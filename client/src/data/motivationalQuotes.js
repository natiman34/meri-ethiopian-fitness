export const motivationalQuotes = [
    {
        id: "jim-ryun-motivation",
        text: "Motivation is what gets you started, habit is what keeps you going.",
        author: "Jim Ryun",
        category: "habits",
        tags: ["motivation", "habits", "consistency"]
    },
    {
        id: "rome-patience",
        text: "Rome wasn't built in a day. The same thing applies when establishing healthy lifestyle habits!",
        author: "Fitness Wisdom",
        category: "perseverance",
        tags: ["patience", "habits", "progress"]
    },
    {
        id: "endorphins-benefits",
        text: "You almost always feel better after exercise - it can release feel-good endorphins.",
        author: "Health Expert",
        category: "motivation",
        tags: ["exercise", "benefits", "mood"]
    },
    {
        id: "body-positivity",
        text: "Making a conscious choice to put your health first is a huge step towards true body positivity!",
        author: "Wellness Coach",
        category: "mindset",
        tags: ["health", "body-positivity", "self-care"]
    },
    {
        id: "self-compassion",
        text: "Be kind to yourself as you try to adjust. If you have a bad week, that's okay!",
        author: "Self-Care Advocate",
        category: "self-care",
        tags: ["self-compassion", "mindset", "forgiveness"]
    },
    {
        id: "balance-perfection",
        text: "The trick is to aim for balance, not for perfection.",
        author: "Fitness Philosophy",
        category: "mindset",
        tags: ["balance", "perfection", "realistic-goals"]
    },
    {
        id: "small-changes",
        text: "Even small changes like adding a gentle walk into your day can improve how you feel.",
        author: "Movement Advocate",
        category: "progress",
        tags: ["small-steps", "walking", "improvement"]
    },
    {
        id: "journey-begins",
        text: "The journey of a thousand miles begins with one step. Your fitness transformation starts with the decision to begin.",
        author: "Ancient Wisdom",
        category: "motivation",
        tags: ["beginning", "transformation", "decision"]
    },
    {
        id: "expert-beginner",
        text: "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown.",
        author: "Success Philosophy",
        category: "perseverance",
        tags: ["beginnings", "growth", "expertise"]
    },
    {
        id: "future-self",
        text: "Your future self will thank you for the healthy choices you make today.",
        author: "Time Wisdom",
        category: "motivation",
        tags: ["future", "choices", "gratitude"]
    },
    {
        id: "therapeutic-workout",
        text: "If you're feeling a bit down or angry, you may be surprised as to how therapeutic a workout can be.",
        author: "Mental Health Advocate",
        category: "motivation",
        tags: ["therapy", "emotions", "mental-health"]
    },
    {
        id: "reality-check",
        text: "While it's great to feel excited and ready to start something new, you have to be realistic about how long the feeling will last!",
        author: "Realistic Fitness",
        category: "mindset",
        tags: ["realism", "expectations", "planning"]
    }
];
// Helper functions to get quotes by category
export const getQuotesByCategory = (category) => {
    return motivationalQuotes.filter(quote => quote.category === category);
};
export const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
};
export const getRandomQuoteByCategory = (category) => {
    const categoryQuotes = getQuotesByCategory(category);
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    return categoryQuotes[randomIndex] || motivationalQuotes[0];
};
export const fitnessTips = [
    {
        id: "follow-plan",
        title: "Don't rely on how you feel — follow a plan",
        description: "Try not to skip your workouts just because you 'don't feel like it'. Exercise can release feel-good endorphins, so you almost always feel better after it.",
        category: "practical",
        actionSteps: [
            "Create a weekly workout schedule",
            "Set up your workout gear the night before",
            "Start with just 10 minutes if you're not feeling motivated",
            "Remember that you usually feel better after exercising"
        ]
    },
    {
        id: "small-changes",
        title: "Make small changes",
        description: "Instead of trying to change everything at once, make one or two small changes and build from there.",
        category: "habits",
        actionSteps: [
            "Choose one small habit to focus on first",
            "Once it feels routine, add another small change",
            "Start with walking once or twice a week",
            "Gradually add resistance training sessions"
        ]
    },
    {
        id: "accountability",
        title: "Make yourself accountable",
        description: "Share your exercise routine with friends or family to help you stay on track.",
        category: "motivation",
        actionSteps: [
            "Find a workout buddy",
            "Share your goals with friends and family",
            "Join online fitness communities",
            "Schedule regular check-ins with your support system"
        ]
    },
    {
        id: "positive-mindset",
        title: "Think positive and be kind to yourself",
        description: "Be patient with yourself and focus on progress, not perfection.",
        category: "mindset",
        actionSteps: [
            "Set realistic, achievable goals",
            "Celebrate small victories",
            "Don't focus on what you did 'wrong'",
            "Keep a fitness journal to track progress"
        ]
    }
];
export const getFitnessTipsByCategory = (category) => {
    return fitnessTips.filter(tip => tip.category === category);
};
