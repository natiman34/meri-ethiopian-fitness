# Enhanced SuperAdmin Feedback System

## Overview

The SuperAdmin feedback system has been enhanced with comprehensive functionality for managing user feedback, including resolved/unresolved status tracking, email reply capabilities, and an improved user interface.

## Features Implemented

### 1. Resolved/Unresolved Status Management
- **Resolved Button**: Marks feedback as resolved and sets the resolved timestamp
- **Unresolved Button**: Marks feedback as unresolved and clears the resolved timestamp
- **Visual Status Indicators**: Color-coded cards and status badges for easy identification
- **Status Filtering**: Filter feedback by All, Resolved, or Unresolved status

### 2. Email Reply System
- **Reply Modal**: Comprehensive modal for composing replies to user feedback
- **Email Integration**: Automatic email sending via Supabase Edge Function
- **Reply History**: Display of admin replies within the feedback interface
- **Update Functionality**: Ability to update existing replies

### 3. Enhanced User Interface
- **Status Badges**: Visual indicators showing resolved/unresolved status
- **Action Buttons**: Contextual buttons for resolving, unresolving, and replying
- **Improved Layout**: Better organization of feedback information
- **Loading States**: Visual feedback during async operations

## Database Schema

### Feedback Table Structure
```sql
CREATE TABLE feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_resolved BOOLEAN DEFAULT FALSE,
    reply_message TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes for Performance
- `idx_feedback_user_id`: For user-specific queries
- `idx_feedback_is_resolved`: For status filtering
- `idx_feedback_created_at`: For chronological ordering
- `idx_feedback_email`: For email-based searches

## Email Notification System

### Email Format and Content Requirements

#### Email Template Structure
The email notification system uses a professional HTML template with the following structure:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Reply to Your Feedback</h2>
  <p>Dear {userName},</p>
  <p>Thank you for your feedback. Here's our response:</p>
  
  <!-- Original Feedback Section -->
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Your feedback:</strong></p>
    <p style="margin: 10px 0;">{feedbackContent}</p>
  </div>
  
  <!-- Admin Reply Section -->
  <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Our reply:</strong></p>
    <p style="margin: 10px 0;">{adminReply}</p>
  </div>
  
  <p>If you have any further questions or concerns, please don't hesitate to contact us.</p>
  
  <p style="margin-top: 30px; color: #666; font-size: 14px;">
    Best regards,<br>
    The FitTrack Team
  </p>
</div>
```

#### Email Content Requirements

1. **Subject Line**: "Reply to your feedback - FitTrack"
2. **From Address**: "FitTrack Support <support@fittrack.com>"
3. **Personalization**: Uses the user's name from the feedback
4. **Content Sections**:
   - Greeting with user's name
   - Original feedback display (gray background)
   - Admin reply (green background)
   - Closing message
   - Professional signature

#### Required Parameters for Email Function
```javascript
{
  feedbackId: string,      // Unique feedback identifier
  userEmail: string,       // Recipient email address
  userName: string,        // User's full name for personalization
  feedbackContent: string, // Original feedback content
  adminReply: string      // Admin's reply message
}
```

### Email Sending Process

1. **Trigger**: When admin clicks "Send Reply" in the reply modal
2. **Database Update**: Reply message and resolved status are saved
3. **Email Dispatch**: Supabase Edge Function sends formatted email
4. **Error Handling**: Email failures are logged but don't prevent database updates
5. **User Feedback**: Success/error messages displayed in the UI

## API Endpoints

### FeedbackService Methods

#### Core Operations
- `getAllFeedback()`: Retrieve all feedback with full details
- `getFeedbackById(id)`: Get specific feedback item
- `markFeedbackAsResolved(id)`: Mark feedback as resolved
- `markFeedbackAsUnresolved(id)`: Mark feedback as unresolved

#### Reply Operations
- `sendFeedbackReply(id, message)`: Send reply and mark as resolved
- `updateFeedbackReply(id, message)`: Update existing reply
- `getResolvedFeedback()`: Get all resolved feedback
- `getUnresolvedFeedback()`: Get all unresolved feedback

## Security Implementation

### Row Level Security (RLS) Policies

1. **User Feedback Insertion**: Users can insert their own feedback or anonymous feedback
2. **User Feedback Viewing**: Users can view their own feedback, admins can view all
3. **Admin Operations**: Only admins can update feedback (resolve/reply)
4. **Anonymous Support**: Allows feedback submission without authentication

### Role-Based Access Control
- **admin_super**: Full access to all feedback operations
- **admin_nutritionist**: Access to feedback management
- **admin_fitness**: Access to feedback management
- **user**: Can only view their own feedback

## Usage Instructions

### For SuperAdmins

1. **Viewing Feedback**:
   - Navigate to Admin Dashboard → Feedback Management
   - Use search bar to find specific feedback
   - Use status filters to view resolved/unresolved items

2. **Resolving Feedback**:
   - Click "Mark Resolved" button on unresolved feedback
   - Feedback status changes to resolved with timestamp

3. **Replying to Feedback**:
   - Click "Reply" button to open reply modal
   - Compose professional response
   - Click "Send Reply" to email user and mark as resolved

4. **Managing Status**:
   - Use "Mark Unresolved" to reopen resolved feedback
   - Update replies using "Update Reply" button

### Email Configuration

Ensure the following environment variables are set in Supabase:
- `RESEND_API_KEY`: API key for Resend email service
- Email function deployed at `/functions/send-feedback-reply`

## Testing

Run the test script to verify system functionality:
```bash
node test_feedback_system.js
```

The test covers:
- Database table structure
- Feedback insertion and retrieval
- Status management
- Reply functionality
- Data cleanup

## Troubleshooting

### Common Issues

1. **Email Not Sending**: Check Resend API key configuration
2. **Permission Errors**: Verify user has admin role in user_profiles table
3. **Database Errors**: Ensure all migrations have been applied
4. **UI Issues**: Check that all required components are imported

### Error Messages

- "First register or login in order to send feedback": RLS policy violation
- "Failed to mark feedback as resolved": Database permission issue
- "Failed to send reply": Email service configuration problem

## Future Enhancements

Potential improvements for the feedback system:
- Bulk operations for multiple feedback items
- Feedback categories and tagging
- Response time analytics
- Automated reply templates
- Integration with customer support systems
