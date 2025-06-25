"use client"

import { useState, useEffect } from "react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { Search, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { FeedbackService } from '../../services/FeedbackService'
import useMobileFeatures from '../../hooks/useMobileFeatures'
import '../../styles/mobile-feedback.css'

interface FeedbackItem {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  content: string;
  rating: number | null;
  is_resolved: boolean;
  reply_message: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'resolved' | 'unresolved'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const feedbackService = FeedbackService.getInstance()

  // Mobile features
  const {
    isMobile,
    isTablet,
    containerRef,
    isPulling,
    isRefreshing,
    completeRefresh,
    triggerHapticFeedback
  } = useMobileFeatures({
    enablePullToRefresh: true,
    enableSwipe: true
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const feedbackData = await feedbackService.getAllFeedback()
      setFeedback(feedbackData.map(item => ({
        id: item.id,
        user_id: item.userId,
        full_name: item.name,
        email: item.email,
        content: item.content,
        rating: item.rating,
        is_resolved: item.resolved,
        reply_message: item.replyMessage,
        resolved_at: item.resolvedAt?.toISOString() || null,
        created_at: item.date.toISOString(),
        updated_at: item.updatedAt.toISOString()
      })))
    } catch (err: any) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback. ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMarkResolved = async (feedbackId: string) => {
    setActionLoading(feedbackId)
    try {
      await feedbackService.markFeedbackAsResolved(feedbackId)
      await fetchFeedback() // Refresh the list
    } catch (err: any) {
      setError('Failed to mark feedback as resolved: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkUnresolved = async (feedbackId: string) => {
    setActionLoading(feedbackId)
    try {
      await feedbackService.markFeedbackAsUnresolved(feedbackId)
      await fetchFeedback() // Refresh the list
    } catch (err: any) {
      setError('Failed to mark feedback as unresolved: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }



  // Filter feedback based on search term and status
  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'resolved' && item.is_resolved) ||
      (filterStatus === 'unresolved' && !item.is_resolved)

    return matchesSearch && matchesStatus
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle pull to refresh
  const handleRefresh = async () => {
    triggerHapticFeedback('light')
    await fetchFeedback()
    completeRefresh()
  }

  // Use refresh when pull to refresh is triggered
  useEffect(() => {
    if (isRefreshing) {
      handleRefresh()
    }
  }, [isRefreshing])

  return (
    <div ref={containerRef} className="p-4 sm:p-6 admin-feedback-container">
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white text-center py-2 text-sm">
          <RefreshCw className="inline-block w-4 h-4 mr-2 animate-spin" />
          Pull to refresh...
        </div>
      )}

      <div className="flex justify-between items-center mb-4 sm:mb-6 admin-feedback-header">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 admin-feedback-title">User Feedback Management</h2>
        {(isMobile || isTablet) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center min-h-[44px] px-3 py-2"
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm sm:text-base">
          Loading feedback...
        </div>
      )}

      {/* Filters */}
      <Card className="mb-4 sm:mb-6">
        <Card.Body className="p-3 sm:p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedback by name, email, or content..."
                className="pl-10 py-3 pr-4 w-full text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-2">
                <span className="text-sm font-medium text-gray-700 block sm:inline">Filter by status:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                    className="min-h-[44px] px-3 py-2"
                  >
                    All ({feedback.length})
                  </Button>
                  <Button
                    variant={filterStatus === 'unresolved' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilterStatus('unresolved')}
                    className="flex items-center min-h-[44px] px-3 py-2"
                  >
                    <Clock size={14} className="mr-1" />
                    <span className="hidden sm:inline">Unresolved</span>
                    <span className="sm:hidden">Pending</span>
                    <span className="ml-1">({feedback.filter(f => !f.is_resolved).length})</span>
                  </Button>
                  <Button
                    variant={filterStatus === 'resolved' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilterStatus('resolved')}
                    className="flex items-center min-h-[44px] px-3 py-2"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Resolved ({feedback.filter(f => f.is_resolved).length})
                  </Button>
                </div>
              </div>

              <span className="text-sm text-gray-600 text-center sm:text-left">
                Showing {filteredFeedback.length} of {feedback.length} feedback items
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Feedback List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((item) => (
            <Card key={item.id} className={`border-gray-100 ${item.is_resolved ? 'bg-green-50' : 'bg-white'}`}>
              <Card.Body className="p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Header Section */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.is_resolved ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {item.is_resolved ? (
                            <CheckCircle size={18} className="text-green-600" />
                          ) : (
                            <Clock size={18} className="text-orange-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{item.full_name}</h3>
                            <p className="text-sm text-gray-600 truncate">{item.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              item.is_resolved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {item.is_resolved ? 'Resolved' : 'Unresolved'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">{item.content}</p>
                    {item.rating && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < item.rating! ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reply Message Display */}
                  {item.reply_message && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-blue-800">Admin Reply</span>
                        {item.resolved_at && (
                          <span className="text-xs text-blue-600 ml-2">
                            • {new Date(item.resolved_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-700 whitespace-pre-wrap">{item.reply_message}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2">

                    {item.is_resolved ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkUnresolved(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex items-center justify-center min-h-[44px] px-4 py-2"
                      >
                        {actionLoading === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        ) : (
                          <XCircle size={14} className="mr-2" />
                        )}
                        <span className="hidden sm:inline">Mark Unresolved</span>
                        <span className="sm:hidden">Unresolved</span>
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleMarkResolved(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex items-center justify-center min-h-[44px] px-4 py-2"
                      >
                        {actionLoading === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle size={14} className="mr-2" />
                        )}
                        <span className="hidden sm:inline">Mark Resolved</span>
                        <span className="sm:hidden">Resolved</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Card>
            <Card.Body className="p-4 text-center text-gray-500">
              No feedback found matching your search criteria.
            </Card.Body>
          </Card>
        )}
      </div>


    </div>
  )
}

export default AdminFeedback