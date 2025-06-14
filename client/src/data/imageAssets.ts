// Image Assets for the Fitness Application
// This file contains URLs for all images and GIFs used throughout the application

export const imageAssets = {
  // Workout Plan Images
  workoutPlans: {
    intermediate: {
      muscleBuilding: "/images/plans/intermediate-muscle-building.jpg",
      endurance: "/images/plans/intermediate-endurance.jpg",
      powerlifting: "/images/plans/intermediate-powerlifting.jpg",
      "weight-gain": "/images/plans/intermediate-weight-gain.jpg",
      "weight-loss": "/images/plans/intermediate-weight-loss.jpg",
    },
    advanced: {
      bodybuilding: "/images/plans/advanced-bodybuilding.jpg",
      functional: "/images/plans/advanced-functional.jpg",
      crossfit: "/images/plans/advanced-crossfit.jpg",
      leg: "/images/plans/advanced-leg.jpg",
      fatBurning: "/images/plans/advanced-fat-burning.jpg",
    }
  },

  // Exercise GIFs and Images (using local paths now)
  exercises: {
    pushUp: {
      gif: "/images/exercises/push-up.gif",
      image: "/images/exercises/push-up.jpg",
      video: "/videos/sample-video.mp4"
    },
    squat: {
      gif: "/images/exercises/squat.gif",
      image: "/images/exercises/squat.jpg",
      video: "/videos/sample-video.mp4"
    },
    plank: {
      gif: "/images/exercises/plank.gif",
      image: "/images/exercises/plank.jpg",
      video: "/videos/sample-video.mp4"
    },
    burpee: {
      gif: "/images/exercises/burpee.gif",
      image: "/images/exercises/burpee.jpg",
      video: "/videos/sample-video.mp4"
    },
    mountainClimber: {
      gif: "/images/exercises/mountain-climber.gif",
      image: "/images/exercises/mountain-climber.jpg",
      video: "/videos/sample-video.mp4"
    },
    jumpingJack: {
      gif: "/images/exercises/jumping-jack.gif",
      image: "/images/exercises/jumping-jack.jpg",
      video: "/videos/sample-video.mp4"
    },
    lunge: {
      gif: "/images/exercises/lunge.gif",
      image: "/images/exercises/lunge.jpg",
      video: "/videos/sample-video.mp4"
    },
    benchPress: {
      gif: "/images/exercises/bench-press.gif",
      image: "/images/exercises/bench-press.jpg",
      video: "/videos/sample-video.mp4"
    }
  },

  // Category Images
  categories: {
    strength: "/images/categories/strength.jpg",
    cardio: "/images/categories/cardio.jpg",
    flexibility: "/images/categories/flexibility.jpg",
    balance: "/images/categories/balance.jpg",
    plyometric: "/images/categories/plyometric.jpg"
  },

  // New Fitness Category Images (for Jefit-like display)
  fitnessCategories: {
    home: "/images/categories/jefit-home.jpg",
    gym: "/images/categories/jefit-gym.jpg",
    men: "/images/categories/jefit-men.jpg",
    "muscle-building": "/images/categories/jefit-muscle-building.jpg",
    "fat-burning": "/images/categories/jefit-fat-burning.jpg",
    leg: "/images/categories/jefit-leg.jpg",
    // Add other categories as needed based on your FitnessCategory type
  },

  fitnessPlansCategories: {
    "weight-gain-workout": "/images/categories/weight-gain-workout.jpg",
    "weight-loss-workout": "/images/categories/weight-loss-workout.jpg",
  },

  // Muscle Group Images
  muscleGroups: {
    chest: "/images/muscle-groups/chest.jpg",
    back: "/images/muscle-groups/back.jpg",
    legs: "/images/muscle-groups/legs.jpg",
    shoulders: "/images/muscle-groups/shoulders.jpg",
    arms: "/images/muscle-groups/arms.jpg",
    abs: "/images/muscle-groups/abs.jpg",
    glutes: "/images/muscle-groups/glutes.jpg",
    'full-body': "/images/muscle-groups/full-body.jpg"
  },

  // Equipment Images
  equipment: {
    bodyweight: "/images/equipment/bodyweight.jpg",
    dumbbell: "/images/equipment/dumbbell.jpg",
    barbell: "/images/equipment/barbell.jpg",
    resistanceBand: "/images/equipment/resistance-band.jpg",
    yogaMat: "/images/equipment/yoga-mat.jpg"
  },

  // Placeholder Images
  placeholders: {
    exercise: "/images/placeholders/exercise.jpg",
    workout: "/images/placeholders/workout.jpg",
    plan: "/images/placeholders/plan.jpg",
    category: "/images/placeholders/category.jpg"
  },

  // Hero Images
  hero: {
    workoutPlans: "/images/hero/workout-plans.jpg",
    nutrition: "/images/hero/nutrition.jpg"
  },

  // Ethiopian Traditional Dishes
  ethiopianDishes: {
    genfo: "/images/ethiopian-dishes/genfo.jpg",
    injera: "/images/ethiopian-dishes/injera.jpg",
    kitfo: "/images/ethiopian-dishes/kitfo.jpg",
    shinbra: "/images/ethiopian-dishes/shinbra.jpg",
    fatira: "/images/ethiopian-dishes/fatira.jpg",
    abish: "/images/ethiopian-dishes/abish.jpg",
    dallen: "/images/ethiopian-dishes/dallen.jpg",
    ambaza: "/images/ethiopian-dishes/ambaza.jpg",
    gomen: "/images/ethiopian-dishes/gomen.jpg",
    misirWot: "/images/ethiopian-dishes/misir-wot.jpg",
    shiroWot: "/images/ethiopian-dishes/shiro-wot.jpg",
    doroWot: "/images/ethiopian-dishes/doro-wot.jpg",
    beraperat: "/images/ethiopian-dishes/beraperat.jpg",
    kashya: "/images/ethiopian-dishes/kashya.jpg",
    ititu: "/images/ethiopian-dishes/ititu.jpg",
    zengada: "/images/ethiopian-dishes/zengada.jpg",
    ajaja: "/images/ethiopian-dishes/ajaja.jpg",
    datta: "/images/ethiopian-dishes/datta.jpg"
  }
};

