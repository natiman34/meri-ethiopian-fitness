"use client"

import type React from "react"
import { useParams } from "react-router-dom"

const MotivationalContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Motivational Content Detail</h1>
        <p className="mt-4">Viewing motivational content with ID: {id}</p>
      </div>
    </div>
  )
}

export default MotivationalContentDetail
