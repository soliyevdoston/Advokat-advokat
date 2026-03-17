import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import PrivateRoute from './components/utils/PrivateRoute';
import ChatPage from './pages/Chat';
import Auth from './pages/Auth';
import LawyerDashboard from './pages/LawyerDashboard';
import { useAuth } from './context/AuthContext';

import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeSwitcher from './components/layout/ThemeSwitcher';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LawyerLanding />} />

          <Route path="/auth" element={<Auth />} />

          <Route
            path="/lawyer"
            element={(
              <PrivateRoute requireRole="lawyer" unauthorizedTo="/auth">
                <LawyerDashboard />
              </PrivateRoute>
            )}
          />

          <Route
            path="/chat/:type?/:id?"
            element={(
              <PrivateRoute requireRole="lawyer" unauthorizedTo="/auth">
                <ChatPage />
              </PrivateRoute>
            )}
          />

          <Route path="/dashboard" element={<Navigate to="/lawyer" replace />} />
          <Route path="/admin" element={<Navigate to="/auth" replace />} />
          <Route path="/admin/login" element={<Navigate to="/auth" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
      <ThemeSwitcher position="bottom-right" />
    </div>
  );
}

export default App;

function LawyerLanding() {
  const { user } = useAuth();

  if (user?.role === 'lawyer') {
    return <Navigate to="/lawyer" replace />;
  }

  return <Navigate to="/auth" replace />;
}
