import { parseFitnessPlanText } from "../utils/planParser";
import { FitnessPlanService } from "../services/FitnessPlanService";
import fs from 'fs';
import path from 'path';
const FITNESS_PLANS_TEXT_PATH = path.resolve(__dirname, '../../fitness plans.txt');
async function importFitnessPlans() {
    try {
        const rawText = fs.readFileSync(FITNESS_PLANS_TEXT_PATH, 'utf-8');
        const fitnessPlans = parseFitnessPlanText(rawText);
        console.log(`Parsed ${fitnessPlans.length} fitness plans.`);
        for (const plan of fitnessPlans) {
            try {
                // Ensure plan status is set for publishing
                plan.status = "published";
                await FitnessPlanService.createFitnessPlan(plan);
                console.log(`Successfully imported plan: ${plan.title}`);
            }
            catch (error) {
                console.error(`Failed to import plan: ${plan.title}`, error);
            }
        }
        console.log("Fitness plan import process completed.");
    }
    catch (error) {
        console.error("Error during fitness plan import:", error);
    }
}
importFitnessPlans();
