/**
 * Security utilities for input validation, sanitization, and hashing
 */
// Input validation patterns with improved security
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Enhanced security patterns
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
/**
 * Sanitizes input by removing potentially dangerous characters with comprehensive XSS protection
 * @param input - The input string to sanitize
 * @param options - Sanitization options
 * @returns Sanitized string
 *
 * @example
 * ```typescript
 * const clean = sanitizeInput('<script>alert("xss")</script>Hello');
 * // Returns: 'Hello'
 * ```
 */
export const sanitizeInput = (input, options = {}) => {
    if (!input || typeof input !== 'string')
        return '';
    const { allowHtml = false, maxLength = 1000 } = options;
    let sanitized = input.trim();
    // Truncate if too long
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    if (!allowHtml) {
        sanitized = sanitized
            .replace(/[<>]/g, '') // Remove < and > to prevent XSS
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/vbscript:/gi, '') // Remove vbscript: protocol
            .replace(/data:/gi, '') // Remove data: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
            .replace(/&/g, '&amp;') // HTML encode ampersands
            .replace(/"/g, '&quot;') // HTML encode quotes
            .replace(/'/g, '&#x27;') // HTML encode apostrophes
            .replace(/\//g, '&#x2F;'); // HTML encode forward slashes
    }
    return sanitized;
};
/**
 * Validates email format with comprehensive checks
 * @param email - The email address to validate
 * @returns ValidationResult with validation status and error message
 *
 * @example
 * ```typescript
 * const result = validateEmail('user@example.com');
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email is required' };
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
        return { isValid: false, error: 'Email cannot be empty' };
    }
    const sanitizedEmail = sanitizeInput(trimmedEmail);
    // Check for basic format
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }
    // Check length limits (RFC 5321)
    if (sanitizedEmail.length > 254) {
        return { isValid: false, error: 'Email address is too long (max 254 characters)' };
    }
    // Check local part length (before @)
    const [localPart] = sanitizedEmail.split('@');
    if (localPart.length > 64) {
        return { isValid: false, error: 'Email local part is too long (max 64 characters)' };
    }
    // Check for consecutive dots
    if (sanitizedEmail.includes('..')) {
        return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }
    // Check for valid domain
    const parts = sanitizedEmail.split('@');
    if (parts.length !== 2) {
        return { isValid: false, error: 'Email must contain exactly one @ symbol' };
    }
    const [, domain] = parts;
    if (domain.length < 2 || domain.length > 253) {
        return { isValid: false, error: 'Email domain length is invalid' };
    }
    return { isValid: true };
};
/**
 * Validates name format with enhanced security checks
 * @param name - The name to validate
 * @returns ValidationResult with validation status and error message
 */
export const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { isValid: false, error: 'Name is required' };
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
        return { isValid: false, error: 'Name cannot be empty' };
    }
    const sanitizedName = sanitizeInput(trimmedName);
    if (sanitizedName.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters long' };
    }
    if (sanitizedName.length > 50) {
        return { isValid: false, error: 'Name must be less than 50 characters' };
    }
    if (!NAME_REGEX.test(sanitizedName)) {
        return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    // Check for suspicious patterns
    if (/^\s+|\s+$/.test(name)) {
        return { isValid: false, error: 'Name cannot start or end with spaces' };
    }
    if (/\s{2,}/.test(sanitizedName)) {
        return { isValid: false, error: 'Name cannot contain multiple consecutive spaces' };
    }
    return { isValid: true };
};
/**
 * Validates phone number format
 * @param phone - The phone number to validate
 * @returns ValidationResult with validation status and error message
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return { isValid: false, error: 'Phone number is required' };
    }
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
        return { isValid: false, error: 'Phone number cannot be empty' };
    }
    // Remove common formatting characters
    const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\.]/g, '');
    if (!PHONE_REGEX.test(cleanPhone)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
    }
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return { isValid: false, error: 'Phone number must be between 7 and 15 digits' };
    }
    return { isValid: true };
};
/**
 * Validates URL format
 * @param url - The URL to validate
 * @returns ValidationResult with validation status and error message
 */
export const validateUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return { isValid: false, error: 'URL is required' };
    }
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
        return { isValid: false, error: 'URL cannot be empty' };
    }
    if (!URL_REGEX.test(trimmedUrl)) {
        return { isValid: false, error: 'Please enter a valid URL (must start with http:// or https://)' };
    }
    if (trimmedUrl.length > 2048) {
        return { isValid: false, error: 'URL is too long (max 2048 characters)' };
    }
    return { isValid: true };
};
/**
 * Validates password strength with comprehensive security checks
 * @param password - The password to validate
 * @returns ValidationResult with validation status, error message, and strength score
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (password.length > 128) {
        return { isValid: false, error: 'Password is too long (max 128 characters)' };
    }
    // Check for whitespace at start/end
    if (password !== password.trim()) {
        return { isValid: false, error: 'Password cannot start or end with spaces' };
    }
    // Check for common weak passwords (expanded list)
    const weakPasswords = [
        'password', '123456', 'qwerty', 'admin', 'letmein', 'welcome',
        'monkey', '1234567890', 'password123', 'admin123', 'qwerty123',
        'abc123', '123abc', 'password1', 'admin1', 'test123', 'user123'
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
        return { isValid: false, error: 'Password is too common, please choose a stronger password' };
    }
    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
        return { isValid: false, error: 'Password cannot contain more than 2 consecutive identical characters' };
    }
    // Check for sequential characters
    const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(password);
    if (hasSequential) {
        return { isValid: false, error: 'Password cannot contain sequential characters (abc, 123, etc.)' };
    }
    // Calculate password strength
    let strength = 0;
    if (/[a-z]/.test(password))
        strength += 1; // lowercase
    if (/[A-Z]/.test(password))
        strength += 1; // uppercase
    if (/\d/.test(password))
        strength += 1; // numbers
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        strength += 1; // special characters
    if (password.length >= 12)
        strength += 1; // length bonus
    if (password.length >= 16)
        strength += 1; // extra length bonus
    // Bonus for character variety
    const uniqueChars = new Set(password.toLowerCase()).size;
    if (uniqueChars >= password.length * 0.7)
        strength += 1; // high character variety
    if (strength < 3) {
        return {
            isValid: false,
            error: 'Password must contain at least 3 of: lowercase, uppercase, numbers, special characters',
            strength
        };
    }
    return { isValid: true, strength };
};
/**
 * Validates password confirmation with enhanced checks
 * @param password - The original password
 * @param confirmPassword - The password confirmation
 * @returns ValidationResult with validation status and error message
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
    if (!confirmPassword || typeof confirmPassword !== 'string') {
        return { isValid: false, error: 'Please confirm your password' };
    }
    if (!password || typeof password !== 'string') {
        return { isValid: false, error: 'Original password is required for confirmation' };
    }
    if (password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match' };
    }
    if (confirmPassword.length === 0) {
        return { isValid: false, error: 'Password confirmation cannot be empty' };
    }
    return { isValid: true };
};
/**
 * Generates a secure salt for password hashing with error handling
 * @returns Hexadecimal salt string or throws error if crypto is unavailable
 *
 * @example
 * ```typescript
 * try {
 *   const salt = generateSalt();
 *   console.log('Generated salt:', salt);
 * } catch (error) {
 *   console.error('Failed to generate salt:', error);
 * }
 * ```
 */
