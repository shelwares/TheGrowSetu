import { getOrderById } from "@/lib/actions/order";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

function formatOrdinalDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "TBD";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "TBD";

  const day = date.getDate();
  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const month = date.toLocaleDateString("en-IN", { month: "short" });
  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  const order = await getOrderById(resolvedParams.orderId);

  if (!order) {
    notFound();
  }

  // Handle single object or array relations from Supabase
  const pool = Array.isArray(order.pools) ? order.pools[0] : order.pools;
  const product = Array.isArray(pool?.products) ? pool?.products[0] : pool?.products;
  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;

  const productName = product?.name || "Product";
  const buyerName = order.buyer_name || profile?.full_name?.trim() || "Buyer";
  const quantity = order.quantity || 0;
  const currentUnits = pool?.current_quantity ?? 0;
  const targetUnits = pool?.target_quantity ?? 0;
  const deadline = pool?.deadline;
  const formattedDate = formatOrdinalDate(deadline);

  const progressPercent =
    targetUnits > 0
      ? Math.min(100, Math.max(0, Math.round((currentUnits / targetUnits) * 100)))
      : 0;

  const total = order.quantity * order.unit_price_at_join + order.logistics_fee_applied;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Success Message Card (Order Submitted, Not Confirmed) */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 p-0 overflow-hidden shadow-sm hover:translate-y-0 hover:shadow-md transition-shadow">
        <div className="p-6 sm:p-8 space-y-5">
          {/* Header Title with Success Badge */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-ink-900 leading-tight">
                Aap <strong className="text-emerald-800 font-bold">{productName}</strong> Pool Mein Jud Gaye Hain ✅
              </h1>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Order Status: Submitted
                </span>
                <span className="text-xs text-ink-500 font-medium">
                  Awaiting Pool Target
                </span>
              </div>
            </div>
          </div>

          {/* Greeting and Order Confirmation Notice */}
          <div className="space-y-2 text-ink-800 text-sm sm:text-base leading-relaxed">
            <p>
              Hi <strong className="font-semibold text-ink-900">{buyerName}</strong>,
            </p>
            <p>
              Aapne <strong className="font-semibold text-ink-900">{productName}</strong> pool mein <strong className="font-semibold text-ink-900">{quantity} units</strong> ke saath order submit kar diya hai.
            </p>
          </div>

          {/* Pool Progress & Deadline Status Block */}
          <div className="bg-white/90 rounded-xl p-4 sm:p-5 border border-emerald-100/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-sm sm:text-base text-ink-800">
              <span className="text-base">📊</span>
              <span>
                <strong className="font-semibold text-ink-900">Pool Status:</strong> Abhi <strong className="text-emerald-700 font-bold">{currentUnits} / {targetUnits}</strong> units ho gaye hain.
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm sm:text-base text-ink-800">
              <span className="text-base">⏳</span>
              <span>
                <strong className="font-semibold text-ink-900">Deadline:</strong> <strong className="font-semibold text-ink-900">{formattedDate}</strong>
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="pt-1.5 space-y-1.5">
              <div className="w-full bg-ink-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-ink-500 font-medium">
                <span>{progressPercent}% target achieved</span>
                <span>Target: {targetUnits} units</span>
              </div>
            </div>
          </div>

          {/* Submission and Payment Expectation Explanatory Note */}
          <p className="text-ink-800 text-sm sm:text-base leading-relaxed">
            <strong className="font-semibold text-ink-900">Aapki order submit ho gayi hai.</strong> Jaise hi pool pura hota hai, hum aapki order confirm karenge aur payment ke liye aapse contact karenge.
          </p>

          {/* Viral Founder Referral Callout */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-sm leading-relaxed">
            Apne founder friends ko bhi batayein — jitni jaldi pool bharega, utni jaldi aapko product milega!
          </div>

          {/* Primary CTA and Team Sign-off */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                Pool Progress Dekhein
              </Button>
            </Link>
            <span className="text-sm font-medium text-ink-600 sm:text-right">
              — Team TheGrowSetu
            </span>
          </div>
        </div>
      </Card>

      {/* Intact Order Summary & Checkout Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-ink-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <h2 className="text-lg font-bold text-ink-900">Order Summary</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Status: Submitted
          </span>
        </div>

        <div className="flex justify-between text-sm sm:text-base text-ink-700">
          <span>Product</span>
          <span className="font-semibold text-ink-900">{productName}</span>
        </div>

        <div className="flex justify-between text-sm sm:text-base text-ink-700">
          <span>Quantity</span>
          <span className="font-semibold text-ink-900">{order.quantity} units</span>
        </div>

        <div className="flex justify-between text-sm sm:text-base text-ink-700">
          <span>Unit Price</span>
          <span className="font-semibold text-ink-900">₹{order.unit_price_at_join}</span>
        </div>

        <div className="flex justify-between text-sm sm:text-base text-ink-700">
          <span>Logistics Fee</span>
          <span className="font-semibold text-ink-900">₹{order.logistics_fee_applied}</span>
        </div>

        <div className="flex justify-between border-t border-ink-200 pt-4 font-bold text-base sm:text-lg text-ink-900">
          <span>Total</span>
          <span className="text-brand-primary-600">₹{total}</span>
        </div>

        <div className="flex items-start gap-2 text-xs text-ink-600 bg-ink-50 p-3 rounded-lg border border-ink-100">
          <AlertCircle className="w-4 h-4 text-ink-400 shrink-0 mt-0.5" />
          <span>
            Payment is not required now. Once the pool reaches the target quantity, our team will reach out to confirm your order and share payment instructions.
          </span>
        </div>

        <Link
          href="/dashboard"
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
