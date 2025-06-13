import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Activity, Heart, Target, Zap, ArrowRight, CheckCircle,
  Timer, Scale, TrendingUp, Brain
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"

const PhysicalFitnessGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview")

  const fitnessDefinitions = [
    {
      term: "Physical Activity",
      definition: "Any bodily movement produced by skeletal muscles that results in energy expenditure, measured in kilocalories."
    },
    {
      term: "Exercise",
      definition: "A subset of physical activity that is planned, structured, and repetitive with the objective of improving or maintaining physical fitness."
    },
    {
      term: "Physical Fitness",
      definition: "A set of health- or skill-related attributes that enable you to carry out daily tasks with vigor and alertness, without undue fatigue."
    }
  ]

  const metabolicFitnessData = [
    {
      measure: "Blood Pressure",
      normal: "120/80 mmHg",
      description: "Measures heart effectiveness, blood volume adequacy, and vascular flow",
      icon: <Heart className="h-6 w-6 text-red-500" />
    },
    {
      measure: "Pulse Rate",
      normal: "60-100 bpm",
      description: "Number of heartbeats per minute felt over peripheral arteries",
      icon: <Activity className="h-6 w-6 text-blue-500" />
    },
    {
      measure: "Blood Insulin",
      normal: "5-20 µm/mL (fasting)",
      description: "Measures circulating insulin responsible for blood glucose usage",
      icon: <Zap className="h-6 w-6 text-yellow-500" />
    }
  ]

  const bodyCompositionMethods = [
    {
      method: "BMI (Body Mass Index)",
      formula: "Weight (kg) / Height² (m²)",
      description: "Key index relating body weight to height",
      accuracy: "Basic screening tool"
    },
    {
      method: "Skinfold Thickness",
      formula: "Multiple site measurements",
      description: "Measures skin and subcutaneous fat at standard anatomical sites",
      accuracy: "±3-4% body fat"
    },
    {
      method: "Waist-to-Hip Ratio",
      formula: "Waist circumference / Hip circumference",
      description: "Assesses fat distribution and health risk",
      accuracy: "Risk assessment tool"
    }
  ]

  const fitnessComponents = [
    {
      category: "Health-Related Fitness",
      components: [
        "Body Composition",
        "Muscular Strength", 
        "Muscular Endurance",
        "Cardiovascular Endurance",
        "Flexibility"
      ],
      description: "Components that determine your ability to perform daily activities and reduce disease risk"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Physical Fitness Guide
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Comprehensive guide to understanding, measuring, and improving your physical fitness
            </p>
            <div className="flex justify-center">
              <Link to="/services/educational-content/tools/fitness-assessment">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <Target className="mr-2 h-5 w-5" />
                  Take Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto py-4 space-x-8">
            {["overview", "metabolic", "health-related", "testing"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace("-", " ")}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-12">
              {/* Introduction */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Understanding Physical Fitness
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Physical fitness is more than just being able to run a long distance or lift heavy weights. 
                  It's about having the energy and strength to perform daily activities with vigor while 
                  maintaining optimal health.
                </p>
              </div>

              {/* Key Definitions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {fitnessDefinitions.map((def, index) => (
                  <Card key={index} className="p-6 h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {def.term}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {def.definition}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Fitness Components Overview */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  Components of Physical Fitness
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {fitnessComponents.map((category, index) => (
                    <Card key={index} className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">
                        {category.category}
                      </h4>
                      <p className="text-gray-600 mb-6">
                        {category.description}
                      </p>
                      <div className="space-y-2">
                        {category.components.map((component, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-gray-700">{component}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Benefits Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Why Physical Fitness Matters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Disease Prevention</h4>
                    <p className="text-sm text-gray-600">Reduces risk of chronic diseases</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Energy Levels</h4>
                    <p className="text-sm text-gray-600">Increases daily energy and vitality</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
                    <p className="text-sm text-gray-600">Enhances physical and mental performance</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Quality of Life</h4>
                    <p className="text-sm text-gray-600">Improves overall well-being</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metabolic Fitness Section */}
          {activeSection === "metabolic" && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Metabolic Fitness
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Metabolic fitness reflects the physiological systems' state of health when at rest. 
                  These measurements provide crucial insights into your body's basic functioning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {metabolicFitnessData.map((item, index) => (
                  <Card key={index} className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.measure}
                    </h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Normal: {item.normal}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Detailed Information */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Understanding Your Metabolic Health
                </h3>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-red-400 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Blood Pressure</h4>
                    <p className="text-gray-600 mb-3">
                      Measured using a sphygmomanometer and stethoscope, blood pressure indicates the effectiveness 
                      of your heartbeat, adequacy of blood volume, and presence of any vascular obstructions.
                    </p>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Normal Range:</strong> 120/80 mmHg or lower
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Pulse Rate</h4>
                    <p className="text-gray-600 mb-3">
                      The number of throbbing sensations felt over a peripheral artery when the heart beats. 
                      This reflects your cardiovascular efficiency.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Normal Range:</strong> 60-100 beats per minute at rest
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Blood Insulin</h4>
                    <p className="text-gray-600 mb-3">
                      Measures the amount of circulating insulin responsible for blood glucose usage by tissues. 
                      Critical for metabolic health assessment.
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Normal Range:</strong> 5-20 µm/mL while fasting<br/>
                        <strong>Note:</strong> Lower levels may suggest Type 1 diabetes, higher levels may indicate Type 2 diabetes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health-Related Fitness Section */}
          {activeSection === "health-related" && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Health-Related Fitness
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  These components determine your ability to perform daily activities with vigor and
                  demonstrate capacities associated with low risk of premature development of diseases.
                </p>
              </div>

              {/* Body Composition Section */}
              <div id="body-composition" className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Scale className="h-6 w-6 text-blue-500 mr-3" />
                  Body Composition
                </h3>

                <p className="text-gray-600 mb-6">
                  Body composition refers to the relative percentage of body mass that is fat and fat-free tissue.
                  It can be measured using various laboratory and field techniques.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {bodyCompositionMethods.map((method, index) => (
                    <Card key={index} className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {method.method}
                      </h4>
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-mono text-blue-800">
                          {method.formula}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {method.description}
                      </p>
                      <div className="text-xs text-green-600 font-medium">
                        Accuracy: {method.accuracy}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Waist-to-Hip Ratio Risk Categories */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Waist-to-Hip Ratio Risk Categories
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Risk Category</th>
                          <th className="text-left py-2">Women</th>
                          <th className="text-left py-2">Men</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-green-600">Very Low</td>
                          <td className="py-2">&lt;70 cm (27.5 in)</td>
                          <td className="py-2">&lt;80 cm (31.5 in)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-yellow-600">Low</td>
                          <td className="py-2">70–89 cm (28.5–35.0 in)</td>
                          <td className="py-2">80–99 cm (31.5–39.0 in)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium text-orange-600">High</td>
                          <td className="py-2">90–109 cm (35.5–43.0 in)</td>
                          <td className="py-2">100–120 cm (39.5–47.0 in)</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-red-600">Very High</td>
                          <td className="py-2">&gt;110 cm (&gt;43.5 in)</td>
                          <td className="py-2">&gt;120 cm (&gt;47.0 in)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Muscular Fitness Section */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 text-red-500 mr-3" />
                  Muscular Fitness
                </h3>

                <p className="text-gray-600 mb-6">
                  Muscular fitness includes both strength and endurance, determining bone mass, glucose tolerance,
                  musculo-tendinous integrity, and ability to carry out activities of daily living.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Muscular Strength */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      Muscular Strength
                    </h4>
                    <p className="text-gray-600 mb-4">
                      The muscle's ability to exert force at high intensities over short periods.
                      The gold standard is the 1 Repetition Maximum (1-RM) test.
                    </p>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2">1-RM Testing Protocol:</h5>
                      <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
                        <li>Warm up with submaximal repetitions</li>
                        <li>Determine 1-RM within 4 trials (3-5 min rest between)</li>
                        <li>Start with 50-70% of perceived capacity</li>
                        <li>Progressively increase by 2.5-20 kg until failure</li>
                        <li>Record final successful weight as 1-RM</li>
                      </ol>
                    </div>
                  </div>

                  {/* Muscular Endurance */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      Muscular Endurance
                    </h4>
                    <p className="text-gray-600 mb-4">
                      The ability of muscle groups to execute repeated contractions over time
                      sufficient to cause muscle fatigue.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Testing Methods:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li><strong>Absolute:</strong> Total repetitions at given resistance</li>
                        <li><strong>Relative:</strong> Repetitions at % of 1-RM</li>
                        <li><strong>Field Test:</strong> Maximum push-ups without rest</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cardiovascular Endurance */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-3" />
                  Cardiovascular Endurance
                </h3>

                <p className="text-gray-600 mb-6">
                  Related to the ability to perform large muscle, dynamic, moderate to high intensity exercise
                  for prolonged periods. Performance depends on respiratory, cardiovascular, and skeletal muscle systems.
                </p>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    VO₂ Max - The Gold Standard
                  </h4>
                  <p className="text-gray-600 mb-4">
                    The best measure of cardiorespiratory fitness is VO₂ max - the maximum volume of oxygen
                    your body can use during exercise. It reflects the functional capacity of your entire
                    cardiovascular system.
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-center text-sm text-gray-600">
                        <strong>VO₂ Max Formula:</strong><br/>
                        Volume (V) of Oxygen (O₂) at Maximum (max) capacity
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flexibility */}
              <div id="flexibility" className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-6 w-6 text-green-500 mr-3" />
                  Flexibility
                </h3>

                <p className="text-gray-600 mb-6">
                  The ability to move a joint through its complete range of motion. Important for daily activities
                  and athletic performance. Flexibility is joint-specific, so no single test evaluates total body flexibility.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Factors Affecting Flexibility
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Joint capsule distensibility
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Adequate warm-up
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Muscle viscosity
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Age and activity level
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Measurement Tools
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Goniometers</li>
                      <li>• Inclinometers</li>
                      <li>• Electrogoniometers</li>
                      <li>• Leighton flexometer</li>
                      <li>• Tape measures</li>
                      <li>• Sit and reach test</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Fitness Testing Section */}
          {activeSection === "testing" && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Fitness Testing Protocols
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Detailed instructions for conducting various fitness tests to assess your physical capabilities
                </p>
              </div>

              {/* Vertical Jump Test */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="h-6 w-6 text-yellow-500 mr-3" />
                  Vertical Jump Test (Lower Body Power)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Materials Required:</h4>
                    <ul className="space-y-2 text-gray-600 mb-6">
                      <li>• Wall with marked measurements</li>
                      <li>• Clearly defined jumping area</li>
                      <li>• Ruler or measuring tape</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Instructions:</h4>
                    <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                      <li>Bend knees and hips, then swiftly jump</li>
                      <li>Use maximal force and reach as high as possible</li>
                      <li>Land safely with bent knees</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Procedure:</h4>
                    <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                      <li>Stand with feet shoulder-width apart</li>
                      <li>Mark standing reach height</li>
                      <li>Demonstrate correct jumping technique</li>
                      <li>Record jump reach height</li>
                      <li>Calculate difference (jump - standing reach)</li>
                      <li>Allow three attempts, record best</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Medicine Ball Throw Test */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 text-red-500 mr-3" />
                  Medicine Ball Throw Test (Upper Body Power)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Setup:</h4>
                    <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                      <li>Hold medicine ball securely with both hands</li>
                      <li>Stand with feet shoulder-width apart</li>
                      <li>Assume stable overhead position</li>
                      <li>Ensure elbows are extended</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Execution:</h4>
                    <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                      <li>Propel ball upward with maximum force</li>
                      <li>Use full-body movement</li>
                      <li>Measure height attained by ball</li>
                      <li>Record as indicator of upper body power</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Drop-Ruler Test */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Timer className="h-6 w-6 text-blue-500 mr-3" />
                  Drop-Ruler Test (Reaction Time)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Procedure:</h4>
                    <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                      <li>Experimenter drops ruler from predetermined height</li>
                      <li>Subject attempts to catch ruler as quickly as possible</li>
                      <li>Measure distance ruler falls before being caught</li>
                      <li>Repeat multiple times for accuracy</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Measurement:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Record centimeter displacement</li>
                      <li>• Shorter distance = faster reaction time</li>
                      <li>• Take average of multiple trials</li>
                      <li>• Compare to normative data</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sprint Test */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-6 w-6 text-green-500 mr-3" />
                  40-Meter Sprint Test (Speed)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Setup:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Mark clear 40-meter distance</li>
                      <li>• Ensure safe, non-slip surface</li>
                      <li>• Have stopwatch ready</li>
                      <li>• Allow proper warm-up</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Execution:</h4>
                    <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                      <li>Assume starting position</li>
                      <li>Give clear signal to start</li>
                      <li>Sprint 40-meter distance at maximum effort</li>
                      <li>Record completion time</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Integration Section */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Nutrition for Optimal Fitness Performance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Pre-Workout Nutrition</h3>
                <p className="text-sm text-gray-600">
                  Consume carbs 30-60 minutes before exercise for energy
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Post-Workout Recovery</h3>
                <p className="text-sm text-gray-600">
                  Protein within 30 minutes helps muscle recovery and growth
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Hydration</h3>
                <p className="text-sm text-gray-600">
                  Drink 16-24 oz water 2 hours before exercise
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Micronutrients</h3>
                <p className="text-sm text-gray-600">
                  Iron, B-vitamins, and antioxidants support energy metabolism
                </p>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Proper nutrition enhances your fitness performance and recovery
              </p>
              <Link to="/services/fitness-and-nutrition-plans">
                <Button className="bg-green-600 hover:bg-green-700">
                  Explore Nutrition Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation to other sections */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">
              Continue exploring the comprehensive guide to physical fitness
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setActiveSection("overview")}
                variant="outline"
              >
                Overview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => setActiveSection("metabolic")}
                variant="outline"
              >
                Metabolic Fitness
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => setActiveSection("health-related")}
                variant="outline"
              >
                Health-Related Fitness
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhysicalFitnessGuide
