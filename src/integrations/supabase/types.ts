export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      emergency_logs: {
        Row: {
          created_at: string | null
          id: string
          location: Json | null
          resolved_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: Json | null
          resolved_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: Json | null
          resolved_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      safe_routes: {
        Row: {
          created_at: string | null
          distance: string
          end_location: string
          estimated_time: string
          id: string
          name: string
          route_data: Json | null
          safety_score: number
          start_location: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          distance: string
          end_location: string
          estimated_time: string
          id?: string
          name: string
          route_data?: Json | null
          safety_score: number
          start_location: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          distance?: string
          end_location?: string
          estimated_time?: string
          id?: string
          name?: string
          route_data?: Json | null
          safety_score?: number
          start_location?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      safety_notes: {
        Row: {
          created_at: string | null
          id: string
          location: string
          note: string
          reports_count: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          note: string
          reports_count?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          note?: string
          reports_count?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      safety_reviews: {
        Row: {
          comment: string
          created_at: string | null
          downvotes: number
          id: string
          location: string
          rating: number
          time: string
          updated_at: string | null
          upvotes: number
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          downvotes?: number
          id?: string
          location: string
          rating: number
          time: string
          updated_at?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          downvotes?: number
          id?: string
          location?: string
          rating?: number
          time?: string
          updated_at?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Relationships: []
      }
      trust_circle: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string | null
          id: string
          priority: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string | null
          id?: string
          priority?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          priority?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          emergency_contacts: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          emergency_contacts?: Json | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          emergency_contacts?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "safety_reviews"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
