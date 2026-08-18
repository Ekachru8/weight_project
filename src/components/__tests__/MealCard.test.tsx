import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MealCard from "../MealCard";
import type { Meal } from "@/lib/meals";

const mockMeal: Meal = {
  name: "Scrambled Eggs & Toast",
  items: "2 whole eggs scrambled with spinach, 1 slice whole-wheat toast",
  calories: 350,
  protein: 22,
  carbs: 20,
  fat: 22,
};

describe("MealCard", () => {
  it("renders the meal name", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(screen.getByText("Scrambled Eggs & Toast")).toBeInTheDocument();
  });

  it("renders the meal items description", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(
      screen.getByText(
        "2 whole eggs scrambled with spinach, 1 slice whole-wheat toast"
      )
    ).toBeInTheDocument();
  });

  it("renders the meal time label", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  it("renders calorie badge", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(screen.getByText("350 kcal")).toBeInTheDocument();
  });

  it("renders protein badge", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(screen.getByText("P: 22g")).toBeInTheDocument();
  });

  it("renders carbs badge", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(screen.getByText("C: 20g")).toBeInTheDocument();
  });

  it("renders fat badge", () => {
    render(<MealCard meal={mockMeal} mealTime="Breakfast" />);
    expect(screen.getByText("F: 22g")).toBeInTheDocument();
  });

  it("uses the correct icon for breakfast", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Breakfast" />
    );
    // Breakfast uses the meal-icon-breakfast class
    const iconBg = container.querySelector(".meal-icon-breakfast");
    expect(iconBg).toBeInTheDocument();
  });

  it("uses the correct icon for lunch", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Lunch" />
    );
    const iconBg = container.querySelector(".meal-icon-lunch");
    expect(iconBg).toBeInTheDocument();
  });

  it("uses the correct icon for dinner", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Dinner" />
    );
    const iconBg = container.querySelector(".meal-icon-dinner");
    expect(iconBg).toBeInTheDocument();
  });

  it("uses the correct icon for morning snack", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Morning Snack" />
    );
    const iconBg = container.querySelector(".meal-icon-snack");
    expect(iconBg).toBeInTheDocument();
  });

  it("uses the correct icon for evening snack", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Evening Snack" />
    );
    const iconBg = container.querySelector(".meal-icon-snack");
    expect(iconBg).toBeInTheDocument();
  });

  it("has hover-lift class on the card", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Breakfast" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("hover-lift")).toBe(true);
  });

  it("has glass-card class on the card", () => {
    const { container } = render(
      <MealCard meal={mockMeal} mealTime="Breakfast" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("glass-card")).toBe(true);
  });
});
