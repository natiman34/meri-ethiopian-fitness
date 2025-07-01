import { User, UserRole } from "./User";
/**
 * WorkoutPlanner class representing a workout planner in the system
 * Extends the base User class with workout planner-specific functionality
 * Based on the class diagram in Figure 25 and Figure 33
 */
export class WorkoutPlanner extends User {
    _specialization;
    _certification;
    constructor(id, name, email, createdAt = new Date().toISOString(), lastLogin = new Date().toISOString(), specialization = "general", certification = "certified") {
        super(id, name, email, UserRole.ADMIN_FITNESS, createdAt, lastLogin);
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
    // WorkoutPlanner-specific methods
    manageFitnessPlans() {
        // Implementation would connect to the fitness plan management service
        console.log(`Workout Planner ${this.name} is managing fitness plans`);
    }
    createWorkoutPlan() {
        // Implementation would connect to the workout plan creation service
        console.log(`Workout Planner ${this.name} is creating a workout plan`);
    }
    updateWorkoutPlan(planId) {
        // Implementation would connect to the workout plan update service
        console.log(`Workout Planner ${this.name} is updating workout plan ${planId}`);
    }
    deleteWorkoutPlan(planId) {
        // Implementation would connect to the workout plan deletion service
        console.log(`Workout Planner ${this.name} is deleting workout plan ${planId}`);
    }
    // Override the base class method
    hasPermission(permission) {
        // Workout planner has specific permissions
        if (permission === "manage_fitness")
            return true;
        return super.hasPermission(permission);
    }
    // Static factory method to create WorkoutPlanner from plain object
    static fromObject(obj) {
        return new WorkoutPlanner(obj.id, obj.name, obj.email, obj.createdAt, obj.lastLogin, obj.specialization, obj.certification);
    }
    // Override toObject to include workout planner-specific properties
    toObject() {
        return {
            ...super.toObject(),
            specialization: this._specialization,
            certification: this._certification,
        };
    }
}
