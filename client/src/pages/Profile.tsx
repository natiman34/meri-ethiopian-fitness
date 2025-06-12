"use client"

import React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth, User as AuthUserType } from "../contexts/AuthContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { User, Mail, Edit2, Save, X, Ruler, Scale, Dumbbell, Flame, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parse } from 'date-fns'
import { supabase } from '../lib/supabase'

// Helper function to get days for the calendar view (includes surrounding days)
const getCalendarDays = (date: Date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)

  // Get the day of the week for the first day of the month (0 for Sunday, 6 for Saturday)
  // Adjust for Monday start (ISO 8601)
  const firstDayOfWeek = (start.getDay() + 6) % 7
  // Get the day of the week for the last day of the month
  const lastDayOfWeek = (end.getDay() + 6) % 7

  // Calculate start date to display (include days from previous month)
  const startDate = new Date(start)
  startDate.setDate(start.getDate() - firstDayOfWeek)

  // Calculate end date to display (include days from next month)
  const endDate = new Date(end)
  endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek)) // Ensure the last day is Sunday in the grid

  return eachDayOfInterval({ start: startDate, end: endDate })
}

const Profile: React.FC = () => {
  const { user, updateProfile, isLoading: authLoading, authError } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || "",
  })

  // State for activities data fetched from backend
  const [activities, setActivities] = useState<{[key: string]: any[]}>({})
  // State for loading/error when fetching activities
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // State for saving activities
  const [isSavingActivity, setIsSavingActivity] = useState(false)
  const [saveActivityError, setSaveActivityError] = useState<string | null>(null)
  const [saveActivitySuccess, setSaveActivitySuccess] = useState<string | null>(null)

  useEffect(() => {
    setFormData({
      name: user?.name || "",
  })
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (!user?.id) {
        throw new Error('User not found')
      }

      const updates: Partial<AuthUserType> = {
        name: formData.name,
      }

      await updateProfile(updates)

        setSuccessMessage('Profile updated successfully!')

      setIsEditing(false)
    } catch (err: any) {
      console.error('Profile update error:', err)
      setError(authError?.message || err.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setFormData({
      name: user?.name || "",
    })
    setIsEditing(false)
    setError('')
    setSuccessMessage('')
  }

  const getBmiCategory = (bmi: number | null) => {
    if (bmi === null) return 'N/A'
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 24.9) return 'Normal weight'
    if (bmi < 29.9) return 'Overweight'
    return 'Obese'
  }

  // *** Activity Calendar and Tracking Logic ***

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth])

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  // Function to save an activity to the database
  const saveActivityToDatabase = async (date: Date, activityDetails: any) => {
    if (!user) {
      console.error('Cannot save activity: User not logged in.')
      setSaveActivityError('You must be logged in to save activities.')
      return
    }

    setIsSavingActivity(true)
    setSaveActivityError(null)
    setSaveActivitySuccess(null)

    console.log('Saving activity:', { date: format(date, 'yyyy-MM-dd'), userId: user.id, ...activityDetails })

    try {
      const { data, error } = await supabase
        .from('activities') // Your activities table name
        .insert([
          {
            user_id: user.id,
            date: format(date, 'yyyy-MM-dd'),
            type: activityDetails.type || 'general', // Example
            details: activityDetails.details || {}, // Example
          }
        ])
        .select() // Use select() to get the inserted row data if needed

      if (error) throw error

      console.log('Activity saved successfully:', data)
      setSaveActivitySuccess('Activity saved successfully!')

      // Refresh activities after saving to update the calendar display
      fetchActivities() // Call the fetch function to get the latest data

    } catch (err: any) {
      console.error('Failed to save activity:', err)
      setSaveActivityError(`Failed to save activity: ${err.message || 'Unknown error'}`)
    } finally {
      setIsSavingActivity(false)
    }
  }

  const handleDayClick = (day: Date) => {
    console.log('Day clicked:', format(day, 'yyyy-MM-dd'))
    // TODO: In a real app, you would typically open a modal here
    // to get the details of the activity from the user.

    // For now, simulate adding a basic workout activity for the clicked day
    const simulatedActivity = { type: 'Workout', details: { name: 'Logged Workout', duration: 'Unknown' } }
    saveActivityToDatabase(day, simulatedActivity)
  }

  // Function to fetch activities for the current month
  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities({}) // Clear activities if no user
      setIsLoadingActivities(false)
      return
    }
    setIsLoadingActivities(true)
    setFetchError(null)

    const startOfMonthISO = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
    const endOfMonthISO = format(endOfMonth(currentMonth), 'yyyy-MM-dd')

    console.log(`Fetching activities for user ${user.id} from ${startOfMonthISO} to ${endOfMonthISO}`)

    try {
      const { data, error } = await supabase
        .from('activities') // Your activities table name
        .select('id, date, type, details') // Select relevant columns
        .eq('user_id', user.id)
        .gte('date', startOfMonthISO)
        .lte('date', endOfMonthISO)

      if (error) throw error

      // Process fetched data into a structure optimized for calendar display
      const groupedActivities: {[key: string]: any[]} = {}
      if (data) {
        data.forEach(activity => {
          // Ensure date is in YYYY-MM-DD format for consistency, use parse to handle potential different date formats from DB if needed
          const activityDate = format(parse(activity.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
          if (!groupedActivities[activityDate]) {
            groupedActivities[activityDate] = []
          }
          groupedActivities[activityDate].push(activity)
        })
      }
      setActivities(groupedActivities)
      console.log('Activities fetched and grouped:', groupedActivities)

    } catch (err: any) {
      console.error('Failed to fetch activities:', err)
      setFetchError(err.message || 'Failed to load activities.')
      setActivities({}) // Clear activities on error
    } finally {
      setIsLoadingActivities(false)
    }
  }, [currentMonth, user])

  // Effect to fetch activities when the component mounts, month, or user changes
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities]) // Depend on fetchActivities (memoized)

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-1 flex flex-col gap-6">
              <Card>
                <Card.Body className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <User size={64} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500 mb-4">{user?.role}</p>

                  <div className="w-full border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center mb-3">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600">{user?.email}</span>
                    </div>
                    {/* Only show BMI related info for standard users */}
                    {user?.role === 'user' && (
                      <>
                        <div className="flex items-center mb-3">
                          <Ruler size={16} className="text-gray-500 mr-2" />
                          <span className="text-gray-600">Height: {user?.height ? `${user.height} cm` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <Scale size={16} className="text-gray-500 mr-2" />
                          <span className="text-gray-600">Weight: {user?.weight ? `${user.weight} kg` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                          <span className="text-gray-600 font-semibold">BMI: {user?.bmi !== null && typeof user?.bmi === 'number' ? `${user.bmi.toFixed(2)} (${getBmiCategory(user.bmi)})` : 'N/A'}</span>
                        </div>
                        {!user?.bmi && (
                          <div className="mt-2 text-sm text-blue-600 italic">
                            Calculate your BMI in the BMI section.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>

               {/* New Progress Tracking Section - Styled like the example image */}
               {user?.role === 'user' && (
              <div className="mt-6">
                 <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
                  {/* 
                      TODO: Fetch and display actual user progress data here.
                      This might involve data from other tables (e.g., workouts, activity_log).
                      You'll need to implement the backend logic to aggregate this data
                      and fetch it when the profile page loads.
                  */}
                 <div className="flex justify-around items-center gap-6">
                     {/* Progress Item: Workouts */}
                     <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm flex-1 min-w-0">
                         <Dumbbell size={48} className="text-green-600 mb-2" />
                         <div className="text-3xl font-bold text-gray-900">0</div>
                         <div className="text-sm text-gray-600">Workouts</div>
                     </div>

                      {/* Progress Item: Calories */}
                     <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm flex-1 min-w-0">
                         <Flame size={48} className="text-orange-500 mb-2" />
                         <div className="text-3xl font-bold text-gray-900">0</div>
                         <div className="text-sm text-gray-600">Calories</div>
                    </div>
                     {/* Add more progress metrics as needed, using similar structure */}
                    </div>
              </div>
               )}

            </div>

            {
              /* Right Column: Personal Information and Activity */
            }
            <div className="md:col-span-2 flex flex-col gap-6">

              {
                /* Personal Information Section */
              }
              <Card>
                <Card.Body>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit2 size={16} />}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
                  )}
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">{successMessage}</div>
                  )}
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading || authLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div className="flex space-x-4">
                          <Button 
                            type="submit" 
                            disabled={isLoading || authLoading}
                            leftIcon={isLoading || authLoading ? null : <Save size={16} />}
                          >
                            {isLoading || authLoading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={cancelEdit}
                            disabled={isLoading || authLoading}
                            leftIcon={<X size={16} />}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Full Name:</p>
                        <p className="text-gray-900 font-semibold">{user?.name}</p>
                      </div>
                      {/* Only show BMI related info for standard users */}
                      {user?.role === 'user' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Height:</p>
                            <p className="text-gray-900 font-semibold">{user?.height ? `${user.height} cm` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Weight:</p>
                            <p className="text-gray-900 font-semibold">{user?.weight ? `${user.weight} kg` : 'N/A'}</p>
                          </div>
                      <div>
                            <p className="text-sm font-medium text-gray-700">BMI:</p>
                            <p className="text-gray-900 font-semibold">
                              {user?.bmi !== null && typeof user?.bmi === 'number' ? 
                                `${user?.bmi.toFixed(2)} (${getBmiCategory(user?.bmi)})` 
                                : 
                                'N/A'
                              }
                            </p>
                            {!user?.bmi && (
                              <p className="text-sm text-blue-600 italic mt-1">
                                Calculate your BMI in the BMI section.
                              </p>
                            )}
                      </div>
                        </>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Activity Calendar Section - Integrated from Activity.tsx */}
              {user?.role === 'user' && (
              <Card>
                <Card.Body className="p-6 md:p-8">
                  {/* Activity Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
                    <Button variant="outline" size="sm" onClick={() => console.log('See All Activities')} className="text-gray-600 hover:bg-gray-100">
                      SEE ALL
                    </Button>
                  </div>

                  {/* Calendar Header (Month Navigation) */}
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="ghost" size="icon" onClick={handlePreviousMonth} aria-label="Previous Month" className="text-gray-600 hover:bg-gray-200">
                      <ChevronLeft size={20} />
                    </Button>
                    <h3 className="text-base font-semibold text-gray-900">{format(currentMonth, 'MMMM, yyyy')}</h3>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Next Month" className="text-gray-600 hover:bg-gray-200">
                      <ChevronRight size={20} />
                    </Button>
                  </div>

                  {/* Loading/Error Message for Fetching */}
                  {isLoadingActivities ? (
                    <div className="text-center text-gray-600 py-4">Loading activities...</div>
                  ) : fetchError ? (
                    <div className="text-center text-red-600 py-4">Error: {fetchError}</div>
                  ) : (
                    <>
                      {/* Weekday Headers */}
                      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="pb-1">{day}</div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-px">
                        {days.map((day, index) => {
                          const dayNumber = format(day, 'd');
                          const fullDateISO = format(day, 'yyyy-MM-dd');
                          const isCurrentMonth = isSameMonth(day, currentMonth);
                          const today = isToday(day);
                          // Check if this day has activities based on fetched data
                          const hasActivity = activities[fullDateISO]?.length > 0;

                          return (
                            <div
                              key={index}
                              className={`flex flex-col items-center justify-center w-full aspect-square rounded-full cursor-pointer
                                               ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} 
                                               ${today ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'} 
                                               ${hasActivity ? 'border-2 border-green-600' : ''} 
                                               text-sm
                                               `}
                              onClick={() => handleDayClick(day)}
                              aria-label={`Day ${dayNumber} ${format(day, 'MMMM')}${hasActivity ? ', with activities' : ''}`}
                            >
                              <span>{dayNumber}</span>
                              {hasActivity && <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-0.5"></div>}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Add Activity Button */}
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      leftIcon={<Plus size={16} />}
                      onClick={() => {
                        console.log('Add Activity Button Clicked');
                        // For now, simulate adding an activity for today
                        const dateToSave = new Date();
                        const simulatedActivity = { type: 'Generic Activity', details: { description: 'Logged via Add Button' } };
                        saveActivityToDatabase(dateToSave, simulatedActivity);
                      }}
                      disabled={!user || isSavingActivity}
                      className="w-full justify-center text-gray-700 hover:bg-gray-100 border-gray-300"
                    >
                      {isSavingActivity ? 'Adding Activity...' : 'ADD ACTIVITY'}
                    </Button>
                    {!user && (
                      <p className="mt-2 text-sm text-blue-600 italic">Log in to track your activities.</p>
                    )}

                    {/* Saving feedback messages */}
                    {saveActivitySuccess && (
                      <p className="mt-2 text-sm text-green-600">{saveActivitySuccess}</p>
                    )}
                    {saveActivityError && (
                      <p className="mt-2 text-sm text-red-600">{saveActivityError}</p>
                    )}
                  </div>

                </Card.Body>
              </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
