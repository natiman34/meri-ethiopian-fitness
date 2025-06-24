"use client"

import type React from "react"
import { useState } from "react"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { FeedbackService } from "../services/FeedbackService"
import { useAuth } from "../contexts/AuthContext"

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { user } = useAuth(); // Get user from AuthContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(null)

    try {
      const feedbackService = FeedbackService.getInstance();
      const userId = user?.id || null; // Use authenticated user's ID if available
      const fullName = formData.name; // Use name from form for full_name
      const email = formData.email; // Use email from form
      const content = formData.message; // Use message from form for content
      const rating = null; // No rating in contact form

      await feedbackService.submitFeedback(userId, fullName, email, content, rating);

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error: any) {
      console.error("Error submitting feedback:", error);

      // Check if the error is related to row-level security policy
      if (error.message && (
        error.message.includes("row-level security policy") ||
        error.message.includes("violates row-level security") ||
        error.message.includes("RLS") ||
        error.message.includes("First register or login in order to send feedback")
      )) {
        setSubmitError("First register or login in order to send feedback.");
      } else {
        setSubmitError(error.message || "Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 text-center max-w-3xl mx-auto px-4">
            Have questions about our services or need personalized advice? Reach out to our team and we'll get back to
            you as soon as possible.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="h-full">
                <Card.Body className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Contact Information</h2>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">Visit Us</h3>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Addis Ababa, Ethiopia</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">Call Us</h3>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">+251 911 123 456</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-800">Email Us</h3>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">support@merifitness.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Business Hours</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 text-sm sm:text-base">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 text-sm sm:text-base">Sunday: Closed</p>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="h-full">
                <Card.Body className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Send Us a Message</h2>

                  {submitSuccess && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 text-green-700 rounded-md text-sm sm:text-base">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-700 rounded-md text-sm sm:text-base">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">Please provide as much detail as possible</p>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        rightIcon={<Send size={16} />}
                        className="w-full sm:w-auto min-h-[48px] px-6 py-3 text-base font-medium"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
