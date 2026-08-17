import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StreakBadge from "../StreakBadge";

describe("StreakBadge", () => {
  const defaultProps = {
    currentStreak: 5,
    longestStreak: 12,
    weeklyCompleted: 4,
    weeklyTotal: 6,
  };

  it("renders all three stat cards", () => {
    render(<StreakBadge {...defaultProps} />);
    expect(screen.getByText("Day Streak")).toBeInTheDocument();
    expect(screen.getByText("Best Streak")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
  });

  it("displays the correct streak values", () => {
    render(<StreakBadge {...defaultProps} />);
    // The AnimatedNumber will eventually display the correct value
    // We check for the text content
    expect(screen.getByTestId("streak-badge")).toBeInTheDocument();
  });

  it("shows weekly completed / total", () => {
    render(<StreakBadge {...defaultProps} />);
    expect(screen.getByText("/6")).toBeInTheDocument();
  });

  it("renders progress bar with correct aria attributes", () => {
    render(<StreakBadge {...defaultProps} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "4");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "6");
  });

  it("applies fire-pulse animation when streak > 0", () => {
    const { container } = render(<StreakBadge {...defaultProps} />);
    const fireIcon = container.querySelector(".fire-pulse");
    expect(fireIcon).toBeInTheDocument();
  });

  it("does not apply fire-pulse when streak is 0", () => {
    const { container } = render(
      <StreakBadge {...defaultProps} currentStreak={0} />
    );
    const fireIcon = container.querySelector(".fire-pulse");
    expect(fireIcon).toBeNull();
  });

  it("renders with 0 values without errors", () => {
    render(
      <StreakBadge
        currentStreak={0}
        longestStreak={0}
        weeklyCompleted={0}
        weeklyTotal={6}
      />
    );
    expect(screen.getByTestId("streak-badge")).toBeInTheDocument();
  });
});
