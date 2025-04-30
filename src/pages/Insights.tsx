import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart2, PieChart, TrendingUp, TrendingDown, Calendar, Clock, Activity, Brain, Heart, Users } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Insights = () => {
  const [dateRange, setDateRange] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('stress');
  
  // Chart refs for cleanup
  const lineChartRef = useRef<ChartJS>(null);
  const pieChartRef = useRef<ChartJS>(null);
  const barChartRef = useRef<ChartJS>(null);

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, []);

  // Weekly stress data
  const weeklyStressData = {
    labels: Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'EEE')),
    datasets: [
      {
        label: 'Stress Level',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      },
    ],
  };

  // Activity distribution data
  const activityData = {
    labels: ['Meditation', 'Exercise', 'Breaks', 'Team Activities'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(249, 115, 22, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Mood distribution data
  const moodData = {
    labels: ['Happy', 'Neutral', 'Stressed', 'Tired', 'Energetic'],
    datasets: [
      {
        data: [35, 25, 20, 10, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(147, 51, 234, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const insights = [
    {
      title: 'Stress Reduction',
      value: '-15%',
      trend: 'down',
      description: 'Lower average stress compared to last week',
      icon: TrendingDown,
      color: 'text-green-500',
    },
    {
      title: 'Focus Time',
      value: '+23%',
      trend: 'up',
      description: 'Increased productive hours this week',
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      title: 'Activity Completion',
      value: '92%',
      trend: 'up',
      description: 'Wellness activities completed',
      icon: Activity,
      color: 'text-purple-500',
    },
  ];

  const metrics = [
    {
      title: 'Average Heart Rate',
      value: '72 BPM',
      change: '-2 BPM',
      icon: Heart,
      color: 'text-red-500',
    },
    {
      title: 'Focus Sessions',
      value: '12',
      change: '+3',
      icon: Brain,
      color: 'text-purple-500',
    },
    {
      title: 'Team Activities',
      value: '8',
      change: '+2',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Active Minutes',
      value: '245',
      change: '+45',
      icon: Activity,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wellness Insights</h1>
              <p className="text-gray-600 mt-1">Track your progress and identify patterns</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  <h3 className="text-lg font-semibold text-gray-800">{metric.title}</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className={metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {metric.change}
                  </span>
                  {' '}vs last period
                </p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stress Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Stress Trends</h2>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2"
                >
                  <option value="stress">Stress Level</option>
                  <option value="focus">Focus Time</option>
                  <option value="activity">Activity Level</option>
                </select>
              </div>
              <Line
                ref={lineChartRef}
                data={weeklyStressData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, max: 100 } }
                }}
              />
            </div>

            {/* Activity Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Activity Distribution</h2>
                <PieChart className="w-5 h-5 text-gray-500" />
              </div>
              <div className="h-64">
                <Pie
                  ref={pieChartRef}
                  data={activityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 12,
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Mood Distribution</h2>
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-64">
              <Bar
                ref={barChartRef}
                data={moodData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">AI Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Optimize Break Times</h3>
                <p className="text-blue-700">Consider taking shorter, more frequent breaks during high-stress periods.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Increase Meditation</h3>
                <p className="text-purple-700">Your stress levels decrease significantly after meditation sessions.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Team Activities</h3>
                <p className="text-green-700">Participating in team activities improves your overall mood.</p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Export as PDF
            </button>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Share Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};