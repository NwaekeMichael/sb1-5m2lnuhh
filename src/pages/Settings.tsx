import React from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Moon,
  User,
  Shield,
  Smartphone,
  Globe,
  Watch,
  Volume2,
  MessageSquare,
  Sun,
  LogOut
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ProfileSettings } from '../components/ProfileSettings';

export const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const settingSections = [
    {
      title: 'Notification Preferences',
      icon: Bell,
      settings: [
        { label: 'Stress Level Alerts', type: 'toggle', enabled: true },
        { label: 'Break Reminders', type: 'toggle', enabled: true },
        { label: 'Team Updates', type: 'toggle', enabled: false },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        { label: 'Data Sharing', type: 'toggle', enabled: false },
        { label: 'Anonymous Analytics', type: 'toggle', enabled: true },
        { label: 'Clear Activity History', type: 'button' },
      ]
    },
    {
      title: 'Device Integration',
      icon: Smartphone,
      settings: [
        { label: 'Connect Smartwatch', type: 'button' },
        { label: 'Sync Health Data', type: 'toggle', enabled: true },
        { label: 'Background Tracking', type: 'toggle', enabled: false },
      ]
    },
    {
      title: 'Appearance',
      icon: Moon,
      settings: [
        { 
          label: 'Dark Mode',
          type: 'toggle',
          enabled: isDarkMode,
          onChange: toggleDarkMode,
          icon: isDarkMode ? Sun : Moon
        },
        { label: 'Compact View', type: 'toggle', enabled: false },
      ]
    },
    {
      title: 'Language & Region',
      icon: Globe,
      settings: [
        { label: 'Language', type: 'select', options: ['English', 'Spanish', 'French'] },
        { label: 'Time Zone', type: 'select', options: ['UTC', 'EST', 'PST'] },
      ]
    }
  ];

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'dark:text-gray-100' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage your account preferences and system settings
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {/* Profile Settings */}
          <ProfileSettings isDarkMode={isDarkMode} />

          {/* Settings Sections */}
          <div className="grid gap-6">
            {settingSections.map((section, index) => (
              <motion.div
                key={index}
                className={`rounded-xl shadow-sm p-6 border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <section.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {setting.icon && <setting.icon className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {setting.label}
                        </span>
                      </div>
                      {setting.type === 'toggle' && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={setting.enabled}
                            onChange={setting.onChange || (() => {})}
                          />
                          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer ${
                            isDarkMode ? 'dark:bg-gray-700' : ''
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                        </label>
                      )}
                      {setting.type === 'button' && (
                        <button className={`px-4 py-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'text-blue-400 hover:bg-gray-700' 
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}>
                          Configure
                        </button>
                      )}
                      {setting.type === 'select' && (
                        <select className={`border rounded-lg px-4 py-2 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-200' 
                            : 'border-gray-200'
                        }`}>
                          {setting.options?.map((option, optionIndex) => (
                            <option key={optionIndex}>{option}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connected Devices */}
          <div className={`rounded-xl shadow-sm p-6 border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Connected Devices
            </h2>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <Watch className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Apple Watch Series 7
                    </h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Last synced: 5 minutes ago
                    </p>
                  </div>
                </div>
                <button className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} hover:text-red-700`}>
                  Disconnect
                </button>
              </div>
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <Smartphone className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      iPhone 13 Pro
                    </h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Last synced: 2 minutes ago
                    </p>
                  </div>
                </div>
                <button className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} hover:text-red-700`}>
                  Disconnect
                </button>
              </div>
            </div>
          </div>

          {/* AI Assistant Preferences */}
          <div className={`rounded-xl shadow-sm p-6 border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                AI Assistant Preferences
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Assistant Voice
                </span>
                <select className={`border rounded-lg px-4 py-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-200'
                }`}>
                  <option>Female (Default)</option>
                  <option>Male</option>
                  <option>Neutral</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Voice Volume
                </span>
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-32"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Conversation Style
                </span>
                <select className={`border rounded-lg px-4 py-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-200'
                }`}>
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};