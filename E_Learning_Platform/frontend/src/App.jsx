import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import InternshipHub from './pages/InternshipHub';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
          {/* Header */}
          <Navbar />

          {/* Main Contents Grid */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/internships" element={<InternshipHub />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<AuthPage defaultIsLogin={true} />} />
              <Route path="/register" element={<AuthPage defaultIsLogin={false} />} />
              {/* Fallback routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Global Alert Notification Banner */}
          <Toast />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
