import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FloatingNavbar } from './components/FloatingNavbar';
import { ChatbotButton } from './components/ChatbotButton';
import { Dashboard } from './pages/Dashboard';
import { Activities } from './pages/Activities';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { Assessment } from './pages/Assessment';
import { Notifications } from './pages/Notifications';
import { Auth } from './pages/Auth';
import { PrivateRoute } from './components/PrivateRoute';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Routes>
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
          <Route path="/activities" element={<PrivateRoute><Activities /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        </Routes>
        {user && <FloatingNavbar />}
        {user && <ChatbotButton />}
      </div>
    </Router>
  );
}

export default App;