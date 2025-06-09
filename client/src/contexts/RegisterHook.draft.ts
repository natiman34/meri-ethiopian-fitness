import { supabase } from '../lib/supabase'
import { useState } from 'react'

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)

  const register = async (name: string, email: string, password: string): Promise<"success" | "confirm_email"> => {
    setIsLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      })

      if (authError) throw authError

      // If email confirmation is required, Supabase returns user but session is null
      if (!authData.session) {
        return "confirm_email"
      }

      // ...profile creation logic as before...
      // (keep your existing profile creation code here)

      return "success"
    } catch (error: any) {
      console.error("Registration error:", error)
      throw new Error(error?.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    isLoading
  }
}

export default Register