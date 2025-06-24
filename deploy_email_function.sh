#!/bin/bash

# Email Function Deployment Script
# This script deploys the send-feedback-reply function to Supabase

echo "📧 Deploying Email Function to Supabase..."
echo "============================================"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "💡 Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if we're in the right directory
if [ ! -d "supabase/functions/send-feedback-reply" ]; then
    echo "❌ send-feedback-reply function directory not found"
    echo "💡 Make sure you're in the project root directory"
    exit 1
fi

echo "✅ Function directory found"

# Deploy the function
echo "🚀 Deploying send-feedback-reply function..."
supabase functions deploy send-feedback-reply

if [ $? -eq 0 ]; then
    echo "✅ Function deployed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure RESEND_API_KEY in Supabase Dashboard"
    echo "2. Test the function with: node client/test_email_function.js"
    echo "3. Check function logs in Supabase Dashboard if issues occur"
    echo ""
    echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/dhcgrpsgvaggrtfcykyf"
else
    echo "❌ Function deployment failed"
    echo "💡 Check your Supabase configuration and try again"
    exit 1
fi
