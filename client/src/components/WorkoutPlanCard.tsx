import React from 'react';
import { FitnessPlan } from '../types/content';
import { Calendar, Clock, Target, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkoutPlanCardProps {
  plan: FitnessPlan;
  variant?: 'default' | 'featured' | 'compact';
  showStats?: boolean;
}

const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({
  plan,
  variant = 'default',
  showStats = true
}) => {
  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (variant === 'compact') {
    return (
      <Link to={`/services/fitness-plans/${plan.id}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
          <div className="relative h-32">
            <img
              src={plan.image_url || "/images/placeholders/workout.jpg"}
              alt={plan.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 truncate">{plan.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{plan.duration} weeks</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{plan.weekly_workouts} days/week</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/services/fitness-plans/${plan.id}`}>
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
          <div className="relative h-64">
            <img
              src={plan.image_url || "/images/placeholders/workout.jpg"}
              alt={plan.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-xl mb-2">{plan.title}</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{plan.duration}</div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{plan.weekly_workouts}</div>
                <div className="text-sm text-gray-600">Days/Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{plan.difficulty}/5</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>
            {showStats && plan.rating && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex mr-2">{getDifficultyStars(plan.rating)}</div>
                  <span className="text-sm text-gray-600">({plan.reviewCount || 0} reviews)</span>
                </div>
                {plan.completionRate && (
                  <div className="text-sm text-green-600 font-semibold">
                    {plan.completionRate}% completion rate
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/services/fitness-plans/${plan.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
        <div className="relative h-48">
          <img
            src={plan.image_url || "/images/placeholders/workout.jpg"}
            alt={plan.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{plan.title}</h3>
          
          {showStats && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                <span>{plan.duration} weeks</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                <span>{plan.weekly_workouts} days/week</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Target className="h-4 w-4 mr-2 text-purple-600" />
                <span>Difficulty {plan.difficulty}/5</span>
              </div>
              {plan.estimated_calories_burn && (
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-2 text-red-600" />
                  <span>{plan.estimated_calories_burn} cal/week</span>
                </div>
              )}
            </div>
          )}

          {showStats && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {plan.rating ? (
                <div className="flex items-center">
                  <div className="flex mr-2">{getDifficultyStars(plan.rating)}</div>
                  <span className="text-sm text-gray-600">({plan.reviewCount || 0})</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No ratings yet</div>
              )}
              {plan.completionRate && (
                <div className="text-sm text-green-600 font-semibold">
                  {plan.completionRate}% completion
                </div>
              )}
            </div>
          )}

          {showStats && plan.goals && plan.goals.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {plan.goals.slice(0, 3).map((goal, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {goal}
                  </span>
                ))}
                {plan.goals.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{plan.goals.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WorkoutPlanCard; 