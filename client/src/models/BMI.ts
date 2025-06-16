/**
 * BMI class for calculating and categorizing Body Mass Index
 * Based on the class diagram in Figure 25 and Figure 33
 */
export class BMI {
  private _height: number // in centimeters
  private _weight: number // in kilograms
  private _bmiValue: number | null = null
  private _category: string | null = null
  private _date: Date
  private _userId: string

  constructor(height: number, weight: number, userId: string) {
    this._height = height
    this._weight = weight
    this._userId = userId
    this._date = new Date()
    this.calculate()
  }

  // Getters
  get height(): number {
    return this._height
  }

  get weight(): number {
    return this._weight
  }

  get bmiValue(): number | null {
    return this._bmiValue
  }

  get category(): string | null {
    return this._category
  }

  get date(): Date {
    return this._date
  }

  get userId(): string {
    return this._userId
  }

  // Setters
  set height(height: number) {
    this._height = height
    this.calculate()
  }

  set weight(weight: number) {
    this._weight = weight
    this.calculate()
  }

  // Methods
  private calculate(): void {
    if (this._height <= 0 || this._weight <= 0) {
      this._bmiValue = null
      this._category = null
      return
    }

    // Convert height from cm to meters
    const heightInMeters = this._height / 100

    // Calculate BMI: weight (kg) / height² (m)
    this._bmiValue = Number.parseFloat((this._weight / (heightInMeters * heightInMeters)).toFixed(1))

    // Determine BMI category
    this.categorize()
  }

  private categorize(): void {
    if (this._bmiValue === null) {
      this._category = null
      return
    }

    if (this._bmiValue < 18.5) {
      this._category = "Underweight"
    } else if (this._bmiValue >= 18.5 && this._bmiValue < 25) {
      this._category = "Normal weight"
    } else if (this._bmiValue >= 25 && this._bmiValue < 30) {
      this._category = "Overweight"
    } else {
      this._category = "Obesity"
    }
  }

  getFoodRecommendations(): string[] {
    if (!this._category) return []

    switch (this._category) {
      case "Underweight":
        return [
          "Doro Wat (Ethiopian Chicken Stew) with extra chicken",
          "Shiro (chickpea stew) with injera",
          "Kik Alicha (yellow split pea stew) with olive oil",
          "Kitfo (minced raw beef) - a protein-rich dish",
          "Teff porridge with honey and nuts",
        ]
      case "Normal weight":
        return [
          "Balanced injera with mixed vegetables",
          "Mesir Wat (red lentil stew)",
          "Gomen (collard greens)",
          "Tibs (sautéed meat) in moderate portions",
          "Bozena Shiro (chickpea stew with beef)",
        ]
      case "Overweight":
        return [
          "Gomen (collard greens) without excess oil",
          "Atakilt Wat (cabbage, carrots, and potatoes)",
          "Tikil Gomen (cabbage stew)",
          "Azifa (green lentil salad)",
          "Smaller portions of injera with vegetable stews",
        ]
      case "Obesity":
        return [
          "Salata (Ethiopian tomato salad)",
          "Fosolia (green beans and carrots)",
          "Ye`abesha Gomen (collard greens) without oil",
          "Alicha Vegetables (mild vegetable stew)",
          "Limited injera with vegetable-based dishes",
        ]
      default:
        return []
    }
  }

  getFitnessRecommendations(): string[] {
    if (!this._category) return []

    switch (this._category) {
      case "Underweight":
        return [
          "Strength training 3-4 times per week",
          "Focus on compound movements (squats, deadlifts)",
          "Moderate cardio (20 minutes, 2-3 times weekly)",
          "Ethiopian traditional dances for enjoyable activity",
          "Ensure adequate rest between workouts",
        ]
      case "Normal weight":
        return [
          "Balanced workout routine (3-5 times weekly)",
          "Mix of strength training and cardio",
          "Ethiopian Eskista dance for cardio",
          "Regular hiking activities",
          "Focus on maintaining current habits",
        ]
      case "Overweight":
        return [
          "Cardio exercises 4-5 times weekly (30-45 minutes)",
          "Strength training 2-3 times weekly",
          "Daily walking (10,000 steps goal)",
          "Traditional Ethiopian dances for fun cardio",
          "Consider group fitness classes for motivation",
        ]
      case "Obesity":
        return [
          "Start with walking daily (15-30 minutes)",
          "Low-impact exercises like swimming",
          "Gentle strength training with professional guidance",
          "Focus on consistency rather than intensity",
          "Gradually increase duration as fitness improves",
        ]
      default:
        return []
    }
  }

  // Convert to a format suitable for storage
  toObject(): Record<string, unknown> {
    return {
      userId: this._userId,
      height: this._height,
      weight: this._weight,
      bmi: this._bmiValue,
      category: this._category,
      date: this._date.toISOString(),
    }
  }

  // Static factory method to create BMI from plain object
  static fromObject(obj: Record<string, unknown>): BMI {
    const bmi = new BMI(obj.height as number, obj.weight as number, obj.userId as string)
    if (obj.date) {
      bmi._date = new Date(obj.date as string)
    }
    return bmi
  }
}
