import { User, UserRole } from "./User"

/**
 * Admin class representing an administrator in the system
 * Extends the base User class with admin-specific functionality

 */
export class Admin extends User {
  private _adminLevel: string

  constructor(
    id: string,
    name: string,
    email: string,
    role: UserRole = UserRole.ADMIN_SUPER,
    createdAt: string = new Date().toISOString(),
    lastLogin: string = new Date().toISOString(),
    adminLevel = "super",
  ) {
    // Ensure the role is an admin role
    if (role !== UserRole.ADMIN_SUPER && role !== UserRole.ADMIN_FITNESS && role !== UserRole.ADMIN_NUTRITIONIST) {
      role = UserRole.ADMIN_SUPER
    }

    super(id, name, email, role, createdAt, lastLogin)
    this._adminLevel = adminLevel
  }

  // Getters
  get adminLevel(): string {
    return this._adminLevel
  }

  // Admin-specific methods
  manageAccounts(): void {
    // Implementation would connect to the account management service
    console.log(`Admin ${this.name} is managing accounts`)
  }

  manageSystem(): void {
    // Implementation would connect to the system management service
    console.log(`Admin ${this.name} is managing the system`)
  }

  resolveIssues(): void {
    // Implementation would connect to the issue resolution service
    console.log(`Admin ${this.name} is resolving issues`)
  }

  // Override the base class method
  override hasPermission(permission: string): boolean {
    // Super admin has all permissions
    if (this.role === UserRole.ADMIN_SUPER) return true

    // Role-specific permissions
    if (permission === "manage_fitness" && this.role === UserRole.ADMIN_FITNESS) return true
    if (permission === "manage_nutrition" && this.role === UserRole.ADMIN_NUTRITIONIST) return true

    return false
  }

  // Static factory method to create Admin from plain object
  static fromObject(obj: any): Admin {
    return new Admin(obj.id, obj.name, obj.email, obj.role, obj.createdAt, obj.lastLogin, obj.adminLevel)
  }

  // Override toObject to include admin-specific properties
  override toObject(): any {
    return {
      ...super.toObject(),
      adminLevel: this._adminLevel,
    }
  }
}
