# Email Functionality Troubleshooting Guide

## Issues Fixed and Improvements Made

### 🔧 **Changes Made to Fix Email Issues:**

1. **Enhanced Error Handling**
   - Added comprehensive error logging in FeedbackService
   - Improved error messages with detailed information
   - Added parameter validation in the email function

2. **Email Function Improvements**
   - Added validation for required parameters
   - Added RESEND_API_KEY configuration check
   - Changed from domain to `onboarding@resend.dev` (Resend's test domain)
   - Enhanced error responses with timestamps and details

3. **Better Logging**
   - Added console logs for debugging email sending process
   - Detailed error information for troubleshooting

## Common Issues and Solutions

### ❌ **Issue 1: "RESEND_API_KEY environment variable is not configured"**

**Solution:**
1. Go to [Resend.com](https://resend.com) and create an account
2. Generate an API key from the dashboard
3. In Supabase Dashboard:
   - Go to Project Settings → Edge Functions
   - Add environment variable: `RESEND_API_KEY` = `your_api_key_here`
4. Redeploy the function: `supabase functions deploy send-feedback-reply`

### ❌ **Issue 2: "Function not found" or 404 errors**

**Solution:**
Deploy the email function to Supabase:
```bash
supabase functions deploy send-feedback-reply
```

### ❌ **Issue 3: Email domain not verified**

**Solution:**
The function now uses `onboarding@resend.dev` which is Resend's verified test domain. For production:
1. Verify your domain in Resend dashboard
2. Update the `from` address in the email function
3. Redeploy the function

### ❌ **Issue 4: Emails going to spam**

**Solutions:**
1. Use a verified domain
2. Set up SPF, DKIM, and DMARC records
3. Use a professional email address
4. Include unsubscribe links (for production)

## Testing the Email Functionality

### **Method 1: Use the Test Script**
```bash
cd client
node test_email_function.js
```

### **Method 2: Manual Testing via UI**
1. Go to Admin Dashboard → Feedback Management
2. Find any feedback item
3. Click "Reply" button
4. Compose a test message
5. Click "Send Reply"
6. Check browser console for detailed logs

### **Method 3: Direct Function Testing**
```javascript
// In browser console or test script
const { data, error } = await supabase.functions.invoke('send-feedback-reply', {
  body: {
    feedbackId: 'test-id',
    userEmail: 'your-test-email@example.com',
    userName: 'Test User',
    feedbackContent: 'Test feedback content',
    adminReply: 'Test admin reply'
  }
});
console.log('Result:', { data, error });
```

## Configuration Checklist

### ✅ **Pre-deployment Checklist:**

1. **Resend Account Setup**
   - [ ] Resend account created
   - [ ] API key generated
   - [ ] Domain verified (optional for testing)

2. **Supabase Configuration**
   - [ ] RESEND_API_KEY environment variable set
   - [ ] Email function deployed
   - [ ] Function accessible via Supabase dashboard

3. **Code Configuration**
   - [ ] Correct function name in FeedbackService
   - [ ] Proper error handling implemented
   - [ ] Test email addresses configured

### ✅ **Post-deployment Verification:**

1. **Function Status**
   - [ ] Function appears in Supabase Functions dashboard
   - [ ] Function logs show no deployment errors
   - [ ] Environment variables are set

2. **Email Testing**
   - [ ] Test email script runs without errors
   - [ ] Email appears in recipient inbox
   - [ ] Email formatting is correct
   - [ ] No spam folder issues

## Debugging Steps

### **Step 1: Check Function Deployment**
```bash
supabase functions list
```

### **Step 2: Check Function Logs**
In Supabase Dashboard:
1. Go to Edge Functions
2. Select `send-feedback-reply`
3. Check the Logs tab for errors

### **Step 3: Test Function Directly**
```bash
curl -X POST 'https://dhcgrpsgvaggrtfcykyf.supabase.co/functions/v1/send-feedback-reply' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "feedbackId": "test",
    "userEmail": "test@example.com",
    "userName": "Test User",
    "feedbackContent": "Test content",
    "adminReply": "Test reply"
  }'
```

### **Step 4: Check Environment Variables**
In the function code, add temporary logging:
```javascript
console.log('RESEND_API_KEY configured:', !!Deno.env.get('RESEND_API_KEY'))
```

## Production Recommendations

### **For Production Use:**

1. **Use Your Own Domain**
   ```javascript
   from: 'FitTrack Support <support@yourdomain.com>'
   ```

2. **Add Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Add user authentication checks

3. **Enhanced Email Templates**
   - Add company branding
   - Include unsubscribe links
   - Add email tracking (optional)

4. **Error Monitoring**
   - Set up error alerts for failed emails
   - Monitor email delivery rates
   - Track bounce rates

5. **Security Considerations**
   - Validate email addresses
   - Sanitize user input
   - Add CSRF protection

## Support Resources

- **Resend Documentation**: https://resend.com/docs
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Email Deliverability Guide**: https://resend.com/docs/knowledge-base/deliverability

## Quick Fix Commands

```bash
# Deploy the email function
supabase functions deploy send-feedback-reply

# Check function status
supabase functions list

# View function logs
supabase functions logs send-feedback-reply

# Test the function
node client/test_email_function.js
```
