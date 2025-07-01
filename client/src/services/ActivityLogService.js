import { supabase } from '../lib/supabase';
/**
 * Enhanced Activity Logging Service
 * Handles both general activity logs and admin-specific logs
 */
export class ActivityLogService {
    /**
     * Log a general activity (visible to public)
     */
    static async logActivity(type, title, description, userId, adminId) {
        try {
            const logEntry = {
                type: type.toLowerCase(),
                title,
                description,
                user_id: userId || undefined,
                admin_id: adminId || undefined,
                timestamp: new Date().toISOString()
            };
            const { data, error } = await supabase
                .from('activity_log')
                .insert([logEntry])
                .select()
                .single();
            if (error) {
                console.error('Failed to log activity:', error);
                return null;
            }
            console.log('Activity logged successfully:', data);
            return data;
        }
        catch (error) {
            console.error('Error logging activity:', error);
            return null;
        }
    }
    /**
     * Log admin-specific activity (secure, admin-only access)
     */
    static async logAdminActivity(adminId, action, details = {}) {
        try {
            // Validate admin user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || user.id !== adminId) {
                console.error('Unauthorized admin logging attempt');
                return null;
            }
            // Check if user is actually an admin
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', adminId)
                .single();
            if (profileError || !profile?.role?.includes('admin_')) {
                console.error('User is not an admin:', profileError);
                return null;
            }
            const logEntry = {
                admin_id: adminId,
                action: action.toUpperCase(),
                details: {
                    ...details,
                    timestamp: new Date().toISOString(),
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
                }
            };
            const { data, error } = await supabase
                .from('admin_logs')
                .insert([logEntry])
                .select()
                .single();
            if (error) {
                console.error('Failed to log admin activity:', error);
                return null;
            }
            console.log('Admin activity logged successfully:', data);
            return data;
        }
        catch (error) {
            console.error('Error logging admin activity:', error);
            return null;
        }
    }
    /**
     * Log user activity (fitness/nutrition related)
     */
    static async logUserActivity(userId, date, type, details = {}) {
        try {
            const { data, error } = await supabase
                .from('activities')
                .insert({
                user_id: userId,
                date,
                type,
                details
            })
                .select()
                .single();
            if (error) {
                console.error('Failed to log user activity:', error);
                return false;
            }
            console.log('User activity logged successfully:', data);
            return true;
        }
        catch (error) {
            console.error('Error logging user activity:', error);
            return false;
        }
    }
    /**
     * Get recent activity logs (public view)
     */
    static async getRecentActivityLogs(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('activity_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error) {
                console.error('Failed to fetch activity logs:', error);
                return [];
            }
            return data;
        }
        catch (error) {
            console.error('Error fetching activity logs:', error);
            return [];
        }
    }
    /**
     * Get admin logs (admin-only access)
     */
    static async getAdminLogs(adminId, limit = 50) {
        try {
            let query = supabase
                .from('admin_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            // If adminId is provided, filter by that admin
            if (adminId) {
                query = query.eq('admin_id', adminId);
            }
            const { data, error } = await query;
            if (error) {
                console.error('Failed to fetch admin logs:', error);
                return [];
            }
            return data;
        }
        catch (error) {
            console.error('Error fetching admin logs:', error);
            return [];
        }
    }
    /**
     * Get user activities
     */
    static async getUserActivities(userId, startDate, endDate) {
        try {
            let query = supabase
                .from('activities')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });
            if (startDate) {
                query = query.gte('date', startDate);
            }
            if (endDate) {
                query = query.lte('date', endDate);
            }
            const { data, error } = await query;
            if (error) {
                console.error('Failed to fetch user activities:', error);
                return [];
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching user activities:', error);
            return [];
        }
    }
    /**
     * Convenience methods for common logging scenarios
     */
    static async logFitnessAction(title, description, adminId) {
        return this.logActivity('fitness', title, description, undefined, adminId);
    }
    static async logNutritionAction(title, description, adminId) {
        return this.logActivity('nutrition', title, description, undefined, adminId);
    }
    static async logUserAction(title, description, userId) {
        return this.logActivity('user', title, description, userId);
    }
    static async logFeedbackAction(title, description, userId) {
        return this.logActivity('feedback', title, description, userId);
    }
}
