export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          date: string
          category_id: number | null
          tags: string[] | null
          location_name: string | null
          location_lat: number | null
          location_lng: number | null
          author_id: string
          status: string
          visibility: string
          verified: boolean
          rating_average: number | null
          rating_count: number | null
          comment_count: number | null
          view_count: number | null
          ai_summary: string | null
          english_summary: string | null
          ai_summary_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          content?: string | null
          date: string
          category_id?: number | null
          tags?: string[] | null
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          author_id: string
          status?: string
          visibility?: string
          verified?: boolean
          rating_average?: number | null
          rating_count?: number | null
          comment_count?: number | null
          view_count?: number | null
          ai_summary?: string | null
          english_summary?: string | null
          ai_summary_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          content?: string | null
          date?: string
          category_id?: number | null
          tags?: string[] | null
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          author_id?: string
          status?: string
          visibility?: string
          verified?: boolean
          rating_average?: number | null
          rating_count?: number | null
          comment_count?: number | null
          view_count?: number | null
          ai_summary?: string | null
          english_summary?: string | null
          ai_summary_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      xp_entries: {
        Row: {
          id: string
          title: string
          content: string
          date: string
          tags: string[] | null
          mood: string | null
          private: boolean
          draft: boolean
          location_name: string | null
          location_lat: number | null
          location_lng: number | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          date: string
          tags?: string[] | null
          mood?: string | null
          private?: boolean
          draft?: boolean
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          date?: string
          tags?: string[] | null
          mood?: string | null
          private?: boolean
          draft?: boolean
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Weitere Tabellen hier...
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
  }
}
