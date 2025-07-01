/**
 * Feedback class representing user feedback in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
export class Feedback {
    _id;
    _userId; // User ID can be null if not authenticated
    _name;
    _email;
    _content; // Renamed from _message
    _rating; // Added rating
    _date;
    _resolved;
    _replyMessage; // Added replyMessage
    _resolvedAt; // Added resolvedAt
    _updatedAt; // Added updatedAt
    constructor(id, userId, name, email, content, rating = null, date = new Date(), resolved = false, replyMessage = null, resolvedAt = null, updatedAt = new Date()) {
        this._id = id;
        this._userId = userId;
        this._name = name;
        this._email = email;
        this._content = content;
        this._rating = rating;
        this._date = date;
        this._resolved = resolved;
        this._replyMessage = replyMessage;
        this._resolvedAt = resolvedAt;
        this._updatedAt = updatedAt;
    }
    // Getters
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get content() {
        return this._content;
    }
    get rating() {
        return this._rating;
    }
    get date() {
        return this._date;
    }
    get resolved() {
        return this._resolved;
    }
    get replyMessage() {
        return this._replyMessage;
    }
    get resolvedAt() {
        return this._resolvedAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // Setters
    set content(content) {
        this._content = content;
    }
    set rating(rating) {
        this._rating = rating;
    }
    set resolved(resolved) {
        this._resolved = resolved;
    }
    set replyMessage(replyMessage) {
        this._replyMessage = replyMessage;
    }
    set resolvedAt(resolvedAt) {
        this._resolvedAt = resolvedAt;
    }
    set updatedAt(updatedAt) {
        this._updatedAt = updatedAt;
    }
    // Methods
    markAsResolved() {
        this._resolved = true;
        this._resolvedAt = new Date();
    }
    // Convert to a format suitable for storage or API
    toObject() {
        return {
            id: this._id,
            user_id: this._userId,
            full_name: this._name,
            email: this._email,
            content: this._content,
            rating: this._rating,
            created_at: this._date.toISOString(),
            is_resolved: this._resolved,
            reply_message: this._replyMessage,
            resolved_at: this._resolvedAt?.toISOString(),
            updated_at: this._updatedAt.toISOString(),
        };
    }
    // Static factory method to create Feedback from plain object
    static fromObject(obj) {
        return new Feedback(obj.id, obj.user_id, obj.full_name, obj.email, obj.content, obj.rating, new Date(obj.created_at), obj.is_resolved, obj.reply_message, obj.resolved_at ? new Date(obj.resolved_at) : null, obj.updated_at ? new Date(obj.updated_at) : new Date());
    }
}
