-- Database Schema: TheGrowSetu

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    phone VARCHAR(20) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    address TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    area TEXT,
    city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    country TEXT DEFAULT 'India',
    role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('buyer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'buyer')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Admin check function to prevent infinite recursion
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR;
BEGIN
    SELECT role INTO user_role FROM profiles WHERE id = user_id;
    RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin(auth.uid()));

-- 2. products
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_image TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Only admins can modify products" ON products FOR ALL USING (is_admin(auth.uid()));

-- 3. pools
CREATE TABLE pools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    target_quantity INTEGER NOT NULL,
    current_quantity INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'manufacturing', 'fulfilled', 'cancelled')),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view pools" ON pools FOR SELECT USING (true);
CREATE POLICY "Only admins can modify pools" ON pools FOR ALL USING (is_admin(auth.uid()));

-- 4. pool_tiers
CREATE TABLE pool_tiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
    min_qty INTEGER NOT NULL,
    max_qty INTEGER NOT NULL,
    buyer_price DECIMAL(10, 2) NOT NULL,
    logistics_fee DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE pool_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view pool tiers" ON pool_tiers FOR SELECT USING (true);
CREATE POLICY "Only admins can modify pool tiers" ON pool_tiers FOR ALL USING (is_admin(auth.uid()));

-- 5. pool_orders
CREATE TABLE pool_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pool_id UUID REFERENCES pools(id),
    buyer_id UUID REFERENCES profiles(id),
    quantity INTEGER NOT NULL,
    unit_price_at_join DECIMAL(10, 2) NOT NULL,
    logistics_fee_applied DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'joined' CHECK (status IN ('joined', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE pool_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view own orders" ON pool_orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can create orders" ON pool_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Only admins can view all orders" ON pool_orders FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can modify all orders" ON pool_orders FOR ALL USING (is_admin(auth.uid()));

-- 6. qc_reports
CREATE TABLE qc_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pool_order_id UUID REFERENCES pool_orders(id),
    qc_status VARCHAR(20) NOT NULL CHECK (qc_status IN ('pending', 'passed', 'failed', 'rework')),
    remarks TEXT,
    checked_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE qc_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view own QC reports" ON qc_reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM pool_orders WHERE id = qc_reports.pool_order_id AND buyer_id = auth.uid())
);
CREATE POLICY "Only admins can view QC reports" ON qc_reports FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can modify QC reports" ON qc_reports FOR ALL USING (is_admin(auth.uid()));

-- 7. product_requests
CREATE TABLE public.product_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    timeline TEXT NOT NULL,
    additional_details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'sourced', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.product_requests ENABLE ROW LEVEL SECURITY;

-- Buyers can insert their own requests
CREATE POLICY "Buyers can insert requests" ON public.product_requests 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Buyers can view their own requests
CREATE POLICY "Buyers can view own requests" ON public.product_requests 
FOR SELECT TO authenticated USING (auth.uid() = buyer_id);

-- Admins can view and update all requests
CREATE POLICY "Admins can view all requests" ON public.product_requests 
FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

