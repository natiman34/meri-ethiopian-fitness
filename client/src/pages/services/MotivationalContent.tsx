import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp, Heart, Target, TrendingUp, Calendar, Users, Star, Quote, ArrowRight, BookOpen, Lightbulb } from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import ImageWithFallback from "../../components/ImageWithFallback"
import { motivationalQuotes } from "../../data/motivationalQuotes"

// Content sections data
const contentSections = [
  {
    id: "what-is-motivation",
    title: "What is Fitness Motivation?",
    icon: <Lightbulb className="h-6 w-6" />,
    summary: "Understanding the driving force behind your fitness journey",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    content: `Fitness motivation is what drives you to exercise and focus on your health and wellbeing. However, it can be expressed in many different ways. Motivation might help to kick-start your healthy lifestyle. You may associate motivation with the excitement of buying new exercise gear, stocking your kitchen with healthy food, or creating a workout planner.

You might think of a conversation you had with a friend when you promised: "this time, we are going to stick with our workouts!". At the time you feel excited about making some healthy changes.

Then, reality hits. You might have had a long day with work or family, or you're tired and just want a day off. Whatever the reason, there is often a point where you lose your workout motivation. Your inner critic and the realities of life make it more and more difficult to get out of bed and go work out.

This is where the healthy habits you set up when you felt motivated need to kick in. Many people that start a new fitness program quit within a few weeks. While it's great to feel excited and ready to start something new, you have to be realistic about how long the feeling will last!`
  },
  {
    id: "workout-tips",
    title: "Workout Motivation Tips",
    icon: <Target className="h-6 w-6" />,
    summary: "Practical strategies to maintain your fitness routine",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    content: `Here are the best tips for creating healthy habits and achieving your fitness goals:

**Don't rely on how you feel — follow a plan**
I totally understand there are some moments in life where you just don't want to do anything, let alone get up and work out. While it's okay to have a rest day and to recognize there are some signs you shouldn't exercise that day, try not to skip your workouts just because you "don't feel like it".

One great thing about exercise is it can release feel-good endorphins, so you almost always feel better after it. If you're feeling a bit down or angry, you may be surprised as to how therapeutic a workout can be.

**Make small changes**
Getting out of a fitness rut can be challenging. One of the biggest problems I see are people trying to change multiple aspects of their life, like their diet and training routine, at the same time and feeling overwhelmed or giving up shortly after.

Instead, try making one or two small changes to start with. Once those behavior changes start to feel like part of your routine, make one or two more. For example, if exercise isn't a regular part of your week, then try starting small by going for a walk once or twice a week. Once you establish this as part of your routine, try adding in a resistance session once a week.

**You might try associating your training with something fun**
Like a workout playlist you really enjoy! If you are due to work out but you really just want to be outside, try to get out for a walk! Or you could take your session outdoors if you have the space.`
  },
  {
    id: "building-habits",
    title: "Building Sustainable Habits",
    icon: <Calendar className="h-6 w-6" />,
    summary: "Transform motivation into lasting lifestyle changes",
    image: "https://images.unsplash.com/photo-1434596922112-19c563067271?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    content: `Motivation can be affected by many different things, so there may be challenges or obstacles that affect your motivation to work out. That is why it's important you form healthy habits, rather than relying on feeling motivated.

**Create healthy lifestyle habits that you can follow**
This is one of the biggest tips to reach your fitness goals: create healthy lifestyle habits that you can follow. These habits will kick in when your motivation levels dip because working out or preparing healthy meals will be a part of your everyday routine.

**Developing habits for healthy eating or working out**
Can help you to follow these behaviors, even when your motivation is low. By doing your workouts even on days you don't feel like it, exercising can become second-nature to you and this can help to develop a habit.

**Start with small, manageable changes**
Don't try to rush in and do everything at once, as it may become difficult to maintain in the beginning. Even short workouts will get you moving towards your fitness goals.

**Focus on consistency over perfection**
It's better to do a 10-minute workout consistently than to plan for an hour-long session that you'll skip when life gets busy.`
  },
  {
    id: "mindset-matters",
    title: "The Power of Positive Mindset",
    icon: <Heart className="h-6 w-6" />,
    summary: "Cultivate the mental strength for lasting change",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    content: `Think positive and be kind to yourself throughout your fitness journey. Your mindset plays a crucial role in your success.

**Rome wasn't built in a day**
The same thing applies when establishing healthy lifestyle habits! It can take lots of small changes to add up to big results. Be kind to yourself as you try to adjust.

**Handle setbacks with grace**
If you have a bad week, that's okay! Don't focus on what you did "wrong" — choose a healthy mindset and focus on how you can improve the next week.

**Set realistic goals**
This is why it is so important to set realistic goals. Placing too much pressure on yourself can leave you feeling defeated, particularly if your efforts fall short. The trick is to aim for balance, not for perfection.

**Celebrate small victories**
Setting smaller short-term goals can help you maintain a sense of progress along the way to your major goal. Making a conscious choice to put your health first is a huge step towards true body positivity!

**Focus on how you feel**
Even small changes like adding a gentle walk into your day can improve how you feel. Keeping a fitness journal can help you to see how far you've come, even if you feel like your goal is still a long way off.`
  }
]

