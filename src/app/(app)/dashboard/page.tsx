"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Flame, Target, TrendingUp, CheckCircle, Clock } from "lucide-react";

interface DashboardData {
  user: any;
  diet: any;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const isGuest = status === "unauthenticated";

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) {
        setLoadingData(false);
        return;
      }
      try {
        const res = await fetch("/api/user");
        if (res.status === 401) {
           // Handle unauthorized gracefully
           return;
        }
        const user = await res.json();
        
        if (!res.ok || user.error) {
          throw new Error("Failed to fetch");
        }
        
        const diet = user.dietTargets?.[0] || null;
        setData({ user, diet });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }
    
    fetchData();
  }, [isAuthenticated]);

  if (status === "loading" || (isAuthenticated && loadingData)) {
    return (
      <div className="flex justify-center items-center h-[60vh] fade-in-up">
        <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center animate-pulse">
          <span className="text-black font-bold">H</span>
        </div>
      </div>
    );
  }

  const { user, diet } = data || {};

  const displayName = isAuthenticated
    ? user?.name?.trim() || session?.user?.name?.trim() || session?.user?.email?.split("@")[0] || "User"
    : null;

  // Calculate goal progress percentage safely
  let progressPct = 0;
  if (user?.weightKg && user?.targetWeightKg) {
    const diff = Math.abs(user.weightKg - user.targetWeightKg);
    progressPct = Math.max(0, Math.min(100, 100 - (diff * 5)));
  }

  return (
    <div className="space-y-8 fade-in-up pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-2">
            {isGuest ? "GUEST PREVIEW" : "Overview"}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {isGuest ? "Explore HomeFit as a guest" : `Good morning, ${displayName}`}
          </h1>
          <p className="text-sm text-foreground/70 mt-2 max-w-xl">
            {isGuest 
              ? "Browse workouts, exercise demonstrations, and sample nutrition guidance. Sign in when you are ready to save your progress and personalize your plan."
              : "Here is a simple view of your progress and today’s next steps."}
          </p>
        </div>
      </div>

      {isAuthenticated && !user?.onboardingDone && (
        <div className="glass-card p-6 border-accent/20 bg-accent/5">
          <h2 className="text-lg font-bold text-foreground mb-2">Finish setting up your profile</h2>
          <p className="text-sm text-muted mb-4">Add your body metrics and goal to unlock your personal calorie target and progress view.</p>
          <Link href="/onboarding" className="inline-block px-4 py-2 bg-accent text-black font-bold rounded-lg hover:opacity-90">
            Complete profile
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-white/5 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="text-accent" size={16} />
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
              {isGuest ? "Sample Target" : "Today's Target"}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {isGuest ? "2,000" : (diet?.targetCalories || 0)} <span className="text-sm font-bold text-muted ml-1 tracking-normal">kcal</span>
          </p>
        </div>

        <div className="glass-card p-5 border-white/5 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-blue-400" size={16} />
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
              {isGuest ? "Sample Weight" : "Current Weight"}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {isGuest ? "75" : (user?.weightKg || 0)} <span className="text-sm font-bold text-muted ml-1 tracking-normal">kg</span>
          </p>
        </div>

        <div className="glass-card p-5 border-white/5 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-green-400" size={16} />
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
              {isGuest ? "Sample Goal" : "Target Weight"}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {isGuest ? "70" : (user?.targetWeightKg || 0)} <span className="text-sm font-bold text-muted ml-1 tracking-normal">kg</span>
          </p>
        </div>

        <div className="glass-card p-5 border-white/5 hover-lift flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px]" />
          <div className="flex justify-between items-end mb-2 relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">
              {isGuest ? "Sample Progress" : "Goal Progress"}
            </span>
            <span className="text-xs font-bold text-accent">
              {isGuest ? "65" : Math.round(progressPct)}%
            </span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full accent-gradient rounded-full" 
              style={{ width: `${isGuest ? 65 : progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action/Focus Section */}
      {isGuest ? (
        <div className="glass-card p-6 md:p-8 border-white/5 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Complete your profile to see your personal target.</h2>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">Get an AI-generated calorie target, daily macro split, and a customized 6-day workout schedule.</p>
          <Link href="/signup" className="px-6 py-3 rounded-xl text-sm font-bold accent-gradient text-black hover:opacity-90 transition-all">
            Create your personal plan
          </Link>
        </div>
      ) : (
        <div className="glass-card p-6 md:p-8 border-white/5">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="text-accent" size={20} />
            Today&apos;s focus
          </h2>
          
          <div className="space-y-3">
            <Link href="/diet" className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Follow today&apos;s meal plan</p>
                  <p className="text-xs text-muted mt-0.5">Your personalized meals are ready.</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </Link>

            <Link href="/exercises" className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-400">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Complete your planned activity</p>
                  <p className="text-xs text-muted mt-0.5">Stay on track with your routine.</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link href="/progress" className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center text-purple-400">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Record your weight or progress</p>
                  <p className="text-xs text-muted mt-0.5">Log today&apos;s entry to track your journey.</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
