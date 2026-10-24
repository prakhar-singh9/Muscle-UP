import { supabase } from './supabase';

/**
 * Read helpers for membership and payment records.
 *
 * These functions intentionally never substitute demo data when a request fails.
 * Callers should surface errors and only display records returned by Supabase.
 */

export type MembershipRow = {
  id: string;
  member_id: string;
  plan_id: string | null;
  plan_name_snapshot: string;
  start_date: string;
  expiry_date: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type MembershipPlanRow = {
  id: string;
  name: string;
  duration_days: number;
  price: number;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRow = {
  id: string;
  member_id: string;
  membership_id: string | null;
  amount: number;
  payment_method: string;
  reference_number: string | null;
  status: 'pending' | 'verified' | 'failed' | 'refunded';
  notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  recorded_by: string | null;
  created_at: string;
};

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then restart the app.',
    );
  }
  return supabase;
}

export async function listMembershipPlans(): Promise<MembershipPlanRow[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('membership_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  return (data ?? []) as MembershipPlanRow[];
}

export async function listMemberships(): Promise<MembershipRow[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('memberships')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as MembershipRow[];
}

export async function listPayments(): Promise<PaymentRow[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PaymentRow[];
}
