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
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      consultancy_submissions: {
        Row: {
          category: string
          created_at: string
          data: Json
          email: string | null
          full_name: string
          id: string
          mobile: string
        }
        Insert: {
          category: string
          created_at?: string
          data?: Json
          email?: string | null
          full_name: string
          id?: string
          mobile: string
        }
        Update: {
          category?: string
          created_at?: string
          data?: Json
          email?: string | null
          full_name?: string
          id?: string
          mobile?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          career_interest: string | null
          city: string | null
          class: string | null
          created_at: string
          id: string
          interest_type: string | null
          library_id: string | null
          message: string | null
          mobile: string
          name: string
          preferred_timing: string | null
          product_interest: string | null
          quiz_level: string | null
          quiz_score: number | null
          quiz_topic: string | null
          school: string | null
          source_page: string
        }
        Insert: {
          career_interest?: string | null
          city?: string | null
          class?: string | null
          created_at?: string
          id?: string
          interest_type?: string | null
          library_id?: string | null
          message?: string | null
          mobile: string
          name: string
          preferred_timing?: string | null
          product_interest?: string | null
          quiz_level?: string | null
          quiz_score?: number | null
          quiz_topic?: string | null
          school?: string | null
          source_page: string
        }
        Update: {
          career_interest?: string | null
          city?: string | null
          class?: string | null
          created_at?: string
          id?: string
          interest_type?: string | null
          library_id?: string | null
          message?: string | null
          mobile?: string
          name?: string
          preferred_timing?: string | null
          product_interest?: string | null
          quiz_level?: string | null
          quiz_score?: number | null
          quiz_topic?: string | null
          school?: string | null
          source_page?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "libraries"
            referencedColumns: ["id"]
          },
        ]
      }
      libraries: {
        Row: {
          address: string
          city: string
          created_at: string
          facilities: Json | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          pin_code: string | null
          price_per_month: number | null
          seats: number | null
          state: string
          timings: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          facilities?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          pin_code?: string | null
          price_per_month?: number | null
          seats?: number | null
          state: string
          timings?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          facilities?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          pin_code?: string | null
          price_per_month?: number | null
          seats?: number | null
          state?: string
          timings?: string | null
        }
        Relationships: []
      }
      mock_test_questions: {
        Row: {
          correct_answer: number
          created_at: string
          id: string
          mock_test_id: string
          options: Json
          question: string
          question_number: number
        }
        Insert: {
          correct_answer: number
          created_at?: string
          id?: string
          mock_test_id: string
          options: Json
          question: string
          question_number: number
        }
        Update: {
          correct_answer?: number
          created_at?: string
          id?: string
          mock_test_id?: string
          options?: Json
          question?: string
          question_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_questions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_test_sessions: {
        Row: {
          answers: Json | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lead_id: string | null
          mobile: string
          mock_test_id: string
          name: string
          score: number | null
          started_at: string
          total_attempted: number | null
        }
        Insert: {
          answers?: Json | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          mobile: string
          mock_test_id: string
          name: string
          score?: number | null
          started_at?: string
          total_attempted?: number | null
        }
        Update: {
          answers?: Json | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          mobile?: string
          mock_test_id?: string
          name?: string
          score?: number | null
          started_at?: string
          total_attempted?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_sessions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          created_at: string
          duration_minutes: number
          exam_name: string
          id: string
          is_active: boolean | null
          test_name: string
          total_questions: number
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          exam_name: string
          id?: string
          is_active?: boolean | null
          test_name: string
          total_questions?: number
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          exam_name?: string
          id?: string
          is_active?: boolean | null
          test_name?: string
          total_questions?: number
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          class_level: string
          correct_answer: number
          created_at: string
          id: string
          language: string
          options: Json
          question: string
          topic: string
        }
        Insert: {
          class_level: string
          correct_answer: number
          created_at?: string
          id?: string
          language?: string
          options: Json
          question: string
          topic: string
        }
        Update: {
          class_level?: string
          correct_answer?: number
          created_at?: string
          id?: string
          language?: string
          options?: Json
          question?: string
          topic?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          correct_answers: number | null
          created_at: string
          id: string
          lead_id: string | null
          level: string | null
          questions_attempted: number | null
          score: number | null
          topic: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string
          id?: string
          lead_id?: string | null
          level?: string | null
          questions_attempted?: number | null
          score?: number | null
          topic: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string
          id?: string
          lead_id?: string | null
          level?: string | null
          questions_attempted?: number | null
          score?: number | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
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
    Enums: {},
  },
} as const
