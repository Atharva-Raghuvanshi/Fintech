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
      trade_history: {
        Row: {
          id: string
          created_at: string
          timestamp: string | null
          asset: string | null
          action: string | null
          type: string | null
          quantity: number | null
          price: number | null
          amount: number | null
          order_type: string | null
          orderType: string | null
          user_id: string | null
          source: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          timestamp?: string | null
          asset?: string | null
          action?: string | null
          type?: string | null
          quantity?: number | null
          price?: number | null
          amount?: number | null
          order_type?: string | null
          orderType?: string | null
          user_id?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          timestamp?: string | null
          asset?: string | null
          action?: string | null
          type?: string | null
          quantity?: number | null
          price?: number | null
          amount?: number | null
          order_type?: string | null
          orderType?: string | null
          user_id?: string | null
          source?: string | null
        }
        Relationships: []
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
