"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Dumbbell,
  TrendingUp,
  Utensils,
  User,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/diet", label: "Diet", icon: Utensils },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav
        id="mobile-nav"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0d1117]/90 backdrop-blur-xl border-t border-border"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
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
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav
        id="desktop-nav"
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 gap-2 bg-[#0d1117]/80 backdrop-blur-xl border-r border-border z-50"
      >
        <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center mb-6 hover-lift">
          <Dumbbell size={20} className="text-black" />
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              id={`nav-desktop-${item.label.toLowerCase()}`}
              className={`group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-14 ${
                isActive
                  ? "text-accent bg-accent-dim"
                  : "text-muted hover:text-foreground hover:bg-card"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
              />
              <span className="text-[9px] font-medium">{item.label}</span>
              {/* Hover tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-[#1a1f2e] text-foreground text-xs font-medium rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-border shadow-lg">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
