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
      console.error('Error logging admin activity:', error);
    }
  } catch (error) {
    console.error('Error in logAdminActivity:', error);
  }
};
