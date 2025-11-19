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
      tduel_trading_sessions: {
        Row: {
          id: string
          user_address: string | null
          mode: 'regular' | 'vs' | 'battle'
          start_balance: number
          current_balance: number
          start_time: string
          end_time: string | null
          pnl: number
          pnl_percentage: number
          status: 'active' | 'completed' | 'abandoned'
          challenge_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_address?: string | null
          mode: 'regular' | 'vs' | 'battle'
          start_balance: number
          current_balance: number
          start_time?: string
          end_time?: string | null
          pnl?: number
          pnl_percentage?: number
          status?: 'active' | 'completed' | 'abandoned'
          challenge_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_address?: string | null
          mode?: 'regular' | 'vs' | 'battle'
          start_balance?: number
          current_balance?: number
          start_time?: string
          end_time?: string | null
          pnl?: number
          pnl_percentage?: number
          status?: 'active' | 'completed' | 'abandoned'
          challenge_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      tduel_trades: {
        Row: {
          id: string
          session_id: string
          coin: 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'
          type: 'buy' | 'sell'
          amount: number
          price: number
          total_cost: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          coin: 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'
          type: 'buy' | 'sell'
          amount: number
          price: number
          total_cost: number
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          coin?: 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'
          type?: 'buy' | 'sell'
          amount?: number
          price?: number
          total_cost?: number
          timestamp?: string
          created_at?: string
        }
      }
      tduel_positions: {
        Row: {
          id: string
          session_id: string
          coin: 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'
          amount: number
          average_price: number
          current_price: number
          pnl: number
          pnl_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          coin: 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'
          amount: number
          average_price: number
          current_price: number
          pnl?: number
          pnl_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          coin?: 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'
          amount?: number
          average_price?: number
          current_price?: number
          pnl?: number
          pnl_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      tduel_challenges: {
        Row: {
          id: string
          creator_address: string
          mode: 'vs' | 'battle'
          participants: string[]
          wager: number | null
          prizes: number[] | null
          settings: Json
          status: 'pending' | 'active' | 'completed'
          start_time: string | null
          end_time: string | null
          winner_address: string | null
          leaderboard: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_address: string
          mode: 'vs' | 'battle'
          participants?: string[]
          wager?: number | null
          prizes?: number[] | null
          settings: Json
          status?: 'pending' | 'active' | 'completed'
          start_time?: string | null
          end_time?: string | null
          winner_address?: string | null
          leaderboard?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_address?: string
          mode?: 'vs' | 'battle'
          participants?: string[]
          wager?: number | null
          prizes?: number[] | null
          settings?: Json
          status?: 'pending' | 'active' | 'completed'
          start_time?: string | null
          end_time?: string | null
          winner_address?: string | null
          leaderboard?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      tduel_leaderboard: {
        Row: {
          id: string
          user_address: string
          username: string | null
          total_trades: number
          total_pnl: number
          total_pnl_percentage: number
          wins: number
          losses: number
          rank: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_address: string
          username?: string | null
          total_trades?: number
          total_pnl?: number
          total_pnl_percentage?: number
          wins?: number
          losses?: number
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_address?: string
          username?: string | null
          total_trades?: number
          total_pnl?: number
          total_pnl_percentage?: number
          wins?: number
          losses?: number
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
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