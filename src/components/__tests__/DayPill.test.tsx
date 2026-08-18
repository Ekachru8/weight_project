import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DayPill from "../DayPill";

describe("DayPill", () => {
  it("renders the day number and name", () => {
    render(<DayPill dayNumber={1} dayName="Chest" />);
    expect(screen.getByText("Day 1")).toBeInTheDocument();
    expect(screen.getByText("Chest")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<DayPill dayNumber={3} dayName="Legs" />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Day 3: Legs"
    );
  });

  it("includes (Today) in aria-label when isToday", () => {
    render(<DayPill dayNumber={1} dayName="Chest" isToday />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Day 1: Chest (Today)"
    );
  });

  it("shows today dot when isToday is true", () => {
    const { container } = render(
      <DayPill dayNumber={1} dayName="Chest" isToday />
    );
    const dot = container.querySelector(".bg-accent.rounded-full");
    expect(dot).toBeInTheDocument();
  });

  it("does not show today dot when isToday is false", () => {
    const { container } = render(
      <DayPill dayNumber={1} dayName="Chest" isToday={false} />
    );
    const dot = container.querySelector(".bg-accent.rounded-full.animate-pulse");
    expect(dot).toBeNull();
  });

  it("applies active state classes when isActive", () => {
    const { container } = render(
      <DayPill dayNumber={1} dayName="Chest" isActive />
    );
    const button = container.querySelector("button");
    expect(button?.className).toContain("ring-2");
    expect(button?.className).toContain("scale-105");
  });

  it("fires onClick when provided", () => {
    const handleClick = vi.fn();
    render(<DayPill dayNumber={1} dayName="Chest" onClick={handleClick} />);
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("has cursor-default when no onClick", () => {
    const { container } = render(
      <DayPill dayNumber={1} dayName="Chest" />
    );
    expect(container.querySelector("button")?.className).toContain(
      "cursor-default"
    );
  });

  it("has data-testid attribute", () => {
    render(<DayPill dayNumber={3} dayName="Legs" />);
    expect(screen.getByTestId("day-pill-3")).toBeInTheDocument();
  });
});