export const generateSalt = () => {
    if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
        throw new Error('Web Crypto API is not available in this environment');
    }
    try {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    catch (error) {
        throw new Error(`Failed to generate secure salt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
/**
 * Hashes a password with salt using Web Crypto API with comprehensive error handling
 * @param password - The password to hash
 * @param salt - The salt to use for hashing
 * @returns Promise<string> - Hexadecimal hash string
 *
 * @example
 * ```typescript
 * try {
 *   const salt = generateSalt();
 *   const hash = await hashPassword('myPassword123', salt);
 *   console.log('Password hash:', hash);
 * } catch (error) {
 *   console.error('Failed to hash password:', error);
 * }
 * ```
 */
export const hashPassword = async (password, salt) => {
    // Input validation
    if (!password || typeof password !== 'string') {
        throw new Error('Password is required and must be a string');
    }
    if (!salt || typeof salt !== 'string') {
        throw new Error('Salt is required and must be a string');
    }
    if (typeof crypto === 'undefined' || !crypto.subtle) {
        throw new Error('Web Crypto API is not available in this environment');
    }
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    catch (error) {
        throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
/**
 * Validates registration form data with comprehensive validation
 * @param data - The registration data to validate
 * @returns RegistrationValidationResult with validation status, errors, and sanitized data
 *
 * @example
 * ```typescript
 * const result = validateRegistrationData({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   confirmPassword: 'SecurePass123!'
 * });
 *
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateRegistrationData = (data) => {
    const errors = {};
    // Input validation
    if (!data || typeof data !== 'object') {
        return { isValid: false, errors: { general: 'Registration data is required' } };
    }
    // Validate name
    const nameValidation = validateName(data.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error;
    }
    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
    }
    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }
    // Validate password confirmation
    const confirmValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
    if (!confirmValidation.isValid) {
        errors.confirmPassword = confirmValidation.error;
    }
    // Validate phone if provided
    if (data.phone) {
        const phoneValidation = validatePhone(data.phone);
        if (!phoneValidation.isValid) {
            errors.phone = phoneValidation.error;
        }
    }
    // Validate terms acceptance if provided
    if (data.terms !== undefined && !data.terms) {
        errors.terms = 'You must accept the terms and conditions';
    }
    if (Object.keys(errors).length > 0) {
        return { isValid: false, errors };
    }
    // Return sanitized data
    const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email).toLowerCase(),
        password: data.password, // Don't sanitize password as it might contain special chars
        confirmPassword: data.confirmPassword,
        ...(data.phone && { phone: sanitizeInput(data.phone) }),
        ...(data.terms !== undefined && { terms: data.terms.toString() })
    };
    return { isValid: true, errors, sanitizedData };
};
/**
 * Rate limiting utility for registration attempts
 */
class RateLimiter {
    attempts = new Map();
    maxAttempts;
    windowMs;
    constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    isAllowed(identifier) {
        const now = Date.now();
        const attempt = this.attempts.get(identifier);
        if (!attempt) {
            this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
            return true;
        }
        if (now > attempt.resetTime) {
            this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
            return true;
        }
        if (attempt.count >= this.maxAttempts) {
            return false;
        }
        attempt.count++;
        return true;
    }
    getRemainingTime(identifier) {
        const attempt = this.attempts.get(identifier);
        if (!attempt)
            return 0;
        const remaining = attempt.resetTime - Date.now();
        return Math.max(0, remaining);
    }
}
export const registrationRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes 
