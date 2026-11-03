/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '../supabase/server'
import { UpdateProfileSchema } from '../validations'
import { logger } from '../logger'

export async function getProfile() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { ...data, email: user.email, full_name: user.user_metadata?.full_name }
  } catch (error) {
    logger.error('Error fetching profile', error)
    return null
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const data = {
      full_name: (formData.get('full_name') as string || '').trim(),
      phone: (formData.get('phone') as string || '').trim(),
      company_name: (formData.get('company_name') as string || '').trim(),
      address_line1: (formData.get('address_line1') as string || '').trim(),
      address_line2: (formData.get('address_line2') as string || '').trim(),
      area: (formData.get('area') as string || '').trim(),
      city: (formData.get('city') as string || '').trim(),
      district: (formData.get('district') as string || '').trim(),
      state: (formData.get('state') as string || '').trim(),
      pincode: (formData.get('pincode') as string || '').trim(),
      country: (formData.get('country') as string || 'India').trim(),
    };

    const validatedData = UpdateProfileSchema.safeParse(data);

    if (!validatedData.success) {
      logger.warn('Profile update validation failed', { userId: user.id });
      return { 
        error: 'Invalid input: ' + validatedData.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
      };
    }

    // Update auth metadata for full_name
    if (data.full_name) {
      await supabase.auth.updateUser({ data: { full_name: data.full_name } });
    }

    // Upsert profile
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...validatedData.data });

    if (error) {
      logger.error('Profile upsert error', error);
      return { error: 'Failed to update profile. Please try again.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (e: any) {
    logger.error('updateProfile exception', e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function isProfileComplete(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone, address_line1, area, city, district, state, pincode')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) return false;

    return !!(
      profile.full_name?.trim() &&
      profile.phone?.trim() &&
      profile.address_line1?.trim() &&
      profile.area?.trim() &&
      profile.city?.trim() &&
      profile.district?.trim() &&
      profile.state?.trim() &&
      profile.pincode?.trim()
    );
  } catch {
    return false;
  }
}

export async function deleteAccount() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    logger.info('Account deletion requested under DPDP compliance', { userId: user.id });

    // Clean up user-associated records if applicable
    await supabase.from('product_requests').delete().eq('buyer_id', user.id);
    await supabase.from('pool_orders').delete().eq('buyer_id', user.id);

    // Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      logger.error('Failed to delete profile record', profileError, { userId: user.id });
      return { error: 'Failed to delete profile data. Please contact support@thegrowsetu.com.' };
    }

    // Delete auth user if service role key is available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const adminClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );
        const { error: authError } = await adminClient.auth.admin.deleteUser(user.id);
        if (authError) {
          logger.warn('Admin auth deletion note', { error: authError.message });
        }
      } catch (err) {
        logger.warn('Admin client error during account deletion', { error: String(err) });
      }
    }

    // Sign out session
    await supabase.auth.signOut();

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    logger.error('Unexpected error in deleteAccount', error);
    return { error: 'Failed to complete account deletion' };
  }
}
