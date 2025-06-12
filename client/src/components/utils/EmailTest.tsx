import React, { useState } from 'react'
import EmailService from '../../services/EmailService'
import Button from '../ui/Button'
import Card from '../ui/Card'

const EmailTest: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [config, setConfig] = useState<any>(null)

  const emailService = EmailService.getInstance()

  const testEmailService = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      const isAvailable = await emailService.isEmailServiceAvailable()
      const emailConfig = emailService.getEmailConfig()
      
      setConfig(emailConfig)
      
      if (isAvailable) {
        setResult('✅ Email service is available and properly configured')
      } else {
        setResult('❌ Email service is not available')
      }
    } catch (error) {
      setResult(`❌ Error testing email service: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testPasswordReset = async () => {
    if (!email) {
      setResult('❌ Please enter an email address')
      return
    }

    setIsLoading(true)
    setResult('')
    
    try {
      await emailService.sendPasswordResetEmail(email)
      setResult(`✅ Password reset email sent successfully to ${email}`)
    } catch (error: any) {
      setResult(`❌ Failed to send password reset email: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <Card.Body>
        <h3 className="text-lg font-semibold mb-4">Email Service Test</h3>
        
        <div className="space-y-4">
          <div>
            <Button 
              onClick={testEmailService} 
              isLoading={isLoading}
              variant="secondary"
            >
              Test Email Service
            </Button>
          </div>

          {config && (
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium mb-2">Configuration:</h4>
              <pre className="text-sm text-gray-600">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter email to test password reset"
            />
          </div>

          <div>
            <Button 
              onClick={testPasswordReset} 
              isLoading={isLoading}
              variant="primary"
            >
              Test Password Reset Email
            </Button>
          </div>

          {result && (
            <div className={`p-3 rounded ${
              result.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {result}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default EmailTest 