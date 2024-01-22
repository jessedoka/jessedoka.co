export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      article: {
        Row: {
          created_at: string
          id: number
          slug: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          slug: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          slug?: string
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: {
        Args: {
          slug: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

