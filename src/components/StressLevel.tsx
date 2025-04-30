import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMetricsStore } from '../store/metricsStore';

export const StressLevel = () => {
  const { metrics, fetchMetrics } = useMetricsStore();
  
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const stressLevel = metrics?.stress_level ?? 0;

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-green-500';
    if (level < 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStressLabel = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 60) return 'Moderate';
    return 'High';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Stress</h2>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative w-32 h-32 mb-4"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${stressLevel * 2.83} 283`}
              strokeLinecap="round"
              className={getStressColor(stressLevel)}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{stressLevel}</span>
          </div>
        </motion.div>
        <p className={`text-lg font-semibold ${getStressColor(stressLevel)}`}>
          {getStressLabel(stressLevel)}
        </p>
        <p className="text-sm text-gray-500 mt-1">Stress Level</p>
      </div>
    </div>
  );
};