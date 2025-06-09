import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> & {
  Title: React.FC<CardTitleProps>
  Body: React.FC<CardBodyProps>
  Footer: React.FC<CardFooterProps>
} = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${
        hover ? "transition-all duration-200 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => {
  return <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>{children}</div>
}

Card.Title = CardTitle
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
