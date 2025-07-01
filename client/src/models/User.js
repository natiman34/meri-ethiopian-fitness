/**
 * User class representing a user in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN_SUPER"] = "admin_super";
    UserRole["ADMIN_FITNESS"] = "admin_fitness";
    UserRole["ADMIN_NUTRITIONIST"] = "admin_nutritionist";
})(UserRole || (UserRole = {}));
export class User {
    _id;
    _name;
    _email;
    _role;
    _createdAt;
    _lastLogin;
    _bmiResults;
    constructor(id, name, email, role = UserRole.USER, createdAt = new Date().toISOString(), lastLogin = new Date().toISOString(), bmiResults = []) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._role = role;
        this._createdAt = createdAt;
        this._lastLogin = lastLogin;
        this._bmiResults = bmiResults;
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get role() {
        return this._role;
    }
    get createdAt() {
        return this._createdAt;
    }
    get lastLogin() {
        return this._lastLogin;
    }
    get bmiResults() {
        return [...this._bmiResults];
    }
    // Setters
    set name(name) {
        this._name = name;
    }
    set email(email) {
        this._email = email;
    }
    set lastLogin(lastLogin) {
        this._lastLogin = lastLogin;
    }
    // Methods
    addBMIResult(result) {
        this._bmiResults.push(result);
    }
    isAdmin() {
        return (this._role === UserRole.ADMIN_SUPER ||
            this._role === UserRole.ADMIN_FITNESS ||
            this._role === UserRole.ADMIN_NUTRITIONIST);
    }
    hasPermission(permission) {
        // Implementation would depend on specific permission system
        if (this._role === UserRole.ADMIN_SUPER)
            return true;
        // Role-specific permissions
        if (permission === "manage_fitness" && this._role === UserRole.ADMIN_FITNESS)
            return true;
        if (permission === "manage_nutrition" && this._role === UserRole.ADMIN_NUTRITIONIST)
            return true;
        return false;
    }
    // Static factory method to create User from plain object
    static fromObject(obj) {
        return new User(obj.id, obj.name, obj.email, obj.role, obj.createdAt, obj.lastLogin, obj.bmiResults || []);
    }
    // Convert to plain object for API calls
    toObject() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            role: this._role,
            createdAt: this._createdAt,
            lastLogin: this._lastLogin,
            bmiResults: this._bmiResults,
        };
    }
}
