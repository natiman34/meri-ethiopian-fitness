import { supabase } from '../lib/supabase'

export interface Activity {
  id: string
  user_id: string
  date: string // 'yyyy-MM-dd' format
  type: 'workout' | 'cardio' | 'strength' | 'flexibility' | 'custom' | 'manual'
  details: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserActivityProgress {
  id: string
  user_id: string
  selected_dates: string[] // Array of date strings in 'yyyy-MM-dd' format
  created_at: string
  updated_at: string
}

export interface ActivityProgressData {
  activities: { [date: string]: Activity[] }
  selectedDates: Set<string>
}

/**
 * Service for managing user activity progress and manually selected activity days
 */
export class ActivityProgressService {
  
  /**
   * Save user's manually selected activity days to the database
   */
  public async saveSelectedDates(userId: string, selectedDates: Set<string>): Promise<void> {
    try {
      const datesArray = Array.from(selectedDates)

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error('Authentication error:', authError)
        throw new Error('Authentication failed. Please log in again.')
      }

      if (!user) {
        throw new Error('User not authenticated. Please log in.')
      }

      if (user.id !== userId) {
        throw new Error('User ID mismatch. Please log in again.')
      }

      console.log('ActivityProgressService: Attempting to save selected dates:', {
        userId,
        datesArray,
        authenticatedUserId: user.id,
        supabaseUrl: supabase.supabaseUrl,
        supabaseKey: supabase.supabaseKey ? 'present' : 'missing'
      })

      // Use upsert to either insert or update the user's activity progress
      const { data, error } = await supabase
        .from('user_activity_progress')
        .upsert({
          user_id: userId,
          selected_dates: datesArray
        }, {
          onConflict: 'user_id'
        })
        .select()

      if (error) {
        console.error('ActivityProgressService: Database error saving selected dates:', error)
        const errorMessage = error.message || error.details || error.hint || 'Unknown database error'
        throw new Error(`Failed to save activity progress: ${errorMessage}`)
      }

      console.log('ActivityProgressService: Successfully saved selected dates:', { datesArray, dbResponse: data })
    } catch (error) {
      console.error('Error in saveSelectedDates:', error)
      throw error
    }
  }

  /**
   * Load user's manually selected activity days from the database
   */
  public async loadSelectedDates(userId: string): Promise<Set<string>> {
    try {
      console.log('ActivityProgressService: Starting loadSelectedDates for user:', userId)

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error('ActivityProgressService: Authentication error:', authError)
        throw new Error('Authentication failed. Please log in again.')
      }

      if (!user) {
        console.error('ActivityProgressService: No authenticated user found')
        throw new Error('User not authenticated. Please log in.')
      }

      if (user.id !== userId) {
        console.error('ActivityProgressService: User ID mismatch:', { providedUserId: userId, authenticatedUserId: user.id })
        throw new Error('User ID mismatch. Please log in again.')
      }

      console.log('ActivityProgressService: Authentication verified, querying database for user:', userId)

      const { data, error } = await supabase
        .from('user_activity_progress')
        .select('selected_dates')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found, return empty set
          console.log('ActivityProgressService: No activity progress found for user, returning empty set')
          return new Set<string>()
        }
        console.error('ActivityProgressService: Database error loading selected dates:', error)
        const errorMessage = error.message || error.details || error.hint || 'Unknown database error'
        throw new Error(`Failed to load activity progress: ${errorMessage}`)
      }

      const selectedDates = new Set(data?.selected_dates || [])
      console.log('ActivityProgressService: Successfully loaded selected dates:', Array.from(selectedDates))
      return selectedDates
    } catch (error) {
      console.error('ActivityProgressService: Error in loadSelectedDates:', error)
      // Return empty set on error to prevent app crashes
      return new Set<string>()
    }
  }

  /**
   * Fetch activities for a specific date range
   */
  public async fetchActivities(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ [date: string]: Activity[] }> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('id, date, type, details, created_at, updated_at')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching activities:', error)
        throw new Error(`Failed to fetch activities: ${error.message}`)
      }

      // Group activities by date
      const groupedActivities: { [date: string]: Activity[] } = {}
      if (data) {
        data.forEach(activity => {
          const activityWithUserId = { ...activity, user_id: userId }
          if (!groupedActivities[activity.date]) {
            groupedActivities[activity.date] = []
          }
          groupedActivities[activity.date].push(activityWithUserId)
        })
      }

      console.log('Successfully fetched activities:', Object.keys(groupedActivities).length, 'days with activities')
      return groupedActivities
    } catch (error) {
      console.error('Error in fetchActivities:', error)
      throw error
    }
  }

  /**
   * Add a new activity
   */
  public async addActivity(
    userId: string,
    date: string,
    type: Activity['type'],
    details: Record<string, any> = {}
  ): Promise<Activity> {
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
        .single()

      if (error) {
        console.error('Error adding activity:', error)
        throw new Error(`Failed to add activity: ${error.message}`)
      }

      console.log('Successfully added activity:', data)
      return data as Activity
    } catch (error) {
      console.error('Error in addActivity:', error)
      throw error
    }
  }

  /**
   * Update an existing activity
   */
  public async updateActivity(
    activityId: string,
    updates: Partial<Pick<Activity, 'type' | 'details'>>
  ): Promise<Activity> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', activityId)
        .select()
        .single()

      if (error) {
        console.error('Error updating activity:', error)
        throw new Error(`Failed to update activity: ${error.message}`)
      }

      console.log('Successfully updated activity:', data)
      return data as Activity
    } catch (error) {
      console.error('Error in updateActivity:', error)
      throw error
    }
  }

  /**
   * Delete an activity
   */
  public async deleteActivity(activityId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)

      if (error) {
        console.error('Error deleting activity:', error)
        throw new Error(`Failed to delete activity: ${error.message}`)
      }

      console.log('Successfully deleted activity:', activityId)
    } catch (error) {
      console.error('Error in deleteActivity:', error)
      throw error
    }
  }

  /**
   * Get comprehensive activity progress data for a user and date range
   */
  public async getActivityProgressData(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ActivityProgressData> {
    try {
      // Fetch both activities and selected dates in parallel
      const [activities, selectedDates] = await Promise.all([
        this.fetchActivities(userId, startDate, endDate),
        this.loadSelectedDates(userId)
      ])

      return {
        activities,
        selectedDates
      }
    } catch (error) {
      console.error('Error in getActivityProgressData:', error)
      throw error
    }
  }

  /**
   * Clear all selected dates for a user
   */
  public async clearSelectedDates(userId: string): Promise<void> {
    try {
      await this.saveSelectedDates(userId, new Set<string>())
      console.log('Successfully cleared all selected dates for user:', userId)
    } catch (error) {
      console.error('Error in clearSelectedDates:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const activityProgressService = new ActivityProgressService()
