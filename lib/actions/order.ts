/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { joinLimiter, getClientIp } from '@/lib/rate-limit';
import { getSupabaseServerClient } from '../supabase/server'
import { JoinPoolSchema } from '../validations'
import { logger } from '../logger'

export async function getCurrentPrice(poolId: string, quantity: number) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: pool, error } = await supabase
      .from('pools')
      .select('current_quantity, pool_tiers(*)')
      .eq('id', poolId)
      .maybeSingle();

    if (error) {
      logger.error('getCurrentPrice error', error);
      return null;
    }
    if (!pool || !pool.pool_tiers || pool.pool_tiers.length === 0) {
      return null;
    }

    const sortedTiers = [...pool.pool_tiers].sort((a, b) => a.min_qty - b.min_qty);

    // ---- PRODUCT PRICE TIER ----
    // Based on PROJECTED POOL TOTAL (existing pool qty + this buyer's qty)
    const projectedQty = (pool.current_quantity || 0) + quantity;
    let priceTier = sortedTiers[0];
    for (const tier of sortedTiers) {
      if (projectedQty >= tier.min_qty) {
        priceTier = tier;
      }
    }

    // ---- DELIVERY FEE TIER ----
    // Based on BUYER'S OWN QUANTITY ONLY (not pool total)
    let deliveryTier = sortedTiers[0];
    for (const tier of sortedTiers) {
      if (quantity >= tier.min_qty) {
        deliveryTier = tier;
      }
    }

    // Validate — buyer_price must exist
    if (!priceTier || priceTier.buyer_price === null || priceTier.buyer_price === undefined) {
      return null;
    }

    return {
      buyer_price: Number(priceTier.buyer_price),
      logistics_fee: Number(deliveryTier.logistics_fee) || 0,
    };
  } catch (e: any) {
    logger.error('getCurrentPrice exception', e);
    return null;
  }
}


import { revalidatePath } from 'next/cache';

export async function joinPool(poolId: string, quantity: number) {
  try {
    // Validate input FIRST before any DB operation
    const validated = JoinPoolSchema.safeParse({ poolId, quantity });
    if (!validated.success) {
      return { error: 'Invalid input: poolId must be a valid UUID and quantity must be a positive integer' };
    }

    const ip = await getClientIp();
    if (joinLimiter) {
      const { success } = await joinLimiter.limit(ip);
      if (!success) return { error: 'Too many requests. Try again later.' };
    }

    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }
    
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .select('*, pool_tiers(*)')
      .eq('id', validated.data.poolId)
      .maybeSingle();
    if (poolError || !pool) {
      return { error: 'Pool not found' };
    }
    
    const tier = await getCurrentPrice(validated.data.poolId, validated.data.quantity);
    
    if (!tier || tier.buyer_price === null || tier.buyer_price === undefined) {
      return { error: 'Pricing not available for this pool. Please contact support.' };
    }
    
    const insertData = {
      pool_id: validated.data.poolId,
      buyer_id: user.id,
      quantity: validated.data.quantity,
      unit_price_at_join: Number(tier.buyer_price),
      logistics_fee_applied: Number(tier.logistics_fee) || 0,
      status: 'joined',
    };
    
    const { data: order, error: insertError } = await supabase
      .from('pool_orders')
      .insert(insertData)
      .select()
      .maybeSingle();
    
    if (insertError) {
      logger.error('Pool join insert error', insertError);
      return { error: 'Failed to join pool. Please try again.' };
    }
    
    await supabase
      .from('pools')
      .update({ current_quantity: (pool.current_quantity || 0) + validated.data.quantity })
      .eq('id', validated.data.poolId);
    
    revalidatePath('/dashboard');
    return { orderId: order?.id };
  } catch (e: any) {
    logger.error('joinPool exception', e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data, error } = await supabase
      .from('pool_orders')
      .select(`
        *,
        pools (
          *,
          products (*)
        ),
        profiles (*)
      `)
      .eq('id', orderId)
      .eq('buyer_id', user.id) 
      .maybeSingle()

    if (error) {
      logger.error('Error fetching order:', error)
      return null
    }

    if (!data) return null

    const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
    const buyerName = profile?.full_name || user.user_metadata?.full_name || null

    return {
      ...data,
      buyer_name: buyerName,
    }
  } catch (error) {
    logger.error('Error in getOrderById', error);
    return null;
  }
}
