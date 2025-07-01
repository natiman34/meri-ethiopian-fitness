// Helper function to parse meal strings into Meal objects
const parseMealString = (mealString, idPrefix = "", isEthiopian = false) => {
    const nameMatch = mealString.match(/^(.*?)\s*\(/);
    const name = nameMatch ? nameMatch[1].trim() : mealString.trim();
    const nutritionalInfoMatch = mealString.match(/\((\d+)\s*cal,\s*([\d.]+)\s*g\s*fat,\s*([\d.]+)\s*g\s*protein,\s*([\d.]+)\s*g\s*CHO(?:\s*per portion)?\)/);
    let nutritionalInfo;
    if (nutritionalInfoMatch) {
        nutritionalInfo = {
            calories: parseInt(nutritionalInfoMatch[1], 10),
            fat: parseFloat(nutritionalInfoMatch[2]),
            protein: parseFloat(nutritionalInfoMatch[3]),
            carbs: parseFloat(nutritionalInfoMatch[4]),
        };
    }
    const description = mealString; // Keep full string as description for now
    const ingredients = []; // Placeholder
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
export const nutritionPlans = [
    {
        id: "eth-weight-gain-1",
        title: "Ethiopian Traditional Weight Gain Plan",
        description: "A comprehensive weight gain plan featuring authentic Ethiopian cultural foods, focusing on a healthy calorie surplus from balanced macronutrients: carbohydrates (4 cal/gram) - brown rice, quinoa, oats, potatoes, sweet potatoes, legumes (beans, lentils), white bread; proteins (4 cal/gram) - chicken, turkey, fish, eggs, dairy products, beans, lentils, tofu; and fats (9 cal/gram) - avocados, nuts, seeds, olive oil, fatty fish. Designed to help you gain weight healthily with traditional Ethiopian cuisine.",
        duration: 60,
        category: "weight-gain",
        image_url: "/images/plans/ethiopian-weight-gain.jpg",
        calorieRange: { min: 2500, max: 3200 },
        meals: [
            {
                day: 1,
                breakfast: [
                    parseMealString("Barley flour (roasted) + Butter + spices - 556 cal, 37.20g fat, 6.6g protein, 49.9g CHO", "eth-wg-day1-breakfast", true)
                ],
                lunch: [
                    parseMealString("Shinbra (Kik wet) Gonder (Dembia) - 125 cal, 5.20g fat, 5.9g protein, 18.30g CHO", "eth-wg-day1-lunch", true),
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
                totalCalories: 2019,
            },
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
        description: "A comprehensive weight loss plan featuring authentic Ethiopian cultural foods, focusing on high-protein, fiber-rich, and balanced meals while controlling calorie intake. Emphasizes caloric deficit through nutrient-dense Ethiopian cuisine for sustainable and healthy weight loss.",
        duration: 45,
        category: "weight-loss",
        image_url: "/images/plans/ethiopian-weight-loss.jpg",
        calorieRange: { min: 1400, max: 1800 },
        meals: [
            {
                day: 1,
                breakfast: [
                    parseMealString("Kinche (Cracked wheat) + Low-fat yogurt - 180 cal, 2g fat, 8g protein, 32g CHO", "eth-wl-day1-breakfast1", true),
                    parseMealString("Fetira (Ethiopian Crepe) with boiled eggs (without butter) - 220 cal, 6g fat, 14g protein, 28g CHO", "eth-wl-day1-breakfast2", true)
                ],
                lunch: [
                    parseMealString("Tibs (Lean beef or chicken) with lots of vegetables & small Injera - 280 cal, 8g fat, 25g protein, 22g CHO", "eth-wl-day1-lunch1", true),
                    parseMealString("Lentil Stew with Cabbage & Carrots - 160 cal, 3g fat, 12g protein, 24g CHO", "eth-wl-day1-lunch2", true)
                ],
                dinner: [
                    parseMealString("Gomen (Collard Greens) with a small portion of Tibs - 150 cal, 5g fat, 12g protein, 15g CHO", "eth-wl-day1-dinner1", true),
                    parseMealString("Firfir with Berbere & Tomato Sauce - 140 cal, 4g fat, 8g protein, 18g CHO", "eth-wl-day1-dinner2", true)
                ],
                snacks: [
                    parseMealString("Avocado & Lemon Juice (No sugar) - 120 cal, 11g fat, 2g protein, 6g CHO", "eth-wl-day1-snack1", true),
                    parseMealString("Greek Yogurt with Flaxseeds - 100 cal, 4g fat, 8g protein, 8g CHO", "eth-wl-day1-snack2", true)
                ],
                totalCalories: 1550,
            },
            {
                day: 2,
                breakfast: [
                    parseMealString("Shiro Firfir (Chickpea stew with small Injera pieces) - 200 cal, 5g fat, 10g protein, 28g CHO", "eth-wl-day2-breakfast1", true)
                ],
                lunch: [
                    parseMealString("Doro Wat (Spicy Chicken Stew) with brown rice - 320 cal, 12g fat, 28g protein, 26g CHO", "eth-wl-day2-lunch1", true),
                    parseMealString("Lentil Stew with Cabbage & Carrots - 160 cal, 3g fat, 12g protein, 24g CHO", "eth-wl-day2-lunch2", true)
                ],
                dinner: [
                    parseMealString("Shiro with a small Injera & side salad - 180 cal, 6g fat, 10g protein, 22g CHO", "eth-wl-day2-dinner1", true),
                    parseMealString("Gomen (Collard Greens) with minimal oil - 80 cal, 2g fat, 4g protein, 12g CHO", "eth-wl-day2-dinner2", true)
                ],
                snacks: [
                    parseMealString("Boiled Eggs & Roasted Chickpeas - 140 cal, 6g fat, 12g protein, 10g CHO", "eth-wl-day2-snack1", true),
                    parseMealString("Smoothie with Spinach, Avocado, & Banana - 150 cal, 8g fat, 4g protein, 18g CHO", "eth-wl-day2-snack2", true)
                ],
                totalCalories: 1630,
            },
            {
                day: 3,
                breakfast: [
                    parseMealString("Kinche (Cracked wheat) + Low-fat yogurt - 180 cal, 2g fat, 8g protein, 32g CHO", "eth-wl-day3-breakfast1", true)
                ],
                lunch: [
                    parseMealString("Tibs (Lean beef or chicken) with lots of vegetables & small Injera - 280 cal, 8g fat, 25g protein, 22g CHO", "eth-wl-day3-lunch1", true),
                    parseMealString("Doro Wat (Spicy Chicken Stew) with brown rice - 320 cal, 12g fat, 28g protein, 26g CHO", "eth-wl-day3-lunch2", true)
                ],
                dinner: [
                    parseMealString("Shiro with a small Injera & side salad - 180 cal, 6g fat, 10g protein, 22g CHO", "eth-wl-day3-dinner1", true),
                    parseMealString("Firfir with Berbere & Tomato Sauce - 140 cal, 4g fat, 8g protein, 18g CHO", "eth-wl-day3-dinner2", true)
                ],
                snacks: [
                    parseMealString("Atmit (Oatmeal with Cinnamon & No Sugar) - 120 cal, 2g fat, 4g protein, 22g CHO", "eth-wl-day3-snack1", true),
                    parseMealString("Boiled Sweet Potatoes & Lentils - 160 cal, 1g fat, 8g protein, 32g CHO", "eth-wl-day3-snack2", true)
                ],
                totalCalories: 1680,
            }
        ],
        features: [
            "Calorie Deficit: Eat slightly fewer calories than you burn",
            "High Protein: At least 1.2-1.6g per kg of body weight",
            "Fiber-Rich Foods: More vegetables, lentils, and whole grains",
            "Healthy Fats: Use olive oil, nuts, and seeds",
            "Hydration: Drink at least 3-4L of water daily",
            "Sleep: Aim for 7-9 hours per night for fat loss",
            "Traditional Ethiopian spices for flavor without excess calories"
        ],
        createdBy: "Ethiopian Dietitian",
        createdAt: "2024-01-15T11:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
        status: 'published',
        tags: ['ethiopian', 'weight loss', 'traditional', 'healthy', 'deficit'],
        featured: true,
    },
];
export const getAllNutritionPlans = () => {
    return nutritionPlans;
};
export const getFeaturedNutritionPlans = () => {
    return nutritionPlans.filter(plan => plan.featured);
};
export const getNutritionPlanById = (id) => {
    return nutritionPlans.find(plan => plan.id === id);
};
export const getNutritionPlansByCategory = (category) => {
    return nutritionPlans.filter(plan => plan.category === category);
};
export const getNutritionPlansByCalorieRange = (min, max) => {
    return nutritionPlans.filter(plan => plan.calorieRange.min >= min && plan.calorieRange.max <= max);
};
