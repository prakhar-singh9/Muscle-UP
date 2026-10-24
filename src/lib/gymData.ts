import { supabase } from './supabase';

/**
 * Database access helpers for gym members.
 *
 * These helpers deliberately do not fall back to mock data. If Supabase is not
 * configured or a request fails, callers must show the error rather than
 * pretending a database write succeeded.
 */
export type GymMemberRow = {
  id: string;
  member_number: number;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not';
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  fitness_goal: string | null;
  preferred_slot: string | null;
  locker_number: string | null;
  assigned_trainer: string | null;
  branch: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateGymMemberInput = {
  full_name: string;
  phone: string;
  email?: string | null;
  date_of_birth?: string | null;
  gender?: GymMemberRow['gender'];
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relationship?: string | null;
  emergency_contact_phone?: string | null;
  fitness_goal?: string | null;
  preferred_slot?: string | null;
  locker_number?: string | null;
  assigned_trainer?: string | null;
  branch?: string;
  notes?: string | null;
};

export type UpdateGymMemberInput = Partial<CreateGymMemberInput>;

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then restart the app.',
    );
  }
  return supabase;
}

export async function listGymMembers(): Promise<GymMemberRow[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('gym_members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as GymMemberRow[];
}

export async function createGymMember(
  input: CreateGymMemberInput,
): Promise<GymMemberRow> {
  const client = requireSupabase();
  const fullName = input.full_name.trim();
  const phone = input.phone.trim();

  if (!fullName) throw new Error('Member name is required.');
  if (!phone) throw new Error('Member phone number is required.');

  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error('Sign in before adding a gym member.');

  const { data, error } = await client
    .from('gym_members')
    .insert({
      ...input,
      full_name: fullName,
      phone,
      created_by: authData.user.id,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as GymMemberRow;
}

export async function updateGymMember(
  id: string,
  updates: UpdateGymMemberInput,
): Promise<GymMemberRow> {
  const client = requireSupabase();
  if (!id) throw new Error('A member ID is required.');

  const payload = { ...updates };
  if (typeof payload.full_name === 'string') {
    payload.full_name = payload.full_name.trim();
    if (!payload.full_name) throw new Error('Member name cannot be empty.');
  }
  if (typeof payload.phone === 'string') {
    payload.phone = payload.phone.trim();
    if (!payload.phone) throw new Error('Member phone number cannot be empty.');
  }

  const { data, error } = await client
    .from('gym_members')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as GymMemberRow;
}
