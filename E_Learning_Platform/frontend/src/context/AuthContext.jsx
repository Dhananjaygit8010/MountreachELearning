import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myApplications, setMyApplications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        // Fetch applications if logged in
        const appsResponse = await api.get('/internships/my-applications');
        setMyApplications(appsResponse.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      showToast(`Welcome back, ${response.data.name}!`, 'success');
      
      // Fetch applications
      const appsResponse = await api.get('/internships/my-applications');
      setMyApplications(appsResponse.data);
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const register = async (name, email, password, college, branch) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        college,
        branch
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      setMyApplications([]);
      showToast(`Account created successfully! Welcome, ${name}!`, 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Try again.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMyApplications([]);
    showToast('Logged out successfully.', 'info');
  };

  const updateProfile = async (dataOrName, college, branch, password) => {
    try {
      let body = {};
      if (typeof dataOrName === 'object' && dataOrName !== null) {
        body = { ...dataOrName };
      } else {
        body = { name: dataOrName, college, branch };
        if (password) body.password = password;
      }

      const response = await api.put('/auth/update', body);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      showToast('Profile updated successfully!', 'success');
      return { success: true, user: response.data };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update profile settings.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const punchAttendance = async (sessionName = 'Industrial Systems & Architecture Lab', mode = 'Online') => {
    try {
      const response = await api.post('/auth/attendance/punch', { sessionName, mode });
      setUser((prev) => ({
        ...prev,
        attendance: response.data.attendance,
      }));
      showToast(response.data.message || 'Attendance checked in successfully!', 'success');
      return { success: true, attendance: response.data.attendance };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Attendance check-in failed.';
      showToast(errMsg, 'warning');
      return { success: false, error: errMsg };
    }
  };

  const submitSupportTicket = async (ticketData) => {
    try {
      const response = await api.post('/auth/support/ticket', ticketData);
      setUser((prev) => ({
        ...prev,
        supportTickets: response.data.supportTickets,
      }));
      showToast('Support ticket submitted successfully!', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to submit support ticket.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const enrollInCourse = async (courseId) => {
    if (!user) {
      showToast('Please login to enroll in courses.', 'warning');
      return { success: false, requireAuth: true };
    }

    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser((prev) => ({
          ...prev,
          enrolledCourses: response.data.enrolledCourses,
        }));
      }
      showToast('Enrolled successfully! Course added to dashboard with invoice receipt.', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to enroll in course.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const applyForInternship = async (internshipId, college, branch, resumeName) => {
    if (!user) {
      showToast('Please login to apply for internships.', 'warning');
      return { success: false, requireAuth: true };
    }

    try {
      const response = await api.post('/internships/apply', {
        internshipId,
        college,
        branch,
        resumeName
      });
      
      // Fetch updated applications list
      const appsResponse = await api.get('/internships/my-applications');
      setMyApplications(appsResponse.data);
      showToast('Application submitted successfully!', 'success');
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to submit internship application.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        myApplications,
        toastMessage,
        toastType,
        showToast,
        login,
        register,
        logout,
        updateProfile,
        punchAttendance,
        submitSupportTicket,
        enrollInCourse,
        applyForInternship,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
