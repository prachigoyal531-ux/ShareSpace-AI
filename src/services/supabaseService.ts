/**
 * Supabase Integration Service Layer
 * 
 * This module is architected to allow drop-in Supabase authentication,
 * Postgres database persistence, and storage buckets.
 * 
 * To connect live Supabase:
 * 1. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.
 * 2. Run the SQL schema provided below in your Supabase SQL Editor.
 * 
 * When unconfigured, ShareSpace AI runs gracefully in local memory/localStorage
 * mode with full demonstration data and realistic state persistence.
 */

export interface SupabaseConfigStatus {
  isConnected: boolean;
  url?: string;
  authMode: 'local_demo' | 'supabase_active';
  storageBucketReady: boolean;
}

export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(url && key && !url.includes('placeholder'));

  return {
    isConnected: isConfigured,
    url: isConfigured ? url : undefined,
    authMode: isConfigured ? 'supabase_active' : 'local_demo',
    storageBucketReady: isConfigured
  };
};

/**
 * Recommended Postgres Schema for Supabase Migration:
 * 
 * CREATE TABLE resources (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   department TEXT NOT NULL,
 *   location TEXT NOT NULL,
 *   owner_name TEXT NOT NULL,
 *   owner_email TEXT NOT NULL,
 *   status TEXT NOT NULL,
 *   description TEXT,
 *   specifications JSONB DEFAULT '[]'::jsonb,
 *   rules JSONB DEFAULT '[]'::jsonb,
 *   eligibility_requirements JSONB DEFAULT '[]'::jsonb,
 *   max_booking_duration_hours INT DEFAULT 4,
 *   lead_time_hours INT DEFAULT 2,
 *   requires_approval BOOLEAN DEFAULT true,
 *   fair_use_weekly_limit_hours INT DEFAULT 20,
 *   total_usage_count INT DEFAULT 0,
 *   condition_score INT DEFAULT 95,
 *   current_condition_notes TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE bookings (
 *   id TEXT PRIMARY KEY,
 *   resource_id TEXT REFERENCES resources(id),
 *   user_id TEXT NOT NULL,
 *   user_name TEXT NOT NULL,
 *   user_email TEXT NOT NULL,
 *   start_time TIMESTAMPTZ NOT NULL,
 *   end_time TIMESTAMPTZ NOT NULL,
 *   purpose TEXT NOT NULL,
 *   project_type TEXT,
 *   status TEXT NOT NULL,
 *   check_in_code TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE condition_reports (
 *   id TEXT PRIMARY KEY,
 *   booking_id TEXT,
 *   resource_id TEXT NOT NULL,
 *   reported_by TEXT NOT NULL,
 *   report_type TEXT NOT NULL,
 *   pre_condition TEXT,
 *   post_condition TEXT,
 *   description TEXT,
 *   severity TEXT NOT NULL,
 *   status TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
