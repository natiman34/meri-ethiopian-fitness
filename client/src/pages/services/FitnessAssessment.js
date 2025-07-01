import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Target, Activity, Scale, CheckCircle, ArrowRight, ArrowLeft, BarChart3 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
const FitnessAssessment = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [assessmentData, setAssessmentData] = useState({
        personalInfo: { age: "", gender: "", activityLevel: "" },
        measurements: { height: "", weight: "", restingHeartRate: "", bloodPressure: "" },
        fitnessTests: { pushUps: "", sitUps: "", flexibility: "", cardio: "" }
    });
    const [results, setResults] = useState(null);
    const steps = [
        { number: 1, title: "Personal Information", icon: _jsx(Target, { className: "h-5 w-5" }) },
        { number: 2, title: "Body Measurements", icon: _jsx(Scale, { className: "h-5 w-5" }) },
        { number: 3, title: "Fitness Tests", icon: _jsx(Activity, { className: "h-5 w-5" }) },
        { number: 4, title: "Results", icon: _jsx(BarChart3, { className: "h-5 w-5" }) }
    ];
    const updatePersonalInfo = (field, value) => {
        setAssessmentData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };
    const updateMeasurements = (field, value) => {
        setAssessmentData(prev => ({
            ...prev,
            measurements: { ...prev.measurements, [field]: value }
        }));
    };
    const updateFitnessTests = (field, value) => {
        setAssessmentData(prev => ({
            ...prev,
            fitnessTests: { ...prev.fitnessTests, [field]: value }
        }));
    };
    const calculateFitnessScores = () => {
        const age = parseInt(assessmentData.personalInfo.age);
        const gender = assessmentData.personalInfo.gender;
        const pushUps = parseInt(assessmentData.fitnessTests.pushUps);
        const sitUps = parseInt(assessmentData.fitnessTests.sitUps);
        const flexibility = parseInt(assessmentData.fitnessTests.flexibility);
        const cardioTime = parseFloat(assessmentData.fitnessTests.cardio);
        const scores = [];
        // Push-up assessment (Upper body strength)
        let pushUpRating = "Poor";
        let pushUpColor = "text-red-600";
        if (gender === "male") {
            if (age < 30) {
                if (pushUps >= 40) {
                    pushUpRating = "Excellent";
                    pushUpColor = "text-green-600";
                }
                else if (pushUps >= 30) {
                    pushUpRating = "Good";
                    pushUpColor = "text-blue-600";
                }
                else if (pushUps >= 20) {
                    pushUpRating = "Fair";
                    pushUpColor = "text-yellow-600";
                }
            }
            else if (age < 40) {
                if (pushUps >= 35) {
                    pushUpRating = "Excellent";
                    pushUpColor = "text-green-600";
                }
                else if (pushUps >= 25) {
                    pushUpRating = "Good";
                    pushUpColor = "text-blue-600";
                }
                else if (pushUps >= 15) {
                    pushUpRating = "Fair";
                    pushUpColor = "text-yellow-600";
                }
            }
        }
        else {
            if (age < 30) {
                if (pushUps >= 30) {
                    pushUpRating = "Excellent";
                    pushUpColor = "text-green-600";
                }
                else if (pushUps >= 20) {
                    pushUpRating = "Good";
                    pushUpColor = "text-blue-600";
                }
                else if (pushUps >= 10) {
                    pushUpRating = "Fair";
                    pushUpColor = "text-yellow-600";
                }
            }
            else if (age < 40) {
                if (pushUps >= 25) {
                    pushUpRating = "Excellent";
                    pushUpColor = "text-green-600";
                }
                else if (pushUps >= 15) {
                    pushUpRating = "Good";
                    pushUpColor = "text-blue-600";
                }
                else if (pushUps >= 8) {
                    pushUpRating = "Fair";
                    pushUpColor = "text-yellow-600";
                }
            }
        }
        scores.push({
            component: "Upper Body Strength",
            score: pushUps,
            rating: pushUpRating,
            color: pushUpColor,
            recommendations: [
                "Include push-ups, chest press, and shoulder exercises",
                "Progressive overload with increased repetitions",
                "Focus on proper form over quantity"
            ]
        });
        // Sit-up assessment (Core strength)
        let sitUpRating = "Poor";
        let sitUpColor = "text-red-600";
        if (sitUps >= 50) {
            sitUpRating = "Excellent";
            sitUpColor = "text-green-600";
        }
        else if (sitUps >= 35) {
            sitUpRating = "Good";
            sitUpColor = "text-blue-600";
        }
        else if (sitUps >= 20) {
            sitUpRating = "Fair";
            sitUpColor = "text-yellow-600";
        }
        scores.push({
            component: "Core Strength",
            score: sitUps,
            rating: sitUpRating,
            color: sitUpColor,
            recommendations: [
                "Add planks, crunches, and rotational exercises",
                "Focus on controlled movements",
                "Include functional core training"
            ]
        });
        // Flexibility assessment
        let flexRating = "Poor";
        let flexColor = "text-red-600";
        if (flexibility >= 15) {
            flexRating = "Excellent";
            flexColor = "text-green-600";
        }
        else if (flexibility >= 10) {
            flexRating = "Good";
            flexColor = "text-blue-600";
        }
        else if (flexibility >= 5) {
            flexRating = "Fair";
            flexColor = "text-yellow-600";
        }
        scores.push({
            component: "Flexibility",
            score: flexibility,
            rating: flexRating,
            color: flexColor,
            recommendations: [
                "Daily stretching routine (10-15 minutes)",
                "Include dynamic warm-up before exercise",
                "Consider yoga or Pilates classes"
            ]
        });
        // Cardiovascular assessment (1.5 mile run time)
        let cardioRating = "Poor";
        let cardioColor = "text-red-600";
        if (gender === "male") {
            if (cardioTime <= 10) {
                cardioRating = "Excellent";
                cardioColor = "text-green-600";
            }
            else if (cardioTime <= 12) {
                cardioRating = "Good";
                cardioColor = "text-blue-600";
            }
            else if (cardioTime <= 15) {
                cardioRating = "Fair";
                cardioColor = "text-yellow-600";
            }
        }
        else {
            if (cardioTime <= 12) {
                cardioRating = "Excellent";
                cardioColor = "text-green-600";
            }
            else if (cardioTime <= 14) {
                cardioRating = "Good";
                cardioColor = "text-blue-600";
            }
            else if (cardioTime <= 17) {
                cardioRating = "Fair";
                cardioColor = "text-yellow-600";
            }
        }
        scores.push({
            component: "Cardiovascular Endurance",
            score: cardioTime,
            rating: cardioRating,
            color: cardioColor,
            recommendations: [
                "Aim for 150+ minutes moderate cardio per week",
                "Include interval training 2-3 times per week",
                "Gradually increase duration and intensity"
            ]
        });
        return scores;
    };
    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
        if (currentStep === 3) {
            const scores = calculateFitnessScores();
            setResults(scores);
        }
    };
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const isStepComplete = (step) => {
        switch (step) {
            case 1:
                return !!(assessmentData.personalInfo.age && assessmentData.personalInfo.gender && assessmentData.personalInfo.activityLevel);
            case 2:
                return !!(assessmentData.measurements.height && assessmentData.measurements.weight && assessmentData.measurements.restingHeartRate);
            case 3:
                return !!(assessmentData.fitnessTests.pushUps && assessmentData.fitnessTests.sitUps && assessmentData.fitnessTests.flexibility && assessmentData.fitnessTests.cardio);
            default:
                return false;
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Comprehensive Fitness Assessment" }), _jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Complete evaluation of your physical fitness across multiple components with personalized recommendations" })] }), _jsx("div", { className: "mb-12", children: _jsx("div", { className: "flex justify-between items-center", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `flex items-center justify-center w-12 h-12 rounded-full border-2 ${currentStep >= step.number
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : "bg-white border-gray-300 text-gray-500"}`, children: currentStep > step.number ? (_jsx(CheckCircle, { className: "h-6 w-6" })) : (step.icon) }), _jsxs("div", { className: "ml-3 hidden sm:block", children: [_jsxs("p", { className: `text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-500"}`, children: ["Step ", step.number] }), _jsx("p", { className: `text-xs ${currentStep >= step.number ? "text-blue-500" : "text-gray-400"}`, children: step.title })] }), index < steps.length - 1 && (_jsx("div", { className: `w-16 h-0.5 ml-4 ${currentStep > step.number ? "bg-blue-500" : "bg-gray-300"}` }))] }, step.number))) }) }), _jsxs(Card, { className: "p-8 mb-8", children: [currentStep === 1 && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Personal Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Age" }), _jsx("input", { type: "number", value: assessmentData.personalInfo.age, onChange: (e) => updatePersonalInfo("age", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "Enter your age" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Gender" }), _jsxs("select", { value: assessmentData.personalInfo.gender, onChange: (e) => updatePersonalInfo("gender", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Select gender" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Current Activity Level" }), _jsxs("select", { value: assessmentData.personalInfo.activityLevel, onChange: (e) => updatePersonalInfo("activityLevel", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Select activity level" }), _jsx("option", { value: "sedentary", children: "Sedentary (little to no exercise)" }), _jsx("option", { value: "light", children: "Light (1-3 days per week)" }), _jsx("option", { value: "moderate", children: "Moderate (3-5 days per week)" }), _jsx("option", { value: "active", children: "Active (6-7 days per week)" }), _jsx("option", { value: "very-active", children: "Very Active (2x per day, intense workouts)" })] })] })] })] })), currentStep === 2 && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Body Measurements" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Height (cm)" }), _jsx("input", { type: "number", value: assessmentData.measurements.height, onChange: (e) => updateMeasurements("height", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "170" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Weight (kg)" }), _jsx("input", { type: "number", value: assessmentData.measurements.weight, onChange: (e) => updateMeasurements("weight", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "70" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Resting Heart Rate (bpm)" }), _jsx("input", { type: "number", value: assessmentData.measurements.restingHeartRate, onChange: (e) => updateMeasurements("restingHeartRate", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "70" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Blood Pressure (optional)" }), _jsx("input", { type: "text", value: assessmentData.measurements.bloodPressure, onChange: (e) => updateMeasurements("bloodPressure", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "120/80" })] })] })] })), currentStep === 3 && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Fitness Tests" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Push-ups (maximum in 1 minute)" }), _jsx("input", { type: "number", value: assessmentData.fitnessTests.pushUps, onChange: (e) => updateFitnessTests("pushUps", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "25" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sit-ups (maximum in 1 minute)" }), _jsx("input", { type: "number", value: assessmentData.fitnessTests.sitUps, onChange: (e) => updateFitnessTests("sitUps", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "30" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Sit-and-reach (cm)" }), _jsx("input", { type: "number", value: assessmentData.fitnessTests.flexibility, onChange: (e) => updateFitnessTests("flexibility", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "10" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "1.5 Mile Run Time (minutes)" }), _jsx("input", { type: "number", step: "0.1", value: assessmentData.fitnessTests.cardio, onChange: (e) => updateFitnessTests("cardio", e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "12.5" })] })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-blue-800 mb-2", children: "Test Instructions:" }), _jsxs("ul", { className: "text-sm text-blue-700 space-y-1", children: [_jsx("li", { children: "\u2022 Warm up properly before each test" }), _jsx("li", { children: "\u2022 Perform tests on separate days if needed" }), _jsx("li", { children: "\u2022 Use proper form for all exercises" }), _jsx("li", { children: "\u2022 Stop if you experience pain or discomfort" })] })] })] })] })), currentStep === 4 && results && (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Your Fitness Assessment Results" }), _jsx("div", { className: "space-y-6", children: results.map((result, index) => (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: result.component }), _jsxs("div", { className: "flex items-center mt-1", children: [_jsx("span", { className: "text-2xl font-bold mr-2", children: result.score }), _jsx("span", { className: `font-semibold ${result.color}`, children: result.rating })] })] }), _jsx("div", { className: `px-3 py-1 rounded-full text-sm font-medium ${result.rating === "Excellent" ? "bg-green-100 text-green-800" :
                                                                result.rating === "Good" ? "bg-blue-100 text-blue-800" :
                                                                    result.rating === "Fair" ? "bg-yellow-100 text-yellow-800" :
                                                                        "bg-red-100 text-red-800"}`, children: result.rating })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "Recommendations:" }), _jsx("ul", { className: "space-y-1", children: result.recommendations.map((rec, idx) => (_jsxs("li", { className: "flex items-start text-sm text-gray-600", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" }), rec] }, idx))) })] })] }, index))) })] }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsxs(Button, { onClick: prevStep, variant: "outline", disabled: currentStep === 1, className: "flex items-center", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Previous"] }), _jsxs(Button, { onClick: nextStep, disabled: currentStep === 4 || !isStepComplete(currentStep), className: "flex items-center", children: [currentStep === 3 ? "Calculate Results" : "Next", _jsx(ArrowRight, { className: "ml-2 h-4 w-4" })] })] })] }) }) }));
};
export default FitnessAssessment;
