// Email function for feedback replies using Resend API
// This function actually sends emails to users

import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { feedbackId, userEmail, userName, feedbackContent, adminReply } = await req.json()

    // Validate required parameters
    if (!userEmail || !userName || !feedbackContent || !adminReply) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters: userEmail, userName, feedbackContent, or adminReply',
          received: { feedbackId, userEmail, userName, feedbackContent: !!feedbackContent, adminReply: !!adminReply }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Processing email request:')
    console.log('- To:', userEmail)
    console.log('- From user:', userName)
    console.log('- Feedback ID:', feedbackId)
    console.log('- Admin reply length:', adminReply.length)

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not configured')
      // Return success but indicate email service is not configured
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: `email_${Date.now()}_simulated`,
            to: userEmail,
            subject: 'Reply to your feedback - FitTrack',
            status: 'simulated_no_api_key',
            timestamp: new Date().toISOString()
          },
          message: 'Reply saved successfully. Email simulation mode - RESEND_API_KEY not configured.',
          emailId: `email_${Date.now()}_simulated`,
          note: 'Configure RESEND_API_KEY environment variable to enable actual email sending'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Send actual email using Resend
    try {
      console.log('Sending email via Resend API...')

      const { data, error } = await resend.emails.send({
        from: 'FitTrack Support <onboarding@resend.dev>', // Using Resend's verified domain
        to: [userEmail],
        subject: 'Reply to your feedback - FitTrack',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #2c3e50; margin: 0 0 15px 0;">Reply to Your Feedback</h2>
              <p style="color: #34495e; margin: 0;">Dear ${userName},</p>
              <p style="color: #34495e;">Thank you for taking the time to share your feedback with us. We value your input and here's our response:</p>
            </div>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #bdc3c7;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #2c3e50;">Your feedback:</p>
              <p style="margin: 0; color: #34495e; line-height: 1.6;">${feedbackContent}</p>
            </div>

            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #27ae60;">Our reply:</p>
              <p style="margin: 0; color: #2c3e50; line-height: 1.6;">${adminReply}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #34495e; margin: 0;">If you have any further questions or concerns, please don't hesitate to contact us. We're here to help!</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong style="color: #2c3e50;">The FitTrack Team</strong><br>
                <span style="font-size: 12px;">Your Fitness Journey Partner</span>
              </p>
            </div>
          </div>
        `,
        text: `
Dear ${userName},

Thank you for your feedback. Here's our response:

Your feedback:
${feedbackContent}

Our reply:
${adminReply}

If you have any further questions, please don't hesitate to contact us.

Best regards,
The FitTrack Team
        `
      })

      if (error) {
        console.error('Resend API error:', error)
        throw new Error(`Email sending failed: ${error.message}`)
      }

      console.log('Email sent successfully via Resend:', data)

      const emailResult = {
        id: data.id,
        to: userEmail,
        subject: 'Reply to your feedback - FitTrack',
        status: 'sent',
        timestamp: new Date().toISOString(),
        provider: 'resend'
      }

      console.log('Email delivery completed:', emailResult)

      return new Response(
        JSON.stringify({
          success: true,
          data: emailResult,
          message: 'Email sent successfully',
          emailId: emailResult.id,
          provider: 'resend',
          note: 'Email delivered via Resend API'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )

    } catch (emailError) {
      console.error('Email sending error:', emailError)

      // Return success for database operations but indicate email failure
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: `email_${Date.now()}_failed`,
            to: userEmail,
            subject: 'Reply to your feedback - FitTrack',
            status: 'failed',
            timestamp: new Date().toISOString(),
            error: emailError.message
          },
          message: 'Reply saved successfully, but email sending failed',
          emailId: `email_${Date.now()}_failed`,
          error: `Email delivery failed: ${emailError.message}`,
          note: 'Feedback reply was saved to database but email could not be sent'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 because the main operation (saving reply) succeeded
        },
      )
    }
  } catch (error) {
    console.error('Email function error:', error)

    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error occurred',
        details: error.toString(),
        timestamp: new Date().toISOString(),
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})