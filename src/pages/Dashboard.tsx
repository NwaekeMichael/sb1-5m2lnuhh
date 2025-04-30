import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart2, Brain, Heart, Activity, Calendar, Users, Trophy, Clock, Sun, Moon } from 'lucide-react';
import { StressChart } from '../components/StressChart';
import { QuickActions } from '../components/QuickActions';
import { StressLevel } from '../components/StressLevel';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useActivityStore } from '../store/activityStore';
import { useMetricsStore } from '../store/metricsStore';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { activities } = useActivityStore();
  const { metrics, fetchMetrics } = useMetricsStore();
  const userName = user?.user_metadata?.name || 'User';

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const upcomingActivities = activities.filter(activity => activity.status === 'upcoming').slice(0, 3);

  const achievements = [
    {
      id: 1,
      title: "7-Day Streak",
      description: "Completed daily wellness activities",
      icon: Trophy,
      completed: true,
      progress: "7/7 days"
    },
    {
      id: 2,
      title: "Team Player",
      description: "Participated in 5 group sessions",
      icon: Users,
      completed: false,
      progress: "3/5 sessions"
    },
    {
      id: 3,
      title: "Mindfulness Master",
      description: "30 minutes of meditation",
      icon: Brain,
      completed: false,
      progress: "15/30 minutes"
    }
  ];

  const dailyMetrics = [
    {
      icon: Heart,
      title: "Heart Rate",
      value: `${metrics?.heart_rate || 0} BPM`,
      trend: "+2",
      color: "text-red-500",
      description: "Average today"
    },
    {
      icon: Brain,
      title: "Focus Time",
      value: `${metrics?.focus_score || 0}%`,
      trend: "+5",
      color: "text-purple-500",
      description: "Focus score today"
    },
    {
      icon: Activity,
      title: "Activity Score",
      value: metrics?.activity_score || 0,
      trend: "+12",
      color: "text-green-500",
      description: "Daily activity score"
    },
    {
      icon: BarChart2,
      title: "Stress Score",
      value: metrics?.stress_level || 0,
      trend: "-5",
      color: "text-blue-500",
      description: "Current stress level"
    }
  ];

  const timeBlocks = activities.filter(activity => activity.status === 'upcoming')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5)
    .map(activity => ({
      time: activity.time,
      activity: activity.title,
      icon: getActivityIcon(activity.type),
      color: getActivityColor(activity.type)
    }));

  function getActivityIcon(type: string) {
    switch (type) {
      case 'meditation':
        return Brain;
      case 'breathing':
        return Heart;
      case 'focus':
        return Clock;
      case 'meeting':
        return Users;
      default:
        return Calendar;
    }
  }

  function getActivityColor(type: string) {
    switch (type) {
      case 'meditation':
        return 'bg-purple-100 text-purple-600';
      case 'breathing':
        return 'bg-red-100 text-red-600';
      case 'focus':
        return 'bg-green-100 text-green-600';
      case 'meeting':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Welcome Back, {userName}</h1>
              <p className="text-gray-600 mt-1">Let's check on your well-being today</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/assessment"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Assessment
              </Link>
            </div>
          </div>

          {/* Time Blocks */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeBlocks.length > 0 ? (
                timeBlocks.map((block, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-gray-50 flex items-center gap-4"
                  >
                    <div className={`p-3 rounded-lg ${block.color}`}>
                      <block.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{block.time}</p>
                      <p className="font-medium text-gray-900">{block.activity}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
                  No activities scheduled. <Link to="/activities" className="text-blue-600 hover:underline">Create one now</Link>
                </div>
              )}
            </div>
          </div>

          {/* Stress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StressLevel />
            <div className="col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Stress Trends</h2>
                <select className="border border-gray-200 rounded-lg px-4 py-2">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <StressChart />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Daily Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {dailyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  <h3 className="text-lg font-semibold text-gray-800">{metric.title}</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <span className={`text-sm ${
                    metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              <Link to="/activities" className="text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingActivities.length > 0 ? (
                upcomingActivities.map(event => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{event.time}</span>
                    </div>
                    <p className="text-gray-700">{event.title}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
                  No upcoming events. <Link to="/activities" className="text-blue-600 hover:underline">Create one now</Link>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <achievement.icon 
                      className={`w-5 h-5 ${
                        achievement.completed ? 'text-yellow-500' : 'text-gray-400'
                      }`} 
                    />
                    <span className="font-medium text-gray-900">{achievement.title}</span>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{achievement.progress}</span>
                    {achievement.completed && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};