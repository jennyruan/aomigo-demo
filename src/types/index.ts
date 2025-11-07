export interface UserProfile {
  id: string;
  pet_name: string;
  intelligence: number;
  health: number;
  level: number;
  day_streak: number;
  last_activity_date: string;
  language_preference: 'en' | 'zh';
  created_at: string;
  updated_at: string;
  display_name?: string | null;
  organization_name?: string | null;
  avatar_config?: Record<string, unknown> | null;
}

export interface TeachingSession {
  id: string;
  user_id: string;
  session_id: string;
  input_type: 'text' | 'voice' | 'image';
  raw_input: string;
  extracted_topics: string[];
  follow_up_question?: string;
  user_answer?: string;
  quality_score: number;
  intelligence_gain: number;
  health_change: number;
  created_at: string;
}

export interface Topic {
  id: string;
  user_id: string;
  topic_name: string;
  depth: number;
  first_learned: string;
  last_reviewed: string;
  review_count: number;
  mastery_level: number;
  connections: string[];
  metadata: Record<string, any>;
}

export interface Review {
  id: string;
  user_id: string;
  topic_id: string;
  scheduled_date: string;
  interval_days: number;
  completed_at?: string;
  result?: 'good' | 'poor' | 'skipped';
  next_review_date?: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  pet_name: string;
  summary_text: string;
  topics_learned: string[];
  post_date: string;
  likes_count: number;
  created_at: string;
  content?: string;
  image_url?: string;
  privacy?: 'public' | 'friends' | 'private';
  comment_count?: number;
  reaction_counts?: Record<string, number>;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  pet_name: string;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'celebrate' | 'applause' | 'thinking' | 'idea' | 'love';
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  unlocked_at: string;
  metadata: Record<string, any>;
}

export type PetMood = 'sleepy' | 'happy' | 'excited' | 'energized';

export interface KnowledgeNode {
  id: string;
  label: string;
  depth: number;
  lastReviewed: Date;
  connections: string[];
  x?: number;
  y?: number;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  strength: number;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}
