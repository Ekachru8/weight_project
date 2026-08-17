import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WorkoutCard from "../WorkoutCard";

const mockExercise = {
  id: 1,
  name: "Flat Dumbbell Press",
  sets: 4,
  reps: "12",
  equipment: "Dumbbells",
  muscleGroup: "Chest",
  formCue: "Keep elbows at 45 degrees, squeeze at the top.",
};

describe("WorkoutCard", () => {
  it("renders exercise name", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(screen.getByText("Flat Dumbbell Press")).toBeInTheDocument();
  });

  it("renders sets and reps", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(screen.getByText("4 × 12")).toBeInTheDocument();
  });

  it("renders equipment", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(screen.getByText("Dumbbells")).toBeInTheDocument();
  });

  it("renders muscle group", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(screen.getByText("Chest")).toBeInTheDocument();
  });

  it("shows the correct index number (1-based)", () => {
    render(<WorkoutCard exercise={mockExercise} index={2} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("has expandable form tip button", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(screen.getByText("Form tip")).toBeInTheDocument();
  });

  it("does not show form cue initially", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(
      screen.queryByText("Keep elbows at 45 degrees, squeeze at the top.")
    ).not.toBeInTheDocument();
  });

  it("shows form cue after clicking expand", async () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    screen.getByText("Form tip").click();
    expect(
      screen.getByText("Keep elbows at 45 degrees, squeeze at the top.")
    ).toBeInTheDocument();
  });

  it("has data-testid attribute", () => {
    render(<WorkoutCard exercise={mockExercise} index={0} />);
    expect(screen.getByTestId("workout-card-1")).toBeInTheDocument();
  });

  it("has correct animation delay based on index", () => {
    const { container } = render(
      <WorkoutCard exercise={mockExercise} index={3} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.style.animationDelay).toBe("240ms");
  });
});
