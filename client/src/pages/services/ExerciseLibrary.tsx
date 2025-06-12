"use client"

import React, { useState, useEffect } from "react";
import { exercises } from "../../data/exercises";
import ExerciseGallery from "../../components/ExerciseGallery";
import ExerciseDetailModal from "../../components/ExerciseDetailModal";
import ExerciseCard from "../../components/ExerciseCard";
import { Exercise } from "../../types/content";
import { 
  Dumbbell, 
  Target, 
  Clock, 
  TrendingUp, 
  Filter,
  Grid,
  List,
  Search,
  Star,
  Users,
  Zap
} from "lucide-react";

const ExerciseLibrary: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>('grid');

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  // Get statistics
  const stats = {
    total: exercises.length,
    byDifficulty: {
      beginner: exercises.filter(e => e.difficulty === 'beginner').length,
      intermediate: exercises.filter(e => e.difficulty === 'intermediate').length,
      advanced: exercises.filter(e => e.difficulty === 'advanced').length,
    },
    byCategory: {
      strength: exercises.filter(e => e.category === 'strength').length,
      cardio: exercises.filter(e => e.category === 'cardio').length,
      flexibility: exercises.filter(e => e.category === 'flexibility').length,
      balance: exercises.filter(e => e.category === 'balance').length,
      plyometric: exercises.filter(e => e.category === 'plyometric').length,
    },
    byMuscleGroup: {
      chest: exercises.filter(e => e.muscleGroup === 'chest').length,
      back: exercises.filter(e => e.muscleGroup === 'back').length,
      legs: exercises.filter(e => e.muscleGroup === 'legs').length,
      shoulders: exercises.filter(e => e.muscleGroup === 'shoulders').length,
      arms: exercises.filter(e => e.muscleGroup === 'biceps' || e.muscleGroup === 'triceps').length,
      abs: exercises.filter(e => e.muscleGroup === 'abs').length,
      glutes: exercises.filter(e => e.muscleGroup === 'glutes').length,
      'full-body': exercises.filter(e => e.muscleGroup === 'full-body').length,
    }
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Exercise Library
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Discover our comprehensive collection of exercises with detailed instructions, 
              GIF demonstrations, and expert tips to help you achieve your fitness goals.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.total}</div>
                <div className="text-green-200">Total Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.byDifficulty.beginner}</div>
                <div className="text-green-200">Beginner</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.byDifficulty.intermediate}</div>
                <div className="text-green-200">Intermediate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{stats.byDifficulty.advanced}</div>
                <div className="text-green-200">Advanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {category.replace('-', ' ')}
                </h3>
                <div className="text-2xl font-bold text-green-600">{count}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(count / stats.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Muscle Group Overview */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Target Muscle Groups</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.byMuscleGroup).map(([muscle, count]) => (
            <div key={muscle} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-green-600 mb-1">{count}</div>
              <div className="text-sm text-gray-600 capitalize">
                {muscle.replace('-', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Exercises */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Exercises</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercises.slice(0, 8).map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              variant="detailed"
              onClick={() => handleExerciseClick(exercise)}
            />
          ))}
        </div>
      </div>

      {/* Full Exercise Gallery */}
      <div className="container mx-auto px-4">
        <ExerciseGallery
          exercises={exercises}
          title="Complete Exercise Library"
          showFilters={true}
          variant={viewMode}
        />
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExercise(null);
        }}
      />
    </div>
  );
};

export default ExerciseLibrary; 