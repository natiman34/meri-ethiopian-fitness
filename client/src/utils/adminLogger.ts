import { supabase } from '../lib/supabase';

export const logAdminActivity = async (adminId: string, action: string, details: any) => {
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert([{
        admin_id: adminId,
        action,
        details,
      }]);

    if (error) {
      // Silent error handling for admin logging
    }
  } catch (error) {
    // Silent error handling for admin logging
  }
};
