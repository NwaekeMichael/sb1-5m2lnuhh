import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Watch, Users, Calendar, Search, Filter, ChevronRight, Clock, Play, Pause } from 'lucide-react';
import { useActivityStore } from '../store/activityStore';
import { CreateActivityModal } from '../components/CreateActivityModal';

export const Activities = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { activities, fetchActivities, isLoading } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'meditation':
        return Brain;
      case 'breathing':
        return Heart;
      case 'focus':
        return Watch;
      case 'meeting':
        return Users;
      default:
        return Calendar;
    }
  };

  const getColor = (type: string) => {
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
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ActivityCard = ({ activity }: { activity: typeof activities[0] }) => {
    const isActive = activeActivity === activity.id;
    const Icon = getIcon(activity.type);

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`p-4 rounded-lg ${isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getColor(activity.type)}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                {activity.status === 'ongoing' && (
                  <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                    Live
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {activity.time} • {activity.duration} • {activity.participants} participant{activity.participants !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveActivity(isActive ? null : activity.id)}
            className={`p-2 rounded-full ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } hover:bg-blue-700 hover:text-white transition-colors`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
        
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <p className="text-gray-600 mb-4">{activity.description}</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Join Now
              </button>
              <button className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                Add to Calendar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Wellness Activities</h1>
              <p className="text-gray-600 mt-1">Join activities to improve your well-being</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Activity
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Activities</option>
                <option value="meditation">Meditation</option>
                <option value="breathing">Breathing</option>
                <option value="meeting">Team Meetings</option>
                <option value="focus">Focus Sessions</option>
              </select>
            </div>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading activities...</div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No activities found. Create your first activity to get started!
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredActivities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};