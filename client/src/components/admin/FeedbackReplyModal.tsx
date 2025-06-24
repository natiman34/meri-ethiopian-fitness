"use client"

import { useState } from "react"
import { X, Send, Mail } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"

interface FeedbackReplyModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: {
    id: string
    full_name: string
    email: string
    content: string
    rating?: number | null
  } | null
  onSendReply: (feedbackId: string, replyMessage: string) => Promise<void>
  isLoading?: boolean
}

const FeedbackReplyModal: React.FC<FeedbackReplyModalProps> = ({
  isOpen,
  onClose,
  feedback,
  onSendReply,
  isLoading = false
}) => {
  const [replyMessage, setReplyMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const handleSendReply = async () => {
    if (!feedback || !replyMessage.trim()) {
      setError("Please enter a reply message")
      return
    }

    setIsSending(true)
    setError(null)

    try {
      await onSendReply(feedback.id, replyMessage.trim())
      setReplyMessage("")
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to send reply")
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    if (!isSending) {
      setReplyMessage("")
      setError(null)
      onClose()
    }
  }

  if (!isOpen || !feedback) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:rounded-lg sm:shadow-xl sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Reply to Feedback</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-2 -m-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} className="sm:hidden" />
            <X size={24} className="hidden sm:block" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1">
          {/* Original Feedback */}
          <Card className="mb-4 sm:mb-6 bg-gray-50">
            <Card.Body className="p-3 sm:p-4">
              <div className="mb-3">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{feedback.full_name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{feedback.email}</p>
              </div>
              <div className="mb-3">
                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">{feedback.content}</p>
              </div>
              {feedback.rating && (
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm text-gray-600 mr-2">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-base sm:text-lg ${
                          i < feedback.rating! ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Reply Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                id="replyMessage"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply to the user here..."
                rows={window.innerWidth < 640 ? 8 : 6}
                disabled={isSending}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                style={{ fontSize: '16px' }} // Prevents zoom on iOS
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                This message will be sent to {feedback.email}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSending}
            className="min-h-[48px] px-6 py-3 text-base font-medium order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            disabled={isSending || !replyMessage.trim()}
            className="flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-medium order-1 sm:order-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackReplyModal
