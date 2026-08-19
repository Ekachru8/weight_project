import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0b0f14" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground safe-bottom`}>
        {children}
      </body>
    </html>
  );
}
