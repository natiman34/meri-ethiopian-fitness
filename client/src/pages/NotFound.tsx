import type React from "react"
import { Link } from "react-router-dom"
import Button from "../components/ui/Button"

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-bold text-green-600">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-6 text-gray-800">Page Not Found</h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Return to Homepage
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
