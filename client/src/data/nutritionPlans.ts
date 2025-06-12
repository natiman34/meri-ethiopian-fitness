import { NutritionPlan, DayMeal, CalorieRange, Meal, NutritionInfo } from "../types/content";

// Helper function to parse meal strings into Meal objects
const parseMealString = (mealString: string, idPrefix: string = "", isEthiopian: boolean = false): Meal => {
  const nameMatch = mealString.match(/^(.*?)\s*\(/);
  const name = nameMatch ? nameMatch[1].trim() : mealString.trim();

  const nutritionalInfoMatch = mealString.match(/\((\d+)\s*cal,\s*([\d.]+)\s*g\s*fat,\s*([\d.]+)\s*g\s*protein,\s*([\d.]+)\s*g\s*CHO(?:\s*per portion)?\)/);
  let nutritionalInfo: NutritionInfo | undefined;
  if (nutritionalInfoMatch) {
    nutritionalInfo = {
      calories: parseInt(nutritionalInfoMatch[1], 10),
      fat: parseFloat(nutritionalInfoMatch[2]),
      protein: parseFloat(nutritionalInfoMatch[3]),
      carbs: parseFloat(nutritionalInfoMatch[4]),
    };
  }

  const description = mealString; // Keep full string as description for now
  const ingredients: string[] = []; // Placeholder
  const preparation = ""; // Placeholder

  return {
    id: `${idPrefix}-${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
    name: name,
    description: description,
    image: '', // Default empty for now
    isEthiopian: isEthiopian,
    nutritionInfo: nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }, // Ensure nutritionalInfo is always present
    ingredients: ingredients,
    preparation: preparation,
  };
};

export const nutritionPlans: NutritionPlan[] = [
  {
    id: "np1",
    title: "Balanced Eating for Energy",
    description: "A diverse meal plan focusing on whole foods for sustained energy and overall well-being.",
    duration: 30, // days
    category: "maintenance",
    image_url: "/images/plans/balanced-eating.jpg",
    calorieRange: { min: 1800, max: 2200 },
    meals: [
      {
        day: 1,
        breakfast: [parseMealString("Oatmeal with berries and nuts", "np1-day1-breakfast")],
        lunch: [parseMealString("Quinoa salad with grilled chicken and vegetables", "np1-day1-lunch")],
        dinner: [parseMealString("Baked salmon with sweet potato and asparagus", "np1-day1-dinner")],
        snacks: [parseMealString("Apple", "np1-day1-snack1"), parseMealString("Handful of almonds", "np1-day1-snack2")],
        totalCalories: 2000, // Placeholder, will be calculated by the class in real scenario
      },
      {
        day: 2,
        breakfast: [parseMealString("Scrambled eggs with spinach and whole-wheat toast", "np1-day2-breakfast")],
        lunch: [parseMealString("Lentil soup with a side of whole-grain bread", "np1-day2-lunch")],
        dinner: [parseMealString("Turkey meatballs with zucchini noodles", "np1-day2-dinner")],
        snacks: [parseMealString("Greek yogurt", "np1-day2-snack1"), parseMealString("Orange", "np1-day2-snack2")],
        totalCalories: 2100, // Placeholder
      }
    ],
    features: [
      "Sustainable and healthy habits",
      "Rich in vitamins and minerals",
      "Supports daily energy levels"
    ],
    createdBy: "Chef Nutri",
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2023-01-10T10:00:00Z",
    status: 'published',
    tags: ['balanced', 'energy', 'healthy'],
    featured: true,
  },
  {
    id: "np2",
    title: "High Protein Muscle Gain (General)",
    description: "Designed for healthy weight gain and muscle growth, this plan focuses on a calorie surplus from a balanced intake of macronutrients: carbohydrates (4 cal/gram), proteins (4 cal/gram), and fats (9 cals/gram). Emphasizes high protein intake with complex carbs.",
    duration: 60, // days
    category: "weight-gain",
    image_url: "/images/plans/high-protein-muscle.jpg",
    calorieRange: { min: 2500, max: 3000 },
    meals: [
      {
        day: 1,
        breakfast: [parseMealString("Protein shake with banana and peanut butter", "np2-day1-breakfast")],
        lunch: [parseMealString("Grilled steak with brown rice and broccoli", "np2-day1-lunch")],
        dinner: [parseMealString("Chicken breast with quinoa and mixed greens", "np2-day1-dinner")],
        snacks: [parseMealString("Cottage cheese", "np2-day1-snack1"), parseMealString("Protein bar", "np2-day1-snack2")],
        totalCalories: 2800,
      },
      {
        day: 2,
        breakfast: [parseMealString("Egg white omelette with cheese and vegetables", "np2-day2-breakfast")],
        lunch: [parseMealString("Tuna salad sandwich on whole-wheat bread", "np2-day2-lunch")],
        dinner: [parseMealString("Lean ground beef stir-fry with bell peppers and onions", "np2-day2-dinner")],
        snacks: [parseMealString("Hard-boiled eggs", "np2-day2-snack1"), parseMealString("Handful of walnuts", "np2-day2-snack2")],
        totalCalories: 2900,
      }
    ],
    features: [
      "Optimized for muscle synthesis",
      "Aids in post-workout recovery",
      "Supports strength gains",
      "Focus on calorie surplus from balanced macros"
    ],
    createdBy: "Coach Bulk",
    createdAt: "2023-02-15T12:00:00Z",
    updatedAt: "2023-02-15T12:00:00Z",
    status: 'published',
    tags: ['protein', 'muscle gain', 'strength'],
    featured: true,
  },
  {
    id: "np3",
    title: "Low Carb Weight Loss (General)",
    description: "A meal plan focused on creating a caloric deficit by consuming fewer calories than you burn. Emphasizes fruits, vegetables, lean proteins (fish, chicken breast, legumes, tofu), healthy fats (avocados, nuts, seeds, olive oil, fatty fish), whole grains (brown rice, quinoa, oatmeal, grain bread), and legumes (beans, lentils, chickpeas).",
    duration: 45, // days
    category: "weight-loss",
    image_url: "/images/plans/low-carb-weight-loss.jpg",
    calorieRange: { min: 1500, max: 1800 },
    meals: [
      {
        day: 1,
        breakfast: [parseMealString("Avocado and smoked salmon with a side of berries", "np3-day1-breakfast")],
        lunch: [parseMealString("Large green salad with grilled salmon and olive oil dressing", "np3-day1-lunch")],
        dinner: [parseMealString("Chicken and vegetable skewers", "np3-day1-dinner")],
        snacks: [parseMealString("Cheese stick", "np3-day1-snack1"), parseMealString("Few olives", "np3-day1-snack2")],
        totalCalories: 1700,
      },
      {
        day: 2,
        breakfast: [parseMealString("Spinach and feta frittata", "np3-day2-breakfast")],
        lunch: [parseMealString("Shrimp scampi with zucchini noodles", "np3-day2-lunch")],
        dinner: [parseMealString("Pork chops with sautéed green beans", "np3-day2-dinner")],
        snacks: [parseMealString("Cucumber slices with hummus", "np3-day2-snack1"), parseMealString("Small handful of pecans", "np3-day2-snack2")],
        totalCalories: 1750,
      }
    ],
    features: [
      "Promotes ketosis and fat burning",
      "Helps control blood sugar",
      "Reduces cravings",
      "Focus on caloric deficit and nutrient-dense foods"
    ],
    createdBy: "Dietitian Slim",
    createdAt: "2023-03-20T09:00:00Z",
    updatedAt: "2023-03-20T09:00:00Z",
    status: 'published',
    tags: ['low carb', 'weight loss', 'fat burning'],
    featured: false,
  },
  {
    id: "np4",
    title: "Vegetarian Endurance Boost",
    description: "Plant-based nutrition to fuel endurance activities, rich in complex carbohydrates and plant proteins.",
    duration: 90, // days
    category: "endurance",
    image_url: "/images/plans/vegetarian-endurance.jpg",
    calorieRange: { min: 2000, max: 2500 },
    meals: [
      {
        day: 1,
        breakfast: [parseMealString("Tofu scramble with bell peppers and onions", "np4-day1-breakfast")],
        lunch: [parseMealString("Black bean burgers on whole-grain buns with a side salad", "np4-day1-lunch")],
        dinner: [parseMealString("Vegetable curry with brown rice", "np4-day1-dinner")],
        snacks: [parseMealString("Banana", "np4-day1-snack1"), parseMealString("Peanut butter", "np4-day1-snack2")],
        totalCalories: 2200,
      },
      {
        day: 2,
        breakfast: [parseMealString("Smoothie with spinach, banana, and plant-based protein powder", "np4-day2-breakfast")],
        lunch: [parseMealString("Quinoa and lentil soup", "np4-day2-lunch")],
        dinner: [parseMealString("Chickpea and spinach stew", "np4-day2-dinner")],
        snacks: [parseMealString("Edamame", "np4-day2-snack1"), parseMealString("Mixed berries", "np4-day2-snack2")],
        totalCalories: 2300,
      }
    ],
    features: [
      "High in fiber and essential nutrients",
      "Supports sustained energy for workouts",
      "Promotes heart health"
    ],
    createdBy: "Green Guru",
    createdAt: "2023-04-25T14:00:00Z",
    updatedAt: "2023-04-25T14:00:00Z",
    status: 'published',
    tags: ['vegetarian', 'endurance', 'plant-based'],
    featured: true,
  },
  {
    id: "np5",
    title: "Ethiopian Weight Gain Plan",
    description: "A weight gain plan tailored with Ethiopian cultural foods, focusing on a healthy calorie surplus from balanced macronutrients: carbohydrates (e.g., Barley flour, Teff, Injera), proteins (e.g., Lentils, Chickpeas, Beef, Fish, Dairy), and fats (e.g., Butter, Niger Seed, Sesame).",
    duration: 60, // days
    category: "weight-gain",
    image_url: "/images/plans/ethiopian-weight-gain.jpg",
    calorieRange: { min: 2500, max: 3000 },
    meals: [
      {
        day: 1,
        breakfast: [parseMealString("Genfo (Barley flour porridge) with butter and spices (556 cal, 37.2g fat, 6.6g protein, 49.9g CHO)", "np5-day1-breakfast", true)],
        lunch: [parseMealString("Shinbra (Kik wet) with Injera (127 cal, 5.2g fat, 5.9g protein, 18.3g CHO per portion)", "np5-day1-lunch", true)],
        dinner: [parseMealString("Amber Kitfo (Minced beef) with Kocho (220 cal, 23.2g fat, 2.6g protein, 5.5g CHO per portion)", "np5-day1-dinner", true)],
        snacks: [
          parseMealString("Dallen (Sesame seed powder with honey and butter) (506 cal, 24.4g fat, 5.1g protein, 66.0g CHO per portion)", "np5-day1-snack1", true),
          parseMealString("Sour milk (Ititu) (147 cal, 12.4g fat, 5g protein, 3.9g CHO per portion)", "np5-day1-snack2", true)
        ],
        totalCalories: 2800,
      },
      {
        day: 2,
        breakfast: [parseMealString("Fatira (Harrari flatbread) with eggs (372 cal, 20.7g fat, 10g protein, 37.6g CHO per portion)", "np5-day2-breakfast", true)],
        lunch: [parseMealString("Yetekur Amber (Kale with beef, butter, spices) (126 cal, 10.9g fat, 5.9g protein, 4.2g CHO per portion)", "np5-day2-lunch", true)],
        dinner: [parseMealString("Geba Dereq (Tigray stew) with Injera (339 cal, 3.2g fat, 5.1g protein, 78.2g CHO per portion)", "np5-day2-dinner", true)],
        snacks: [
          parseMealString("Abish (Fenugreek) with honey (360 cal, 7.2g fat, 28.9g protein, 52.9g CHO per portion)", "np5-day2-snack1", true),
          parseMealString("Beraperat (Gurage Cheha bread) (413 cal, 13.3g fat, 0.4g protein, 73g CHO per portion)", "np5-day2-snack2", true)
        ],
        totalCalories: 2900,
      }
    ],
    features: [
      "Incorporates traditional Ethiopian ingredients",
      "Balanced macronutrient profile for weight gain",
      "Culturally relevant and delicious meals"
    ],
    createdBy: "Ethiopian Chef",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
    status: 'published',
    tags: ['ethiopian', 'weight gain', 'traditional'],
    featured: true,
  },
  {
    id: "np6",
    title: "Ethiopian Weight Loss Plan",
    description: "A weight loss plan focused on creating a caloric deficit with nutrient-dense Ethiopian foods. Emphasizes fruits and vegetables, lean proteins (e.g., Lentils, Fish, Chicken), healthy fats (e.g., Niger Seed, Sesame), and whole grains.",
    duration: 45, // days
    category: "weight-loss",
    image_url: "/images/plans/ethiopian-weight-loss.jpg",
    calorieRange: { min: 1500, max: 1800 },
    meals: [
      {
        day: 1,
        breakfast: [parseMealString("Oatmeal with fruits and nuts (using lean protein and whole grains principles)", "np6-day1-breakfast")],
        lunch: [parseMealString("Misir Wot (Red lentil stew) with plenty of vegetables (e.g., Gomen - collard greens) and a small portion of Injera", "np6-day1-lunch", true)],
        dinner: [parseMealString("Grilled fish (Ambaza wet type) with steamed vegetables (e.g., Shiro, Cabbage)", "np6-day1-dinner", true)],
        snacks: [
          parseMealString("Fresh fruits", "np6-day1-snack1"),
          parseMealString("Boiled chickpeas (Shinbra)", "np6-day1-snack2", true)
        ],
        totalCalories: 1700,
      },
      {
        day: 2,
        breakfast: [parseMealString("Scrambled eggs with kale (e.g., Gomen) and a small whole-grain bread", "np6-day2-breakfast")],
        lunch: [parseMealString("Shiro Wot (Chickpea stew) with mixed vegetables and a moderate portion of Injera", "np6-day2-lunch", true)],
        dinner: [parseMealString("Chicken stew (Doro Wot) with a focus on lean chicken breast and less butter, served with steamed vegetables", "np6-day2-dinner", true)],
        snacks: [
          parseMealString("Low-fat yogurt with a sprinkle of Abish", "np6-day2-snack1"),
          parseMealString("Vegetable sticks (carrots, cucumber) with a light dip (e.g., Datta)", "np6-day2-snack2", true)
        ],
        totalCalories: 1750,
      }
    ],
    features: [
      "Caloric deficit for healthy weight loss",
      "Utilizes fiber-rich Ethiopian vegetables and legumes",
      "Includes lean proteins and healthy fats from Ethiopian diet"
    ],
    createdBy: "Ethiopian Dietitian",
    createdAt: "2023-06-05T10:00:00Z",
    updatedAt: "2023-06-05T10:00:00Z",
    status: 'published',
    tags: ['ethiopian', 'weight loss', 'traditional'],
    featured: false,
  }
];

export const getAllNutritionPlans = (): NutritionPlan[] => {
  return nutritionPlans;
};

export const getFeaturedNutritionPlans = (): NutritionPlan[] => {
  return nutritionPlans.filter(plan => plan.featured);
};

export const getNutritionPlanById = (id: string): NutritionPlan | undefined => {
  return nutritionPlans.find(plan => plan.id === id);
};

export const getNutritionPlansByCategory = (category: string): NutritionPlan[] => {
  return nutritionPlans.filter(plan => plan.category === category);
};

export const getNutritionPlansByCalorieRange = (min: number, max: number): NutritionPlan[] => {
  return nutritionPlans.filter(plan =>
    plan.calorieRange.min >= min && plan.calorieRange.max <= max
  );
}; 