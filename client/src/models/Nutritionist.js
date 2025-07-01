import { User, UserRole } from "./User";
/**
 * Nutritionist class representing a nutritionist in the system
 * Extends the base User class with nutritionist-specific functionality
 * Based on the class diagram in Figure 25 and Figure 33
 */
export class Nutritionist extends User {
    _specialization;
    _certification;
    constructor(id, name, email, createdAt = new Date().toISOString(), lastLogin = new Date().toISOString(), specialization = "general", certification = "certified") {
        super(id, name, email, UserRole.ADMIN_NUTRITIONIST, createdAt, lastLogin);
        this._specialization = specialization;
        this._certification = certification;
    }
    // Getters
    get specialization() {
        return this._specialization;
    }
    get certification() {
        return this._certification;
    }
    // Setters
    set specialization(specialization) {
        this._specialization = specialization;
    }
    set certification(certification) {
        this._certification = certification;
    }
    // Nutritionist-specific methods
    manageNutritionPlans() {
        // Implementation would connect to the nutrition plan management service
        console.log(`Nutritionist ${this.name} is managing nutrition plans`);
    }
    createMealPlan() {
        // Implementation would connect to the meal plan creation service
        console.log(`Nutritionist ${this.name} is creating a meal plan`);
    }
    updateMealPlan(planId) {
        // Implementation would connect to the meal plan update service
        console.log(`Nutritionist ${this.name} is updating meal plan ${planId}`);
    }
    deleteMealPlan(planId) {
        // Implementation would connect to the meal plan deletion service
        console.log(`Nutritionist ${this.name} is deleting meal plan ${planId}`);
    }
    // Override the base class method
    hasPermission(permission) {
        // Nutritionist has specific permissions
        if (permission === "manage_nutrition")
            return true;
        return super.hasPermission(permission);
    }
    // Static factory method to create Nutritionist from plain object
    static fromObject(obj) {
        return new Nutritionist(obj.id, obj.name, obj.email, obj.createdAt, obj.lastLogin, obj.specialization, obj.certification);
    }
    // Override toObject to include nutritionist-specific properties
    toObject() {
        return {
            ...super.toObject(),
            specialization: this._specialization,
            certification: this._certification,
        };
    }
}
