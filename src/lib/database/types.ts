import type { Review, Topic, TeachingSession, UserProfile } from '../../types';

type InsertProfile = Omit<UserProfile, 'created_at' | 'updated_at'> & {
  created_at?: string | null;
  updated_at?: string | null;
};

type UpdateProfile = Partial<Omit<UserProfile, 'id'>> & { id?: string };

type InsertReview = Omit<Review, 'id'> & { id?: string };

type UpdateReview = Partial<Omit<Review, 'user_id' | 'topic_id'>>;

type InsertTopic = Omit<Topic, 'id'> & { id?: string };

type UpdateTopic = Partial<Omit<Topic, 'user_id'>>;

type InsertSession = Omit<TeachingSession, 'id'> & { id?: string };

type UpdateSession = Partial<Omit<TeachingSession, 'user_id'>>;

export type Database = {
  public: {
    Tables: {
      users_profile: {
        Row: UserProfile;
        Insert: InsertProfile;
        Update: UpdateProfile;
      };
      reviews: {
        Row: Review;
        Insert: InsertReview;
        Update: UpdateReview;
      };
      topics: {
        Row: Topic;
        Insert: InsertTopic;
        Update: UpdateTopic;
      };
      teaching_sessions: {
        Row: TeachingSession;
        Insert: InsertSession;
        Update: UpdateSession;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
