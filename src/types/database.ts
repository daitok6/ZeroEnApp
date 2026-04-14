export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          locale: 'en' | 'ja';
          role: 'client' | 'admin';
          status: 'pending' | 'onboarding' | 'client';
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          locale?: 'en' | 'ja';
          role?: 'client' | 'admin';
          status?: 'pending' | 'onboarding' | 'client';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          application_id: string | null;
          name: string;
          description: string | null;
          status: 'onboarding' | 'building' | 'launched' | 'operating' | 'paused' | 'terminated';
          github_repo: string | null;
          vercel_project: string | null;
          supabase_project: string | null;
          site_url: string | null;
          onboarding_data: Json | null;
          plan_tier: 'basic' | 'premium' | null;
          commitment_starts_at: string | null;
          client_visible: boolean;
          stripe_subscription_id: string | null;
          pending_plan_tier: 'basic' | 'premium' | null;
          pending_plan_effective_at: string | null;
          stripe_subscription_schedule_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at' | 'client_visible'> & { id?: string; created_at?: string; updated_at?: string; client_visible?: boolean };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          project_id: string;
          sender_id: string;
          parent_id: string | null;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          project_id: string;
          client_id: string;
          change_request_id: string | null;
          stripe_invoice_id: string | null;
          stripe_payment_intent_id: string | null;
          stripe_hosted_invoice_url: string | null;
          stripe_invoice_pdf_url: string | null;
          stripe_invoice_number: string | null;
          amount_cents: number;
          currency: string;
          description: string;
          type: 'subscription' | 'per_request' | null;
          status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'declined';
          due_date: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      change_requests: {
        Row: {
          id: string;
          project_id: string;
          client_id: string;
          title: string;
          description: string;
          tier: 'small' | 'medium' | 'large' | null;
          estimated_cost_cents: number | null;
          status: 'submitted' | 'reviewing' | 'quoted' | 'approved' | 'in_progress' | 'completed' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['change_requests']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['change_requests']['Insert']>;
      };
      message_read_status: {
        Row: {
          user_id: string;
          project_id: string;
          last_read_at: string;
        };
        Insert: {
          user_id: string;
          project_id: string;
          last_read_at?: string;
        };
        Update: Partial<Database['public']['Tables']['message_read_status']['Insert']>;
      };
      message_notification_log: {
        Row: {
          id: string;
          recipient_id: string;
          project_id: string;
          sent_at: string;
          type: 'client_instant' | 'admin_digest';
        };
        Insert: Omit<Database['public']['Tables']['message_notification_log']['Row'], 'id' | 'sent_at'> & { id?: string; sent_at?: string };
        Update: Partial<Database['public']['Tables']['message_notification_log']['Insert']>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          locale: 'en' | 'ja';
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'subscribed_at'> & { id?: string; subscribed_at?: string };
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>;
      };
      client_brand: {
        Row: {
          profile_id: string;
          business_name: string | null;
          industry: string | null;
          location: string | null;
          tagline: string | null;
          entity_name: string | null;
          timezone: string | null;
          logo_url: string | null;
          primary_color: string | null;
          secondary_color: string | null;
          font_preference: string | null;
          target_audience: string | null;
          primary_cta: string | null;
          key_offerings: string[] | null;
          reference_urls: string[] | null;
          vibe_keywords: string[] | null;
          terms_accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['client_brand']['Row'], 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['client_brand']['Insert']>;
      };
    };
  };
};
