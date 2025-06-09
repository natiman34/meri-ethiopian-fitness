/**
 * NutritionPlan class representing a meal plan in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  id: string
  name: string
  description: string
  image: string
  isEthiopian: boolean
  nutritionInfo: NutritionInfo
  ingredients: string[]
}

export interface DayMeal {
  day: number
  breakfast: Meal[]
  lunch: Meal[]
  dinner: Meal[]
  snacks: Meal[]
  totalCalories: number
}

export interface CalorieRange {
  min: number
  max: number
}

export interface NutritionPlan {
  id: string;
  created_at: string;
  category: string;
  title: string;
  description: string;
  image_url?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  ingredients?: string[];
  instructions?: string[];
}

export class NutritionPlan {
  private _id: string
  private _title: string
  private _description: string
  private _duration: number // in days
  private _categoryId: string
  private _image: string
  private _calorieRange: CalorieRange
  private _meals: DayMeal[]
  private _createdBy: string
  private _createdAt: Date

  constructor(
    id: string,
    title: string,
    description: string,
    duration: number,
    categoryId: string,
    image: string,
    calorieRange: CalorieRange,
    meals: DayMeal[],
    createdBy: string,
    createdAt: Date = new Date(),
  ) {
    this._id = id
    this._title = title
    this._description = description
    this._duration = duration
    this._categoryId = categoryId
    this._image = image
    this._calorieRange = calorieRange
    this._meals = meals
    this._createdBy = createdBy
    this._createdAt = createdAt
  }

  // Getters
  get id(): string {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get description(): string {
    return this._description
  }

  get duration(): number {
    return this._duration
  }

  get categoryId(): string {
    return this._categoryId
  }

  get image(): string {
    return this._image
  }

  get calorieRange(): CalorieRange {
    return { ...this._calorieRange }
  }

  get meals(): DayMeal[] {
    return [...this._meals]
  }

  get createdBy(): string {
    return this._createdBy
  }

  get createdAt(): Date {
    return this._createdAt
  }

  // Setters
  set title(title: string) {
    this._title = title
  }

  set description(description: string) {
    this._description = description
  }

  set duration(duration: number) {
    this._duration = duration
  }

  set categoryId(categoryId: string) {
    this._categoryId = categoryId
  }

  set image(image: string) {
    this._image = image
  }

  set calorieRange(calorieRange: CalorieRange) {
    this._calorieRange = calorieRange
  }

  // Methods
  addMealToDay(day: number, mealType: "breakfast" | "lunch" | "dinner" | "snacks", meal: Meal): void {
    const dayMeal = this._meals.find((m) => m.day === day)
    if (dayMeal) {
      dayMeal[mealType].push(meal)
      this.recalculateDayCalories(day)
    }
  }

  removeMealFromDay(day: number, mealType: "breakfast" | "lunch" | "dinner" | "snacks", mealId: string): void {
    const dayMeal = this._meals.find((m) => m.day === day)
    if (dayMeal) {
      dayMeal[mealType] = dayMeal[mealType].filter((m) => m.id !== mealId)
      this.recalculateDayCalories(day)
    }
  }

  private recalculateDayCalories(day: number): void {
    const dayMeal = this._meals.find((m) => m.day === day)
    if (dayMeal) {
      const allMeals = [...dayMeal.breakfast, ...dayMeal.lunch, ...dayMeal.dinner, ...dayMeal.snacks]

      dayMeal.totalCalories = allMeals.reduce((sum, meal) => sum + meal.nutritionInfo.calories, 0)
    }
  }

  getMealsPerDay(day: number): number {
    const dayMeal = this._meals.find((m) => m.day === day)
    if (!dayMeal) return 0

    return dayMeal.breakfast.length + dayMeal.lunch.length + dayMeal.dinner.length + dayMeal.snacks.length
  }

  // Convert to a format suitable for storage or API
  toObject(): any {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      duration: this._duration,
      categoryId: this._categoryId,
      image: this._image,
      calorieRange: this._calorieRange,
      meals: this._meals,
      createdBy: this._createdBy,
      createdAt: this._createdAt.toISOString(),
    }
  }

  // Static factory method to create NutritionPlan from plain object
  static fromObject(obj: any): NutritionPlan {
    return new NutritionPlan(
      obj.id,
      obj.title,
      obj.description,
      obj.duration,
      obj.categoryId,
      obj.image,
      obj.calorieRange,
      obj.meals,
      obj.createdBy,
      new Date(obj.createdAt),
    )
  }
}
