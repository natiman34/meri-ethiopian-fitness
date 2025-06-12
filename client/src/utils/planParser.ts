import { FitnessPlan } from "../types/content";
import { FitnessPlan as IFitnessPlan, DaySchedule, Exercise, FitnessCategory, FitnessLevel, ExerciseSet } from "../types/content";
import { FitnessPlan as FitnessPlanModel } from "../models/FitnessPlan";

export function parseFitnessPlanText(rawText: string): FitnessPlanModel[] {
  const plans: FitnessPlanModel[] = [];
  const sections = rawText.split(/________________________________________\r\n/);

  let currentPlan: Partial<IFitnessPlan> = {};
  let currentDay: Partial<DaySchedule> = {};
  let inWorkoutSection = false;

  for (const section of sections) {
    const lines = section.split(/\r\n|\n/).map(line => line.trim()).filter(line => line.length > 0);

    const planTitleMatch = lines[0]?.match(/🏋️‍♂️\s*(.*?)\s*Workout Plan/);
    if (planTitleMatch) {
      if (Object.keys(currentPlan).length > 0) {
        // Push the previous plan if it exists
        if (currentPlan.title && currentPlan.category && currentPlan.level && currentPlan.schedule) {
          plans.push(new FitnessPlanModel(currentPlan as IFitnessPlan));
        }
      }
      currentPlan = {
        title: planTitleMatch[1],
        description: "", // Will be filled later
        category: "strength",
        level: "beginner",
        duration: 0,
        weekly_workouts: 0,
        difficulty: 1,
        prerequisites: [],
        equipment: [],
        goals: [],
        schedule: [],
        status: "published",
        image_url: "",
        tags: [],
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        muscleGroups: [],
        equipmentRequired: [],
        intensity: 'low',
      };
      inWorkoutSection = true;
      continue;
    }

    if (!inWorkoutSection) {
      continue;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("•\tFocus:")) {
        currentPlan.description = line.replace("•\tFocus:", "").trim();
      } else if (line.startsWith("•\tDuration:")) {
        const durationMatch = line.match(/(\d+)\s*days\/week/);
        if (durationMatch) {
          currentPlan.weekly_workouts = parseInt(durationMatch[1], 10);
        }
        const totalDurationMatch = lines.find(l => l.includes("Duration:") && !l.includes("days/week"))?.match(/Duration:\s*(\d+)\s*days/);
        if (totalDurationMatch) {
            currentPlan.duration = parseInt(totalDurationMatch[1], 10);
        } else {
            // Assign a default or infer if needed. Assuming 4 weeks for now if not specified.
            currentPlan.duration = 4; // Default to 4 weeks if not specified
        }
      } else if (line.startsWith("•\tCardio:") && currentPlan.category === undefined) {
        if (currentPlan.title?.includes("Weight Gain")) {
          currentPlan.category = "weight-gain";
        } else if (currentPlan.title?.includes("Weight Loss")) {
          currentPlan.category = "weight-loss";
        }
      } else if (line.startsWith("•\tRest Days:") && currentPlan.level === undefined) {
        if (currentPlan.title?.includes("Beginner")) {
          currentPlan.level = "beginner";
        } else if (currentPlan.title?.includes("Intermediate")) {
          currentPlan.level = "intermediate";
        } else if (currentPlan.title?.includes("Advanced")) {
          currentPlan.level = "advanced";
        } else {
            // Infer from workout content if possible, or set a default.
            // For now, default to intermediate if not explicitly stated.
            currentPlan.level = "intermediate";
        }
      } else if (line.startsWith("Day ")) {
        if (currentDay.day !== undefined) {
          currentPlan.schedule?.push(currentDay as DaySchedule);
        }
        const dayMatch = line.match(/Day (\d+):\s*(.*)/);
        if (dayMatch) {
          currentDay = {
            day: parseInt(dayMatch[1], 10),
            restDay: dayMatch[2].includes("Rest") || dayMatch[2].includes("Recovery"),
            exercises: [],
            totalEstimatedTime: 0,
            focusAreas: [],
          };
        }
      } else if (line.startsWith("•\t") && !currentDay.restDay) {
        const exerciseLine = line.substring(2).trim();
        const exerciseMatch = exerciseLine.match(/(.*?)\s*–\s*(\d+x\d+(?:-\d+)?(?:\s*sec|\s*min)?(?:\s*each leg)?)/);
        if (exerciseMatch) {
          const name = exerciseMatch[1].trim();
          const setsRepsDuration = exerciseMatch[2].trim();
          let sets: ExerciseSet[] = [];
          let duration: string | undefined;

          if (setsRepsDuration.includes("x")) {
            const [s, r] = setsRepsDuration.split("x");
            const numSets = parseInt(s, 10);
            let numReps = parseInt(r.replace("each leg", "").trim(), 10);
            if (r.includes("sec") || r.includes("min")) {
              duration = r;
              numReps = 0;
            }
            for (let j = 1; j <= numSets; j++) {
              sets.push({
                setNumber: j,
                setType: 'working',
                reps: numReps,
                restTime: 60,
                duration: duration,
              });
            }
          } else if (setsRepsDuration.includes("sec") || setsRepsDuration.includes("min")) {
            duration = setsRepsDuration;
            sets.push({
              setNumber: 1,
              setType: 'working',
              reps: 0,
              restTime: 60,
              duration: duration,
            });
          } else {
              sets.push({
                setNumber: 1,
                setType: 'working',
                reps: parseInt(setsRepsDuration, 10),
                restTime: 60,
              });
          }
          
          let description = "";
          let nextLineIndex = i + 1;
          while (nextLineIndex < lines.length && !lines[nextLineIndex].startsWith("•\t") && !lines[nextLineIndex].startsWith("Day ")) {
              description += " " + lines[nextLineIndex];
              nextLineIndex++;
          }
          description = description.trim();

          currentDay.exercises?.push({
            id: `${currentPlan.title?.toLowerCase().replace(/\s/g, '-')}-${currentDay.day}-e${currentDay.exercises.length + 1}`,
            name: name,
            description: description,
            image: '',
            gifUrl: '',
            videoUrl: undefined,
            steps: [],
            sets: sets,
            equipment: [],
            targetMuscles: [],
            secondaryMuscles: [],
            difficulty: "intermediate",
            category: "strength",
            instructions: [],
            tips: [],
            commonMistakes: [],
            variations: [],
            estimatedTime: 0,
            caloriesBurn: undefined,
            muscleGroup: "full-body",
          });
        } else if (line.includes("Cardio:") || line.includes("Core Focus:")) {
            const cardioDetails = line.replace("•\tCardio:", "").replace("•\tCore Focus:", "").trim();
            currentDay.exercises?.push({
                id: `${currentPlan.title?.toLowerCase().replace(/\s/g, '-')}-${currentDay.day}-cardio${currentDay.exercises.length + 1}`,
                name: line.includes("Cardio:") ? "Cardio" : "Core Workout",
                description: cardioDetails,
                image: '',
                gifUrl: '',
                videoUrl: undefined,
                steps: [],
                sets: [],
                equipment: [],
                targetMuscles: [],
                secondaryMuscles: [],
                difficulty: "intermediate",
                category: line.includes("Cardio:") ? "cardio" : "strength",
                instructions: [],
                tips: [],
                commonMistakes: [],
                variations: [],
                estimatedTime: 0,
                caloriesBurn: undefined,
                muscleGroup: "full-body",
            });
        }
      }
    }
  }

  // Push the last plan
  if (Object.keys(currentPlan).length > 0) {
    if (currentPlan.title && currentPlan.category && currentPlan.level && currentPlan.schedule) {
      plans.push(new FitnessPlanModel(currentPlan as IFitnessPlan));
    }
  }

  // Assign images based on category and level (example, you can customize these)
  plans.forEach(plan => {
    if (plan.category === "weight-loss") {
      if (plan.level === "beginner") plan.image_url = "https://images.unsplash.com/photo-1579234857723-5e20ac7d756e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      else if (plan.level === "intermediate") plan.image_url = "https://images.unsplash.com/photo-1546483864-3298c50c1822?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      else if (plan.level === "advanced") plan.image_url = "https://images.unsplash.com/photo-1594892484433-f542a170562e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    } else if (plan.category === "weight-gain") {
      if (plan.level === "beginner") plan.image_url = "https://images.unsplash.com/photo-1594892484433-f542a170562e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      else if (plan.level === "intermediate") plan.image_url = "https://images.unsplash.com/photo-1546483864-3298c50c1822?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      else if (plan.level === "advanced") plan.image_url = "https://images.unsplash.com/photo-1579234857723-5e20ac7d756e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    // Add more conditions for other categories/levels as needed
  });

  return plans;
}