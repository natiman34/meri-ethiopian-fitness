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
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
          <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Have questions about our services or need personalized advice? Reach out to our team and we'll get back to
            you as soon as possible.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card>
                <Card.Body>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-green-600 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800"></h3>
                        <p className="text-gray-600 mt-1"></p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-green-600 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800"></h3>
                        <p className="text-gray-600 mt-1"></p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-green-600 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800"></h3>
                        <p className="text-gray-600 mt-1"></p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3"></h3>
                    <p className="text-gray-600"></p>
                    <p className="text-gray-600"></p>
                    <p className="text-gray-600"></p>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <Card.Body>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>

                  {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      ></textarea>
                    </div>

                    <Button type="submit" variant="primary" isLoading={isSubmitting} rightIcon={<Send size={16} />}>
                      Send Message
                    </Button>
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
