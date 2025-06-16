# Password Reset System - OTP Only - Testing Guide

## 🔧 **Password Reset System - FIXED WITH OTP!**

The password reset functionality has been completely rebuilt to work exclusively with OTP (One-Time Password) verification. This provides a secure and reliable password reset method.

## 🎯 **OTP-Based Password Reset System**

### **Single Method: OTP Verification**
- **Route**: `/reset-password`
- **How it works**: Sends 6-digit OTP code to email for verification
- **Secure**: Requires OTP verification before password reset
- **Local Development**: Uses Inbucket email testing server
- **Production Ready**: Works with any SMTP configuration

## 🧪 **Testing Instructions**

### **OTP Password Reset Flow**

#### **Step 1: Access the Reset Page**
1. Go to http://localhost:5173/login
2. Click "Forgot your password?"
3. Or directly visit: http://localhost:5173/reset-password

#### **Step 2: Request OTP**
1. Enter your email address
2. Click "Send Verification Code"
3. **Expected Result**:
   - If account exists: Shows "OTP Sent!" success page
   - If account doesn't exist: Shows error message

#### **Step 3: Check Email (Local Development)**
1. Open Inbucket email interface: http://127.0.0.1:54324
2. Look for your email address in the inbox
3. Open the email to find the 6-digit OTP code
4. **Note**: In local development, emails are captured by Inbucket, not sent to real email

#### **Step 4: Verify OTP**
1. Click "Enter Verification Code" on the success page
2. Enter the 6-digit code from the email
3. Click "Verify Code"
4. **Expected Result**:
   - If code is correct: Redirects to password reset page
   - If code is wrong: Shows error message

#### **Step 5: Set New Password**
1. Enter new password (must meet requirements)
2. Confirm the password
3. Click "Update Password"
4. **Expected Result**:
   - Success message appears
   - Redirects to login page after 3 seconds
   - Can log in with new password

#### **Password Requirements:**
- At least 6 characters long
- Contains uppercase letter
- Contains lowercase letter
- Contains at least one number

### **Error Handling Tests**

#### **Test Invalid Email**
1. Try resetting password with non-existent email
2. **Expected Result**: "No account found with this email address" error

#### **Test Invalid OTP**
1. Enter wrong OTP code (e.g., 123456)
2. **Expected Result**: "Invalid verification code" error

#### **Test Expired OTP**
1. Wait for OTP to expire (1 hour)
2. Try to use the expired code
3. **Expected Result**: "Token has expired" error

#### **Test Password Validation**
1. Try weak passwords (e.g., "123")
2. **Expected Result**: Specific validation errors

#### **Test Rate Limiting**
1. Request multiple OTPs quickly
2. **Expected Result**: Rate limit error after too many requests

## 🔍 **Troubleshooting**

### **If OTP Email Doesn't Arrive:**
1. Check Inbucket interface: http://127.0.0.1:54324
2. Verify Supabase is running locally
3. Check browser console for errors
4. Ensure user account exists in database

### **If OTP Verification Fails:**
1. Verify the 6-digit code is entered correctly
2. Check if the code has expired (1 hour limit)
3. Try requesting a new OTP code
4. Check browser console for detailed error messages

### **Common Issues:**

#### **"User not found" Error**
- **Cause**: Email doesn't exist in database
- **Solution**: Check email spelling or create account first

#### **"Failed to update password" Error**
- **Cause**: Database connection or permission issue
- **Solution**: Check Supabase connection and RLS policies

#### **"Authentication failed" Error**
- **Cause**: Session expired or invalid tokens
- **Solution**: Start password reset process again

## 📊 **System Architecture**

### **OTP Password Reset Flow:**
```
1. User enters email on /reset-password
2. System checks if user exists in user_profiles table
3. If user exists, call supabase.auth.signInWithOtp()
4. Supabase sends 6-digit OTP to email (captured by Inbucket locally)
5. User navigates to /verify-reset-otp
6. User enters 6-digit OTP code
7. System calls supabase.auth.verifyOtp() with type 'email'
8. If valid, Supabase creates authenticated session
9. User redirected to /set-new-password
10. User enters new password
11. System calls supabase.auth.updateUser() to change password
12. User signed out for security
13. Success - redirect to login with new password
```

### **Key Components:**
- **ResetPassword.tsx**: Email input and OTP request
- **VerifyResetOTP.tsx**: OTP verification
- **SetNewPassword.tsx**: Password update with session
- **Inbucket**: Local email testing server (port 54324)
- **Supabase Auth**: OTP generation and verification

## ✅ **Expected Results**

### **Successful OTP Password Reset:**
- ✅ User can access reset form at /reset-password
- ✅ Account verification works (checks user_profiles table)
- ✅ OTP email sent and captured by Inbucket
- ✅ OTP verification works correctly
- ✅ Password validation enforced
- ✅ Password successfully updated
- ✅ User signed out after password change
- ✅ Can log in with new password
- ✅ Old password no longer works

### **Error Handling:**
- ✅ Clear error messages for invalid emails
- ✅ "No account found" for non-existent users
- ✅ "Invalid verification code" for wrong OTP
- ✅ "Token has expired" for expired OTP
- ✅ Password strength validation
- ✅ Rate limiting protection
- ✅ Network error recovery

### **Security Features:**
- ✅ 6-digit OTP with 1-hour expiration
- ✅ Account verification before OTP sending
- ✅ Secure session handling
- ✅ Automatic logout after password reset
- ✅ No password exposure in logs
- ✅ Rate limiting on OTP requests

## 🎉 **Success Criteria**

The OTP password reset system is working correctly if:

1. **OTP Generation**: Can request and receive OTP codes
2. **Email Delivery**: OTP emails appear in Inbucket (local) or user's inbox (production)
3. **OTP Verification**: Can verify codes and get authenticated session
4. **Password Update**: Can successfully change password
5. **Security**: Only account owners can reset passwords
6. **Error Handling**: Clear feedback for all error cases
7. **User Experience**: Smooth flow from email to new password

## 🚀 **Ready for Use**

The OTP password reset system is now fully functional:

- ✅ **Single Method**: Simplified OTP-only approach
- ✅ **Local Development**: Uses Inbucket email testing
- ✅ **Production Ready**: Works with any SMTP configuration
- ✅ **Security**: Secure OTP verification with session management
- ✅ **User-Friendly**: Clear instructions and error messages
- ✅ **Reliable**: Robust error handling and recovery

## 📧 **Local Development Email Testing**

**Important**: In local development, emails are not sent to real email addresses. Instead:

1. **Inbucket Interface**: http://127.0.0.1:54324
2. **Check Inbox**: Look for your email address
3. **View OTP**: Open the email to see the 6-digit code
4. **Copy Code**: Use the code in the verification form

**Users can now successfully reset their passwords using the secure OTP method!**
