import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MacroRing from "../MacroRing";

// Mock recharts to avoid canvas rendering issues in JSDOM
vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => <div data-testid="tooltip" />,
}));

const defaultProps = {
  proteinG: 140,
  carbsG: 250,
  fatG: 60,
  calories: 2000,
};

describe("MacroRing", () => {
  it("renders the component title", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("Daily Macros")).toBeInTheDocument();
  });

  it("renders the calorie count in the center", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("2000")).toBeInTheDocument();
    expect(screen.getByText("kcal")).toBeInTheDocument();
  });

  it("renders protein grams", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("140")).toBeInTheDocument();
  });

  it("renders carbs grams", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("renders fat grams", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("renders all three macro labels", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByText("Carbs")).toBeInTheDocument();
    expect(screen.getByText("Fat")).toBeInTheDocument();
  });

  it("calculates correct percentages", () => {
    // Protein: 140*4=560, Carbs: 250*4=1000, Fat: 60*9=540
    // Total: 2100
    // Protein%: round(560/2100*100)=27
    // Carbs%: round(1000/2100*100)=48
    // Fat%: round(540/2100*100)=26
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByText("27%")).toBeInTheDocument();
    expect(screen.getByText("48%")).toBeInTheDocument();
    expect(screen.getByText("26%")).toBeInTheDocument();
  });

  it("renders the pie chart container", () => {
    render(<MacroRing {...defaultProps} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders progress bars for each macro", () => {
    const { container } = render(<MacroRing {...defaultProps} />);
    const progressBars = container.querySelectorAll(".progress-fill-animate");
    expect(progressBars.length).toBe(3);
  });

  it("renders gram suffix for each macro", () => {
    render(<MacroRing {...defaultProps} />);
    const gLabels = screen.getAllByText("g");
    expect(gLabels.length).toBe(3);
  });

  it("has hover-lift class on the card", () => {
    const { container } = render(<MacroRing {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("hover-lift")).toBe(true);
  });
});
