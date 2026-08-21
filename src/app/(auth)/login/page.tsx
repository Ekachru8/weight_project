"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";

type IdentifierType = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const [identifierType, setIdentifierType] = useState<IdentifierType>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email/phone and password.");
      } else {
        document.cookie = "homefit_guest=; Max-Age=0; path=/";
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      document.cookie = "homefit_guest=; Max-Age=0; path=/";
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#030303]">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c0ff00] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00e676] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8 fade-in-up">
          <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center shadow-lg shadow-accent/20">
            <Dumbbell size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted">
              Sign in to securely access your plan
            </p>
          </div>
        </div>

        <div className="text-xs text-center text-muted mb-6">
          Browse the HomeFit experience without an account. Sign in or create an account when you want personalized plans, progress tracking, or saved changes.
        </div>

        <div className="glass-card p-6 sm:p-8 fade-in-up opacity-0 shadow-[0_0_50px_rgba(192,255,0,0.05)]" style={{ animationDelay: "100ms" }}>
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-border hover:bg-white/10 text-foreground font-semibold transition-all duration-300 mb-6 hover-lift"
          >
            {googleLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted uppercase tracking-wider font-medium">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => {
                setIdentifierType("email");
                setIdentifier("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                identifierType === "email"
                  ? "bg-accent-dim text-accent border border-accent/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  : "bg-card border border-border text-muted hover:text-foreground"
              }`}
            >
              <Mail size={14} className="inline mr-1.5 -mt-0.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifierType("phone");
                setIdentifier("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                identifierType === "phone"
                  ? "bg-accent-dim text-accent border border-accent/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  : "bg-card border border-border text-muted hover:text-foreground"
              }`}
            >
              <Phone size={14} className="inline mr-1.5 -mt-0.5" />
              Phone
            </button>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="relative">
              {identifierType === "email" ? (
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
              ) : (
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
              )}
              <input
                id="auth-identifier"
                type={identifierType === "email" ? "email" : "tel"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  identifierType === "email"
                    ? "your@email.com"
                    : "+91 98765 43210"
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200 pl-10"
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all duration-200 pl-10 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold accent-gradient text-black hover:opacity-90 shadow-[0_0_20px_rgba(192,255,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 btn-press"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border flex flex-col items-center gap-3">
             <button
                onClick={() => {
                   setLoading(true);
                   document.cookie = "homefit_guest=true; path=/";
                   router.push("/dashboard");
                }}
                disabled={loading}
                className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
             >
                Continue as Guest
             </button>
             <p className="text-xs text-center text-muted">
               Browse HomeFit without an account. Sign in or create an account when you want personalized plans, saved progress, and AI recommendations.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
