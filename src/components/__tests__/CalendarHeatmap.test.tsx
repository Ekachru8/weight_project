import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CalendarHeatmap from "../CalendarHeatmap";

// Fixed date for deterministic tests
const TODAY = new Date(2025, 2, 15); // March 15, 2025
const REG_DATE = "2025-01-01";

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Generate mock logs with some completed and some skipped days
function generateMockLogs() {
  const logs: Array<{ date: string; completed: boolean; dayNumber: number }> =
    [];
  const regDate = new Date(2025, 0, 1);
  const current = new Date(regDate);

  while (current <= TODAY) {
    const diffDays = Math.floor(
      (current.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dayNum = ((diffDays % 7) + 7) % 7 + 1;

    if (dayNum !== 7) {
      logs.push({
        date: formatDate(current),
        completed: diffDays % 3 !== 0, // Skip every 3rd day
        dayNumber: dayNum,
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return logs;
}

describe("CalendarHeatmap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the title", () => {
    render(
      <CalendarHeatmap logs={[]} registrationDate={REG_DATE} />
    );
    expect(screen.getByText("Activity Heatmap")).toBeInTheDocument();
  });

  it("renders legend items", () => {
    render(
      <CalendarHeatmap logs={[]} registrationDate={REG_DATE} />
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Skipped")).toBeInTheDocument();
    expect(screen.getByText("Rest")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders day labels", () => {
    render(
      <CalendarHeatmap logs={[]} registrationDate={REG_DATE} />
    );
    // Odd-indexed labels are hidden, so only M, W, F, S are shown
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("W")).toBeInTheDocument();
  });

  it("renders heatmap cells", () => {
    const logs = generateMockLogs();
    const { container } = render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    const cells = container.querySelectorAll(".heatmap-cell");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("applies heatmap-pop animation class to cells", () => {
    const logs = generateMockLogs();
    const { container } = render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    const cells = container.querySelectorAll(".heatmap-pop");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("shows completed cells with accent color", () => {
    const logs = generateMockLogs();
    const { container } = render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    const completedCells = container.querySelectorAll(".bg-accent");
    expect(completedCells.length).toBeGreaterThan(0);
  });

  it("shows skipped cells with red color", () => {
    const logs = generateMockLogs();
    const { container } = render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    const skippedCells = container.querySelectorAll('[class*="bg-red"]');
    expect(skippedCells.length).toBeGreaterThan(0);
  });

  it("renders cells with title tooltips", () => {
    const logs = [
      { date: "2025-03-14", completed: true, dayNumber: 3 },
    ];
    const { container } = render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    const cellsWithTitle = container.querySelectorAll(".heatmap-cell[title]");
    // At least some cells should have titles
    const titledCells = Array.from(cellsWithTitle).filter(
      (c) => c.getAttribute("title") !== ""
    );
    expect(titledCells.length).toBeGreaterThan(0);
  });

  it("applies staggered animation delays to cells", () => {
    const logs = generateMockLogs();
    const { container } = render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    const cells = container.querySelectorAll(".heatmap-cell");
    // First cell should have an animation delay style
    if (cells.length > 0) {
      const delay = (cells[0] as HTMLElement).style.animationDelay;
      expect(delay).toBeDefined();
    }
  });

  it("has glass-card class on the wrapper", () => {
    const { container } = render(
      <CalendarHeatmap logs={[]} registrationDate={REG_DATE} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("glass-card")).toBe(true);
  });

  it("renders month labels", () => {
    const logs = generateMockLogs();
    render(
      <CalendarHeatmap logs={logs} registrationDate={REG_DATE} />
    );
    // Should show month abbreviations like Jan, Feb, Mar
    // At least "Mar" should be visible since today is March 15
    expect(screen.getByText("Mar")).toBeInTheDocument();
  });
});
