import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HomeFit — Home Workout & Diet Tracker",
  description:
    "Track your 6-day home workout split, log consistency, and manage your nutrition — all from your phone.",
  keywords: ["home workout", "fitness tracker", "diet planner", "workout log", "macro calculator"],
  authors: [{ name: "HomeFit" }],
  openGraph: {
    title: "HomeFit — Home Workout & Diet Tracker",
    description: "Track your 6-day home workout split, log consistency, and manage your nutrition.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0f14" />
      </head>
      <body className="min-h-screen bg-background text-foreground pb-20 md:pb-0 md:pl-20">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
