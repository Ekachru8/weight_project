/**
 * Sample meal plans organized by calorie tier and diet preference.
 * Three diet types: vegetarian, non-vegetarian, eggetarian
 * Three calorie tiers: ~1500, ~2000, ~2500
 */

export type DietType = "vegetarian" | "non_vegetarian" | "eggetarian";

export interface Meal {
  name: string;
  items: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlan {
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  eveningSnack: Meal;
  dinner: Meal;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

/**
 * Get a sample meal plan based on target calories and diet preference.
 * Selects the closest calorie tier.
 */
export function getSampleMealPlan(
  targetCalories: number,
  dietType: DietType
): MealPlan {
  // Pick the closest tier
  let tier: "1500" | "2000" | "2500";
  if (targetCalories < 1750) tier = "1500";
  else if (targetCalories < 2250) tier = "2000";
  else tier = "2500";

  return MEAL_PLANS[dietType][tier];
}

function makePlan(meals: {
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  eveningSnack: Meal;
  dinner: Meal;
}): MealPlan {
  const all = [
    meals.breakfast,
    meals.morningSnack,
    meals.lunch,
    meals.eveningSnack,
    meals.dinner,
  ];
  return {
    ...meals,
    totalCalories: all.reduce((s, m) => s + m.calories, 0),
    totalProtein: all.reduce((s, m) => s + m.protein, 0),
    totalCarbs: all.reduce((s, m) => s + m.carbs, 0),
    totalFat: all.reduce((s, m) => s + m.fat, 0),
  };
}

const MEAL_PLANS: Record<DietType, Record<string, MealPlan>> = {
  // ═══════════════════════════════════
  // NON-VEGETARIAN
  // ═══════════════════════════════════
  non_vegetarian: {
    "1500": makePlan({
      breakfast: {
        name: "Scrambled Eggs & Toast",
        items: "2 whole eggs scrambled with spinach, 1 slice whole-wheat toast, ½ avocado",
        calories: 350,
        protein: 22,
        carbs: 20,
        fat: 22,
      },
      morningSnack: {
        name: "Greek Yogurt",
        items: "150g plain Greek yogurt with 10 almonds",
        calories: 150,
        protein: 14,
        carbs: 8,
        fat: 8,
      },
      lunch: {
        name: "Grilled Chicken Salad",
        items: "120g grilled chicken breast, mixed greens, cucumber, tomato, 1 tbsp olive oil dressing",
        calories: 400,
        protein: 35,
        carbs: 12,
        fat: 22,
      },
      eveningSnack: {
        name: "Protein Shake",
        items: "1 scoop whey protein with water and 1 banana",
        calories: 200,
        protein: 25,
        carbs: 28,
        fat: 2,
      },
      dinner: {
        name: "Baked Fish & Vegetables",
        items: "150g baked salmon or tilapia, steamed broccoli and carrots, 1 small sweet potato",
        calories: 400,
        protein: 35,
        carbs: 30,
        fat: 14,
      },
    }),
    "2000": makePlan({
      breakfast: {
        name: "Oatmeal & Eggs",
        items: "50g oats with milk and banana, 2 boiled eggs",
        calories: 450,
        protein: 25,
        carbs: 55,
        fat: 15,
      },
      morningSnack: {
        name: "Chicken Wrap",
        items: "Small whole-wheat wrap with 60g chicken, lettuce, and mustard",
        calories: 250,
        protein: 20,
        carbs: 22,
        fat: 8,
      },
      lunch: {
        name: "Chicken Rice Bowl",
        items: "150g grilled chicken, 1 cup brown rice, sautéed vegetables, light soy sauce",
        calories: 550,
        protein: 40,
        carbs: 60,
        fat: 14,
      },
      eveningSnack: {
        name: "Fruit & Nut Mix",
        items: "1 apple, 20g mixed nuts, 1 boiled egg",
        calories: 250,
        protein: 12,
        carbs: 25,
        fat: 14,
      },
      dinner: {
        name: "Grilled Fish & Quinoa",
        items: "150g grilled fish, ¾ cup quinoa, roasted vegetables with olive oil",
        calories: 500,
        protein: 38,
        carbs: 45,
        fat: 18,
      },
    }),
    "2500": makePlan({
      breakfast: {
        name: "Power Breakfast",
        items: "3 eggs scrambled, 2 slices whole-wheat toast, 1 avocado, glass of milk",
        calories: 600,
        protein: 32,
        carbs: 45,
        fat: 34,
      },
      morningSnack: {
        name: "Tuna Sandwich",
        items: "Whole-wheat bread, 100g tuna, lettuce, mayo, 1 banana",
        calories: 400,
        protein: 30,
        carbs: 42,
        fat: 12,
      },
      lunch: {
        name: "Chicken Pasta",
        items: "150g chicken breast, 100g whole-wheat pasta, marinara sauce, side salad",
        calories: 650,
        protein: 45,
        carbs: 70,
        fat: 16,
      },
      eveningSnack: {
        name: "Smoothie Bowl",
        items: "Protein smoothie with banana, peanut butter, oats, and milk",
        calories: 350,
        protein: 25,
        carbs: 40,
        fat: 12,
      },
      dinner: {
        name: "Steak & Sweet Potato",
        items: "180g lean steak, large sweet potato, steamed green beans, olive oil",
        calories: 550,
        protein: 42,
        carbs: 45,
        fat: 20,
      },
    }),
  },

  // ═══════════════════════════════════
  // VEGETARIAN
  // ═══════════════════════════════════
  vegetarian: {
    "1500": makePlan({
      breakfast: {
        name: "Overnight Oats",
        items: "50g oats soaked in almond milk with chia seeds, berries, and honey",
        calories: 320,
        protein: 12,
        carbs: 50,
        fat: 10,
      },
      morningSnack: {
        name: "Hummus & Veggies",
        items: "3 tbsp hummus with carrot and cucumber sticks",
        calories: 150,
        protein: 6,
        carbs: 15,
        fat: 8,
      },
      lunch: {
        name: "Lentil Dal & Rice",
        items: "1 cup masoor dal, ¾ cup steamed rice, side of raita",
        calories: 420,
        protein: 18,
        carbs: 65,
        fat: 8,
      },
      eveningSnack: {
        name: "Trail Mix",
        items: "25g mixed nuts and dried fruits",
        calories: 160,
        protein: 5,
        carbs: 18,
        fat: 9,
      },
      dinner: {
        name: "Paneer Tikka & Roti",
        items: "100g paneer tikka (grilled), 1 whole-wheat roti, cucumber salad",
        calories: 400,
        protein: 22,
        carbs: 35,
        fat: 18,
      },
    }),
    "2000": makePlan({
      breakfast: {
        name: "Smoothie & Toast",
        items: "Banana-peanut butter smoothie with milk, 1 slice whole-wheat toast with jam",
        calories: 450,
        protein: 16,
        carbs: 60,
        fat: 18,
      },
      morningSnack: {
        name: "Fruit & Nuts",
        items: "1 apple, 200g Greek yogurt, 15g walnuts",
        calories: 280,
        protein: 15,
        carbs: 30,
        fat: 12,
      },
      lunch: {
        name: "Chickpea Curry & Rice",
        items: "1 cup chana masala, 1 cup brown rice, mixed green salad",
        calories: 520,
        protein: 20,
        carbs: 75,
        fat: 14,
      },
      eveningSnack: {
        name: "Peanut Butter Toast",
        items: "2 slices whole-wheat bread with 2 tbsp peanut butter, drizzle of honey",
        calories: 350,
        protein: 14,
        carbs: 38,
        fat: 18,
      },
      dinner: {
        name: "Tofu Stir-Fry",
        items: "150g firm tofu, stir-fried vegetables, ¾ cup noodles or rice, soy sauce",
        calories: 450,
        protein: 22,
        carbs: 50,
        fat: 16,
      },
    }),
    "2500": makePlan({
      breakfast: {
        name: "Loaded Oatmeal",
        items: "80g oats with milk, banana, peanut butter, seeds, and honey",
        calories: 550,
        protein: 20,
        carbs: 75,
        fat: 20,
      },
      morningSnack: {
        name: "Paneer Roll",
        items: "Whole-wheat wrap with 80g paneer, mint chutney, onion, capsicum",
        calories: 380,
        protein: 20,
        carbs: 35,
        fat: 18,
      },
      lunch: {
        name: "Rajma Rice Bowl",
        items: "1.5 cups kidney bean curry, 1.5 cups rice, curd, salad",
        calories: 650,
        protein: 24,
        carbs: 100,
        fat: 14,
      },
      eveningSnack: {
        name: "Protein Smoothie",
        items: "Plant protein powder, banana, oats, almond butter, almond milk",
        calories: 400,
        protein: 28,
        carbs: 45,
        fat: 14,
      },
      dinner: {
        name: "Palak Paneer & Rotis",
        items: "150g palak paneer, 2 whole-wheat rotis, dal, salad",
        calories: 550,
        protein: 28,
        carbs: 55,
        fat: 22,
      },
    }),
  },

  // ═══════════════════════════════════
  // EGGETARIAN
  // ═══════════════════════════════════
  eggetarian: {
    "1500": makePlan({
      breakfast: {
        name: "Egg & Veggie Omelette",
        items: "3-egg omelette with bell peppers, onions, and tomatoes, 1 toast",
        calories: 350,
        protein: 24,
        carbs: 18,
        fat: 20,
      },
      morningSnack: {
        name: "Yogurt Parfait",
        items: "150g yogurt with granola and mixed berries",
        calories: 180,
        protein: 10,
        carbs: 25,
        fat: 5,
      },
      lunch: {
        name: "Egg Fried Rice",
        items: "2 eggs, 1 cup fried rice with mixed vegetables and soy sauce",
        calories: 420,
        protein: 18,
        carbs: 55,
        fat: 14,
      },
      eveningSnack: {
        name: "Boiled Eggs & Fruit",
        items: "2 boiled eggs, 1 orange",
        calories: 200,
        protein: 14,
        carbs: 18,
        fat: 10,
      },
      dinner: {
        name: "Dal & Chapati",
        items: "1 cup toor dal, 2 chapatis, cucumber-tomato salad",
        calories: 380,
        protein: 16,
        carbs: 55,
        fat: 8,
      },
    }),
    "2000": makePlan({
      breakfast: {
        name: "French Toast",
        items: "2 slices whole-wheat French toast with 2 eggs, berries, and maple syrup",
        calories: 450,
        protein: 20,
        carbs: 55,
        fat: 16,
      },
      morningSnack: {
        name: "Egg Sandwich",
        items: "Whole-wheat bread, 1 fried egg, cheese slice, lettuce",
        calories: 280,
        protein: 16,
        carbs: 28,
        fat: 12,
      },
      lunch: {
        name: "Egg Curry & Rice",
        items: "2 boiled eggs in tomato-onion gravy, 1 cup rice, raita",
        calories: 500,
        protein: 22,
        carbs: 65,
        fat: 16,
      },
      eveningSnack: {
        name: "Protein Shake",
        items: "Protein powder with milk, 1 banana, 1 tbsp peanut butter",
        calories: 320,
        protein: 28,
        carbs: 32,
        fat: 10,
      },
      dinner: {
        name: "Paneer Bhurji & Roti",
        items: "120g paneer bhurji (scrambled), 2 rotis, salad",
        calories: 480,
        protein: 24,
        carbs: 42,
        fat: 22,
      },
    }),
    "2500": makePlan({
      breakfast: {
        name: "Power Egg Breakfast",
        items: "4-egg scramble with cheese, 2 toasts, avocado, glass of milk",
        calories: 650,
        protein: 38,
        carbs: 42,
        fat: 36,
      },
      morningSnack: {
        name: "Egg Wrap & Smoothie",
        items: "Whole-wheat wrap with 2 eggs, vegetables; small banana smoothie",
        calories: 400,
        protein: 22,
        carbs: 48,
        fat: 14,
      },
      lunch: {
        name: "Egg Biryani",
        items: "4 boiled eggs in biryani rice with yogurt raita and salad",
        calories: 620,
        protein: 28,
        carbs: 80,
        fat: 18,
      },
      eveningSnack: {
        name: "Nuts & Cheese",
        items: "30g mixed nuts, 30g cheese, 1 apple",
        calories: 350,
        protein: 14,
        carbs: 25,
        fat: 22,
      },
      dinner: {
        name: "Egg Masala & Parathas",
        items: "3 eggs in spicy gravy, 2 whole-wheat parathas, dal, salad",
        calories: 580,
        protein: 28,
        carbs: 60,
        fat: 24,
      },
    }),
  },
};
