"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck, LogOut } from "lucide-react";

export default function MFAVerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      const supabase = getSupabaseClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === "aal2") {
        router.replace("/admin");
        return;
      }

      const { data: factors, error: factorsError } =
        await supabase.auth.mfa.listFactors();

      if (factorsError) {
        setError(factorsError.message);
        setChecking(false);
        return;
      }

      const totpFactor = factors?.totp?.find((f) => f.status === "verified");
      if (!totpFactor) {
        router.replace("/dashboard/security?reason=setup-required");
        return;
      }

      setFactorId(totpFactor.id);

      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

      if (challengeError) {
        setError(challengeError.message);
        setChecking(false);
        return;
      }

      setChallengeId(challenge.id);
      setChecking(false);
    };

    setup();
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !challengeId) return;

    setLoading(true);
    setError(null);

    const supabase = getSupabaseClient();
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });

    if (verifyError) {
      setError(verifyError.message);
      toast.error(verifyError.message);
      setLoading(false);
      return;
    }

    toast.success("Verified successfully!");
    router.replace("/admin");
    router.refresh();
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="animate-spin w-8 h-8 border-4 border-brand-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-primary-50 mb-4">
            <ShieldCheck className="w-7 h-7 text-brand-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Verify 2FA</h1>
          <p className="text-ink-500 text-sm mt-1">
            Enter the 6-digit code from Google Authenticator
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="text-center text-2xl tracking-widest font-mono"
            autoFocus
            required
          />

          <Button
            type="submit"
            disabled={code.length !== 6 || loading}
            className="w-full"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-ink-100 text-center">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <p className="text-xs text-ink-400 text-center mt-4">
          Lost access? Contact support@thegrowsetu.com
        </p>
      </Card>
    </div>
  );
}
