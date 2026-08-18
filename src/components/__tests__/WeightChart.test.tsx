import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WeightChart from "../WeightChart";

// Mock recharts to avoid canvas rendering issues in JSDOM
vi.mock("recharts", () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

const mockData = [
  { date: "2025-01-01", weightKg: 72.5 },
  { date: "2025-01-08", weightKg: 72.0 },
  { date: "2025-01-15", weightKg: 71.5 },
  { date: "2025-01-22", weightKg: 71.0 },
];

describe("WeightChart", () => {
  describe("empty state", () => {
    it("renders empty state message when no data", () => {
      render(<WeightChart data={[]} />);
      expect(screen.getByText("No weight data yet")).toBeInTheDocument();
    });

    it("renders encouragement text in empty state", () => {
      render(<WeightChart data={[]} />);
      expect(
        screen.getByText("Log your weight to see the trend chart here!")
      ).toBeInTheDocument();
    });

    it("does not render chart in empty state", () => {
      render(<WeightChart data={[]} />);
      expect(
        screen.queryByTestId("responsive-container")
      ).not.toBeInTheDocument();
    });
  });

  describe("with data", () => {
    it("renders the chart title", () => {
      render(<WeightChart data={mockData} />);
      expect(screen.getByText("Weight Trend")).toBeInTheDocument();
    });

    it("renders the chart container", () => {
      render(<WeightChart data={mockData} />);
      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    });

    it("renders AreaChart component", () => {
      render(<WeightChart data={mockData} />);
      expect(screen.getByTestId("area-chart")).toBeInTheDocument();
    });

    it("has hover-lift class on the card", () => {
      const { container } = render(<WeightChart data={mockData} />);
      const card = container.firstChild as HTMLElement;
      expect(card.classList.contains("hover-lift")).toBe(true);
    });

    it("has glass-card class on the card", () => {
      const { container } = render(<WeightChart data={mockData} />);
      const card = container.firstChild as HTMLElement;
      expect(card.classList.contains("glass-card")).toBe(true);
    });
  });
});
