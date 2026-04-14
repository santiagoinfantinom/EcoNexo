export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          activity_data: Json
          activity_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      event_administrators: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_administrators_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_notifications: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notification_type: string
          sent_at: string | null
          subscription_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notification_type: string
          sent_at?: string | null
          subscription_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notification_type?: string
          sent_at?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_notifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "push_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          accessibility_needs: string | null
          agree_to_photos: boolean
          agree_to_terms: boolean
          created_at: string | null
          dietary_restrictions: string | null
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          event_id: string
          experience: string | null
          id: string
          motivation: string | null
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          accessibility_needs?: string | null
          agree_to_photos?: boolean
          agree_to_terms?: boolean
          created_at?: string | null
          dietary_restrictions?: string | null
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          event_id: string
          experience?: string | null
          id?: string
          motivation?: string | null
          name: string
          phone: string
          user_id: string
        }
        Update: {
          accessibility_needs?: string | null
          agree_to_photos?: boolean
          agree_to_terms?: boolean
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          event_id?: string
          experience?: string | null
          id?: string
          motivation?: string | null
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          category: string
          city: string
          country: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          description_de: string | null
          description_en: string | null
          end_time: string | null
          id: string
          image_url: string | null
          notes: string | null
          optional_categories: string[] | null
          start_time: string | null
          title: string
          title_de: string | null
          title_en: string | null
        }
        Insert: {
          capacity?: number | null
          category: string
          city: string
          country: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          optional_categories?: string[] | null
          start_time?: string | null
          title: string
          title_de?: string | null
          title_en?: string | null
        }
        Update: {
          capacity?: number | null
          category?: string
          city?: string
          country?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          optional_categories?: string[] | null
          start_time?: string | null
          title?: string
          title_de?: string | null
          title_en?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: Database["public"]["Enums"]["favorite_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: Database["public"]["Enums"]["favorite_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: Database["public"]["Enums"]["favorite_type"]
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "local_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      karma_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      local_groups: {
        Row: {
          avatar_url: string | null
          city: string
          country: string
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          region: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city: string
          country: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          region?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string
          country?: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          region?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      marketplace_favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_favorites_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category: string
          condition: string | null
          created_at: string | null
          currency: string | null
          description: string
          eco_certifications: string[] | null
          exchange_for: string | null
          favorites_count: number | null
          id: string
          images: string[] | null
          is_exchange: boolean | null
          item_type: string
          location_city: string | null
          location_country: string | null
          price: number | null
          seller_id: string
          status: string
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          category: string
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          eco_certifications?: string[] | null
          exchange_for?: string | null
          favorites_count?: number | null
          id?: string
          images?: string[] | null
          is_exchange?: boolean | null
          item_type: string
          location_city?: string | null
          location_country?: string | null
          price?: number | null
          seller_id: string
          status?: string
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          category?: string
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          eco_certifications?: string[] | null
          exchange_for?: string | null
          favorites_count?: number | null
          id?: string
          images?: string[] | null
          is_exchange?: boolean | null
          item_type?: string
          location_city?: string | null
          location_country?: string | null
          price?: number | null
          seller_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      marketplace_transactions: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          item_id: string
          payment_method: string | null
          seller_id: string
          status: string
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          item_id: string
          payment_method?: string | null
          seller_id: string
          status?: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          item_id?: string
          payment_method?: string | null
          seller_id?: string
          status?: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_matches: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          mentee_id: string
          mentor_id: string
          rating_mentee: number | null
          rating_mentor: number | null
          started_at: string | null
          status: string
          topic: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mentee_id: string
          mentor_id: string
          rating_mentee?: number | null
          rating_mentor?: number | null
          started_at?: string | null
          status?: string
          topic: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          rating_mentee?: number | null
          rating_mentor?: number | null
          started_at?: string | null
          status?: string
          topic?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about_me: string | null
          areas_of_expertise: string | null
          avatar_url: string | null
          bio: string | null
          birth_place: string | null
          birthdate: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          expertise_areas: string[] | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          github_url: string | null
          hobbies: string | null
          id: string
          instagram_url: string | null
          interests: string | null
          is_mentee: boolean | null
          is_mentor: boolean | null
          karma: number | null
          languages: string | null
          last_login: string | null
          last_name: string | null
          linkedin_url: string | null
          newsletter_subscribed: boolean | null
          notifications_enabled: boolean | null
          oauth_data: Json | null
          oauth_provider: string | null
          passions: string | null
          phone: string | null
          preferred_language: string | null
          profile_visibility: string | null
          pronouns: string | null
          reputation_score: number | null
          skills: string | null
          timezone: string | null
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          about_me?: string | null
          areas_of_expertise?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_place?: string | null
          birthdate?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          expertise_areas?: string[] | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          github_url?: string | null
          hobbies?: string | null
          id: string
          instagram_url?: string | null
          interests?: string | null
          is_mentee?: boolean | null
          is_mentor?: boolean | null
          karma?: number | null
          languages?: string | null
          last_login?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          newsletter_subscribed?: boolean | null
          notifications_enabled?: boolean | null
          oauth_data?: Json | null
          oauth_provider?: string | null
          passions?: string | null
          phone?: string | null
          preferred_language?: string | null
          profile_visibility?: string | null
          pronouns?: string | null
          reputation_score?: number | null
          skills?: string | null
          timezone?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          about_me?: string | null
          areas_of_expertise?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_place?: string | null
          birthdate?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          expertise_areas?: string[] | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          github_url?: string | null
          hobbies?: string | null
          id?: string
          instagram_url?: string | null
          interests?: string | null
          is_mentee?: boolean | null
          is_mentor?: boolean | null
          karma?: number | null
          languages?: string | null
          last_login?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          newsletter_subscribed?: boolean | null
          notifications_enabled?: boolean | null
          oauth_data?: Json | null
          oauth_provider?: string | null
          passions?: string | null
          phone?: string | null
          preferred_language?: string | null
          profile_visibility?: string | null
          pronouns?: string | null
          reputation_score?: number | null
          skills?: string | null
          timezone?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          category: string
          city: string
          country: string
          created_at: string | null
          description: string | null
          description_de: string | null
          description_en: string | null
          id: string
          image_url: string | null
          info_url: string | null
          lat: number
          lng: number
          name: string
          name_de: string | null
          name_en: string | null
          spots: number | null
          title_de: string | null
          title_en: string | null
        }
        Insert: {
          address?: string | null
          category: string
          city: string
          country: string
          created_at?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          info_url?: string | null
          lat: number
          lng: number
          name: string
          name_de?: string | null
          name_en?: string | null
          spots?: number | null
          title_de?: string | null
          title_en?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string
          country?: string
          created_at?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          info_url?: string | null
          lat?: number
          lng?: number
          name?: string
          name_de?: string | null
          name_en?: string | null
          spots?: number | null
          title_de?: string | null
          title_en?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      review_helpful: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string | null
          helpful_count: number | null
          id: string
          rating: number
          reviewable_id: string
          reviewable_type: string
          reviewer_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          rating: number
          reviewable_id: string
          reviewable_type: string
          reviewer_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          rating?: number
          reviewable_id?: string
          reviewable_type?: string
          reviewer_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          availability: string
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          project_id: string
        }
        Insert: {
          availability: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          project_id: string
        }
        Update: {
          availability?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      favorite_type: "project" | "event"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      favorite_type: ["project", "event"],
    },
  },
} as const
