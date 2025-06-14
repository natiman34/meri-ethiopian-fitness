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
    id: "eth-weight-gain-1",
    title: "Ethiopian Traditional Weight Gain Plan",
    description: "A comprehensive weight gain plan featuring authentic Ethiopian cultural foods, focusing on a healthy calorie surplus from balanced macronutrients: carbohydrates (4 cal/gram) - brown rice, quinoa, oats, potatoes, sweet potatoes, legumes (beans, lentils), white bread; proteins (4 cal/gram) - chicken, turkey, fish, eggs, dairy products, beans, lentils, tofu; and fats (9 cal/gram) - avocados, nuts, seeds, olive oil, fatty fish. Designed to help you gain weight healthily with traditional Ethiopian cuisine.",
    duration: 60, // days
    category: "weight-gain",
    image_url: "/images/plans/ethiopian-weight-gain.jpg",
    calorieRange: { min: 2500, max: 3200 },
    meals: [
      // Day 1 - Ethiopian Traditional Weight Gain Foods
      {
        day: 1,
        breakfast: [
          parseMealString("Barley flour (roasted) + Butter + spices - 556 cal, 37.20g fat, 6.6g protein, 49.9g CHO", "eth-wg-day1-breakfast", true)
        ],
        lunch: [
          parseMealString("Shinbra (Kik wet) Gonder (Dembia) - 127 cal, 5.20g fat, 5.9g protein, 18.30g CHO", "eth-wg-day1-lunch", true),
          parseMealString("Kale + beef + butter + shallot + spices + salt (Yetekur amber) (Gurage Cheha) - 126 cal, 10.90g fat, 5.9g protein, 4.20g CHO", "eth-wg-day1-lunch2", true)
        ],
        dinner: [
          parseMealString("Amber Kitfo - 220 cal, 23.20g fat, 2.60g protein, 5.5g CHO", "eth-wg-day1-dinner", true),
          parseMealString("Geba Dereq (Tigray, Mekelle) - 339 cal, 3.20g fat, 5.10g protein, 78.20g CHO", "eth-wg-day1-dinner2", true)
        ],
        snacks: [
          parseMealString("Dallen (Harrari) - Sesame seed powder + honey + butter - 506 cal, 24.40g fat, 5.10g protein, 66.0g CHO", "eth-wg-day1-snack1", true),
          parseMealString("Sour milk (Cows) Ititu (Borena) - 147 cal, 12.40g fat, 5g protein, 3.90g CHO", "eth-wg-day1-snack2", true)
        ],
        totalCalories: 2021,
      },
      // Day 2 - Ethiopian Traditional Weight Gain Foods
      {
        day: 2,
        breakfast: [
          parseMealString("Fatira (Harrari) - 372 cal, 20.70g fat, 10g protein, 37.60g CHO", "eth-wg-day2-breakfast", true)
        ],
        lunch: [
          parseMealString("Abish (Tigray) - 360 cal, 7.20g fat, 28.90g protein, 52.90g CHO", "eth-wg-day2-lunch", true),
          parseMealString("Kale + shallot + oil + salt + spices + sauce - 79 cal, 4.8g fat, 5.4g protein, 7.9g CHO", "eth-wg-day2-lunch2", true)
        ],
        dinner: [
          parseMealString("Fish (Dried) + Chili + sunflower + salt - Ambaza wet (Gonder) - 134 cal, 3.60g fat, 23.10g protein, 3.20g CHO", "eth-wg-day2-dinner", true),
          parseMealString("Beraperat (Gurage Cheha) - 413 cal, 13.30g fat, 0.40g protein, 73g CHO", "eth-wg-day2-dinner2", true)
        ],
        snacks: [
          parseMealString("Cabbage Cheese + toasted (Kashya) (Gurage/Cheha) - 227 cal, 15.50g fat, 16g protein, 6.30g CHO", "eth-wg-day2-snack1", true),
          parseMealString("Niger Seed + garlic + green pepper (Gumuz) - 109 cal, 7.40g fat, 4.30g protein, 9.60g CHO", "eth-wg-day2-snack2", true)
        ],
        totalCalories: 1694,
      },
      // Day 3 - Ethiopian Traditional Weight Gain Foods
      {
        day: 3,
        breakfast: [
          parseMealString("Wheat flour (refined) + butter + oil + baking powder + salt - 389 cal, 15.70g fat, 6.9g protein, 55.60g CHO", "eth-wg-day3-breakfast", true)
        ],
        lunch: [
          parseMealString("Mushroom + Shallot + garlic + Chili + butter + salt (Metekel Shinasha) - 97 cal, 3.90g fat, 5.20g protein, 10g CHO", "eth-wg-day3-lunch", true),
          parseMealString("Zengada - 374 cal, 3.20g fat, 8.10g protein, 70.40g CHO", "eth-wg-day3-lunch2", true)
        ],
        dinner: [
          parseMealString("Kale + butter + shallot + garlic + spices + salt - 93 cal, 7.3g fat, 2.9g protein, 5.7g CHO", "eth-wg-day3-dinner", true),
          parseMealString("Sesame powder + garlic + chili + ginger + salt + water (Wellega) - 140 cal, 12.20g fat, 4.20g protein, 6.20g CHO", "eth-wg-day3-dinner2", true)
        ],
        snacks: [
          parseMealString("Datta (Welayita) - 132 cal, 9.70g fat, 2.30g protein, 13.80g CHO", "eth-wg-day3-snack1", true),
          parseMealString("Ajaja - 140 cal, 4.70g fat, 3.30g protein, 21.30g CHO", "eth-wg-day3-snack2", true)
        ],
        totalCalories: 1365,
      }
    ],

    features: [
      "Authentic Ethiopian cultural foods",
      "Balanced macronutrient profile for healthy weight gain",
      "Traditional recipes with detailed nutritional information",
      "Calorie surplus from natural, wholesome ingredients",
      "Rich in traditional spices and flavors",
      "Supports muscle building and healthy weight increase"
    ],
    createdBy: "Ethiopian Nutrition Expert",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: 'published',
    tags: ['ethiopian', 'weight gain', 'traditional', 'cultural', 'authentic'],
    featured: true,
  },
  {
    id: "eth-weight-loss-1",
    title: "Ethiopian Traditional Weight Loss Plan",
    description: "A healthy weight loss plan focused on creating a caloric deficit, meaning you consume fewer calories than you burn. Emphasizes fruits and vegetables (vitamins, minerals, antioxidants), lean proteins (fish, chicken breast, legumes, tofu), healthy fats (avocados, nuts, seeds, olive oil), whole grains (brown rice, quinoa, oatmeal, grain bread), and legumes (beans, lentils, chickpeas). Designed for sustainable weight loss with authentic Ethiopian cuisine.",
    duration: 45, // days
    category: "weight-loss",
    image_url: "/images/plans/ethiopian-weight-loss.jpg",
    calorieRange: { min: 1400, max: 1800 },
    meals: [
      // Day 1 - Ethiopian Traditional Weight Loss Foods (Caloric Deficit)
      {
        day: 1,
        breakfast: [
          parseMealString("Genfo (light preparation) - 134 cal, 5.5g fat, 2.10g protein, 19.20g CHO", "eth-wl-day1-breakfast", true)
        ],
        lunch: [
          parseMealString("Shinbra (Kik wet) with vegetables - 127 cal, 5.20g fat, 5.9g protein, 18.30g CHO", "eth-wl-day1-lunch", true),
          parseMealString("Kale + shallot + minimal oil + spices - 79 cal, 4.8g fat, 5.4g protein, 7.9g CHO", "eth-wl-day1-lunch2", true)
        ],
        dinner: [
          parseMealString("Fish (lean preparation) + minimal chili + sunflower - 134 cal, 3.60g fat, 23.10g protein, 3.20g CHO", "eth-wl-day1-dinner", true),
          parseMealString("Mixed vegetables with minimal oil - 80 cal, 2g fat, 3g protein, 15g CHO", "eth-wl-day1-dinner2", true)
        ],
        snacks: [
          parseMealString("Fresh fruits (Ethiopian varieties) - vitamins, minerals, antioxidants - 90 cal, 0.5g fat, 1g protein, 22g CHO", "eth-wl-day1-snack1", true),
          parseMealString("Niger Seed (small portion) - 109 cal, 7.40g fat, 4.30g protein, 9.60g CHO", "eth-wl-day1-snack2", true)
        ],
        totalCalories: 1653,
      },
      // Day 2 - Ethiopian Traditional Weight Loss Foods (Caloric Deficit)
      {
        day: 2,
        breakfast: [
          parseMealString("Ajaja (light preparation) - 140 cal, 4.70g fat, 3.30g protein, 21.30g CHO", "eth-wl-day2-breakfast", true)
        ],
        lunch: [
          parseMealString("Abish (Tigray) with vegetables - lean protein - 180 cal, 3.60g fat, 14.50g protein, 26.50g CHO", "eth-wl-day2-lunch", true),
          parseMealString("Steamed vegetables with minimal seasoning - 60 cal, 1g fat, 2g protein, 12g CHO", "eth-wl-day2-lunch2", true)
        ],
        dinner: [
          parseMealString("Kale + lean protein + minimal butter - 93 cal, 7.3g fat, 2.9g protein, 5.7g CHO", "eth-wl-day2-dinner", true),
          parseMealString("Mushroom + Shallot + garlic (minimal oil) - 97 cal, 3.90g fat, 5.20g protein, 10g CHO", "eth-wl-day2-dinner2", true)
        ],
        snacks: [
          parseMealString("Sour milk (Ititu) - low fat version - 74 cal, 6.20g fat, 2.50g protein, 2g CHO", "eth-wl-day2-snack1", true),
          parseMealString("Sesame powder (small portion) - healthy fats - 70 cal, 6.10g fat, 2.10g protein, 3.10g CHO", "eth-wl-day2-snack2", true)
        ],
        totalCalories: 1714,
      },
      // Day 3 - Ethiopian Traditional Weight Loss Foods (Caloric Deficit)
      {
        day: 3,
        breakfast: [
          parseMealString("Barley flour + butter + salt (light preparation) - 150 cal, 2g fat, 5g protein, 28g CHO", "eth-wl-day3-breakfast", true)
        ],
        lunch: [
          parseMealString("Legumes - beans, lentils (Misir Wat) with vegetables - 200 cal, 4g fat, 12g protein, 32g CHO", "eth-wl-day3-lunch", true),
          parseMealString("Steamed collard greens (Gomen) - whole grains - 50 cal, 1g fat, 3g protein, 8g CHO", "eth-wl-day3-lunch2", true)
        ],
        dinner: [
          parseMealString("Lean fish with Ethiopian spices - lean protein - 180 cal, 6g fat, 28g protein, 4g CHO", "eth-wl-day3-dinner", true),
          parseMealString("Cabbage and carrot salad - fruits and vegetables - 60 cal, 0.5g fat, 2g protein, 12g CHO", "eth-wl-day3-dinner2", true)
        ],
        snacks: [
          parseMealString("Fresh Ethiopian fruits - vitamins, minerals, antioxidants - 80 cal, 0.3g fat, 1g protein, 20g CHO", "eth-wl-day3-snack1", true),
          parseMealString("Boiled chickpeas (small portion) - legumes - 90 cal, 1.5g fat, 5g protein, 15g CHO", "eth-wl-day3-snack2", true)
        ],
        totalCalories: 1810,
      }
    ],
    features: [
      "Caloric deficit for healthy weight loss",
      "Rich in Ethiopian vegetables and legumes",
      "High fiber content for satiety",
      "Lean proteins from traditional sources",
      "Antioxidant-rich fruits and vegetables",
      "Traditional spices for flavor without excess calories",
      "Sustainable and culturally appropriate"
    ],
    createdBy: "Ethiopian Dietitian",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    status: 'published',
    tags: ['ethiopian', 'weight loss', 'traditional', 'healthy', 'deficit'],
    featured: true,
  },
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