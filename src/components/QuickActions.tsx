import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Brain, Heart, MessageCircle } from 'lucide-react';
import { useMetricsStore } from '../store/metricsStore';

export const QuickActions = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [isMeditationActive, setIsMeditationActive] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const { updateMetrics } = useMetricsStore();

  const handleBreak = () => {
    setIsBreakActive(!isBreakActive);
    if (!isBreakActive) {
      // Start break timer (5 minutes)
      setTimeout(() => {
        setIsBreakActive(false);
        updateMetrics({ stress_level: Math.max(0, (metrics?.stress_level || 0) - 10) });
      }, 5 * 60 * 1000);
    }
  };

  const handleMeditation = () => {
    setIsMeditationActive(!isMeditationActive);
    if (!isMeditationActive) {
      // Start meditation timer (10 minutes)
      setTimeout(() => {
        setIsMeditationActive(false);
        updateMetrics({ 
          stress_level: Math.max(0, (metrics?.stress_level || 0) - 15),
          focus_score: Math.min(100, (metrics?.focus_score || 0) + 10)
        });
      }, 10 * 60 * 1000);
    }
  };

  const handleBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
    if (!isBreathingActive) {
      // Start breathing exercise timer (2 minutes)
      setTimeout(() => {
        setIsBreathingActive(false);
        updateMetrics({ 
          stress_level: Math.max(0, (metrics?.stress_level || 0) - 5),
          heart_rate: Math.max(60, (metrics?.heart_rate || 0) - 2)
        });
      }, 2 * 60 * 1000);
    }
  };

  const handleSupport = () => {
    // Open chat with support
    document.querySelector('[data-chatbot-trigger]')?.click();
  };

  const actions = [
    {
      icon: Pause,
      label: isBreakActive ? 'End Break' : 'Take a Break',
      color: isBreakActive 
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      onClick: handleBreak
    },
    {
      icon: Brain,
      label: isMeditationActive ? 'End Meditation' : 'Start Meditation',
      color: isMeditationActive
        ? 'bg-purple-600 text-white hover:bg-purple-700'
        : 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      onClick: handleMeditation
    },
    {
      icon: Heart,
      label: isBreathingActive ? 'End Exercise' : 'Breathing Exercise',
      color: isBreathingActive
        ? 'bg-red-600 text-white hover:bg-red-700'
        : 'bg-red-50 text-red-600 hover:bg-red-100',
      onClick: handleBreathing
    },
    {
      icon: MessageCircle,
      label: 'Contact Support',
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
      onClick: handleSupport
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className={`${action.color} p-4 rounded-xl transition-colors flex flex-col items-center gap-3`}
        >
          <action.icon className="w-6 h-6" />
          <span className="font-medium">{action.label}</span>
          {(action.label.includes('Break') || action.label.includes('Meditation') || action.label.includes('Exercise')) && (
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div
                className="bg-current rounded-full h-1 transition-all duration-1000"
                style={{
                  width: action.label.includes('Break') && isBreakActive ? '100%' :
                         action.label.includes('Meditation') && isMeditationActive ? '100%' :
                         action.label.includes('Exercise') && isBreathingActive ? '100%' : '0%'
                }}
              />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
};