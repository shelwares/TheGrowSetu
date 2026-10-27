/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '../supabase/server'
import { logger } from '../logger'
import { CreateProductSchema, CreatePoolSchema, UpdateOrderStatusSchema } from '../validations'

// ─── Admin Guard ───────────────────────────────────────────────────────────────
export async function requireAdmin() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || profile?.role !== 'admin') {
      logger.warn('Unauthorized admin access attempt', { userId: user.id });
      redirect('/')
    }
    return user
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Error in requireAdmin', error);
    redirect('/');
  }
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────────
export async function getAdminStats() {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const [products, pools, orders, buyers] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('pools').select('id', { count: 'exact', head: true }),
      supabase.from('pool_orders').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'buyer'),
    ])
    return {
      totalProducts: products.count || 0,
      totalPools: pools.count || 0,
      totalOrders: orders.count || 0,
      totalBuyers: buyers.count || 0,
    }
  } catch (error) {
    logger.error('Error in getAdminStats', error);
    return { totalProducts: 0, totalPools: 0, totalOrders: 0, totalBuyers: 0 };
  }
}

// ─── Products ──────────────────────────────────────────────────────────────────
export async function getAdminProducts() {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  } catch (error) {
    logger.error('Error in getAdminProducts', error);
    return [];
  }
}

export async function createProduct(formData: FormData) {
  try {
    await requireAdmin()
    
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      base_image: formData.get('base_image') as string || undefined,
    }
    
    const validatedData = CreateProductSchema.safeParse(data);
    if (!validatedData.success) {
      logger.warn('Create product validation failed', { errors: validatedData.error.issues });
      return { error: 'Invalid input data' };
    }

    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from('products').insert(validatedData.data)

    if (error) {
      logger.error('Error creating product', error);
      return { error: 'Failed to create product' }
    }
    revalidatePath('/admin/products')
    redirect('/admin/products')
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Error in createProduct', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()

    // Safety check: ensure no pools are linked to this product
    const { count, error: poolCheckError } = await supabase
      .from('pools')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', productId)

    if (poolCheckError) {
      logger.error('Error checking pools for product', { productId, error: poolCheckError })
      return { error: 'Failed to verify product safety. Please try again.' }
    }

    if ((count ?? 0) > 0) {
      return { error: 'Cannot delete product. It is linked to existing pools.' }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      logger.error('Error deleting product', { productId, error })
      return { error: 'Failed to delete product' }
    }

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error
    logger.error('Error in deleteProduct', error)
    return { error: 'An unexpected error occurred' }
  }
}

// ─── Pools ────────────────────────────────────────────────────────────────────
export async function getAdminPools() {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase
      .from('pools')
      .select(`*, products(name, category)`)
      .order('created_at', { ascending: false })
    return data || []
  } catch (error) {
    logger.error('Error in getAdminPools', error);
    return [];
  }
}

export async function getAdminPool(poolId: string) {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase
      .from('pools')
      .select(`*, products(*), pool_tiers(*)`)
      .eq('id', poolId)
      .single()
    if (data?.pool_tiers) {
      data.pool_tiers.sort((a: any, b: any) => a.min_qty - b.min_qty)
    }
    return data
  } catch (error) {
    logger.error('Error in getAdminPool', error);
    return null;
  }
}

