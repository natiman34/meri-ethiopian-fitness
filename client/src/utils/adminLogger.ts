import { supabase } from '../lib/supabase';

/**
 * Interface for admin activity log details
 */
export interface AdminLogDetails {
  [key: string]: unknown;
  timestamp?: string;
  userAgent?: string;
  ipAddress?: string;
  resource?: string;
  resourceId?: string;
  previousValue?: unknown;
  newValue?: unknown;
}

/**
 * Interface for admin log entry
 */
export interface AdminLogEntry {
  admin_id: string;
  action: string;
  details: AdminLogDetails;
  created_at?: string;
}

/**
 * Result interface for logging operations
 */
export interface LogResult {
  success: boolean;
  error?: string;
}

/**
 * Logs admin activity to the database with proper error handling and validation
 * @param adminId - The ID of the admin performing the action
 * @param action - The action being performed (e.g., 'CREATE_USER', 'UPDATE_PLAN')
 * @param details - Additional details about the action
 * @returns Promise<LogResult> - Result of the logging operation
 *
 * @example
 * ```typescript
 * const result = await logAdminActivity('admin-123', 'CREATE_MEAL', {
 *   resource: 'meal',
 *   resourceId: 'meal-456',
 *   newValue: { name: 'Ethiopian Injera' }
 * });
 *
 * if (!result.success) {
 *   console.warn('Failed to log admin activity:', result.error);
 * }
 * ```
 */
export const logAdminActivity = async (
  adminId: string,
  action: string,
  details: AdminLogDetails = {}
): Promise<LogResult> => {
  // Input validation
  if (!adminId || typeof adminId !== 'string') {
    return { success: false, error: 'Admin ID is required and must be a string' };
  }

  if (!action || typeof action !== 'string') {
    return { success: false, error: 'Action is required and must be a string' };
  }

  if (typeof details !== 'object' || details === null) {
    return { success: false, error: 'Details must be an object' };
  }

  try {
    // Prepare log entry with timestamp
    const logEntry: AdminLogEntry = {
      admin_id: adminId.trim(),
      action: action.trim().toUpperCase(),
      details: {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    const { error } = await supabase
      .from('admin_logs')
      .insert([logEntry]);

    if (error) {
      console.warn('Failed to log admin activity:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.warn('Failed to log admin activity:', errorMessage);
    return { success: false, error: errorMessage };
  }
};
