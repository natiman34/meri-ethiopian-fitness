import { FitnessPlan } from "../types/content";
/**
 * Parses fitness plan text into structured FitnessPlan objects with comprehensive error handling
 * @param rawText - The raw text containing fitness plan data
 * @param options - Configuration options for parsing
 * @returns ParseResult containing parsed plans and any errors/warnings
 *
 * @example
 * ```typescript
 * const result = parseFitnessPlanText(planText, {
 *   maxPlans: 10,
 *   validatePlans: true,
 *   defaultLevel: 'intermediate'
 * });
 *
 * if (result.errors.length > 0) {
 *   console.error('Parsing errors:', result.errors);
 * }
 *
 * console.log(`Parsed ${result.plans.length} plans`);
 * ```
 */
export function parseFitnessPlanText(rawText, options = {}) {
    const { maxPlans = 50, validatePlans = true, defaultDuration = 4, defaultLevel = 'intermediate', defaultCategory = 'strength' } = options;
    const plans = [];
    const errors = [];
    const warnings = [];
    // Input validation
    if (!rawText || typeof rawText !== 'string') {
        errors.push('Raw text is required and must be a string');
        return { plans, errors, warnings };
    }
    const trimmedText = rawText.trim();
    if (!trimmedText) {
        errors.push('Raw text cannot be empty');
        return { plans, errors, warnings };
    }
    try {
        const sections = trimmedText.split(/________________________________________\r?\n/);
        let currentPlan = {};
        let currentDay = {};
        let inWorkoutSection = false;
        let planCount = 0;
        for (const section of sections) {
            if (planCount >= maxPlans) {
                warnings.push(`Maximum plan limit (${maxPlans}) reached, skipping remaining sections`);
                break;
            }
            const lines = section.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length === 0) {
                continue;
            }
            const planTitleMatch = lines[0]?.match(/🏋️‍♂️\s*(.*?)\s*Workout Plan/);
            if (planTitleMatch) {
                // Save previous plan if it exists
                if (Object.keys(currentPlan).length > 0) {
                    try {
                        if (currentPlan.title && currentPlan.category && currentPlan.level && currentPlan.schedule) {
                            plans.push(new FitnessPlan(currentPlan));
                            planCount++;
                        }
                        else {
                            warnings.push(`Incomplete plan skipped: ${currentPlan.title || 'Unknown'}`);
                        }
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        errors.push(`Failed to create plan "${currentPlan.title}": ${errorMessage}`);
                    }
                }
                // Initialize new plan with defaults
                currentPlan = {
                    title: planTitleMatch[1]?.trim() || 'Untitled Plan',
                    description: "",
                    category: defaultCategory,
                    level: defaultLevel,
                    duration: defaultDuration,
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
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
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
                try {
                    if (line.startsWith("•\tFocus:")) {
                        currentPlan.description = line.replace("•\tFocus:", "").trim();
                    }
                    else if (line.startsWith("•\tDuration:")) {
                        const durationMatch = line.match(/(\d+)\s*days\/week/);
                        if (durationMatch) {
                            const weeklyWorkouts = parseInt(durationMatch[1], 10);
                            if (!isNaN(weeklyWorkouts) && weeklyWorkouts > 0) {
                                currentPlan.weekly_workouts = weeklyWorkouts;
                            }
                        }
                        const totalDurationMatch = lines.find(l => l.includes("Duration:") && !l.includes("days/week"))?.match(/Duration:\s*(\d+)\s*days/);
                        if (totalDurationMatch) {
                            const duration = parseInt(totalDurationMatch[1], 10);
                            if (!isNaN(duration) && duration > 0) {
                                currentPlan.duration = duration;
                            }
                        }
                        else {
                            currentPlan.duration = defaultDuration;
                        }
                    }
                    else if (line.startsWith("•\tCardio:") && currentPlan.category === defaultCategory) {
                        if (currentPlan.title?.toLowerCase().includes("weight gain")) {
                            currentPlan.category = "weight-gain";
                        }
                        else if (currentPlan.title?.toLowerCase().includes("weight loss")) {
                            currentPlan.category = "weight-loss";
                        }
                    }
                    else if (line.startsWith("•\tRest Days:") && currentPlan.level === defaultLevel) {
                        const title = currentPlan.title?.toLowerCase() || '';
                        if (title.includes("beginner")) {
                            currentPlan.level = "beginner";
                        }
                        else if (title.includes("intermediate")) {
                            currentPlan.level = "intermediate";
                        }
                        else if (title.includes("advanced")) {
                            currentPlan.level = "advanced";
                        }
                    }
                    else if (line.startsWith("Day ")) {
                        // Save previous day if it exists
                        if (currentDay.day !== undefined) {
                            if (validatePlans && (!currentDay.exercises || currentDay.exercises.length === 0) && !currentDay.restDay) {
                                warnings.push(`Day ${currentDay.day} has no exercises and is not marked as rest day`);
                            }
                            currentPlan.schedule?.push(currentDay);
                        }
                        const dayMatch = line.match(/Day (\d+):\s*(.*)/);
                        if (dayMatch) {
                            const dayNumber = parseInt(dayMatch[1], 10);
                            const dayDescription = dayMatch[2]?.trim() || '';
                            if (isNaN(dayNumber) || dayNumber < 1) {
                                warnings.push(`Invalid day number in line: ${line}`);
                                continue;
                            }
                            currentDay = {
                                day: dayNumber,
                                restDay: dayDescription.toLowerCase().includes("rest") ||
                                    dayDescription.toLowerCase().includes("recovery"),
                                exercises: [],
                                totalEstimatedTime: 0,
                                focusAreas: [],
                            };
                        }
                        else {
                            warnings.push(`Could not parse day line: ${line}`);
                        }
                    }
                    else if (line.startsWith("•\t") && !currentDay.restDay) {
                        const exerciseLine = line.substring(2).trim();
                        const exerciseMatch = exerciseLine.match(/(.*?)\s*–\s*(\d+x\d+(?:-\d+)?(?:\s*sec|\s*min)?(?:\s*each leg)?)/);
                        if (exerciseMatch) {
                            const name = exerciseMatch[1]?.trim();
                            const setsRepsDuration = exerciseMatch[2]?.trim();
                            if (!name || !setsRepsDuration) {
                                warnings.push(`Invalid exercise format in line: ${line}`);
                                continue;
                            }
                            let sets = [];
                            let duration;
                            try {
                                if (setsRepsDuration.includes("x")) {
                                    const [s, r] = setsRepsDuration.split("x");
                                    const numSets = parseInt(s, 10);
                                    let numReps = parseInt(r.replace(/each leg|sec|min/gi, "").trim(), 10);
                                    if (isNaN(numSets) || numSets < 1) {
                                        warnings.push(`Invalid sets number in exercise: ${name}`);
                                        continue;
                                    }
                                    if (r.includes("sec") || r.includes("min")) {
                                        duration = r.trim();
                                        numReps = 0;
                                    }
                                    else if (isNaN(numReps) || numReps < 0) {
                                        warnings.push(`Invalid reps number in exercise: ${name}`);
                                        continue;
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
                                }
                                else if (setsRepsDuration.includes("sec") || setsRepsDuration.includes("min")) {
                                    duration = setsRepsDuration;
                                    sets.push({
                                        setNumber: 1,
                                        setType: 'working',
                                        reps: 0,
                                        restTime: 60,
                                        duration: duration,
                                    });
                                }
                                else {
                                    const reps = parseInt(setsRepsDuration, 10);
                                    if (isNaN(reps) || reps < 0) {
                                        warnings.push(`Invalid reps format in exercise: ${name}`);
                                        continue;
                                    }
                                    sets.push({
                                        setNumber: 1,
                                        setType: 'working',
                                        reps: reps,
                                        restTime: 60,
                                    });
                                }
                            }
                            catch (error) {
                                warnings.push(`Failed to parse exercise sets for: ${name}`);
                                continue;
                            }
                            // Collect description from following lines
                            let description = "";
                            let nextLineIndex = i + 1;
                            while (nextLineIndex < lines.length &&
                                !lines[nextLineIndex].startsWith("•\t") &&
                                !lines[nextLineIndex].startsWith("Day ")) {
                                description += " " + lines[nextLineIndex];
                                nextLineIndex++;
                            }
                            description = description.trim();
                            // Generate unique exercise ID
                            const exerciseId = `${currentPlan.title?.toLowerCase().replace(/\s+/g, '-') || 'plan'}-${currentDay.day}-e${(currentDay.exercises?.length || 0) + 1}`;
                            currentDay.exercises?.push({
                                id: exerciseId,
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
                        }
                        else if (line.includes("Cardio:") || line.includes("Core Focus:")) {
                            const cardioDetails = line.replace("•\tCardio:", "").replace("•\tCore Focus:", "").trim();
                            const isCardio = line.includes("Cardio:");
                            const exerciseId = `${currentPlan.title?.toLowerCase().replace(/\s+/g, '-') || 'plan'}-${currentDay.day}-${isCardio ? 'cardio' : 'core'}${(currentDay.exercises?.length || 0) + 1}`;
                            currentDay.exercises?.push({
                                id: exerciseId,
                                name: isCardio ? "Cardio" : "Core Workout",
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
                                category: isCardio ? "cardio" : "strength",
                                instructions: [],
                                tips: [],
                                commonMistakes: [],
                                variations: [],
                                estimatedTime: 0,
                                caloriesBurn: undefined,
                                muscleGroup: "full-body",
                            });
                        }
                        else {
                            warnings.push(`Could not parse exercise line: ${line}`);
                        }
                    }
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    errors.push(`Error parsing line "${line}": ${errorMessage}`);
                }
            }
        }
        // Save the last plan if it exists
        if (Object.keys(currentPlan).length > 0) {
            try {
                if (currentPlan.title && currentPlan.category && currentPlan.level && currentPlan.schedule) {
                    // Add the last day if it exists
                    if (currentDay.day !== undefined) {
                        if (validatePlans && (!currentDay.exercises || currentDay.exercises.length === 0) && !currentDay.restDay) {
                            warnings.push(`Day ${currentDay.day} has no exercises and is not marked as rest day`);
                        }
                        currentPlan.schedule.push(currentDay);
                    }
                    plans.push(new FitnessPlan(currentPlan));
                }
                else {
                    warnings.push(`Incomplete final plan skipped: ${currentPlan.title || 'Unknown'}`);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                errors.push(`Failed to create final plan "${currentPlan.title}": ${errorMessage}`);
            }
        }
        // Assign images based on category and level with error handling
        plans.forEach((plan, index) => {
            try {
                if (plan.category === "weight-loss") {
                    if (plan.level === "beginner") {
                        plan.image_url = "https://images.unsplash.com/photo-1579234857723-5e20ac7d756e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }
                    else if (plan.level === "intermediate") {
                        plan.image_url = "https://images.unsplash.com/photo-1546483864-3298c50c1822?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }
                    else if (plan.level === "advanced") {
                        plan.image_url = "https://images.unsplash.com/photo-1594892484433-f542a170562e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }
                }
                else if (plan.category === "weight-gain") {
                    if (plan.level === "beginner") {
                        plan.image_url = "https://images.unsplash.com/photo-1594892484433-f542a170562e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }
                    else if (plan.level === "intermediate") {
                        plan.image_url = "https://images.unsplash.com/photo-1546483864-3298c50c1822?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }
                    else if (plan.level === "advanced") {
                        plan.image_url = "https://images.unsplash.com/photo-1579234857723-5e20ac7d756e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                    }
                }
            }
            catch (error) {
                warnings.push(`Failed to assign image to plan ${index + 1}: ${plan.title}`);
            }
        });
        // Validation if requested
        if (validatePlans) {
            plans.forEach((plan, index) => {
                if (!plan.schedule || plan.schedule.length === 0) {
                    warnings.push(`Plan "${plan.title}" has no scheduled days`);
                }
                if (plan.weekly_workouts === 0) {
                    warnings.push(`Plan "${plan.title}" has no weekly workouts specified`);
                }
                const workoutDays = plan.schedule.filter(day => !day.restDay);
                if (workoutDays.length === 0) {
                    warnings.push(`Plan "${plan.title}" has no workout days`);
                }
            });
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
        errors.push(`Critical parsing error: ${errorMessage}`);
    }
    return { plans, errors, warnings };
}
