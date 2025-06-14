import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand and Description */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <div className="font-bold text-xl flex items-center">
                <span className="text-red-500">መሪ</span>
                <span className="text-yellow-500">Ethiopian</span>
                <span className="text-green-500">Fitness</span>
                <span className="ml-2 text-white"></span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Embrace health and fitness through Ethiopian culture. We provide culturally relevant nutrition and fitness
              guidance to help you achieve your wellness goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/bmi" className="text-gray-400 hover:text-white transition-colors">
                  BMI Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
