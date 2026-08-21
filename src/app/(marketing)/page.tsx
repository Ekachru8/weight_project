"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  Dumbbell,
  TrendingUp,
  Utensils,
  Calendar,
  Flame,
  ChevronRight,
  Star,
  ArrowRight,
  Mail,
  Zap,
  Target,
  Shield,
} from "lucide-react";

/* ── Floating particle component ── */
function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * 10,
        opacity: 0.1 + Math.random() * 0.25,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="landing-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  return (
    <div
      className="landing-feature-card fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`landing-feature-icon ${gradient}`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-lg font-bold text-foreground mt-4 mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

/* ── Stat Counter ── */
function StatCounter({
  value,
  label,
  suffix,
}: {
  value: string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold accent-text">
        {value}
        {suffix && <span className="text-xl text-accent/70">{suffix}</span>}
      </div>
      <div className="text-xs sm:text-sm text-muted mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Dumbbell,
      title: "Smart Workouts",
      description:
        "Follow a structured 6-day split with curated exercises, form cues, and progressive overload tracking.",
      gradient: "landing-gradient-lime",
    },
    {
      icon: TrendingUp,
      title: "Visual Progress",
      description:
        "Track your weight, consistency heatmaps, and streaks with beautiful interactive charts.",
      gradient: "landing-gradient-sky",
    },
    {
      icon: Utensils,
      title: "Diet Intelligence",
      description:
        "Get personalized macro targets with calorie-accurate meal suggestions powered by your goals.",
      gradient: "landing-gradient-orange",
    },
    {
      icon: Calendar,
      title: "Schedule View",
      description:
        "See your entire week at a glance. Know exactly what to do every day with zero guesswork.",
      gradient: "landing-gradient-violet",
    },
    {
      icon: Target,
      title: "Goal Projection",
      description:
        "Set a target weight and get a realistic timeline with a visual chart showing your projected journey.",
      gradient: "landing-gradient-rose",
    },
    {
      icon: Shield,
      title: "Your Data, Secure",
      description:
        "Sign in with Google, email, or phone. Your progress is always safe and synced across sessions.",
      gradient: "landing-gradient-teal",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />

      {/* ── Navbar ── */}
      <nav
        id="landing-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0b0f14]/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center group-hover:scale-105 transition-transform">
              <Dumbbell size={18} className="text-black" />
            </div>
            <span className="text-lg font-extrabold text-foreground tracking-tight">
              Home<span className="accent-text">Fit</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              id="landing-login-btn"
              className="px-4 py-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              id="landing-signup-btn"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 accent-gradient text-black hover:opacity-90 hover:scale-105 shadow-lg shadow-accent/20"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glowing orbs & Cyber Rings */}
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-40 right-1/4 w-60 h-60 bg-sky-500/8 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] max-h-[600px] pointer-events-none opacity-40 z-0 hidden md:block">
            <div className="cyber-ring cyber-ring-1" />
            <div className="cyber-ring cyber-ring-2" />
            <div className="cyber-ring cyber-ring-3" />
            <div className="cyber-ring" style={{ width: '300px', height: '300px', border: 'none' }}>
              <div className="radar-sweep" />
            </div>
          </div>

          <div className="fade-in-up relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-dim border border-accent/20 text-accent text-xs font-semibold mb-6 landing-badge-glow">
              <Zap size={14} />
              Your Home Gym Companion
            </div>
          </div>

          <h1 className="fade-in-up relative z-10 text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Transform Your Body
            <br />
            <span className="text-gradient-hero">From Home</span>
          </h1>

          <p className="fade-in-up relative z-10 opacity-0 text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: "150ms" }}>
            Track workouts, crush macros, and build unbreakable consistency — all
            with premium tools designed for your home fitness journey.
          </p>

          <div className="fade-in-up relative z-10 opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" style={{ animationDelay: "300ms" }}>
            <Link
              href="/signup"
              id="hero-cta-btn"
              className="group px-8 py-4 rounded-2xl text-base font-bold accent-gradient text-black hover:opacity-90 shadow-[0_0_30px_rgba(192,255,0,0.3)] hover:shadow-[0_0_50px_rgba(192,255,0,0.5)] transition-all duration-300 flex items-center gap-2 hover:gap-3 btn-press"
            >
              Get Started Free
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <button
              onClick={() => {
                document.cookie = "homefit_guest=true; path=/";
                router.push("/dashboard");
              }}
              className="px-8 py-4 rounded-2xl text-base font-semibold text-foreground bg-card border border-border hover:bg-card-hover transition-all duration-300 flex items-center gap-2"
            >
              Continue as Guest
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="fade-in-up relative z-10 opacity-0 text-center" style={{ animationDelay: "400ms" }}>
             <p className="text-xs text-muted max-w-md mx-auto">
               Browse HomeFit without an account. Sign in or create an account when you want personalized plans, saved progress, and AI recommendations.
             </p>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative py-12 border-y border-border bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-3 gap-6">
          <StatCounter value="6" label="Day Split" suffix="-day" />
          <StatCounter value="40" label="Exercises" suffix="+" />
          <StatCounter value="100" label="Free Forever" suffix="%" />
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="accent-text">Succeed</span>
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              A complete fitness platform — workouts, nutrition, and progress
              tracking — all in one beautiful interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={100 + i * 80}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-10 sm:p-14 relative overflow-hidden landing-cta-card">
            <div className="absolute top-0 right-0 w-48 h-48 accent-gradient rounded-full blur-[80px] opacity-15 -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-sky-500 rounded-full blur-[60px] opacity-10 translate-y-8 -translate-x-8" />

            <div className="relative z-10">
              <Flame
                size={48}
                className="mx-auto mb-5 text-accent"
                strokeWidth={1.5}
              />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted text-base mb-8 max-w-md mx-auto">
                Join HomeFit today and get personalized workouts, macro tracking, and
                a clear path to your goals.
              </p>
              <Link
                href="/login"
                id="cta-start-btn"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold accent-gradient text-black hover:opacity-90 shadow-xl shadow-accent/20 transition-all duration-300"
              >
                <Star size={18} />
                Create Your Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-border bg-[#080b0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center">
                <Dumbbell size={16} className="text-black" />
              </div>
              <span className="text-sm font-bold text-foreground">
                Home<span className="accent-text">Fit</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <Mail size={14} />
              <a
                href="mailto:hello@homefit.app"
                className="hover:text-foreground transition-colors"
              >
                hello@homefit.app
              </a>
            </div>

            <p className="text-xs text-muted/60">
              © {new Date().getFullYear()} HomeFit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
