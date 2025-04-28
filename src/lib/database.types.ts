export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "admin" | "attendee";
          avatar_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: "admin" | "attendee";
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "admin" | "attendee";
          avatar_url?: string | null;
          created_at?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          location: string;
          status: "draft" | "published" | "canceled" | "completed";
          cover_image_url: string | null;
          created_by: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          location: string;
          status: "draft" | "published" | "canceled" | "completed";
          cover_image_url?: string | null;
          created_by: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          location?: string;
          status?: "draft" | "published" | "canceled" | "completed";
          cover_image_url?: string | null;
          created_by?: string;
          created_at?: string | null;
        };
      };
      vendors: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          category:
            | "venue"
            | "catering"
            | "marketing"
            | "entertainment"
            | "technology"
            | "other";
          address: string;
          website: string;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          category:
            | "venue"
            | "catering"
            | "marketing"
            | "entertainment"
            | "technology"
            | "other";
          address?: string | null;
          website?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          category?:
            | "venue"
            | "catering"
            | "marketing"
            | "entertainment"
            | "technology"
            | "other";
          address?: string | null;
          website?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
      };
      budget_categories: {
        Row: {
          id: string;
          event_id: string;
          name: "venue" | "catering" | "marketing" | "staff" | "other";
          allocated: number;
          spent: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: "venue" | "catering" | "marketing" | "staff" | "other";
          allocated: number;
          spent: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: "venue" | "catering" | "marketing" | "staff" | "other";
          allocated?: number;
          spent?: number;
          created_at?: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          event_id: string;
          category: "venue" | "catering" | "marketing" | "staff" | "other";
          amount: number;
          description: string;
          date: string;
          vendor_id: string | null;
          receipt_url: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          category: "venue" | "catering" | "marketing" | "staff" | "other";
          amount: number;
          description: string;
          date: string;
          vendor_id?: string | null;
          receipt_url?: string | null;
          status: "pending" | "approved" | "rejected";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          category?: "venue" | "catering" | "marketing" | "staff" | "other";
          amount?: number;
          description?: string;
          date?: string;
          vendor_id?: string | null;
          receipt_url?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string | null;
        };
      };
      attendees: {
        Row: {
          id: string;
          name: string;
          email: string;
          event_id: string;
          registration_date: string;
          status: "registered" | "attended" | "canceled" | "no-show";
          ticket_type: string | null;
          check_in_time: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          registration_date: string;
          status: "registered" | "attended" | "canceled" | "no-show";
          ticket_type?: string | null;
          check_in_time?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          registration_date?: string;
          status?: "registered" | "attended" | "canceled" | "no-show";
          ticket_type?: string | null;
          check_in_time?: string | null;
          created_at?: string | null;
        };
      };
      guests: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string | null;
          invited_by: string;
          status: "invited" | "confirmed" | "declined" | "attended";
          plus_one: boolean;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone?: string | null;
          invited_by: string;
          status: "invited" | "confirmed" | "declined" | "attended";
          plus_one: boolean;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          invited_by?: string;
          status?: "invited" | "confirmed" | "declined" | "attended";
          plus_one?: boolean;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