export async function createPool(formData: FormData) {
  try {
    await requireAdmin()
    
    const data = {
      product_id: formData.get('product_id') as string,
      target_quantity: parseInt(formData.get('target_quantity') as string),
      deadline: formData.get('deadline') as string,
    };
    
    const validatedData = CreatePoolSchema.safeParse(data);
    if (!validatedData.success) {
      logger.warn('Create pool validation failed', { errors: validatedData.error.issues });
      return { error: 'Invalid input data' };
    }

    const supabase = await getSupabaseServerClient()

    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .insert({
        product_id: validatedData.data.product_id,
        target_quantity: validatedData.data.target_quantity,
        deadline: validatedData.data.deadline,
        status: 'active',
      })
      .select('id')
      .single()

    if (poolError) {
      logger.error('Error creating pool', poolError);
      return { error: 'Failed to create pool' }
    }

    const tierCount = parseInt(formData.get('tier_count') as string || '1')
    const tiers = []
    for (let i = 1; i <= tierCount; i++) {
      const min_qty = parseInt(formData.get(`tier_min_${i}`) as string)
      const buyer_price = parseFloat(formData.get(`tier_price_${i}`) as string)
      const logistics_fee = parseFloat(formData.get(`tier_logistics_${i}`) as string || '0')
      if (!isNaN(min_qty) && !isNaN(buyer_price)) {
        tiers.push({ pool_id: pool.id, min_qty, max_qty: 99999, buyer_price, logistics_fee })
      }
    }

    if (tiers.length > 0) {
      await supabase.from('pool_tiers').insert(tiers)
    }

    revalidatePath('/admin/pools')
    redirect('/admin/pools')
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Error in createPool', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deletePool(poolId: string) {
  try {
    await requireAdmin();
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from('pools')
      .delete()
      .eq('id', poolId);
    if (error) throw error;
    revalidatePath('/admin/pools');
    return { success: true };
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Delete pool error', { poolId, error });
    return { error: 'Failed to delete pool' };
  }
}

export async function updatePoolStatus(poolId: string, status: string) {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
      .from('pools')
      .update({ status })
      .eq('id', poolId)
    if (error) {
      logger.error('Error updating pool status', error);
      return { error: 'Failed to update pool' }
    }
    revalidatePath('/admin/pools')
    revalidatePath(`/admin/pools/${poolId}`)
    return { success: true }
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Error in updatePoolStatus', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getAdminOrders() {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase
      .from('pool_orders')
      .select(`
        *,
        pools ( id, products ( name ) ),
        profiles ( full_name, phone, company_name, address_line1, address_line2, area, city, district, state, pincode, country )
      `)
      .order('created_at', { ascending: false })
    return data || []
  } catch (error) {
    logger.error('Error in getAdminOrders', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin()
    
    const validatedData = UpdateOrderStatusSchema.safeParse({ status });
    if (!validatedData.success) {
      logger.warn('Update order status validation failed', { errors: validatedData.error.issues });
      return { error: 'Invalid status' };
    }

    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
      .from('pool_orders')
      .update({ status: validatedData.data.status })
      .eq('id', orderId)
    if (error) {
      logger.error('Error updating order status', error);
      return { error: 'Failed to update order' }
    }
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Error in updateOrderStatus', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ─── QC Reports ───────────────────────────────────────────────────────────────
export async function logQC(orderId: string, qc_status: string, remarks: string) {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('qc_reports').insert({
      pool_order_id: orderId,
      qc_status: qc_status,
      remarks: remarks,
      checked_by: user?.id || 'admin',
    })

    if (error) {
      logger.error('Error logging QC', error);
      return { error: 'Failed to log QC' }
    }

    const nextStatus = qc_status === 'passed' ? 'shipped' : 'confirmed'
    await supabase.from('pool_orders').update({ status: nextStatus }).eq('id', orderId)

    revalidatePath('/admin/orders')
    revalidatePath('/admin/qc')
    return { success: true }
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error;
    logger.error('Error in logQC', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ─── Pool Buyers ──────────────────────────────────────────────────────────────
export async function getPoolBuyers(poolId: string) {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from('pool_orders')
    .select(`
      id,
      quantity,
      unit_price_at_join,
      logistics_fee_applied,
      status,
      created_at,
      profiles (
        full_name,
        phone,
        company_name,
        address_line1,
        address_line2,
        area,
        city,
        district,
        state,
        pincode,
        country
      )
    `)
    .eq('pool_id', poolId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Get pool buyers error', { error: error.message });
    throw new Error('Failed to fetch pool buyers');
  }

  return orders || [];
}

// ─── Product Requests ─────────────────────────────────────────────────────────
export async function getProductRequests() {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from('product_requests')
      .select(`
        id,
        buyer_id,
        product_name,
        quantity,
        timeline,
        additional_details,
        status,
        created_at,
        profiles (
          full_name,
          company_name,
          phone
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching product requests in admin', error)
      return []
    }

    const formatted = (data || []).map((item: any) => ({
      id: item.id,
      buyer_id: item.buyer_id,
      product_name: item.product_name,
      quantity: Number(item.quantity) || 0,
      timeline: item.timeline,
      additional_details: item.additional_details,
      status: item.status,
      created_at: item.created_at,
      profiles: Array.isArray(item.profiles) ? (item.profiles[0] ?? null) : (item.profiles ?? null),
    }))

    return formatted
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error
    logger.error('Error in getProductRequests', error)
    return []
  }
}

export async function updateProductRequestStatus(requestId: string, status: string) {
  try {
    await requireAdmin()
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase
      .from('product_requests')
      .update({ status })
      .eq('id', requestId)

    if (error) {
      logger.error('Error updating product request status', error)
      return { error: 'Failed to update status' }
    }

    revalidatePath('/admin/requests')
    return { success: true }
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') throw error
    logger.error('Error in updateProductRequestStatus', error)
    return { error: 'An unexpected error occurred' }
  }
}

