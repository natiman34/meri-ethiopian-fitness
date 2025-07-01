import { ActivityLogService } from '../services/ActivityLogService';
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
export const logAdminActivity = async (adminId, action, details = {}) => {
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
        // Use the enhanced ActivityLogService for admin logging
        const result = await ActivityLogService.logAdminActivity(adminId.trim(), action.trim(), details);
        if (result) {
            return { success: true };
        }
        else {
            return { success: false, error: 'Failed to log admin activity' };
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.warn('Failed to log admin activity:', errorMessage);
        return { success: false, error: errorMessage };
    }
};
