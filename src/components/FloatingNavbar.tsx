import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Activity, Bell, LineChart, Settings, X, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Activity, label: 'Activities', href: '/activities' },
  { icon: BarChart2, label: 'Assessment', href: '/assessment' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: LineChart, label: 'Insights', href: '/insights' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const FloatingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const NavContent = () => (
    <div className="flex items-center gap-2">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === item.href
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-blue-100 text-gray-600 hover:text-blue-600'
          }`}
        >
          <item.icon className="w-5 h-5" />
          {(!isMobile || isOpen) && (
            <span className="font-medium">{item.label}</span>
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        {isMobile ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-4 rounded-full bg-blue-600 text-white shadow-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-full mb-2 bg-white rounded-xl shadow-lg p-2 min-w-[200px]"
                >
                  <div className="flex flex-col gap-1">
                    <NavContent />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="px-6 py-3">
            <NavContent />
          </div>
        )}
      </div>
    </motion.div>
  );
};