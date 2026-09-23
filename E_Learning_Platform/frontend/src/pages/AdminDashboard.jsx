import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Users,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Shield,
  Layers,
  Search,
  RefreshCw,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, showToast } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Platform data states
  const [overview, setOverview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);

  // Forms state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: 4999,
    duration: '8 Weeks',
    level: 'Beginner',
    syllabus: 'HTML & CSS, JavaScript ES6+, React Hooks, Node.js REST API',
    projects: 'Personal Portfolio, E-Commerce Store, Fullstack Blog App',
    certificationDetails: 'ISO 9001:2015 Industrial Verification Stamp',
  });

  const [internshipForm, setInternshipForm] = useState({
    title: '',
    description: '',
    duration: '3 Months',
    company: 'Mountreach Solution Private Limited',
    stipend: '₹8,000 / Month',
    skillsRequired: 'React.js, Node.js, MongoDB',
    projects: 'Client Portal Feature, Microservice Deployment',
  });

  // Search filter inside applications
  const [appSearch, setAppSearch] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState('All');

  // Load all admin data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [overviewRes, coursesRes, internRes, appsRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/courses'),
        api.get('/internships'),
        api.get('/internships/admin/all-applications'),
      ]);

      setOverview(overviewRes.data);
      setCourses(coursesRes.data);
      setInternships(internRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Error fetching admin platform data:', err);
      showToast('Could not load administrative data. Ensure you are signed in.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        showToast('Admin dashboard requires administrator credentials.', 'warning');
        navigate('/login', { state: { from: '/admin' } });
        return;
      }
      if (user.role !== 'admin') {
        showToast('Access Denied: Only the System Administrator can access the Admin Dashboard.', 'error');
        navigate('/dashboard', { replace: true });
        return;
      }
      fetchAllData();
    }
  }, [user, authLoading]);

  // Handle Application Status Update
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await api.put(`/internships/admin/applications/${applicationId}/status`, {
        status: newStatus,
      });
      showToast(`Status updated to "${newStatus}"!`, 'success');
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? res.data.application : app))
      );
      // Refresh overview counts
      api.get('/admin/overview').then((r) => setOverview(r.data));
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  // Handle Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...courseForm,
        syllabus: courseForm.syllabus.split(',').map((s) => s.trim()),
        projects: courseForm.projects.split(',').map((p) => p.trim()),
      };
      await api.post('/courses', payload);
      showToast('Course created successfully!', 'success');
      setShowCourseModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create course.', 'error');
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) return;
    try {
      await api.delete(`/courses/${courseId}`);
      showToast('Course deleted successfully.', 'success');
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      showToast('Failed to delete course.', 'error');
    }
  };

  // Handle Create Internship
  const handleCreateInternship = async (e) => {
    e.preventDefault();
    try {
      await api.post('/internships', internshipForm);
      showToast('Internship program created successfully!', 'success');
      setShowInternshipModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create internship.', 'error');
    }
  };

  // Handle Delete Internship
  const handleDeleteInternship = async (internshipId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/internships/${internshipId}`);
      showToast('Internship deleted successfully.', 'success');
      setInternships((prev) => prev.filter((i) => i._id !== internshipId));
    } catch (err) {
      showToast('Failed to delete internship.', 'error');
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      appFilterStatus === 'All' || app.status === appFilterStatus;
    const matchesSearch =
      !appSearch.trim() ||
      app.user?.name?.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.user?.college?.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.internship?.title?.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.branch?.toLowerCase().includes(appSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-brand animate-spin mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-lg">Loading Admin Management Suite...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Title Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-brand/20">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Admin Management Portal
                </h1>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  Administrator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Live monitoring, curriculum catalog control, and student applications management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync DB
            </button>
            <button
              onClick={() => setShowCourseModal(true)}
              className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Course
            </button>
            <button
              onClick={() => setShowInternshipModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Internship
            </button>
          </div>
        </div>

        {/* Global Statistics Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-brand flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Registered Students
              </span>
              <span className="text-2xl font-black text-slate-900">
                {overview?.stats?.totalUsers || 0}
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Total Courses
              </span>
              <span className="text-2xl font-black text-slate-900">{courses.length}</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Active Internships
              </span>
              <span className="text-2xl font-black text-slate-900">{internships.length}</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Submitted Applications
              </span>
              <span className="text-2xl font-black text-slate-900">{applications.length}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 p-1.5 shadow-xs gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-brand text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-brand text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            Student Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-brand text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'internships'
                ? 'bg-brand text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Internships ({internships.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Review Status Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg">Application Status Pipeline</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-xs font-bold text-amber-700 block">Applied (Pending)</span>
                  <span className="text-3xl font-black text-amber-900 mt-1 block">
                    {overview?.stats?.statusBreakdown?.applied || 0}
                  </span>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-xs font-bold text-blue-700 block">Under Review</span>
                  <span className="text-3xl font-black text-blue-900 mt-1 block">
                    {overview?.stats?.statusBreakdown?.underReview || 0}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700 block">Accepted</span>
                  <span className="text-3xl font-black text-emerald-900 mt-1 block">
                    {overview?.stats?.statusBreakdown?.accepted || 0}
                  </span>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <span className="text-xs font-bold text-rose-700 block">Rejected</span>
                  <span className="text-3xl font-black text-rose-900 mt-1 block">
                    {overview?.stats?.statusBreakdown?.rejected || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Applications & Students Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">Recent Applications</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {overview?.recentApplications?.length === 0 ? (
                    <p className="text-xs text-slate-400">No applications submitted yet.</p>
                  ) : (
                    overview?.recentApplications?.map((app) => (
                      <div
                        key={app._id}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {app.user?.name || 'Student'}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold">
                            {app.internship?.title} • {app.college}
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                          {app.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recently Registered Students */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">Recent Registrations</h3>
                <div className="space-y-3">
                  {overview?.recentStudents?.length === 0 ? (
                    <p className="text-xs text-slate-400">No students registered yet.</p>
                  ) : (
                    overview?.recentStudents?.map((stu) => (
                      <div
                        key={stu._id}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{stu.name}</div>
                          <div className="text-xs text-slate-500 font-semibold">
                            {stu.email} • {stu.college}
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-brand bg-brand-accent px-2 py-0.5 rounded">
                          {stu.role}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT APPLICATIONS MANAGEMENT */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">Internship Applicants Review</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Review student submissions, attached resumes, and change evaluation status in realtime.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search applicant..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <select
                  value={appFilterStatus}
                  onChange={(e) => setAppFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase font-extrabold text-slate-400">
                    <th className="pb-3 px-2">Applicant</th>
                    <th className="pb-3 px-2">College & Branch</th>
                    <th className="pb-3 px-2">Internship Program</th>
                    <th className="pb-3 px-2">Resume File</th>
                    <th className="pb-3 px-2">Applied At</th>
                    <th className="pb-3 px-2 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No applications matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-2">
                          <span className="font-extrabold text-slate-900 block text-sm">
                            {app.user?.name || 'Unknown Student'}
                          </span>
                          <span className="text-slate-400 text-[11px]">{app.user?.email}</span>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="text-slate-800 block">{app.college}</span>
                          <span className="text-slate-400 text-[11px]">{app.branch}</span>
                        </td>
                        <td className="py-3.5 px-2 font-bold text-indigo-700">
                          {app.internship?.title || 'Program'}
                        </td>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-slate-500">
                          📄 {app.resumeName}
                        </td>
                        <td className="py-3.5 px-2 text-slate-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`text-xs font-extrabold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : app.status === 'Under Review'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : app.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COURSES MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">Curriculum Management</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Create, edit, or remove courses from the public database catalog.
                </p>
              </div>
              <button
                onClick={() => setShowCourseModal(true)}
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="h-4 w-4" />
                New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-brand-accent text-brand">
                        {c.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base mt-1.5">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(c._id, c.title)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-200/60">
                    <span>Duration: {c.duration}</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{c.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INTERNSHIPS MANAGEMENT */}
        {activeTab === 'internships' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">
                  Internship Programs Management
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Publish new internship openings or delete completed terms.
                </p>
              </div>
              <button
                onClick={() => setShowInternshipModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="h-4 w-4" />
                New Internship
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internships.map((i) => (
                <div
                  key={i._id}
                  className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {i.duration}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base mt-1.5">{i.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{i.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteInternship(i._id, i.title)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Internship"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-200/60">
                    <span>Stipend: {i.stipend}</span>
                    <span className="text-emerald-700 font-extrabold text-xs">
                      {i.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">Add New Training Course</h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Next.js 14 Enterprise Architecture"
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows="2"
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Comprehensive training details..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none"
                  >
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>Data Science & AI</option>
                    <option>Security</option>
                    <option>Cloud & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Difficulty Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Syllabus Modules (comma-separated)</label>
                <input
                  type="text"
                  value={courseForm.syllabus}
                  onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Projects (comma-separated)</label>
                <input
                  type="text"
                  value={courseForm.projects}
                  onChange={(e) => setCourseForm({ ...courseForm, projects: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand text-white rounded-xl text-xs font-bold hover:bg-brand-dark shadow"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INTERNSHIP MODAL */}
      {showInternshipModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">Add New Internship Program</h3>
              <button onClick={() => setShowInternshipModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInternship} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Internship Title</label>
                <input
                  type="text"
                  required
                  value={internshipForm.title}
                  onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                  placeholder="e.g. Cloud Infrastructure & DevOps Intern"
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows="2"
                  required
                  value={internshipForm.description}
                  onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Duration</label>
                  <input
                    type="text"
                    value={internshipForm.duration}
                    onChange={(e) => setInternshipForm({ ...internshipForm, duration: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm({ ...internshipForm, stipend: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Skills Required (comma-separated)</label>
                <input
                  type="text"
                  value={internshipForm.skillsRequired}
                  onChange={(e) => setInternshipForm({ ...internshipForm, skillsRequired: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInternshipModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow"
                >
                  Publish Internship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
