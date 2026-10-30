"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, Copy, Check } from "lucide-react";

type Factor = {
  id: string;
  friendly_name?: string;
  status: string;
  created_at: string;
  factor_type: string;
};

export default function SecurityPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [factors, setFactors] = useState<Factor[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors((data?.totp || []) as Factor[]);
    setLoading(false);
  };

  const enrollMFA = async () => {
    setEnrolling(true);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Admin TOTP",
    });
    setEnrolling(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setFactorId(data.id);
  };

  const verifyMFA = async () => {
    if (!factorId) return;
    setVerifying(true);

    const supabase = getSupabaseClient();
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      toast.error(challengeError.message);
      setVerifying(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode,
    });

    setVerifying(false);

    if (verifyError) {
      toast.error(verifyError.message);
      return;
    }

    toast.success("2FA enabled successfully!");
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerifyCode("");
    await loadFactors();
  };

  const copySecret = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const unenrollMFA = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to disable 2FA? This will reduce your account security."
      )
    )
      return;

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("2FA disabled");
    await loadFactors();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-ink-500">Loading...</div>
    );
  }

  const verifiedFactors = factors.filter((f) => f.status === "verified");
  const hasMFA = verifiedFactors.length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {reason === "setup-required" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg">
          <p className="font-semibold">⚠️ 2FA Setup Required</p>
          <p className="text-sm mt-1">
            Admin panel access requires two-factor authentication. Please set up 2FA below.
          </p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-ink-900">Security Settings</h1>
        <p className="text-ink-500 text-sm mt-1">
          Protect your account with two-factor authentication (2FA).
        </p>
      </div>

      <Card className="p-6">
        {hasMFA ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-9 h-9 text-emerald-600" />
              <div>
                <h2 className="font-bold text-ink-900">2FA is Enabled</h2>
                <p className="text-sm text-ink-500">
                  Your account is protected with two-factor authentication.
                </p>
              </div>
            </div>

            {verifiedFactors.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between bg-ink-50 rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">
                    {f.friendly_name || "TOTP"}
                  </p>
                  <p className="text-xs text-ink-500">
                    Added {new Date(f.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => unenrollMFA(f.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-9 h-9 text-amber-500" />
              <div>
                <h2 className="font-bold text-ink-900">
                  Add Two-Factor Authentication
                </h2>
                <p className="text-sm text-ink-500">
                  Add an extra security layer using Google Authenticator.
                </p>
              </div>
            </div>

            {!qrCode ? (
              <Button onClick={enrollMFA} disabled={enrolling}>
                {enrolling ? "Setting up..." : "Enable 2FA"}
              </Button>
            ) : (
              <div className="space-y-4 pt-4 border-t border-ink-100">
                <p className="text-sm text-ink-700 font-medium">
                  Step 1: Scan this QR code with Google Authenticator
                </p>

                {qrCode && (
                  <div className="flex justify-center bg-white p-4 rounded-lg border border-ink-200">
                    <Image
                      src={qrCode}
                      alt="QR Code"
                      width={192}
                      height={192}
                      unoptimized
                      className="w-48 h-48"
                    />
                  </div>
                )}

                <div className="bg-ink-50 rounded-lg p-3">
                  <p className="text-xs text-ink-500 mb-1">
                    Or enter this secret manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-ink-200 break-all">
                      {secret}
                    </code>
                    <button
                      onClick={copySecret}
                      className="p-2 hover:bg-ink-100 rounded"
                      title="Copy secret"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-ink-500" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-ink-700 font-medium">
                  Step 2: Enter the 6-digit code from Google Authenticator
                </p>

                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="text-center text-2xl tracking-widest font-mono"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={verifyMFA}
                    disabled={verifyCode.length !== 6 || verifying}
                    className="flex-1"
                  >
                    {verifying ? "Verifying..." : "Verify & Enable"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQrCode(null);
                      setSecret(null);
                      setFactorId(null);
                      setVerifyCode("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-4 bg-ink-50">
        <p className="text-xs text-ink-600">
          <strong>Tip:</strong> Install <strong>Google Authenticator</strong>{" "}
          or <strong>Authy</strong> on your phone to generate 6-digit codes.
        </p>
      </Card>
    </div>
  );
}