// Helper function to get exercise image
export const getExerciseImage = (exerciseId: string, type: 'gif' | 'image' | 'video' = 'image'): string => {
  const exercise = imageAssets.exercises[exerciseId as keyof typeof imageAssets.exercises];
  if (exercise) {
    return exercise[type];
  }
  return imageAssets.placeholders.exercise;
};

// Helper function to get category image
export const getCategoryImage = (category: string): string => {
  return imageAssets.categories[category as keyof typeof imageAssets.categories] || imageAssets.placeholders.category;
};

// Helper function to get muscle group image
export const getMuscleGroupImage = (muscleGroup: string): string => {
  return imageAssets.muscleGroups[muscleGroup as keyof typeof imageAssets.muscleGroups] || imageAssets.placeholders.exercise;
};

// Helper function to get workout plan image
export const getWorkoutPlanImage = (level: string, category: string): string => {
  const levelPlans = imageAssets.workoutPlans[level as keyof typeof imageAssets.workoutPlans];
  if (levelPlans) {
    const imageUrl = levelPlans[category as keyof typeof levelPlans] || imageAssets.placeholders.plan;
    console.log(`getWorkoutPlanImage: level=${level}, category=${category}, imageUrl=${imageUrl}`);
    return imageUrl;
  }
  const imageUrl = imageAssets.placeholders.plan;
  console.log(`getWorkoutPlanImage: level=${level}, category=${category}, imageUrl=${imageUrl} (placeholder)`);
  return imageUrl;
};

// Helper function to get Ethiopian dish image
export const getEthiopianDishImage = (dishName: string): string => {
  return imageAssets.ethiopianDishes[dishName as keyof typeof imageAssets.ethiopianDishes] || imageAssets.placeholders.plan;
};
