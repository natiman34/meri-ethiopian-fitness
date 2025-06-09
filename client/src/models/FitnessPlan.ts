/**
 * FitnessPlan class representing a workout plan in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
export type FitnessCategory = 'weight-loss' | 'weight-gain' | 'maintenance' | 'strength' | 'flexibility' | 'endurance';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  image?: string;
  gifUrl?: string;
  steps: string[];
  sets?: number;
  reps?: number;
  duration?: string;
  targetMuscles: string[];
  difficulty: FitnessLevel;
}

export interface DaySchedule {
  day: number;
  restDay: boolean;
  exercises: Exercise[];
}

export interface FitnessPlan {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  category: FitnessCategory;
  level: FitnessLevel;
  duration: number;
  image_url?: string;
  weekly_workouts: number;
  estimated_calories_burn?: number;
  difficulty: number;
  target_audience?: string;
  prerequisites: string[];
  equipment: string[];
  goals: string[];
  schedule: DaySchedule[];
  status: 'draft' | 'published';
  created_at: string;
}

export class FitnessPlan {
  private _id: string
  private _title: string
  private _description: string
  private _level: string
  private _duration: number // in weeks
  private _categoryId: string
  private _image: string
  private _schedule: DaySchedule[]
  private _createdBy: string
  private _createdAt: Date

  constructor(
    id: string,
    title: string,
    description: string,
    level: string,
    duration: number,
    categoryId: string,
    image: string,
    schedule: DaySchedule[],
    createdBy: string,
    createdAt: Date = new Date(),
  ) {
    this._id = id
    this._title = title
    this._description = description
    this._level = level
    this._duration = duration
    this._categoryId = categoryId
    this._image = image
    this._schedule = schedule
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

  get level(): string {
    return this._level
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

  get schedule(): DaySchedule[] {
    return [...this._schedule]
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

  set level(level: string) {
    this._level = level
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

  // Methods
  addExerciseToDay(day: number, exercise: Exercise): void {
    const daySchedule = this._schedule.find((s) => s.day === day)
    if (daySchedule && !daySchedule.restDay) {
      daySchedule.exercises.push(exercise)
    }
  }

  removeExerciseFromDay(day: number, exerciseId: string): void {
    const daySchedule = this._schedule.find((s) => s.day === day)
    if (daySchedule && !daySchedule.restDay) {
      daySchedule.exercises = daySchedule.exercises.filter((e) => e.id !== exerciseId)
    }
  }

  setRestDay(day: number, isRest: boolean): void {
    const daySchedule = this._schedule.find((s) => s.day === day)
    if (daySchedule) {
      daySchedule.restDay = isRest
      if (isRest) {
        daySchedule.exercises = []
      }
    }
  }

  getWorkoutsPerWeek(): number {
    return this._schedule.filter((day) => !day.restDay).length
  }

  // Convert to a format suitable for storage or API
  toObject(): any {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      level: this._level,
      duration: this._duration,
      categoryId: this._categoryId,
      image: this._image,
      schedule: this._schedule,
      createdBy: this._createdBy,
      createdAt: this._createdAt.toISOString(),
    }
  }

  // Static factory method to create FitnessPlan from plain object
  static fromObject(obj: any): FitnessPlan {
    return new FitnessPlan(
      obj.id,
      obj.title,
      obj.description,
      obj.level,
      obj.duration,
      obj.categoryId,
      obj.image,
      obj.schedule,
      obj.createdBy,
      new Date(obj.createdAt),
    )
  }
}
