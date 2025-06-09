import React from "react"
import { Link } from "react-router-dom"

const NutritionPlans: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Nutrition Plans</h1>
        <p className="mt-4">This is the Nutrition Plans page. Content will be added soon.</p>
        <ul className="mt-4">
          <li>
            <Link to="/services/nutrition/1">Nutrition Plan 1</Link>
          </li>
          <li>
            <Link to="/services/nutrition/2">Nutrition Plan 2</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NutritionPlans
