"use client"

import { useState, useEffect } from "react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import { Search, Filter, Mail, Check, AlertCircle } from "lucide-react"
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface FeedbackItem {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  content: string;
  rating: number | null;
  created_at: string;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { session } = useAuth();

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, full_name, email, content, rating, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (err: any) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback. ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter feedback based on search term
  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">User Feedback</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          Loading feedback...
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Status */}
            <div className="text-right md:text-center col-span-2">
              <span className="text-gray-600">
                Showing {filteredFeedback.length} of {feedback.length} feedback items
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((item) => (
            <Card key={item.id} className="border-gray-100">
              <Card.Body className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                        <Mail size={18} className="text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.full_name}</h3>
                      <p className="text-sm text-gray-600">{item.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
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