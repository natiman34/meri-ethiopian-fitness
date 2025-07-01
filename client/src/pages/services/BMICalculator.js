import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Calculator, Scale, TrendingUp, AlertCircle, CheckCircle, Info } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
const BMICalculator = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [unit, setUnit] = useState("metric");
    const [result, setResult] = useState(null);
    const [showNutritionTips, setShowNutritionTips] = useState(false);
    const calculateBMI = () => {
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        if (!weightNum || !heightNum || weightNum <= 0 || heightNum <= 0) {
            return;
        }
        let bmi;
        if (unit === "metric") {
            // BMI = weight (kg) / height² (m²)
            const heightInMeters = heightNum / 100;
            bmi = weightNum / (heightInMeters * heightInMeters);
        }
        else {
            // BMI = (weight (lbs) / height² (inches²)) × 703
            bmi = (weightNum / (heightNum * heightNum)) * 703;
        }
        const bmiResult = getBMICategory(bmi);
        setResult(bmiResult);
        setShowNutritionTips(true);
    };
    const getBMICategory = (bmi) => {
        if (bmi < 18.5) {
            return {
                bmi,
                category: "Underweight",
                healthRisk: "Increased risk of nutritional deficiency and osteoporosis",
                color: "text-blue-600",
                recommendations: [
                    "Consult with a healthcare provider about healthy weight gain",
                    "Focus on nutrient-dense, calorie-rich foods",
                    "Include strength training to build muscle mass",
                    "Consider working with a registered dietitian"
                ]
            };
        }
        else if (bmi >= 18.5 && bmi < 25) {
            return {
                bmi,
                category: "Normal Weight",
                healthRisk: "Low risk of weight-related health problems",
                color: "text-green-600",
                recommendations: [
                    "Maintain current healthy lifestyle",
                    "Continue balanced diet and regular exercise",
                    "Focus on overall fitness and well-being",
                    "Regular health check-ups for prevention"
                ]
            };
        }
        else if (bmi >= 25 && bmi < 30) {
            return {
                bmi,
                category: "Overweight",
                healthRisk: "Increased risk of cardiovascular disease and diabetes",
                color: "text-yellow-600",
                recommendations: [
                    "Aim for gradual weight loss of 1-2 pounds per week",
                    "Increase physical activity to 150+ minutes per week",
                    "Focus on portion control and balanced nutrition",
                    "Consider consulting a healthcare provider"
                ]
            };
        }
        else {
            return {
                bmi,
                category: "Obese",
                healthRisk: "High risk of serious health complications",
                color: "text-red-600",
                recommendations: [
                    "Consult healthcare provider for comprehensive weight management plan",
                    "Consider medically supervised weight loss program",
                    "Focus on sustainable lifestyle changes",
                    "Address underlying health conditions"
                ]
            };
        }
    };
    const nutritionTips = [
        {
            title: "Balanced Macronutrients",
            description: "Aim for 45-65% carbohydrates, 20-35% fats, and 10-35% protein",
            icon: _jsx(Scale, { className: "h-5 w-5 text-green-500" })
        },
        {
            title: "Hydration",
            description: "Drink at least 8 glasses of water daily, more if you're active",
            icon: _jsx(TrendingUp, { className: "h-5 w-5 text-blue-500" })
        },
        {
            title: "Portion Control",
            description: "Use smaller plates and listen to your body's hunger cues",
            icon: _jsx(CheckCircle, { className: "h-5 w-5 text-purple-500" })
        },
        {
            title: "Whole Foods",
            description: "Choose minimally processed foods rich in nutrients",
            icon: _jsx(Info, { className: "h-5 w-5 text-orange-500" })
        }
    ];
    const clearCalculation = () => {
        setHeight("");
        setWeight("");
        setResult(null);
        setShowNutritionTips(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 pt-24 pb-16", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "BMI Calculator" }), _jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Calculate your Body Mass Index and get personalized health recommendations with integrated nutrition guidance" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs(Card, { className: "p-8", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Calculator, { className: "h-6 w-6 text-blue-500 mr-3" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Calculate Your BMI" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Measurement System" }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: () => setUnit("metric"), className: `px-4 py-2 rounded-lg font-medium transition-colors ${unit === "metric"
                                                            ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                                                            : "bg-gray-100 text-gray-700 border-2 border-gray-200"}`, children: "Metric (kg/cm)" }), _jsx("button", { onClick: () => setUnit("imperial"), className: `px-4 py-2 rounded-lg font-medium transition-colors ${unit === "imperial"
                                                            ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                                                            : "bg-gray-100 text-gray-700 border-2 border-gray-200"}`, children: "Imperial (lbs/in)" })] })] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Height (", unit === "metric" ? "cm" : "inches", ")"] }), _jsx("input", { type: "number", value: height, onChange: (e) => setHeight(e.target.value), placeholder: unit === "metric" ? "170" : "68", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Weight (", unit === "metric" ? "kg" : "lbs", ")"] }), _jsx("input", { type: "number", value: weight, onChange: (e) => setWeight(e.target.value), placeholder: unit === "metric" ? "70" : "154", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Button, { onClick: calculateBMI, className: "flex-1", disabled: !height || !weight, children: "Calculate BMI" }), _jsx(Button, { onClick: clearCalculation, variant: "outline", className: "flex-1", children: "Clear" })] }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-blue-800 mb-2", children: "BMI Formula:" }), _jsx("p", { className: "text-sm text-blue-700", children: unit === "metric"
                                                    ? "BMI = Weight (kg) ÷ Height² (m²)"
                                                    : "BMI = (Weight (lbs) ÷ Height² (inches²)) × 703" })] })] }), _jsx(Card, { className: "p-8", children: result ? (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Scale, { className: "h-6 w-6 text-green-500 mr-3" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Your Results" })] }), _jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: `text-4xl font-bold ${result.color} mb-2`, children: result.bmi.toFixed(1) }), _jsx("div", { className: `text-xl font-semibold ${result.color} mb-2`, children: result.category }), _jsx("p", { className: "text-gray-600 text-sm", children: result.healthRisk })] }), _jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-3", children: "BMI Categories:" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Underweight:" }), _jsx("span", { className: "text-blue-600", children: "< 18.5" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Normal weight:" }), _jsx("span", { className: "text-green-600", children: "18.5 - 24.9" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Overweight:" }), _jsx("span", { className: "text-yellow-600", children: "25.0 - 29.9" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Obese:" }), _jsx("span", { className: "text-red-600", children: "\u2265 30.0" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-3", children: "Recommendations:" }), _jsx("ul", { className: "space-y-2", children: result.recommendations.map((rec, index) => (_jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm text-gray-600", children: rec })] }, index))) })] })] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(Calculator, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "Enter your height and weight to calculate your BMI" })] })) })] }), showNutritionTips && (_jsxs("div", { className: "mt-12", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 text-center mb-8", children: "Nutrition Tips for Optimal Health" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: nutritionTips.map((tip, index) => (_jsxs(Card, { className: "p-6 text-center", children: [_jsx("div", { className: "flex justify-center mb-4", children: tip.icon }), _jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: tip.title }), _jsx("p", { className: "text-sm text-gray-600", children: tip.description })] }, index))) })] })), _jsx("div", { className: "mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg", children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-yellow-600 mr-3 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-yellow-800 mb-2", children: "Important Note" }), _jsx("p", { className: "text-yellow-700 text-sm", children: "BMI is a screening tool and doesn't directly measure body fat or health. It may not be accurate for athletes, elderly, or those with high muscle mass. Always consult with healthcare professionals for comprehensive health assessment." })] })] }) })] }) }) }));
};
export default BMICalculator;
