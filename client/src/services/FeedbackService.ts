import { Feedback } from "../models/Feedback"
import { supabase } from "../lib/supabase"

/**
 * FeedbackService class for handling feedback operations
 * Implements the service layer in the three-tier architecture
 */
export class FeedbackService {
  private static instance: FeedbackService

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  // Singleton pattern implementation
  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService()
    }
    return FeedbackService.instance
  }

  // Submit feedback
  public async submitFeedback(userId: string | null, name: string, email: string, content: string, rating: number | null = null): Promise<Feedback> {
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
        if (error.message && (
          error.message.includes("row-level security policy") ||
          error.message.includes("violates row-level security") ||
          error.message.includes("RLS") ||
          error.code === "42501"
        )) {
          throw new Error("First register or login in order to send feedback.");
        }
        throw new Error(error.message || "Failed to submit feedback to Supabase");
      }

      // Return the submitted feedback as a Feedback object
      return Feedback.fromObject(data);
    } catch (error) {
      console.error("Submit feedback error:", error);
      throw error;
    }
  }

  // Get all feedback (admin only)
  public async getAllFeedback(): Promise<Feedback[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || "Failed to get all feedback from Supabase");
      }

      return data.map((item: any) => Feedback.fromObject(item));
    } catch (error) {
      console.error("Get all feedback error:", error);
      throw error;
    }
  }

  // Get feedback by ID (admin only)
  public async getFeedbackById(feedbackId: string): Promise<Feedback> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
        .eq('id', feedbackId)
        .single();

      if (error) {
        throw new Error(error.message || "Failed to get feedback by ID from Supabase");
      }

      return Feedback.fromObject(data);
    } catch (error) {
      console.error("Get feedback by ID error:", error);
      throw error;
    }
  }

  // Mark feedback as resolved (admin only)
  public async markFeedbackAsResolved(feedbackId: string): Promise<Feedback> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', feedbackId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to mark feedback as resolved in Supabase");
      }

      return Feedback.fromObject(data);
    } catch (error) {
      console.error("Mark feedback as resolved error:", error);
      throw error;
    }
  }

  // Get unresolved feedback (admin only)
  public async getUnresolvedFeedback(): Promise<Feedback[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, full_name, email, content, rating, created_at, is_resolved, reply_message, resolved_at')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || "Failed to get unresolved feedback from Supabase");
      }

      return data.map((item: any) => Feedback.fromObject(item));
    } catch (error) {
      console.error("Get unresolved feedback error:", error);
      throw error;
    }
  }
}
