import { supabase } from '../lib/supabase'

/**
 * EmailService class for handling email-related operations
 * Specifically designed for password reset and other authentication emails
 */
export class EmailService {
  private static instance: EmailService

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Sends a password reset email to the specified email address
   * @param email The email address to send the reset link to
   * @returns Promise<void>
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      console.log(`[EmailService] Sending password reset email to: ${email}`)
      
      const redirectToUrl = `${window.location.origin}/set-new-password`;
      console.log(`[EmailService] Redirecting to: ${redirectToUrl}`);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectToUrl,
        captchaToken: undefined
      })

      if (error) {
        console.error(`[EmailService] Password reset email error:`, error)
        throw error
      }

      console.log(`[EmailService] Password reset email sent successfully to: ${email}`)
      console.log(`[EmailService] Response data:`, data)
      
    } catch (error) {
      console.error(`[EmailService] Failed to send password reset email:`, error)
      throw error
    }
  }

  /**
   * Validates if an email address is properly formatted
   * @param email The email address to validate
   * @returns boolean
   */
  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Checks if the email service is properly configured
   * @returns Promise<boolean>
   */
  public async isEmailServiceAvailable(): Promise<boolean> {
    try {
      // Test the Supabase connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error(`[EmailService] Email service check failed:`, error)
        return false
      }

      console.log(`[EmailService] Email service is available`)
      return true
      
    } catch (error) {
      console.error(`[EmailService] Email service check error:`, error)
      return false
    }
  }

  /**
   * Gets email configuration information for debugging
   * @returns Object with email service configuration
   */
  public getEmailConfig(): { 
    supabaseUrl: string
    redirectUrl: string
    isConfigured: boolean 
  } {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dhcgrpsgvaggrtfcykyf.supabase.co"
    const redirectUrl = `${window.location.origin}/set-new-password`
    
    return {
      supabaseUrl,
      redirectUrl,
      isConfigured: !!supabaseUrl
    }
  }
}

export default EmailService 