const MotivationalContent: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [readingProgress, setReadingProgress] = useState(0)

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const currentQuote = motivationalQuotes[currentQuoteIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Fitness Motivation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Transform your mindset, build lasting habits, and achieve your wellness goals
            </p>

            {/* Rotating Quote */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <Quote className="h-8 w-8 text-green-200 mx-auto mb-4" />
              <blockquote className="text-lg md:text-xl italic mb-4 transition-all duration-500">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-green-200 font-medium">— {currentQuote.author}</cite>
            </div>

            <div className="flex justify-center">
              <Link to="/services/fitness-and-nutrition-plans">
                <Button size="lg" variant="primary" className="bg-black text-green-600 hover:bg-green-50">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Guide to Lasting Fitness Motivation
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover the science-backed strategies and mindset shifts that will help you build
              sustainable fitness habits and achieve your wellness goals.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">85%</h3>
              <p className="text-gray-600">of people quit fitness programs within weeks</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3x</h3>
              <p className="text-gray-600">more likely to succeed with proper habits</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">21</h3>
              <p className="text-gray-600">days to start forming a new habit</p>
            </div>
          </div>
        </div>

        {/* Interactive Content Sections */}
        <div className="max-w-5xl mx-auto space-y-8">
          {contentSections.map((section, index) => (
            <Card key={section.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div
                className="cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-gray-600">{section.summary}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedSections.has(section.id) ? (
                      <ChevronUp className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedSections.has(section.id) && (
                <div className="border-t border-gray-100">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="prose prose-lg max-w-none">
                          {section.content.split('\n\n').map((paragraph, pIndex) => {
                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                              return (
                                <h4 key={pIndex} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                                  {paragraph.replace(/\*\*/g, '')}
                                </h4>
                              )
                            }
                            return (
                              <p key={pIndex} className="text-gray-700 leading-relaxed">
                                {paragraph}
                              </p>
                            )
                          })}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="relative group">
                          <ImageWithFallback
                            src={section.image}
                            alt={section.title}
                            className="w-full h-64 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                            fallbackSrc="https://via.placeholder.com/600x400/10B981/ffffff?text=Fitness+Motivation"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 text-white">
                              <p className="text-sm font-medium">Click to explore more</p>
                            </div>
                          </div>
                        </div>

                        {/* Motivational Quote for this section */}
                        {index < motivationalQuotes.length && (
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
                            <Quote className="h-5 w-5 text-green-600 mb-2" />
                            <blockquote className="text-gray-700 italic mb-2">
                              "{motivationalQuotes[index].text}"
                            </blockquote>
                            <cite className="text-green-600 font-medium text-sm">
                              — {motivationalQuotes[index].author}
                            </cite>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Additional Motivational Sections */}
        <div className="max-w-4xl mx-auto mt-16 space-y-12">
          {/* Accountability Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Make Yourself Accountable</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Sharing your exercise routine with a friend or family member can help you to stay on track.
                  You might find a workout buddy to join you for training — you could do this via video chat —
                  or perhaps you'll create time each week for a family walk.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Involving others in your healthy habits will ensure that you stay on track, whether they join you or not.
                  It will also help you to set achievable goals as your friend can do a "reality check" on your schedule.
                </p>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <Quote className="h-5 w-5 text-green-600 mb-2" />
                  <blockquote className="text-gray-700 italic mb-2">
                    "When you measure your fitness progress, focus on how you feel and what you can do now that you couldn't do when you started."
                  </blockquote>
                </div>
              </div>
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Workout accountability partners"
                  className="w-full h-64 rounded-lg object-cover"
                  fallbackSrc="https://via.placeholder.com/600x400/3B82F6/ffffff?text=Accountability+Partners"
                />
              </div>
            </div>
          </div>

          {/* Positive Mindset Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Think Positive and Be Kind to Yourself</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Self-care and positive mindset"
                  className="w-full h-64 rounded-lg object-cover"
                  fallbackSrc="https://via.placeholder.com/600x400/10B981/ffffff?text=Positive+Mindset"
                />
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  I'm sure we've all heard the saying "Rome wasn't built in a day". The same thing applies when
                  establishing healthy lifestyle habits! It can take lots of small changes to add up to big results.
                  Be kind to yourself as you try to adjust.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you have a bad week, that's okay! Don't focus on what you did "wrong" — choose a healthy
                  mindset and focus on how you can improve the next week. This is why it is so important to set
                  realistic goals.
                </p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Mindset Tips:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      Aim for balance, not perfection
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      Set smaller short-term goals
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      Celebrate small victories
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      Focus on how you feel, not just how you look
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Habits vs Motivation Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Motivation Gets You Started, Healthy Habits Keep You Going!
              </h3>
              <p className="text-xl text-gray-600">
                The secret to long-term success lies in building sustainable systems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h4 className="text-lg font-semibold text-red-800 mb-3">❌ Relying Only on Motivation</h4>
                <ul className="space-y-2 text-red-700">
                  <li>• Inconsistent energy levels</li>
                  <li>• Depends on mood and circumstances</li>
                  <li>• Often leads to giving up</li>
                  <li>• Short-term thinking</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h4 className="text-lg font-semibold text-green-800 mb-3">✅ Building Healthy Habits</h4>
                <ul className="space-y-2 text-green-700">
                  <li>• Consistent daily actions</li>
                  <li>• Works regardless of mood</li>
                  <li>• Creates lasting change</li>
                  <li>• Long-term success</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <Quote className="h-6 w-6 text-blue-600 mb-4" />
              <blockquote className="text-lg text-gray-800 italic mb-4">
                "Adjusting to a healthy lifestyle can be challenging and you may find yourself going up and down.
                While motivation can help you get started, it's how you keep yourself motivated that really counts!"
              </blockquote>
              <p className="text-gray-700">
                Start slowly and aim to establish a lifestyle that you are happy to continue in the long-term.
                Most importantly, be kind to yourself and try to enjoy the journey!
              </p>
            </div>
          </div>
        </div>

        {/* Action Steps Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h3>
              <p className="text-xl text-green-100">
                Take the first step towards building lasting healthy habits today
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Set Your Goals</h4>
                <p className="text-green-100">Define clear, achievable fitness objectives</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Create a Plan</h4>
                <p className="text-green-100">Build a sustainable workout routine</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Track Progress</h4>
                <p className="text-green-100">Monitor your journey and celebrate wins</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services/fitness-and-nutrition-plans">
                <Button size="lg" variant="primary" className="bg-black text-green-600 hover:bg-green-50">
                  <Target className="mr-2 h-5 w-5" />
                  Explore Fitness Plans
                </Button>
              </Link>
              <Link to="/bmi">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Calculate Your BMI
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Final Motivational Quote */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <Quote className="h-12 w-12 text-green-600 mx-auto mb-6" />
            <blockquote className="text-2xl text-gray-800 italic mb-6 leading-relaxed">
              "The journey of a thousand miles begins with one step. Your fitness transformation starts with the decision to begin."
            </blockquote>
            <cite className="text-green-600 font-semibold text-lg">— Ancient Wisdom</cite>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-gray-600 leading-relaxed">
                Remember, every expert was once a beginner. Every pro was once an amateur.
                Every icon was once an unknown. The key is to start where you are, use what you have,
                and do what you can. Your future self will thank you for the healthy choices you make today.
              </p>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="max-w-5xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Continue Your Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Educational Content</h4>
                <p className="text-gray-600 mb-4">Learn the science behind fitness and nutrition</p>
                <Link to="/services/educational-content">
                  <Button variant="outline" size="sm">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Fitness Plans</h4>
                <p className="text-gray-600 mb-4">Structured workouts for every fitness level</p>
                <Link to="/services/fitness-and-nutrition-plans">
                  <Button variant="outline" size="sm">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h4>
                <p className="text-gray-600 mb-4">Connect with others on similar journeys</p>
                <Link to="/contact">
                  <Button variant="outline" size="sm">
                    Join Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MotivationalContent
