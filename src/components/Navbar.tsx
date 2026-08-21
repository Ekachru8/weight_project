"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  Calendar,
  Dumbbell,
  TrendingUp,
  Utensils,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/diet", label: "Diet", icon: Utensils },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/exercises", label: "Workouts", icon: Dumbbell },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const displayName = isAuthenticated
    ? session?.user?.name?.trim() || session?.user?.email?.split("@")[0] || "User"
    : "Guest Preview";

  return (
    <>
      {/* Mobile bottom nav */}
      <nav
        id="mobile-nav"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0d1117]/90 backdrop-blur-xl border-t border-border safe-bottom"
      >
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-mobile-${item.label.toLowerCase()}`}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-300 btn-press ${
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                />
                <span className="text-[9px] font-medium hidden sm:block">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-accent rounded-full sm:hidden" />
                )}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-300 btn-press text-danger/80 hover:text-danger"
            >
              <LogOut size={20} strokeWidth={1.5} />
              <span className="text-[9px] font-medium hidden sm:block">Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-300 btn-press text-accent hover:text-accent/80"
            >
              <User size={20} strokeWidth={1.5} />
              <span className="text-[9px] font-medium hidden sm:block">Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav
        id="desktop-nav"
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 gap-2 bg-[#0d1117]/80 backdrop-blur-xl border-r border-border z-50 justify-between"
      >
        <div className="flex flex-col items-center w-full gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6">
            <span className="text-accent font-black text-lg">H</span>
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                id={`nav-desktop-${item.label.toLowerCase()}`}
                className={`group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-14 ${
                  isActive
                    ? "text-accent bg-accent/5 shadow-[inset_0_1px_1px_rgba(180,245,53,0.1)]"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
                )}
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={`transition-transform duration-300 ${isActive ? "scale-105" : ""}`}
                />
                <span className="text-[9px] font-medium hidden md:block opacity-0 group-hover:opacity-100 absolute left-16 bg-black/80 px-2 py-1 rounded border border-white/10 pointer-events-none transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              {isAuthenticated && session?.user?.image ? (
                <img src={session.user.image} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-white/50" />
              )}
            </div>
            <span className="text-[8px] text-white/50 max-w-[50px] truncate text-center">{displayName}</span>
          </div>
        
          {isAuthenticated ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-14 text-danger/70 hover:text-danger hover:bg-danger/10"
            >
              <LogOut size={20} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="text-[9px] font-medium">Logout</span>
              <span className="absolute left-full ml-3 px-2 py-1 bg-[#1a1f2e] text-foreground text-xs font-medium rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-border shadow-lg">
                Logout
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-14 text-accent/70 hover:text-accent hover:bg-accent/10"
            >
              <User size={20} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="text-[9px] font-medium text-center leading-tight">Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
