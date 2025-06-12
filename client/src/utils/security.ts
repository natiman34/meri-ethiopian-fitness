/**
 * Security utilities for input validation, sanitization, and hashing
 */

// Input validation patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Sanitizes input by removing potentially dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/&/g, '&amp;') // HTML encode ampersands
    .replace(/"/g, '&quot;') // HTML encode quotes
    .replace(/'/g, '&#x27;') // HTML encode apostrophes
    .replace(/\//g, '&#x2F;'); // HTML encode forward slashes
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const sanitizedEmail = sanitizeInput(email);
  
  if (!EMAIL_REGEX.test(sanitizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true };
};

/**
 * Validates name format
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }
  
  const sanitizedName = sanitizeInput(name);
  
  if (sanitizedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (sanitizedName.length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  if (!NAME_REGEX.test(sanitizedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }
  
  return { isValid: true };
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string; strength?: number } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'Password is too common, please choose a stronger password' };
  }
  
  // Calculate password strength
  let strength = 0;
  if (/[a-z]/.test(password)) strength += 1; // lowercase
  if (/[A-Z]/.test(password)) strength += 1; // uppercase
  if (/\d/.test(password)) strength += 1; // numbers
  if (/[@$!%*?&]/.test(password)) strength += 1; // special characters
  if (password.length >= 12) strength += 1; // length bonus
  
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
 * Validates password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword || typeof confirmPassword !== 'string') {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

/**
 * Generates a secure salt for password hashing
 */
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hashes a password with salt using Web Crypto API
 */
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * Validates registration form data
 */
export const validateRegistrationData = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): { isValid: boolean; errors: Record<string, string>; sanitizedData?: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }
  
  // Validate password confirmation
  const confirmValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmValidation.isValid) {
    errors.confirmPassword = confirmValidation.error!;
  }
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  // Return sanitized data
  const sanitizedData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    password: data.password, // Don't sanitize password as it might contain special chars
    confirmPassword: data.confirmPassword
  };
  
  return { isValid: true, errors, sanitizedData };
};

/**
 * Rate limiting utility for registration attempts
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
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
  
  getRemainingTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return 0;
    
    const remaining = attempt.resetTime - Date.now();
    return Math.max(0, remaining);
  }
}

export const registrationRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes 