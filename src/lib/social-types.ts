// Tipos para funcionalidades sociales y de comunidad

export type FollowStatus = 'following' | 'followed_by' | 'mutual' | 'none';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  country?: string;
  karma: number;
  reputation_score: number;
  followers_count: number;
  following_count: number;
  events_created: number;
  events_attended: number;
  projects_created: number;
  reviews_count: number;
  is_mentor: boolean;
  is_mentee: boolean;
  expertise_areas?: string[];
  created_at: string;
}

export interface FollowRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface ActivityFeedItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  activity_type: 'event_created' | 'event_joined' | 'project_created' | 'review_posted' | 'achievement_earned' | 'group_joined';
  activity_data: {
    event_id?: string;
    event_name?: string;
    project_id?: string;
    project_name?: string;
    review_id?: string;
    achievement_id?: string;
    group_id?: string;
    group_name?: string;
  };
  created_at: string;
}

export interface LocalGroup {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  region?: string;
  avatar_url?: string;
  cover_image_url?: string;
  created_by: string;
  created_by_name: string;
  members_count: number;
  events_count: number;
  is_public: boolean;
  tags: string[];
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  reviewable_type: 'event' | 'project' | 'user';
  reviewable_id: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface KarmaTransaction {
  id: string;
  user_id: string;
  amount: number; // positive or negative
  source: 'event_created' | 'event_attended' | 'review_posted' | 'helpful_review' | 'project_created' | 'group_created' | 'mentoring_session';
  source_id?: string;
  description: string;
  created_at: string;
}

export interface MentoringMatch {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  topic: string;
  started_at?: string;
  completed_at?: string;
  rating_mentor?: number;
  rating_mentee?: number;
  created_at: string;
}

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  seller_name: string;
  seller_avatar?: string;
  title: string;
  description: string;
  category: 'product' | 'service' | 'exchange' | 'donation';
  item_type: 'sustainable_product' | 'eco_service' | 'second_hand' | 'handmade' | 'organic' | 'repair' | 'other';
  price?: number;
  currency?: string;
  is_exchange: boolean;
  exchange_for?: string;
  images: string[];
  location_city?: string;
  location_country?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair';
  eco_certifications?: string[];
  status: 'available' | 'reserved' | 'sold' | 'completed';
  views_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceTransaction {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  payment_method?: string;
  total_amount?: number;
  created_at: string;
  updated_at: string;
}

