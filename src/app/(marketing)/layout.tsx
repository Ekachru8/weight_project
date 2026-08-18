import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HomeFit — Transform Your Body at Home",
  description:
    "Track your workouts, diet, and progress with HomeFit. The premium home fitness tracker that helps you build consistency and achieve your goals.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
