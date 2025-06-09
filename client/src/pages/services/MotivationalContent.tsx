import React from "react"
import { Link } from "react-router-dom"

const MotivationalContent: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Motivational Content</h1>
        <p className="mt-4">This is the Motivational Content page. Content will be added soon.</p>
        <ul className="mt-4">
          <li>
            <Link to="/services/motivation/1">Motivational Resource 1</Link>
          </li>
          <li>
            <Link to="/services/motivation/2">Motivational Resource 2</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MotivationalContent
