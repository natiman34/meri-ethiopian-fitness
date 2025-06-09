/**
 * User class representing a user in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
export enum UserRole {
  USER = "user",
  ADMIN_SUPER = "admin_super",
  ADMIN_FITNESS = "admin_fitness",
  ADMIN_NUTRITIONIST = "admin_nutritionist",
}

export interface BMIResult {
  id: string
  height: number
  weight: number
  bmi: number
  category: string
  date: string
}

export class User {
  private _id: string
  private _name: string
  private _email: string
  private _role: UserRole
  private _createdAt: string
  private _lastLogin: string
  private _bmiResults: BMIResult[]

  constructor(
    id: string,
    name: string,
    email: string,
    role: UserRole = UserRole.USER,
    createdAt: string = new Date().toISOString(),
    lastLogin: string = new Date().toISOString(),
    bmiResults: BMIResult[] = [],
  ) {
    this._id = id
    this._name = name
    this._email = email
    this._role = role
    this._createdAt = createdAt
    this._lastLogin = lastLogin
    this._bmiResults = bmiResults
  }

  // Getters
  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get role(): UserRole {
    return this._role
  }

  get createdAt(): string {
    return this._createdAt
  }

  get lastLogin(): string {
    return this._lastLogin
  }

  get bmiResults(): BMIResult[] {
    return [...this._bmiResults]
  }

  // Setters
  set name(name: string) {
    this._name = name
  }

  set email(email: string) {
    this._email = email
  }

  set lastLogin(lastLogin: string) {
    this._lastLogin = lastLogin
  }

  // Methods
  addBMIResult(result: BMIResult): void {
    this._bmiResults.push(result)
  }

  isAdmin(): boolean {
    return (
      this._role === UserRole.ADMIN_SUPER ||
      this._role === UserRole.ADMIN_FITNESS ||
      this._role === UserRole.ADMIN_NUTRITIONIST
    )
  }

  hasPermission(permission: string): boolean {
    // Implementation would depend on specific permission system
    if (this._role === UserRole.ADMIN_SUPER) return true

    // Role-specific permissions
    if (permission === "manage_fitness" && this._role === UserRole.ADMIN_FITNESS) return true
    if (permission === "manage_nutrition" && this._role === UserRole.ADMIN_NUTRITIONIST) return true

    return false
  }

  // Static factory method to create User from plain object
  static fromObject(obj: any): User {
    return new User(obj.id, obj.name, obj.email, obj.role, obj.createdAt, obj.lastLogin, obj.bmiResults || [])
  }

  // Convert to plain object for API calls
  toObject(): any {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt,
      lastLogin: this._lastLogin,
      bmiResults: this._bmiResults,
    }
  }
}
