import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Check, AlertCircle, Calendar, Users, X, Filter, Search } from 'lucide-react';

interface Notification {
  id: number;
  type: 'alert' | 'reminder' | 'activity' | 'team';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const Notifications = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'High Stress Level Detected',
      description: 'Your stress levels have been elevated for the past 2 hours. Consider taking a break.',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Time for a Break',
      description: "You've been working for 2 hours straight. Take a 5-minute breather.",
      time: '15 minutes ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'activity',
      title: 'Upcoming Meditation Session',
      description: 'Your scheduled meditation session starts in 30 minutes.',
      time: '30 minutes ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'team',
      title: 'Team Wellness Check-in',
      description: 'Daily team wellness check-in starting in 1 hour.',
      time: '1 hour ago',
      read: true,
      priority: 'medium'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return AlertCircle;
      case 'reminder':
        return Clock;
      case 'activity':
        return Calendar;
      case 'team':
        return Users;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'text-red-500';
      case 'reminder':
        return 'text-yellow-500';
      case 'activity':
        return 'text-blue-500';
      case 'team':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'low':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Stay updated with your wellness journey</p>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
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
                <option value="all">All Notifications</option>
                <option value="alert">Alerts</option>
                <option value="reminder">Reminders</option>
                <option value="activity">Activities</option>
                <option value="team">Team</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
            <AnimatePresence>
              {filteredNotifications.map(notification => {
                const Icon = getIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={false}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 flex items-start gap-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      <Icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{notification.description}</p>
                          <span className="text-sm text-gray-500 mt-2 block">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <Check className="w-5 h-5 text-blue-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-700">Stress Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-700">Break Reminders</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">Activity Reminders</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};