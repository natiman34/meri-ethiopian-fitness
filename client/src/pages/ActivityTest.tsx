import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { activityProgressService } from '../services/ActivityProgressService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const ActivityTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Test dates
  const testDates = [
    '2024-01-15',
    '2024-01-16',
    '2024-01-17',
    '2024-01-18',
    '2024-01-19'
  ]

  // Load selected dates on component mount
  useEffect(() => {
    const loadDates = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        setError(null)
        console.log('ActivityTest: Loading selected dates for user:', user.id)
        
        const dates = await activityProgressService.loadSelectedDates(user.id)
        setSelectedDates(dates)
        console.log('ActivityTest: Loaded dates:', Array.from(dates))
        
        setSuccess(`Loaded ${dates.size} selected dates`)
      } catch (err) {
        console.error('ActivityTest: Error loading dates:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dates')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && user?.id) {
      loadDates()
    }
  }, [user?.id, isAuthenticated])

  const handleToggleDate = async (date: string) => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const newSelectedDates = new Set(selectedDates)
      if (newSelectedDates.has(date)) {
        newSelectedDates.delete(date)
        console.log('ActivityTest: Removed date:', date)
      } else {
        newSelectedDates.add(date)
        console.log('ActivityTest: Added date:', date)
      }

      console.log('ActivityTest: Saving dates:', Array.from(newSelectedDates))
      await activityProgressService.saveSelectedDates(user.id, newSelectedDates)
      
      setSelectedDates(newSelectedDates)
      setSuccess(`Successfully saved ${newSelectedDates.size} selected dates`)
      console.log('ActivityTest: Successfully saved dates')
      
    } catch (err) {
      console.error('ActivityTest: Error saving dates:', err)
      setError(err instanceof Error ? err.message : 'Failed to save dates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      console.log('ActivityTest: Clearing all dates')
      await activityProgressService.clearSelectedDates(user.id)
      
      setSelectedDates(new Set())
      setSuccess('Successfully cleared all selected dates')
      console.log('ActivityTest: Successfully cleared all dates')
      
    } catch (err) {
      console.error('ActivityTest: Error clearing dates:', err)
      setError(err instanceof Error ? err.message : 'Failed to clear dates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReload = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      console.log('ActivityTest: Reloading dates from database')
      const dates = await activityProgressService.loadSelectedDates(user.id)
      setSelectedDates(dates)
      setSuccess(`Reloaded ${dates.size} selected dates from database`)
      console.log('ActivityTest: Reloaded dates:', Array.from(dates))
      
    } catch (err) {
      console.error('ActivityTest: Error reloading dates:', err)
      setError(err instanceof Error ? err.message : 'Failed to reload dates')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <Card.Body className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity Test</h1>
            <p className="text-gray-600">Please log in to test activity progress functionality.</p>
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <Card.Body className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Progress Test</h1>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">User: {user?.name} ({user?.id})</p>
              <p className="text-gray-600">Selected dates: {selectedDates.size}</p>
            </div>

            {/* Status Messages */}
            {isLoading && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
                <p className="text-blue-800">Loading...</p>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4">
              <Button
                onClick={handleReload}
                disabled={isLoading}
                variant="outline"
              >
                Reload from DB
              </Button>
              <Button
                onClick={handleClearAll}
                disabled={isLoading || selectedDates.size === 0}
                variant="outline"
              >
                Clear All
              </Button>
            </div>

            {/* Test Dates */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {testDates.map(date => (
                <div
                  key={date}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedDates.has(date)
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleToggleDate(date)}
                >
                  <div className="text-center">
                    <p className="font-semibold">{date}</p>
                    <p className="text-sm text-gray-600">
                      {selectedDates.has(date) ? 'Selected' : 'Click to select'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Debug Info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <pre className="text-sm text-gray-700">
                {JSON.stringify({
                  userId: user?.id,
                  selectedDatesArray: Array.from(selectedDates),
                  selectedDatesCount: selectedDates.size,
                  isAuthenticated,
                  isLoading
                }, null, 2)}
              </pre>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ActivityTest
