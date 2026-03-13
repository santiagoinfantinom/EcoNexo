
import { Project, Category } from '@/data/projects';

export interface UserPreferences {
    selectedCategories: Category[];
    selectedSkills: string[]; // e.g., "tech", "gardening", "teaching", "repair"
    location?: { lat: number; lng: number };
}

/**
 * Calculates a match score (0-100) for a project based on user preferences.
 */
export function calculateMatchScore(project: Project, prefs: UserPreferences): number {
    let score = 0;
    const totalWeight = 100;

    // 1. Category Match (40%)
    if (prefs.selectedCategories.includes(project.category)) {
        score += 40;
    }

    // 2. Skills/Tags Match (40%)
    if (prefs.selectedSkills.length > 0 && project.tags) {
        const matchingTags = project.tags.filter(tag => prefs.selectedSkills.includes(tag));
        if (matchingTags.length > 0) {
            // Proportional score based on how many skills match? 
            // For now, simple boost if at least one matches, or better, scaled.
            // Let's say if you have at least one matching tag, you get good points.
            // Or 20 points per matching tag up to 40?
            score += Math.min(40, matchingTags.length * 20);
        }
    }

    // 3. Location Match (20%) - Placeholder for now, simple implementation
    // If we had user location, we could calculate distance.
    // For now, if "location" is defined in prefs, we assume proximity is desired, 
    // but without real distance calc let's specific "virtual" matches for now or skip.
    // Let's give a default boost if no location is set, or if it's "online" (not in our data model yet)
    score += 10; // Base score for participating

    return Math.min(100, score);
}
