"use client"

import type React from "react"
import { useParams } from "react-router-dom"

const EducationalContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Educational Content Detail</h1>
        <p className="mt-4">Viewing educational content with ID: {id}</p>
      </div>
    </div>
  )
}

export default EducationalContentDetail
