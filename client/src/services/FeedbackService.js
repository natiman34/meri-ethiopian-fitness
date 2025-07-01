import { Feedback } from "../models/Feedback";
import { supabase } from "../lib/supabase";
import { DirectEmailService } from "./DirectEmailService";
/**
 * FeedbackService class for handling feedback operations
 * Implements the service layer in the three-tier architecture
 */
export class FeedbackService {
    static instance;
    constructor() {
        // Private constructor to enforce singleton pattern
    }
    // Singleton pattern implementation
    static getInstance() {
        if (!FeedbackService.instance) {
            FeedbackService.instance = new FeedbackService();
        }
        return FeedbackService.instance;
    }
    // Submit feedback
    async submitFeedback(userId, name, email, content, rating = null) {
        try {
            // Directly insert into Supabase
            const { data, error } = await supabase
                .from('feedback')
                .insert({
                user_id: userId,
                full_name: name,
                email: email,
                content: content,
                rating: rating,
            })
                .select()
                .single();
            if (error) {
                // Check if the error is related to row-level security policy
                if (error.message && (error.message.includes("row-level security policy") ||
                    error.message.includes("violates row-level security") ||
                    error.message.includes("RLS") ||
                    error.code === "42501")) {
                    throw new Error("First register or login in order to send feedback.");
                }
                throw new Error(error.message || "Failed to submit feedback to Supabase");
            }
            // Return the submitted feedback as a Feedback object
            return Feedback.fromObject(data);
        }
        catch (error) {
            console.error("Submit feedback error:", error);
            throw error;
        }
    }
    // Get all feedback (admin only)
    async getAllFeedback() {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at, updated_at')
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message || "Failed to get all feedback from Supabase");
            }
            return data.map((item) => Feedback.fromObject(item));
        }
        catch (error) {
            console.error("Get all feedback error:", error);
            throw error;
        }
    }
    // Get feedback by ID (admin only)
    async getFeedbackById(feedbackId) {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at, updated_at')
                .eq('id', feedbackId)
                .single();
            if (error) {
                throw new Error(error.message || "Failed to get feedback by ID from Supabase");
            }
            return Feedback.fromObject(data);
        }
        catch (error) {
            console.error("Get feedback by ID error:", error);
            throw error;
        }
    }
    // Mark feedback as resolved (admin only)
    async markFeedbackAsResolved(feedbackId) {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .update({ is_resolved: true, resolved_at: new Date().toISOString() })
                .eq('id', feedbackId)
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
                .single();
            if (error) {
                throw new Error(error.message || "Failed to mark feedback as resolved in Supabase");
            }
            return Feedback.fromObject(data);
        }
        catch (error) {
            console.error("Mark feedback as resolved error:", error);
            throw error;
        }
    }
    // Get unresolved feedback (admin only)
    async getUnresolvedFeedback() {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at, updated_at')
                .eq('is_resolved', false)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message || "Failed to get unresolved feedback from Supabase");
            }
            return data.map((item) => Feedback.fromObject(item));
        }
        catch (error) {
            console.error("Get unresolved feedback error:", error);
            throw error;
        }
    }
    // Mark feedback as unresolved (admin only)
    async markFeedbackAsUnresolved(feedbackId) {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .update({ is_resolved: false, resolved_at: null })
                .eq('id', feedbackId)
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
                .single();
            if (error) {
                throw new Error(error.message || "Failed to mark feedback as unresolved in Supabase");
            }
            return Feedback.fromObject(data);
        }
        catch (error) {
            console.error("Mark feedback as unresolved error:", error);
            throw error;
        }
    }
    // Send email reply to feedback (admin only)
    async sendFeedbackReply(feedbackId, replyMessage) {
        try {
            // First, get the feedback details
            const feedback = await this.getFeedbackById(feedbackId);
            // Update the feedback with reply message
            const { data, error } = await supabase
                .from('feedback')
                .update({
                reply_message: replyMessage,
                is_resolved: true,
                resolved_at: new Date().toISOString()
            })
                .eq('id', feedbackId)
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
                .single();
            if (error) {
                throw new Error(error.message || "Failed to update feedback with reply in Supabase");
            }
            // Send email via the bulletproof Supabase Edge Function
            try {
                console.log("📧 SENDING EMAIL NOTIFICATION");
                console.log("📬 Recipient:", feedback.email);
                console.log("👤 User:", feedback.name);
                console.log("📝 Feedback ID:", feedbackId);
                const emailStartTime = Date.now();
                // Send email to actual user (universal email function handles restrictions)
                const { data: emailData, error: emailError } = await supabase.functions.invoke('sendgrid-email', {
                    body: {
                        feedbackId: feedbackId,
                        userEmail: feedback.email, // Send to actual user email
                        userName: feedback.name,
                        feedbackContent: feedback.content,
                        adminReply: replyMessage
                    }
                });
                const emailDuration = Date.now() - emailStartTime;
                console.log(`⏱️ Email function call took ${emailDuration}ms`);
                if (emailError) {
                    console.error("❌ EMAIL FUNCTION ERROR!");
                    console.error("Error type:", typeof emailError);
                    console.error("Error details:", JSON.stringify(emailError, null, 2));
                    alert(`⚠️ Reply saved but email function failed!\nError: ${emailError.message || 'Unknown error'}\nCheck console for details.`);
                }
                else if (emailData?.success === true) {
                    if (emailData.data?.status === 'sent') {
                        console.log("🎉 EMAIL SENT SUCCESSFULLY!");
                        console.log("📧 Email ID:", emailData.emailId);
                        console.log("📬 Delivered to:", feedback.email);
                        console.log("⏱️ Send duration:", emailData.data.duration + 'ms');
                        console.log("🕐 Timestamp:", emailData.data.timestamp);
                        // Show success message to admin
                        const recipient = emailData.data.to;
                        const emailId = emailData.emailId;
                        const method = emailData.data.method || 'standard';
                        const attempt = emailData.data.attempt || 1;
                        alert(`🎉 Email sent successfully to ANY USER!\n📧 Email ID: ${emailId}\n📬 Sent to: ${recipient}\n🚀 Method: ${method} (attempt ${attempt})\n\n✅ User will receive email notification!`);
                    }
                    else if (emailData.data?.status === 'failed') {
                        console.error("❌ EMAIL SENDING FAILED!");
                        console.error("Error:", emailData.error);
                        console.error("Data:", emailData.data);
                        alert(`❌ Reply saved but email failed to send!\nError: ${emailData.error}\nStatus: ${emailData.data?.status}`);
                    }
                    else {
                        console.warn("⚠️ UNEXPECTED EMAIL STATUS:", emailData.data?.status);
                        console.warn("Full response:", emailData);
                        alert(`⚠️ Reply saved but email status unclear!\nStatus: ${emailData.data?.status}\nCheck console for details.`);
                    }
                }
                else if (emailData?.success === false) {
                    console.error("❌ EMAIL FUNCTION RETURNED FAILURE!");
                    console.error("Error:", emailData.error);
                    console.error("Data:", emailData.data);
                    alert(`❌ Reply saved but email failed!\nError: ${emailData.error}\nCheck console for details.`);
                }
                else {
                    console.error("⚠️ UNEXPECTED EMAIL RESPONSE!");
                    console.error("Response:", emailData);
                    alert(`⚠️ Reply saved but unexpected email response!\nCheck console for details.`);
                }
            }
            catch (emailException) {
                console.error("💥 EMAIL FUNCTION EXCEPTION!");
                console.error("Exception type:", emailException.constructor.name);
                console.error("Exception message:", emailException.message);
                console.error("Exception stack:", emailException.stack);
                // Try direct email service as fallback
                console.log("🔄 TRYING DIRECT EMAIL SERVICE AS FALLBACK...");
                try {
                    const directEmailService = DirectEmailService.getInstance();
                    const directResult = await directEmailService.sendFeedbackReply(feedback.email, feedback.name, feedback.content, replyMessage);
                    if (directResult.success) {
                        console.log("✅ DIRECT EMAIL FALLBACK SUCCESSFUL!");
                        console.log("📧 Email ID:", directResult.emailId);
                        alert(`✅ Email sent successfully via backup system!\n📧 Email ID: ${directResult.emailId}\n📬 Sent to: ${feedback.email}\n\n✅ User will receive email notification!`);
                    }
                    else {
                        console.error("❌ DIRECT EMAIL FALLBACK FAILED!");
                        console.error("Error:", directResult.error);
                        alert(`❌ Reply saved but both email systems failed!\nPrimary: ${emailException.message}\nBackup: ${directResult.error}`);
                    }
                }
                catch (directException) {
                    console.error("💥 DIRECT EMAIL FALLBACK EXCEPTION!");
                    console.error("Direct exception:", directException);
                    alert(`💥 Reply saved but all email systems failed!\nPrimary: ${emailException.message}\nBackup: ${directException.message}`);
                }
            }
            return Feedback.fromObject(data);
        }
        catch (error) {
            console.error("Send feedback reply error:", error);
            throw error;
        }
    }
    // Update feedback reply message without sending email (admin only)
    async updateFeedbackReply(feedbackId, replyMessage) {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .update({ reply_message: replyMessage })
                .eq('id', feedbackId)
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
                .single();
            if (error) {
                throw new Error(error.message || "Failed to update feedback reply in Supabase");
            }
            return Feedback.fromObject(data);
        }
        catch (error) {
            console.error("Update feedback reply error:", error);
            throw error;
        }
    }
    // Get resolved feedback (admin only)
    async getResolvedFeedback() {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at, updated_at')
                .eq('is_resolved', true)
                .order('resolved_at', { ascending: false });
            if (error) {
                throw new Error(error.message || "Failed to get resolved feedback from Supabase");
            }
            return data.map((item) => Feedback.fromObject(item));
        }
        catch (error) {
            console.error("Get resolved feedback error:", error);
            throw error;
        }
    }
}
