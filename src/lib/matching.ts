import { Project, Category } from '@/data/projects';

export interface UserPreferences {
  selectedCategories: Category[];
  selectedSkills: string[];
  location?: { lat: number; lng: number };
}

export function calculateMatchScore(project: Project, prefs: UserPreferences): number {
  let score = 0;

  if (prefs.selectedCategories.includes(project.category)) {
    score += 40;
  }

  if (prefs.selectedSkills.length > 0 && project.tags) {
    const matchingTags = project.tags.filter((tag) => prefs.selectedSkills.includes(tag));
    if (matchingTags.length > 0) {
      score += Math.min(40, matchingTags.length * 20);
    }
  }

  score += 10;

  return Math.min(100, score);
}

export interface FeedProject extends Project {
  recommendationScore: number;
  popularityScore: number;
  recencyScore: number;
  distanceKm: number;
  likes: number;
  comments: number;
}

export interface MatchCandidate {
  id: string;
  name: string;
  city: string;
  role: string;
  skills: string[];
  causes: Category[];
  availability: 'part-time' | 'weekends' | 'flexible';
}

const DEFAULT_USER_LOCATION = { lat: 40.4168, lng: -3.7038 }; // Madrid

function hashNumber(seed: string, min: number, max: number) {
  const base = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return min + (base % (max - min + 1));
}

function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function computeRecencyScore(startsAt?: string) {
  if (!startsAt) {
    return 0.45;
  }
  const now = new Date();
  const startDate = new Date(startsAt);
  const diffDays = Math.max(0, (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return 1;
  if (diffDays <= 10) return 0.8;
  if (diffDays <= 20) return 0.6;
  return 0.35;
}

export function getFeedProjects(
  projects: Project[],
  prefs: UserPreferences,
  feedback: Record<string, -1 | 0 | 1> = {}
): FeedProject[] {
  const userLocation = prefs.location ?? DEFAULT_USER_LOCATION;

  return projects
    .map((project) => {
      const likes = hashNumber(`${project.id}-likes`, 40, 280);
      const comments = hashNumber(`${project.id}-comments`, 6, 60);
      const popularityScore = Math.min(1, (likes / 280) * 0.7 + (comments / 60) * 0.3);
      const recencyScore = computeRecencyScore(project.startsAt);
      const distanceKm = haversineDistanceKm(userLocation.lat, userLocation.lng, project.lat, project.lng);

      const categoryScore = prefs.selectedCategories.includes(project.category) ? 1 : 0;
      const matchingTags = (project.tags || []).filter((tag) => prefs.selectedSkills.includes(tag)).length;
      const skillScore = prefs.selectedSkills.length > 0 ? Math.min(1, matchingTags / 2) : 0.4;
      const proximityScore = Math.max(0, 1 - distanceKm / 1200);

      const baseScore =
        categoryScore * 0.35 +
        skillScore * 0.25 +
        proximityScore * 0.2 +
        recencyScore * 0.1 +
        popularityScore * 0.1;

      const adjustedByFeedback = baseScore + (feedback[project.id] ?? 0) * 0.12;

      return {
        ...project,
        recommendationScore: Math.max(0, Math.min(100, Math.round(adjustedByFeedback * 100))),
        popularityScore,
        recencyScore,
        distanceKm,
        likes,
        comments,
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
}

export function buildIntelligentProjectMatches(
  projects: Project[],
  prefs: UserPreferences,
  feedback: Record<string, -1 | 0 | 1> = {}
) {
  return getFeedProjects(projects, prefs, feedback).slice(0, 5);
}

export function buildCandidateMatches(
  candidates: MatchCandidate[],
  prefs: UserPreferences,
  userCity?: string
) {
  return candidates
    .map((candidate) => {
      const sharedSkills = candidate.skills.filter((skill) => prefs.selectedSkills.includes(skill));
      const sharedCauses = candidate.causes.filter((cause) => prefs.selectedCategories.includes(cause));
      const locationBonus = userCity && candidate.city === userCity ? 20 : 8;
      const score = Math.min(
        100,
        30 + sharedSkills.length * 20 + sharedCauses.length * 18 + locationBonus
      );
      return {
        ...candidate,
        matchScore: score,
        sharedSkills,
        sharedCauses,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
}
