import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Coffee, Clock, Users, Briefcase, Activity, Moon, Sun } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  icon: React.ElementType;
  options: string[];
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "How would you rate your current stress level?",
    icon: Brain,
    category: "Mental",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"]
  },
  {
    id: 2,
    text: "How many hours of sleep did you get last night?",
    icon: Moon,
    category: "Physical",
    options: ["Less than 4", "4-6", "6-8", "More than 8"]
  },
  {
    id: 3,
    text: "How would you describe your work-life balance today?",
    icon: Briefcase,
    category: "Work",
    options: ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
  },
  {
    id: 4,
    text: "How is your energy level right now?",
    icon: Sun,
    category: "Physical",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"]
  },
  {
    id: 5,
    text: "How would you rate your social support system?",
    icon: Users,
    category: "Social",
    options: ["Very Strong", "Strong", "Moderate", "Weak", "Very Weak"]
  },
  {
    id: 6,
    text: "How productive do you feel today?",
    icon: Activity,
    category: "Work",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"]
  },
  {
    id: 7,
    text: "How well can you concentrate right now?",
    icon: Brain,
    category: "Mental",
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"]
  },
  {
    id: 8,
    text: "How often did you take breaks today?",
    icon: Clock,
    category: "Work",
    options: ["None", "1-2 times", "3-4 times", "5+ times"]
  }
];

export const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: answer }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateStressScore = () => {
    const stressValues: Record<string, number> = {
      'Very Low': 1, 'Low': 2, 'Moderate': 3, 'High': 4, 'Very High': 5,
      'Excellent': 1, 'Good': 2, 'Fair': 3, 'Poor': 4, 'Very Poor': 5,
      'Very Strong': 1, 'Strong': 2, 'Weak': 4, 'Very Weak': 5,
    };

    const totalScore = Object.values(answers).reduce((acc, answer) => {
      return acc + (stressValues[answer] || 3);
    }, 0);

    return Math.round((totalScore / (questions.length * 5)) * 100);
  };

  const getRecommendations = () => {
    const score = calculateStressScore();
    if (score < 30) {
      return [
        "Keep up the good work!",
        "Consider sharing your stress management techniques with colleagues",
        "Schedule regular check-ins to maintain your well-being"
      ];
    } else if (score < 60) {
      return [
        "Try incorporating short meditation breaks",
        "Schedule regular exercise sessions",
        "Consider talking to a wellness coach"
      ];
    } else {
      return [
        "Schedule an appointment with a wellness professional",
        "Take immediate steps to reduce workload",
        "Practice stress-reduction techniques regularly"
      ];
    }
  };

  const Question = ({ question }: { question: Question }) => {
    const Icon = question.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-sm font-medium text-blue-600">{question.category}</span>
            <h2 className="text-2xl font-semibold text-gray-800">{question.text}</h2>
          </div>
        </div>
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              className="p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <span className="font-medium text-gray-700">{option}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  const Results = () => {
    const score = calculateStressScore();
    const recommendations = getRecommendations();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Results</h2>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Stress Score</span>
              <span className="text-2xl font-bold text-blue-600">{score}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  score < 30 ? 'bg-green-500' : score < 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <p className="text-gray-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
              }}
              className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Take Again
            </button>
            <button
              onClick={() => {/* Handle save/export */}}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Results
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stress Assessment</h1>
          <p className="text-gray-600">Take a moment to assess your current well-being</p>
        </div>
        
        {!showResults && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <Question question={questions[currentQuestion]} />
          </div>
        )}

        {showResults && <Results />}
      </div>
    </div>
  );
};