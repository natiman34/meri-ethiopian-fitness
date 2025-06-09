import React from "react"

export const Card: React.FC<{ children: React.ReactNode }> & { Body: React.FC<{ children: React.ReactNode }> } = ({ children }) => (
  <div className="bg-white shadow rounded-lg">{children}</div>
)

Card.Body = ({ children }) => (
  <div className="p-6">{children}</div>
)