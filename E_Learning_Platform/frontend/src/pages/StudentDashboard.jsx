import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { LayoutDashboard, BookOpen, Award, Settings, User, GraduationCap, Building2, MapPin, CheckCircle2, Lock, Unlock, Download, Save, Printer, X, Shield } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, myApplications, updateProfile, showToast } = useContext(AuthContext);
  const [activePane, setActivePane] = useState('courses');
  
  // Track course completion progress simulated locally
  // Keys will be courseId, values will be progress percentage (0 - 100)
  const [courseProgress, setCourseProgress] = useState({});
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  
  // Settings Form state
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [password, setPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  // Sync settings inputs when user details load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setBranch(user.branch || '');

      // Load or initialize course progress map in local storage
      const storedProgress = localStorage.getItem(`progress_${user._id}`);
      if (storedProgress) {
        setCourseProgress(JSON.parse(storedProgress));
      } else {
        // Initialize default progress for enrolled courses
        const defaultProg = {};
        user.enrolledCourses?.forEach((c, idx) => {
          // Give one course 100% progress so they can inspect certificates right away, others partial
          defaultProg[c._id || c] = idx === 0 ? 100 : 45;
        });
        localStorage.setItem(`progress_${user._id}`, JSON.stringify(defaultProg));
        setCourseProgress(defaultProg);
      }
    }
  }, [user]);

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center animate-pulse">
        <LayoutDashboard className="h-12 w-12 text-slate-300 animate-spin" />
        <h3 className="text-xl font-bold text-slate-700 mt-4">Loading dashboard portal...</h3>
      </div>
    );
  }

  // Update progress helper
  const handleSimulateProgress = (courseId) => {
    const nextProg = { ...courseProgress };
    const current = nextProg[courseId] || 0;
    
    if (current < 100) {
      nextProg[courseId] = Math.min(100, current + 25);
      setCourseProgress(nextProg);
      localStorage.setItem(`progress_${user._id}`, JSON.stringify(nextProg));
      
      if (nextProg[courseId] === 100) {
        showToast('Congratulations! You completed the course and unlocked its certificate!', 'success');
      } else {
        showToast(`Progress increased to ${nextProg[courseId]}%!`, 'info');
      }
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !college.trim() || !branch.trim()) {
      showToast('Fields cannot be empty.', 'warning');
      return;
    }

    setUpdating(true);
    const result = await updateProfile(name, college, branch, password || null);
    setUpdating(false);
    if (result.success) {
      setPassword('');
    }
  };

  const getProgressVal = (courseId) => courseProgress[courseId] || 0;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Administrator Mode Quick Banner */}
        {user.role === 'admin' && (
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-indigo-700/40">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black text-xl shadow-md">
                👑
              </div>
              <div>
                <div className="font-black text-sm sm:text-base flex items-center gap-2">
                  <span>Administrator Session Active</span>
                  <span className="bg-amber-400 text-indigo-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  You are logged into the dedicated Admin account. Review student applications, manage course catalogs, and track real-time analytics.
                </p>
              </div>
            </div>
            <Link
              to="/admin"
              className="bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs px-5 py-3 rounded-2xl shadow transition-all hover:scale-105 whitespace-nowrap flex items-center gap-1.5"
            >
              <Shield className="h-4 w-4 text-indigo-950" />
              Open Admin Dashboard →
            </Link>
          </div>
        )}

        {/* Profile Card Summary Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center gap-4 relative">
            <div className="h-16 w-16 bg-brand text-white font-black text-2xl rounded-2xl flex items-center justify-center border-4 border-slate-100 shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{user.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 mt-1.5 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Building2 className="h-3.5 w-3.5" />
                  {user.college}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {user.branch}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 text-center border-t border-slate-100 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-around md:justify-end">
            <div className="px-4">
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Courses</span>
              <span className="text-2xl font-black text-slate-900">{user.enrolledCourses?.length || 0}</span>
            </div>
            <div className="h-10 w-px bg-slate-200 self-center" />
            <div className="px-4">
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Applications</span>
              <span className="text-2xl font-black text-slate-900">{myApplications?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-1">
              <button
                onClick={() => setActivePane('courses')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  activePane === 'courses'
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                My Enrolled Courses
              </button>
              <button
                onClick={() => setActivePane('certificates')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  activePane === 'certificates'
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                }`}
              >
                <Award className="h-4 w-4" />
                My Certifications
              </button>
              <button
                onClick={() => setActivePane('applications')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  activePane === 'applications'
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Internship Applications
              </button>
              <button
                onClick={() => setActivePane('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  activePane === 'settings'
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                }`}
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </button>
            </div>
          </div>

          {/* Main Content Pane */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[450px]">
              
              {/* PANES */}
              {/* Courses Pane */}
              {activePane === 'courses' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Enrolled Training Curriculums</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Click "Study & Code" to simulate completing coursework steps.</p>
                  </div>

                  {!user.enrolledCourses || user.enrolledCourses.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="font-bold text-slate-800">No active course enrollments</h4>
                      <p className="text-slate-500 text-xs mt-1">Explore our 7 core catalogs to sign up for classes.</p>
                      <button
                        onClick={() => navigate('/courses')}
                        className="mt-4 bg-brand text-white text-xs font-bold px-5 py-2 rounded-xl"
                      >
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.enrolledCourses.map((course) => {
                        const progress = getProgressVal(course._id || course);
                        return (
                          <div key={course._id || course} className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm space-y-4">
                            <div>
                              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-brand-accent text-brand rounded">
                                {course.category}
                              </span>
                              <h4 className="font-extrabold text-slate-900 text-base mt-2">{course.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                            </div>

                            {/* Progress bar info */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                                <span>Program Coursework</span>
                                <span className={progress === 100 ? 'text-emerald-600' : 'text-brand'}>
                                  {progress}% Complete
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    progress === 100 ? 'bg-emerald-500' : 'bg-brand'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Button controls */}
                            <div className="flex gap-2">
                              {progress === 100 ? (
                                <button
                                  onClick={() => {
                                    setSelectedCertificate(course);
                                    setActivePane('certificates');
                                  }}
                                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1"
                                >
                                  <Award className="h-4 w-4" />
                                  View Verified Certificate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSimulateProgress(course._id || course)}
                                  className="w-full bg-brand hover:bg-brand-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200"
                                >
                                  Study & Code (+25%)
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Certificates Pane */}
              {activePane === 'certificates' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Academic & Industrial Certifications</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Certificates unlock automatically upon reaching 100% course progress.</p>
                  </div>

                  {!user.enrolledCourses || user.enrolledCourses.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                      <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-xs">No programs enrolled to track certifications.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.enrolledCourses.map((course) => {
                        const progress = getProgressVal(course._id || course);
                        const isUnlocked = progress === 100;
                        return (
                          <div
                            key={course._id || course}
                            className={`p-5 border rounded-2xl flex items-center justify-between transition-all duration-200 ${
                              isUnlocked
                                ? 'bg-white border-slate-200 hover:shadow-md cursor-pointer'
                                : 'bg-slate-50/50 border-slate-100 text-slate-400'
                            }`}
                            onClick={() => isUnlocked && setSelectedCertificate(course)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                                {isUnlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                              </div>
                              <div>
                                <h4 className={`font-extrabold text-sm ${isUnlocked ? 'text-slate-950' : 'text-slate-500'}`}>
                                  {course.title}
                                </h4>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">
                                  {isUnlocked ? 'Accreditation Unlocked' : 'Locked (Needs 100% Progress)'}
                                </span>
                              </div>
                            </div>
                            
                            {isUnlocked && (
                              <button
                                className="bg-brand-accent hover:bg-brand text-brand hover:text-white p-2 rounded-lg transition-all duration-200"
                                title="Download / Print Certificate"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Applications Pane */}
              {activePane === 'applications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Internship Application Status</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Check status updates on your submitted applications.</p>
                  </div>

                  {myApplications.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <LayoutDashboard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="font-bold text-slate-800">No active applications</h4>
                      <p className="text-slate-500 text-xs mt-1">Browse our internship hub and submit your requests.</p>
                      <button
                        onClick={() => navigate('/internships')}
                        className="mt-4 bg-brand text-white text-xs font-bold px-5 py-2 rounded-xl"
                      >
                        Browse Internships
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myApplications.map((app) => (
                        <div key={app._id} className="p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm hover:shadow transition-all duration-200">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                              {app.internship?.title || 'Internship Program'}
                            </h4>
                            <div className="flex flex-wrap gap-2 items-center mt-1 text-xs text-slate-500 font-semibold">
                              <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span>Resume: {app.resumeName}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-md border bg-indigo-50 border-indigo-100 text-indigo-700">
                              {app.branch}
                            </span>
                            <span className="text-xs font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md">
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Pane */}
              {activePane === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Student Profile Portal</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Edit academic parameters used to populate certificates.</p>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                          Email Address (Read-only)
                        </label>
                        <input
                          type="text"
                          value={user.email}
                          disabled
                          className="w-full p-3 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                          College Name
                        </label>
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                          Branch / Diploma
                        </label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Change Password (Leave empty to keep current)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-1.5 shadow"
                    >
                      <Save className="h-4 w-4" />
                      {updating ? 'Saving Changes...' : 'Update Settings'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Verified Stamp Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-12 relative overflow-hidden flex flex-col justify-between gap-8 my-8">
            
            {/* Close */}
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 print:hidden transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Certificate border frame */}
            <div className="border-8 border-slate-100 p-6 sm:p-10 rounded-2xl relative bg-white border-double border-spacing-2">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
              
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="mx-auto flex justify-center text-brand mb-2">
                  <GraduationCap className="h-14 w-14" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-wide uppercase">
                  Certificate of Course Completion
                </h2>
                <p className="text-brand-light text-xs font-bold uppercase tracking-widest">
                  Mountreach Solution Private Limited
                </p>
                <div className="h-0.5 w-1/3 bg-brand/30 mx-auto mt-2" />
              </div>

              {/* Body */}
              <div className="text-center mt-8 space-y-6 max-w-2xl mx-auto">
                <p className="text-sm text-slate-500 italic">This is to verify that student</p>
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-950 border-b border-slate-100 pb-2 max-w-md mx-auto">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                  has successfully completed the comprehensive industrial training program in
                  <br />
                  <strong className="text-brand text-lg font-black block mt-2">{selectedCertificate.title}</strong>
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Conducted over a duration of <span className="font-bold">{selectedCertificate.duration}</span>. The candidate has actively built and submitted all mandatory commercial projects to our supervisor committee.
                </p>
              </div>

              {/* Signature and verification stamps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 items-end pt-8 border-t border-slate-100">
                {/* Stamp */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 border-4 border-brand/20 bg-brand-accent text-brand rounded-full flex flex-col items-center justify-center font-bold text-[9px] text-center shadow shadow-brand/10">
                    <ShieldCheck className="h-5 w-5 mb-0.5 text-brand" />
                    VERIFIED
                    <span className="text-[7px] opacity-75 font-semibold">MOUNTREACH</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Verified Stamp</span>
                </div>

                {/* ID */}
                <div className="text-center font-mono text-[9px] sm:text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 self-center">
                  <span className="block font-bold uppercase text-[8px] text-slate-400 font-sans tracking-wider">Credential ID</span>
                  MR-{selectedCertificate._id?.substring(0, 8).toUpperCase() || 'MOCKID12'}-{user._id?.substring(0, 6).toUpperCase() || 'STUDID'}
                </div>

                {/* Director */}
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="font-serif italic text-slate-700 text-sm font-semibold border-b border-slate-200 pb-1 w-2/3">
                    Dhananjay S.
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Managing Director</span>
                </div>
              </div>

            </div>

            {/* Print and Download Actions */}
            <div className="flex gap-4 justify-center print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow"
              >
                <Printer className="h-4 w-4" />
                Print Certificate PDF
              </button>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
