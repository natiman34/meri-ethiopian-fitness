/**
 * Direct Email Service - Backup solution for sending emails
 * This service sends emails directly via Resend API without Supabase functions
 */

export interface DirectEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
  status: 'sent' | 'failed';
}

export class DirectEmailService {
  private static instance: DirectEmailService;
  private readonly apiKey = 're_7rddcDCt_7LdvJvjmMjZXKRvWR8ybqsZs';
  private readonly apiUrl = 'https://api.resend.com/emails';

  public static getInstance(): DirectEmailService {
    if (!DirectEmailService.instance) {
      DirectEmailService.instance = new DirectEmailService();
    }
    return DirectEmailService.instance;
  }

  /**
   * Send feedback reply email directly via Resend API
   */
  public async sendFeedbackReply(
    userEmail: string,
    userName: string,
    feedbackContent: string,
    adminReply: string
  ): Promise<DirectEmailResult> {
    console.log('📧 DIRECT EMAIL SERVICE - Sending email...');
    console.log('📬 To:', userEmail);
    console.log('👤 User:', userName);

    try {
      const emailData = {
        from: 'FitTrack Support <onboarding@resend.dev>',
        to: [userEmail],
        subject: 'Reply to your feedback - FitTrack',
        html: this.createEmailHTML(userName, feedbackContent, adminReply),
        text: this.createEmailText(userName, feedbackContent, adminReply)
      };

      console.log('🚀 Calling Resend API directly...');
      const startTime = Date.now();

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const duration = Date.now() - startTime;
      console.log(`⏱️ Direct API call took ${duration}ms`);

      const result = await response.json();

      if (response.ok) {
        console.log('✅ DIRECT EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Email ID:', result.id);
        
        return {
          success: true,
          emailId: result.id,
          status: 'sent'
        };
      } else {
        console.error('❌ Direct email API failed:', result);
        
        return {
          success: false,
          error: `API Error (${response.status}): ${JSON.stringify(result)}`,
          status: 'failed'
        };
      }

    } catch (error) {
      console.error('💥 Direct email exception:', error);
      
      return {
        success: false,
        error: `Exception: ${error.message}`,
        status: 'failed'
      };
    }
  }

  /**
   * Create professional HTML email content
   */
  private createEmailHTML(userName: string, feedbackContent: string, adminReply: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; margin-bottom: 20px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            Reply to Your Feedback
          </h2>
          
          <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
            Dear <strong>${userName}</strong>,
          </p>
          
          <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
            Thank you for taking the time to share your feedback with us. We value your input and here's our response:
          </p>
          
          <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #95a5a6;">
            <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Your feedback:</h3>
            <p style="color: #34495e; margin: 0; font-size: 16px; line-height: 1.6;">${feedbackContent}</p>
          </div>
          
          <div style="background-color: #d5f4e6; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #27ae60; margin: 0 0 15px 0; font-size: 18px;">Our reply:</h3>
            <p style="color: #2c3e50; margin: 0; font-size: 16px; line-height: 1.6;">${adminReply}</p>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #2980b9; margin: 0; font-size: 16px; line-height: 1.6;">
              If you have any further questions or concerns, please don't hesitate to contact us. We're here to help!
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #bdc3c7; text-align: center;">
            <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong style="color: #2c3e50; font-size: 16px;">The FitTrack Team</strong><br>
              <span style="font-size: 12px; color: #95a5a6;">Your Fitness Journey Partner</span>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create plain text email content
   */
  private createEmailText(userName: string, feedbackContent: string, adminReply: string): string {
    return `Dear ${userName},

Thank you for your feedback. Here's our response:

Your feedback:
${feedbackContent}

Our reply:
${adminReply}

If you have any further questions, please don't hesitate to contact us.

Best regards,
The FitTrack Team
Your Fitness Journey Partner`;
  }

  /**
   * Test the direct email service
   */
  public async testDirectEmail(): Promise<DirectEmailResult> {
    console.log('🧪 Testing direct email service...');
    
    return this.sendFeedbackReply(
      'nati737313@gmail.com',
      'Direct Test User',
      'This is a test of the direct email service.',
      'This is a test reply from the direct email service. If you receive this, the backup system is working!'
    );
  }
}
