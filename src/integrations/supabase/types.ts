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
      affiliates: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          total_earnings: number
          total_referrals: number
          user_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          total_earnings?: number
          total_referrals?: number
          user_address: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          total_earnings?: number
          total_referrals?: number
          user_address?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      mock_nfts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          price: number
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          name: string
          price: number
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          price?: number
          video_url?: string
        }
        Relationships: []
      }
      mock_purchases: {
        Row: {
          buyer_address: string
          contract_address: string
          id: string
          nft_id: string
          purchase_date: string
        }
        Insert: {
          buyer_address: string
          contract_address: string
          id?: string
          nft_id: string
          purchase_date?: string
        }
        Update: {
          buyer_address?: string
          contract_address?: string
          id?: string
          nft_id?: string
          purchase_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_purchases_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "mock_nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      real_nft_purchases: {
        Row: {
          buyer_address: string
          id: string
          purchase_date: string
          token_id: string
          transaction_hash: string | null
        }
        Insert: {
          buyer_address: string
          id?: string
          purchase_date?: string
          token_id: string
          transaction_hash?: string | null
        }
        Update: {
          buyer_address?: string
          id?: string
          purchase_date?: string
          token_id?: string
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "real_nft_purchases_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "real_nfts"
            referencedColumns: ["token_id"]
          },
        ]
      }
      real_nfts: {
        Row: {
          created_at: string
          metadata: Json
          token_id: string
        }
        Insert: {
          created_at?: string
          metadata: Json
          token_id: string
        }
        Update: {
          created_at?: string
          metadata?: Json
          token_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_paid: number
          created_at: string
          id: string
          purchase_amount: number
          referred_address: string
          referrer_id: string
        }
        Insert: {
          commission_paid?: number
          created_at?: string
          id?: string
          purchase_amount?: number
          referred_address: string
          referrer_id: string
        }
        Update: {
          commission_paid?: number
          created_at?: string
          id?: string
          purchase_amount?: number
          referred_address?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
