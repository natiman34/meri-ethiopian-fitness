import React from 'react';
import { Link } from 'react-router-dom';
import { NutritionPlan } from "../types/content";
import { Star, Clock, Heart, Scale } from 'lucide-react';


interface NutritionPlanCardProps {
  plan: NutritionPlan;
  variant?: 'default' | 'featured' | 'compact';
  showStats?: boolean;
}

const categoryConfig: Record<string, {
  color: string;
  icon: string;
  description: string;
}> = {
  'weight-loss': {
    color: "bg-blue-100 text-blue-800",
    icon: "🔥",
    description: "Plans focused on burning calories and fat loss"
  },
  'weight-gain': {
    color: "bg-purple-100 text-purple-800",
    icon: "💪",
    description: "Plans focused on muscle building and weight gain"
  },
  'maintenance': {
    color: "bg-green-100 text-green-800",
    icon: "⚖️",
    description: "Plans focused on maintaining current fitness level"
  },
  'muscle-building': {
    color: "bg-red-100 text-red-800",
    icon: "🏋️",
    description: "Plans focused on building strength and muscle mass"
  },
  'endurance-training': {
    color: "bg-yellow-100 text-yellow-800",
    icon: "🧘",
    description: "Plans focused on improving flexibility and mobility"
  },
  'endurance': {
    color: "bg-orange-100 text-orange-800",
    icon: "🏃",
    description: "Plans focused on building cardiovascular endurance"
  },
  'functional': {
    color: "bg-teal-100 text-teal-800",
    icon: "⚡",
    description: "Plans focused on functional movements and athletic performance"
  }
};

const NutritionPlanCard: React.FC<NutritionPlanCardProps> = ({
  plan,
  variant = 'default',
  showStats = false,
}) => {
  const displayCategory = categoryConfig[plan.category] || {
    color: "bg-gray-100 text-gray-800",
    icon: "🍽️",
    description: "General nutrition plan"
  };

  const cardClasses = {
    default: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300",
    featured: "bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 relative",
    compact: "bg-white rounded-lg shadow-sm flex items-center p-4 hover:shadow-md transition-shadow duration-300",
  };

  const renderContent = () => (
    <>
      {variant === 'featured' && (
        <div className="bg-gradient-to-r from-green-400 to-green-500 p-3 text-center">
          <div className="flex items-center justify-center text-white">
            <Star className="h-4 w-4 mr-2 fill-current" />
            <span className="font-semibold">Featured Plan</span>
          </div>
        </div>
      )}
      {variant !== 'compact' && (
        <div className="p-2 bg-gray-50 border-b">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${displayCategory.color}`}>
            {displayCategory.icon} {plan.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </span>
        </div>
      )}
      <div className={variant === 'featured' ? "p-6" : "p-4"}>
        <h3 className={`font-semibold mb-2 ${variant === 'featured' ? "text-xl" : "text-lg"}`}>
          {plan.title}
        </h3>
        {variant !== 'compact' && (
          <p className={`text-sm mb-3 ${variant === 'featured' ? "text-green-100" : "text-gray-600"} line-clamp-2`}>
            {plan.description}
          </p>
        )}

        {showStats && (
          <div className={`flex items-center justify-between text-sm ${variant === 'featured' ? "text-green-100" : "text-gray-500"} mt-3`}>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{plan.duration} days</span>
            </div>
            <div className="flex items-center">
              <Scale className="h-3 w-3 mr-1" />
              <span>{plan.calorieRange.min}-{plan.calorieRange.max} kcal</span>
            </div>
          </div>
        )}

        {variant === 'featured' && plan.features && (
          <div className="mt-4">
            <ul className="text-green-100 text-sm space-y-1">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <Heart className="h-3 w-3 mr-2 fill-current text-green-300" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {variant === 'compact' && (
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold text-gray-900">{plan.title}</h3>
            {showStats && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>{plan.duration} days</span>
                <Scale className="h-3 w-3 ml-4 mr-1" />
                <span>{plan.calorieRange.min}-{plan.calorieRange.max} kcal</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (variant === 'compact') {
    return (
      <Link to={`/services/nutrition-plans/${plan.id}`} className={cardClasses[variant]}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <Link to={`/services/nutrition-plans/${plan.id}`} className={cardClasses[variant]}>
      {renderContent()}
    </Link>
  );
};

export default NutritionPlanCard; 