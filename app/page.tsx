import type { Metadata } from 'next'
import Link from 'next/link'
import { getPools } from '@/lib/actions/pool'
import { getPlatformStats } from '@/lib/stats'
import PoolCard from '@/components/PoolCard'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion/fade-in'
import { StaggerList, StaggerItem } from '@/components/motion/stagger-list'
import { CheckCircle2, ShieldCheck, Factory, Target, TrendingDown, Truck, PackageOpen, Sparkles, ArrowRight } from 'lucide-react'
import { OrganizationSchema } from '@/components/seo/structured-data'

export const metadata: Metadata = {
  title: 'TheGrowSetu — Factory Rates Without Factory MOQ',
  description: "Join India's first B2B demand aggregation platform. Pool orders with other buyers to unlock factory-level pricing on perfume, garments, cosmetics and more. Low MOQ, factory rates.",
  alternates: {
    canonical: 'https://thegrowsetu.com',
  },
}

export default async function Home() {
  const [pools, stats] = await Promise.all([
    getPools(),
    getPlatformStats(),
  ])
  
  // Show max 6 pools on homepage
  const featuredPools = pools?.slice(0, 6) || []

  return (
    <div className="flex flex-col w-full">
      <OrganizationSchema />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary-900 to-brand-primary-700 text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <FadeIn className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Hero Announcement Pill */}
          <div className="inline-flex items-center justify-center mb-6">
            <Link
              href="/pools"
              className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-brand-primary-800/80 hover:bg-brand-primary-800 text-brand-primary-100 border border-brand-primary-500/30 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-brand-accent-400/50"
            >
              <span className="flex items-center gap-1.5 text-brand-accent-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Phase 2 Demand Pools Now Live</span>
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-white/90 hidden sm:inline">Unlock Direct-from-Factory Pricing</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-accent-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
            Factory Rates. <br className="hidden md:block"/>
            <span className="text-brand-accent-500">Without the Factory MOQ.</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-primary-100 max-w-3xl mx-auto mb-10 font-body">
            Join collective buying pools to unlock direct-from-factory pricing. The more buyers join, the lower the price goes for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="accent" size="lg" asChild className="w-full sm:w-auto text-lg">
              <Link href="/pools">Explore Active Pools &rarr;</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto text-lg text-white hover:bg-white/10 hover:text-white">
              <Link href="#how-it-works">How it Works</Link>
            </Button>
          </div>

          {/* Data-Driven Honest Stats Strip */}
          <div className="mt-12 max-w-4xl mx-auto px-2 min-h-[104px] flex items-center justify-center">
            {stats.activePoolsCount === 0 ? (
              /* Honest Early-Stage Banner */
              <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl font-bold font-display text-white">
                    🚀 Launching Soon — Be Among the First 100 Verified Buyers
                  </div>
                  <div className="text-xs sm:text-sm text-brand-primary-200 mt-1">
                    Get priority access to upcoming bulk factory pools and exclusive launch rates.
                  </div>
                </div>
                <Button variant="accent" size="sm" asChild className="shrink-0 font-semibold">
                  <Link href="/auth/signup">Join as Verified Buyer &rarr;</Link>
                </Button>
              </div>
            ) : (
              /* Real Metrics Strip (Only metrics with non-zero values are displayed) */
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.activePoolsCount > 0 && (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                      {stats.activePoolsCount}
                    </div>
                    <div className="text-xs sm:text-sm text-brand-primary-200 mt-1 font-medium">
                      Active Pools
                    </div>
                  </div>
                )}
                {stats.verifiedSuppliersCount > 0 && (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                      {stats.verifiedSuppliersCount}
                    </div>
                    <div className="text-xs sm:text-sm text-brand-primary-200 mt-1 font-medium">
                      Verified Suppliers
                    </div>
                  </div>
                )}
                {stats.totalCategoriesCount > 0 && (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                      {stats.totalCategoriesCount}
                    </div>
                    <div className="text-xs sm:text-sm text-brand-primary-200 mt-1 font-medium">
                      Categories
                    </div>
                  </div>
                )}
                {stats.avgSavingsPercent > 0 && (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                      Up to {stats.avgSavingsPercent}%
                    </div>
                    <div className="text-xs sm:text-sm text-brand-primary-200 mt-1 font-medium">
                      Max Savings at Highest Tier
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Trust Features (Guarantees & Feature Claims) */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <FadeIn delay={0.2} direction="up" className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-accent-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm sm:text-base font-display">Zero Inventory Risk</div>
                <div className="text-xs text-brand-primary-200 mt-0.5 leading-relaxed">
                  Order only what you need. No bulk stocking required.
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} direction="up" className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-accent-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm sm:text-base font-display">Pay Only When Pool Fills</div>
                <div className="text-xs text-brand-primary-200 mt-0.5 leading-relaxed">
                  No advance payment. We collect only after your pool is complete.
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.4} direction="up" className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-start gap-3">
              <Factory className="w-6 h-6 text-brand-accent-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm sm:text-base font-display">Quality Check on Large Orders</div>
                <div className="text-xs text-brand-primary-200 mt-0.5 leading-relaxed">
                  Every order above ₹1L goes through 2-step factory QC.
                </div>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white px-4">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-ink-900 mb-4 font-display tracking-tight">How TheGrowSetu Works</h2>
            <p className="text-ink-600 max-w-2xl mx-auto text-lg">We combine the buying power of hundreds of small businesses to negotiate better rates directly with top manufacturers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-brand-primary-50 text-brand-primary-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm border border-brand-primary-100 group-hover:bg-brand-primary-100 transition-colors">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">1. Join a Pool</h3>
              <p className="text-ink-600">Browse active product pools and commit to the quantity you need. No upfront payment required to join.</p>
            </div>
            <div className="text-center group transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-brand-primary-50 text-brand-primary-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm border border-brand-primary-100 group-hover:bg-brand-primary-100 transition-colors">
                <TrendingDown className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">2. Price Drops</h3>
              <p className="text-ink-600">As more buyers join the pool, the total quantity increases, unlocking cheaper pricing tiers for everyone.</p>
            </div>
            <div className="text-center group transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-brand-primary-50 text-brand-primary-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm border border-brand-primary-100 group-hover:bg-brand-primary-100 transition-colors">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">3. QC + Delivery</h3>
              <p className="text-ink-600">Once the pool closes, orders above ₹1L undergo our 2-step factory QC before direct delivery.</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Active Pools Section */}
      <section className="py-24 bg-ink-50 px-4 border-t border-ink-200">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-ink-900 mb-2 font-display tracking-tight">Active Pools</h2>
              <p className="text-ink-600 text-lg">Join these pools before they close to get the best rates.</p>
            </div>
            <Link href="/pools" className="hidden sm:block text-brand-primary-600 font-semibold hover:text-brand-primary-700 transition-colors">
              View All Pools &rarr;
            </Link>
          </FadeIn>
          
          {featuredPools.length > 0 ? (
            <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPools.map((pool, index) => (
                <StaggerItem key={pool.id}>
                  <PoolCard pool={pool} priority={index < 3} />
                </StaggerItem>
              ))}
            </StaggerList>
          ) : (
            <FadeIn className="bg-white rounded-2xl border border-ink-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-ink-100 text-ink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-ink-900 mb-2 font-display">No active pools right now</h3>
              <p className="text-ink-500">We are sourcing new products. Check back soon!</p>
            </FadeIn>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Link href="/pools" className="inline-block text-brand-primary-600 font-semibold hover:text-brand-primary-700 transition-colors">
              View All Pools &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
