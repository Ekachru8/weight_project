import Navbar from "@/components/Navbar";
import { isGuestMode } from "@/lib/guest";
import Link from "next/link";
import { Providers } from "@/components/Providers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const guestMode = await isGuestMode();

  return (
    <Providers>
      <div className="min-h-screen pb-20 md:pb-0 md:pl-20 relative">
        {guestMode && (
          <div className="w-full bg-accent text-black py-2.5 px-4 text-sm font-semibold flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <span className="bg-black/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold">Guest preview</span>
              <span className="hidden sm:inline">You are browsing HomeFit in Guest Preview. Sign in to save your progress and unlock personalized plans.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:opacity-80 transition-opacity">Sign in</Link>
              <Link href="/signup" className="bg-black text-white px-3 py-1 rounded-lg text-xs hover:bg-black/80 transition-colors">Create account</Link>
            </div>
          </div>
        )}
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
          {children}
        </main>
      </div>
    </Providers>
  );
}
