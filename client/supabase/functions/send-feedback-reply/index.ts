import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { feedbackId, userEmail, userName, feedbackContent, adminReply } = await req.json()

    // Initialize Resend with your API key
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'FitTrack Support <support@fittrack.com>',
      to: userEmail,
      subject: 'Reply to your feedback - FitTrack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reply to Your Feedback</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for your feedback. Here's our response:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your feedback:</strong></p>
            <p style="margin: 10px 0;">${feedbackContent}</p>
          </div>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Our reply:</strong></p>
            <p style="margin: 10px 0;">${adminReply}</p>
          </div>
          
          <p>If you have any further questions or concerns, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Best regards,<br>
            The FitTrack Team
          </p>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 