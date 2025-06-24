/**
 * Feedback class representing user feedback in the system
 * Based on the class diagram in Figure 25 and Figure 33
 */
export class Feedback {
  private _id: string
  private _userId: string | null // User ID can be null if not authenticated
  private _name: string
  private _email: string
  private _content: string // Renamed from _message
  private _rating: number | null // Added rating
  private _date: Date
  private _resolved: boolean
  private _replyMessage: string | null // Added replyMessage
  private _resolvedAt: Date | null // Added resolvedAt
  private _updatedAt: Date // Added updatedAt

  constructor(
    id: string,
    userId: string | null,
    name: string,
    email: string,
    content: string,
    rating: number | null = null,
    date: Date = new Date(),
    resolved = false,
    replyMessage: string | null = null,
    resolvedAt: Date | null = null,
    updatedAt: Date = new Date(),
  ) {
    this._id = id
    this._userId = userId
    this._name = name
    this._email = email
    this._content = content
    this._rating = rating
    this._date = date
    this._resolved = resolved
    this._replyMessage = replyMessage
    this._resolvedAt = resolvedAt
    this._updatedAt = updatedAt
  }

  // Getters
  get id(): string {
    return this._id
  }

  get userId(): string | null {
    return this._userId
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get content(): string {
    return this._content
  }

  get rating(): number | null {
    return this._rating
  }

  get date(): Date {
    return this._date
  }

  get resolved(): boolean {
    return this._resolved
  }

  get replyMessage(): string | null {
    return this._replyMessage
  }

  get resolvedAt(): Date | null {
    return this._resolvedAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  // Setters
  set content(content: string) {
    this._content = content
  }

  set rating(rating: number | null) {
    this._rating = rating
  }

  set resolved(resolved: boolean) {
    this._resolved = resolved
  }

  set replyMessage(replyMessage: string | null) {
    this._replyMessage = replyMessage
  }

  set resolvedAt(resolvedAt: Date | null) {
    this._resolvedAt = resolvedAt
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt
  }

  // Methods
  markAsResolved(): void {
    this._resolved = true
    this._resolvedAt = new Date()
  }

  // Convert to a format suitable for storage or API
  toObject(): any {
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
    }
  }

  // Static factory method to create Feedback from plain object
  static fromObject(obj: any): Feedback {
    return new Feedback(
      obj.id,
      obj.user_id,
      obj.full_name,
      obj.email,
      obj.content,
      obj.rating,
      new Date(obj.created_at),
      obj.is_resolved,
      obj.reply_message,
      obj.resolved_at ? new Date(obj.resolved_at) : null,
      obj.updated_at ? new Date(obj.updated_at) : new Date(),
    )
  }
}
