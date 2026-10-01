import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  User,
  GraduationCap,
  Building2,
  MapPin,
  CheckCircle2,
  Lock,
  Unlock,
  Download,
  Save,
  Printer,
  X,
  Shield,
  CreditCard,
  Calendar,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingUp,
  FileText,
  Briefcase,
  Play,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import GlareHover from '../components/CardHoverAnim';
import InvoiceModal from '../components/InvoiceModal';
import CertificateModal from '../components/CertificateModal';
import LessonPlayerModal from '../components/LessonPlayerModal';
import confetti from 'canvas-confetti';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, myApplications, updateProfile, punchAttendance, submitSupportTicket, showToast } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  // Active Tab
  const [activePane, setActivePane] = useState('overview');

  // Modals state
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeLessonCourse, setActiveLessonCourse] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  // Local progress storage
  const [courseProgress, setCourseProgress] = useState({});

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    college: '',
    branch: '',
    phone: '',
    avatar: '',
    bio: '',
    semester: 'Semester 6',
    graduationYear: '2026',
    rollNumber: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  // Settings Security State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Support Ticket Modal & AI Chat
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Academic & Curriculum',
    priority: 'Medium',
    description: '',
  });
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Mountreach Academic Counselor. How can I help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Sync profile details on load
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        phone: user.phone || '',
        avatar: user.avatar || AVATAR_OPTIONS[0],
        bio: user.bio || 'Computer Science & Engineering Diploma Scholar passionate about Full Stack Web Architectures.',
        semester: user.semester || 'Semester 6',
        graduationYear: user.graduationYear || '2026',
        rollNumber: user.rollNumber || 'DIP-2023-CS-042',
        githubUrl: user.githubUrl || 'https://github.com',
        linkedinUrl: user.linkedinUrl || 'https://linkedin.com',
      });

      // Load progress
      const storedProgress = localStorage.getItem(`progress_${user._id}`);
      if (storedProgress) {
        setCourseProgress(JSON.parse(storedProgress));
      } else {
        const defaultProg = {};
        user.enrolledCourses?.forEach((c, idx) => {
          defaultProg[c._id || c] = idx === 0 ? 100 : 50;
        });
        localStorage.setItem(`progress_${user._id}`, JSON.stringify(defaultProg));
        setCourseProgress(defaultProg);
      }
    }
  }, [user]);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-brand animate-spin mx-auto" />
          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg">Loading Student Portal...</h3>
        </div>
      </div>
    );
  }

  // Attendance Calculations
  const attendanceList = user.attendance || [];
  const todayStr = new Date().toISOString().split('T')[0];
  const isPunchedToday = attendanceList.some((a) => a.date === todayStr);
  const totalDays = Math.max(attendanceList.length, 18);
  const presentDays = Math.max(attendanceList.filter((a) => a.status === 'Present').length, 17);
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  // Profile Completeness calculation
  const completenessFields = [
    profileForm.name,
    profileForm.college,
    profileForm.branch,
    profileForm.phone,
    profileForm.bio,
    profileForm.semester,
    profileForm.githubUrl,
    profileForm.linkedinUrl,
  ];
  const filledFieldsCount = completenessFields.filter((f) => Boolean(f && f.trim())).length;
  const profileCompleteness = Math.round((filledFieldsCount / completenessFields.length) * 100);

  // Handle punch attendance
  const handlePunchToday = async () => {
    await punchAttendance('Industrial Full Stack & Cloud Lab', 'Online');
  };

  // Handle simulate lesson progress
  const handleSimulateProgress = (courseId) => {
    const nextProg = { ...courseProgress };
    const current = nextProg[courseId] || 0;

    if (current < 100) {
      const updated = Math.min(100, current + 25);
      nextProg[courseId] = updated;
      setCourseProgress(nextProg);
      localStorage.setItem(`progress_${user._id}`, JSON.stringify(nextProg));

      if (updated === 100) {
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
        showToast('🎉 Course 100% Completed! ISO 9001:2015 Certificate unlocked in Certificates tab!', 'success');
      } else {
        showToast(`Progress updated to ${updated}%! Keep going!`, 'info');
      }
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const result = await updateProfile(profileForm);
    setSavingProfile(false);
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSavingPassword(true);
    const result = await updateProfile(user.name, user.college, user.branch, newPassword);
    setSavingPassword(false);
    if (result.success) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Handle Ticket Submit
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      showToast('Subject and description are required.', 'warning');
      return;
    }

    const res = await submitSupportTicket(ticketForm);
    if (res.success) {
      setTicketModalOpen(false);
      setTicketForm({ subject: '', category: 'Academic & Curriculum', priority: 'Medium', description: '' });
    }
  };

  // AI Chat simulation
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      let reply = 'Thank you for your inquiry. Our senior technical instructor will guide you on this shortly.';
      const lower = userText.toLowerCase();
      if (lower.includes('certificate') || lower.includes('iso')) {
        reply = 'Certificates are issued with ISO 9001:2015 verification stamp upon completing 100% of course milestones and maintaining over 75% attendance.';
      } else if (lower.includes('stipend') || lower.includes('internship')) {
        reply = 'Internship stipends are disbursed bi-weekly via direct bank transfer after mentor evaluation of commercial repo milestones.';
      } else if (lower.includes('attendance')) {
        reply = 'You can punch in your attendance daily before 11:59 PM from the Attendance tab on this dashboard to maintain your learning streak!';
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 700);
  };

  // Download Attendance CSV
  const handleDownloadAttendanceCSV = () => {
    const rows = [
      ['Date', 'Session Name', 'Mode', 'Status'],
      ...(attendanceList.length > 0
        ? attendanceList.map((a) => [a.date, a.sessionName || 'Lab', a.mode || 'Online', a.status || 'Present'])
        : [
            ['2026-01-10', 'Full Stack System Architecture', 'Online', 'Present'],
            ['2026-01-11', 'Microservices & REST APIs', 'Online', 'Present'],
            ['2026-01-12', 'Database Sharding & MongoDB Atlas', 'Online', 'Present'],
          ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mountreach_Attendance_${user.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report CSV downloaded successfully!', 'success');
  };

  const enrolled = user.enrolledCourses || [];

  return (
    <div className="bg-slate-50 dark:bg-[#0b0f19] min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP GREETING & COMMAND BANNER */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profileForm.avatar || AVATAR_OPTIONS[0]}
                alt={user.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-brand/20 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-bold" title="Online & Active">
                ✓
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <span className="bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 text-xs font-black uppercase px-2.5 py-0.5 rounded-md border border-brand/20">
                  Verified Scholar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                {user.college} • {user.branch}
              </p>
            </div>
          </div>

          {/* Quick Streak & Punch Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded-2xl flex-1 md:flex-initial">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                <Flame className="h-5 w-5 animate-bounce-short" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 block tracking-wider">
                  Active Streak
                </span>
                <span className="text-sm font-black text-amber-900 dark:text-amber-200">
                  {presentDays} Days Check-in
                </span>
              </div>
            </div>

            {!isPunchedToday ? (
              <button
                onClick={handlePunchToday}
                className="bg-brand hover:bg-brand-dark text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-brand/20 transition-all transform hover:scale-105"
              >
                <Check className="h-4 w-4" />
                Punch In Today
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-4 py-3 rounded-2xl text-xs font-black">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Attended Today
              </div>
            )}
          </div>
        </div>

        {/* 4 CORE KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-brand dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block tracking-wider">
                Enrolled Programs
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {enrolled.length}
              </span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block tracking-wider">
                Attendance Ratio
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {attendanceRate}%
              </span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block tracking-wider">
                ISO Certificates
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {enrolled.filter((c) => (courseProgress[c._id || c] || 0) === 100).length}
              </span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block tracking-wider">
                Internship Applications
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {myApplications?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS HEADER */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl px-2 p-1.5 shadow-xs overflow-x-auto gap-1">
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'courses', name: `My Courses (${enrolled.length})`, icon: BookOpen },
            { id: 'attendance', name: 'Attendance', icon: Calendar },
            { id: 'progress', name: 'Learning Progress', icon: TrendingUp },
            { id: 'certificates', name: 'Certificates', icon: Award },
            { id: 'payments', name: 'Payments & Billing', icon: CreditCard },
            { id: 'applications', name: `Internships (${myApplications?.length || 0})`, icon: Briefcase },
            { id: 'profile', name: 'Edit Profile', icon: User },
            { id: 'settings', name: 'Settings', icon: Settings },
            { id: 'help', name: 'Help Desk', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activePane === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePane(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activePane === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Active Learning Track */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                        Continue Learning Curriculum
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        Pick up directly where you left off in your industrial modules
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePane('courses')}
                      className="text-xs font-bold text-brand dark:text-blue-400 hover:underline"
                    >
                      View All Courses →
                    </button>
                  </div>

                  {enrolled.length === 0 ? (
                    <div className="text-center py-10 space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No courses enrolled yet.</p>
                      <Link
                        to="/courses"
                        className="inline-block bg-brand hover:bg-brand-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
                      >
                        Explore ISO Certified Catalog
                      </Link>
                    </div>
                  ) : (
                    enrolled.slice(0, 2).map((course) => {
                      const prog = courseProgress[course._id || course] || 0;
                      return (
                        <div
                          key={course._id}
                          className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="text-[10px] font-black uppercase text-brand dark:text-blue-400 bg-brand-accent/50 dark:bg-brand/20 px-2 py-0.5 rounded">
                                {course.category || 'Tech Training'}
                              </span>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-base mt-1.5">
                                {course.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Instructor: {course.instructor || 'Senior Technical Mentor'} • Duration: {course.duration}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setActiveLessonCourse(course);
                                setLessonIndex(0);
                              }}
                              className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              Resume Lesson
                            </button>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                              <span>Syllabus Completion</span>
                              <span className="font-black text-slate-900 dark:text-white">{prog}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-brand h-full rounded-full transition-all duration-500"
                                style={{ width: `${prog}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Upcoming Live Lab Sessions */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand dark:text-blue-400" />
                    Upcoming Industrial Live Labs & Sessions
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          Distributed Caching with Redis & Node.js
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Tomorrow at 06:00 PM IST • Online Live Classroom
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-brand-accent/50 dark:bg-brand/20 text-brand dark:text-blue-400 uppercase">
                        Scheduled
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          CI/CD GitHub Actions & Production Containerization
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Saturday at 11:00 AM IST • Lab Hands-On
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 uppercase">
                        Lab Exam
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Profile Completeness & Quick Actions */}
              <div className="space-y-6">
                
                {/* Profile Completion Box */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Profile Completeness
                    </h3>
                    <span className="text-xs font-black text-brand dark:text-blue-400">
                      {profileCompleteness}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${profileCompleteness}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Complete your academic details, phone number, and LinkedIn profile to unlock prioritized corporate interview screening.
                  </p>

                  <button
                    onClick={() => setActivePane('profile')}
                    className="w-full py-2.5 text-center text-xs font-bold text-brand dark:text-blue-400 hover:bg-brand-accent/40 dark:hover:bg-brand/20 border border-brand/20 rounded-xl transition-all"
                  >
                    Edit Profile Details →
                  </button>
                </div>

                {/* ISO Verification Stamp Box */}
                <div className="bg-gradient-to-tr from-brand to-indigo-700 text-white rounded-3xl p-6 shadow-md shadow-brand/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      ISO 9001:2015 Accredited
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    Your certificates and training transcripts carry verifiable Industrial Verification Stamps accepted across tier-1 software corporations.
                  </p>
                  <button
                    onClick={() => setActivePane('certificates')}
                    className="bg-white text-brand hover:bg-slate-100 font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    View My Credentials
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY COURSES */}
        {activePane === 'courses' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Enrolled Curriculums</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Track your module milestones, build commercial projects, and claim graduation certificates
                </p>
              </div>
              <Link
                to="/courses"
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
              >
                + Browse More Courses
              </Link>
            </div>

            {enrolled.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">You are not enrolled in any courses yet.</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose from Web Development, Cloud DevOps, AI, and Android programs.</p>
                <Link
                  to="/courses"
                  className="inline-block bg-brand hover:bg-brand-dark text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all mt-2"
                >
                  Explore Course Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolled.map((course) => {
                  const prog = courseProgress[course._id || course] || 0;
                  const syllabusItems = Array.isArray(course.syllabus)
                    ? course.syllabus
                    : typeof course.syllabus === 'string'
                    ? course.syllabus.split(',')
                    : ['Module 1', 'Module 2', 'Capstone Project'];

                  return (
                    <div
                      key={course._id}
                      className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase text-brand dark:text-blue-400 bg-brand-accent/50 dark:bg-brand/20 px-2 py-0.5 rounded">
                            {course.category || 'Curriculum'}
                          </span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            ⏱ {course.duration || '8 Weeks'}
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 dark:text-white text-base">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Modules Checklist */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 block">
                            Key Modules Breakdown:
                          </span>
                          <div className="space-y-1">
                            {syllabusItems.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  prog >= (idx + 1) * 33 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                  {prog >= (idx + 1) * 33 ? '✓' : idx + 1}
                                </span>
                                <span className="truncate">{item.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Progress bar and CTAs */}
                      <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                            <span>Curriculum Progress</span>
                            <span className="font-black text-slate-900 dark:text-white">{prog}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-brand h-full rounded-full transition-all duration-500"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setActiveLessonCourse(course);
                              setLessonIndex(0);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded-xl text-xs shadow transition-all"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            Open Video Lab
                          </button>
                          
                          <button
                            onClick={() => handleSimulateProgress(course._id)}
                            className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold rounded-xl text-xs transition-all"
                            title="Simulate completing lessons to advance progress"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            +25%
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activePane === 'attendance' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Industrial Attendance Tracker</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Daily punch-ins and ISO 9001 compliance criteria (Minimum 75% required for certification)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadAttendanceCSV}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV Log
                </button>
                
                {!isPunchedToday ? (
                  <button
                    onClick={handlePunchToday}
                    className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Punch Today's Session
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Checked in for Today
                  </span>
                )}
              </div>
            </div>

            {/* Attendance Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/60">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">Overall Rate</span>
                <span className="text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1 block">
                  {attendanceRate}%
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                  ✓ ISO Criteria Met (&gt;75%)
                </span>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 block">Present Days</span>
                <span className="text-3xl font-black text-blue-900 dark:text-blue-200 mt-1 block">
                  {presentDays}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block mt-1">
                  Verified Lab Sessions
                </span>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/60">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">Current Streak</span>
                <span className="text-3xl font-black text-amber-900 dark:text-amber-200 mt-1 block">
                  {presentDays} Days
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-1">
                  🔥 Continuous Momentum
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Leaves / Excused</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  1
                </span>
                <span className="text-[10px] text-slate-400 font-bold block mt-1">
                  Authorized Absence
                </span>
              </div>
            </div>

            {/* Monthly Calendar Heatmap Representation */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Monthly Check-in Matrix
                </h4>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Late / Lab
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Scheduled
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} className="text-[10px] font-black uppercase text-slate-400 py-1">
                    {day}
                  </span>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const dayNum = i + 1;
                  const isPresent = dayNum <= presentDays;
                  return (
                    <div
                      key={i}
                      className={`h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 ${
                        isPresent
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance Session Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-extrabold text-slate-400">
                    <th className="pb-3">Session Date</th>
                    <th className="pb-3">Session Topic</th>
                    <th className="pb-3">Delivery Mode</th>
                    <th className="pb-3">Verification Timestamp</th>
                    <th className="pb-3 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {(attendanceList.length > 0
                    ? attendanceList
                    : [
                        { date: todayStr, sessionName: 'Full Stack Distributed Systems', mode: 'Online', timestamp: new Date(), status: 'Present' },
                        { date: '2026-01-14', sessionName: 'Containerization & Docker Swarm', mode: 'Online', timestamp: new Date(Date.now() - 86400000), status: 'Present' },
                        { date: '2026-01-13', sessionName: 'Database Indexing & Sharding', mode: 'Lab Campus', timestamp: new Date(Date.now() - 172800000), status: 'Present' },
                      ]
                  ).map((att, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-slate-900 dark:text-white">{att.date}</td>
                      <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{att.sessionName || 'Technical Lab'}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{att.mode || 'Online'}</td>
                      <td className="py-3 text-slate-400">{new Date(att.timestamp || Date.now()).toLocaleTimeString()}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          {att.status || 'Present'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LEARNING PROGRESS */}
        {activePane === 'progress' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Learning Analytics & Skill Matrix</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Real-time competency assessment and industrial readiness metrics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Technical Competencies Breakdown */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                <h4 className="font-black text-slate-900 dark:text-white text-sm">
                  Technical Proficiency Benchmarks
                </h4>
                
                <div className="space-y-3">
                  {[
                    { skill: 'Modern Web Architecture (React & Next.js)', level: 90 },
                    { skill: 'Backend REST API & Microservices (Node.js)', level: 85 },
                    { skill: 'Database Engineering (MongoDB & Atlas)', level: 88 },
                    { skill: 'Cloud & Automated DevOps (Docker / CI/CD)', level: 75 },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{s.skill}</span>
                        <span className="font-black text-brand dark:text-blue-400">{s.level}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand h-full rounded-full transition-all duration-500"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Study Hours Bar Chart Simulation */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">
                    Weekly Study Effort (Hours Logged)
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Total: 18.5 Hrs
                  </span>
                </div>

                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {[
                    { day: 'Mon', hrs: 2.5, height: '45%' },
                    { day: 'Tue', hrs: 3.0, height: '60%' },
                    { day: 'Wed', hrs: 1.5, height: '30%' },
                    { day: 'Thu', hrs: 4.0, height: '80%' },
                    { day: 'Fri', hrs: 3.5, height: '70%' },
                    { day: 'Sat', hrs: 2.0, height: '40%' },
                    { day: 'Sun', hrs: 2.0, height: '40%' },
                  ].map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-400">{d.hrs}h</span>
                      <div
                        className="w-7 sm:w-9 bg-brand hover:bg-brand-dark rounded-t-lg transition-all duration-300 shadow-xs"
                        style={{ height: d.height }}
                      />
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATES */}
        {activePane === 'certificates' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                ISO 9001:2015 Industrial Credentials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Official verified certificates of completion with QR authentication and LinkedIn badges
              </p>
            </div>

            {enrolled.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Award className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">No certificates earned yet.</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Complete 100% of your course syllabus to unlock official credentials.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolled.map((course) => {
                  const prog = courseProgress[course._id || course] || 0;
                  const isUnlocked = prog === 100;

                  return (
                    <div
                      key={course._id}
                      className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800/60 border-brand/30 shadow-md shadow-brand/5'
                          : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-80'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                            isUnlocked
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                          }`}>
                            {isUnlocked ? '✓ ISO Certified' : 'In Progress (Locked)'}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            MR-{course._id?.slice(-6).toUpperCase()}
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 dark:text-white text-base">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Accreditation: ISO 9001:2015 Industrial Verification Stamp
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                        {isUnlocked ? (
                          <button
                            onClick={() => setSelectedCertificate(course)}
                            className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                          >
                            <Award className="h-4 w-4" />
                            View & Print ISO Certificate
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>Milestones Done: {prog}%</span>
                              <span>Need 100% to unlock</span>
                            </div>
                            <button
                              onClick={() => handleSimulateProgress(course._id)}
                              className="w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-brand hover:text-white text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors"
                            >
                              Advance Course Progress (+25%)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PAYMENTS & BILLING */}
        {activePane === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                  Billing History & Tax Invoices
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Official GST Invoices (HSN: 999293) and payment transaction receipts
                </p>
              </div>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold">
                <CreditCard className="h-4 w-4" /> PCI-DSS 256-Bit Encrypted
              </span>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-extrabold text-slate-400">
                    <th className="pb-3">Invoice Number</th>
                    <th className="pb-3">Particulars (Program)</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Amount (INR)</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {(user.payments && user.payments.length > 0
                    ? user.payments
                    : enrolled.map((c, i) => ({
                        invoiceNumber: `INV-2026-${89201 + i}`,
                        courseTitle: c.title,
                        date: new Date(Date.now() - i * 86400000 * 4),
                        paymentMethod: 'UPI / Online Card',
                        amount: c.price || 4999,
                        status: 'Captured',
                        transactionId: `TXN-${Date.now()}-${8821 + i}`,
                      }))
                  ).map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-mono text-slate-900 dark:text-white font-bold">
                        {inv.invoiceNumber || `INV-2026-${89201 + idx}`}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {inv.courseTitle || 'Industrial Full Stack Curriculum'}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">
                        {new Date(inv.date || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">
                        {inv.paymentMethod || 'UPI / Card'}
                      </td>
                      <td className="py-3.5 font-black text-slate-900 dark:text-white">
                        ₹{Number(inv.amount || 4999).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                          {inv.status || 'Captured'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-xs font-bold text-brand dark:text-blue-400 hover:underline"
                        >
                          View Tax Invoice →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: INTERNSHIP APPLICATIONS */}
        {activePane === 'applications' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                  Internship Application Tracking
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Real-time status updates from Mountreach corporate partner review desks
                </p>
              </div>
              <Link
                to="/internships"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
              >
                + Browse Open Positions
              </Link>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">No applications submitted yet.</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Apply for high-stipend corporate internships tailored for diploma and engineering students.</p>
                <Link
                  to="/internships"
                  className="inline-block bg-brand hover:bg-brand-dark text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all mt-2"
                >
                  Explore Internship Hub
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app._id}
                    className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {app.internship?.title || 'Industrial Internship'}
                        </h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                            : app.status === 'Under Review'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Company: {app.internship?.company || 'Mountreach Solution'} • Stipend: {app.internship?.stipend || '₹8,000/mo'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        Applied On: {new Date(app.appliedAt).toLocaleDateString()} • Resume: 📄 {app.resumeName}
                      </p>
                    </div>

                    {/* Progress Pipeline */}
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">1</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Screening</span>
                      <span className="h-0.5 w-6 bg-slate-300 dark:bg-slate-700" />
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                        app.status !== 'Applied' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>2</span>
                      <span className={app.status !== 'Applied' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Review</span>
                      <span className="h-0.5 w-6 bg-slate-300 dark:bg-slate-700" />
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                        app.status === 'Accepted' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>3</span>
                      <span className={app.status === 'Accepted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Decision</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: PROFILE SECTION (EDIT PROFILE) */}
        {activePane === 'profile' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Student Profile & Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Update your academic records, contact info, and professional portfolios
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {AVATAR_OPTIONS.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Avatar"
                      onClick={() => setProfileForm({ ...profileForm, avatar: imgUrl })}
                      className={`h-14 w-14 rounded-2xl object-cover cursor-pointer border-2 transition-transform hover:scale-105 ${
                        profileForm.avatar === imgUrl ? 'border-brand ring-2 ring-brand/30 scale-105' : 'border-slate-200 dark:border-slate-700 opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Legal Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Registered Email (Verified)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    College / Polytechnic Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Branch / Specialization
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Current Semester
                  </label>
                  <select
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6 (Final Year)</option>
                    <option>Graduated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={profileForm.graduationYear}
                    onChange={(e) => setProfileForm({ ...profileForm, graduationYear: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Institutional Roll / ID No.
                  </label>
                  <input
                    type="text"
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio & Social Links */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Professional Bio / Objective
                </label>
                <textarea
                  rows="2"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    GitHub Profile Link
                  </label>
                  <input
                    type="url"
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    LinkedIn Profile Link
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedinUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                {savingProfile ? 'Saving Details...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activePane === 'settings' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Account Preferences & Security</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Manage your credentials, theme appearance, and communication alerts
              </p>
            </div>

            {/* Appearance Theme Selector */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">Interface Theme</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Toggle between high-contrast Dark and crisp Light aesthetic</span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs hover:scale-105 transition-all"
              >
                Current: {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>

            {/* Change Password Form */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Change Security Password
              </h4>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full p-3 pr-10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  className="bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-all"
                >
                  {savingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Active Sessions */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">Active Learning Sessions</span>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Chrome on Windows 11 (Current Web Session)
                </span>
                <span className="text-slate-400">Active Now</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: HELP DESK */}
        {activePane === 'help' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Student Support & Help Center</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Frequently asked questions, live counselor chat, and official helpdesk tickets
                </p>
              </div>

              <button
                onClick={() => setTicketModalOpen(true)}
                className="bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
              >
                + Submit Support Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: FAQs Accordion */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Frequently Asked Questions
                </h4>

                {[
                  {
                    q: 'How do I download my ISO 9001:2015 Certificate?',
                    a: 'Once your course syllabus progress reaches 100% and attendance criteria is satisfied, your certificate unlocks automatically in the "Certificates" tab. You can print it as an authentic high-resolution PDF or share it to your LinkedIn profile.',
                  },
                  {
                    q: 'How does the industrial attendance system work?',
                    a: 'Students should click "Punch In Today" once daily from the Attendance tab. Maintaining a minimum of 75% attendance ratio is mandatory to remain eligible for ISO certification and corporate internship stipends.',
                  },
                  {
                    q: 'When are internship monthly stipends disbursed?',
                    a: 'Internship stipends are disbursed between the 1st and 5th of each calendar month directly into your bank account after bi-weekly technical milestone evaluation.',
                  },
                  {
                    q: 'Can I change my registered college name or branch?',
                    a: 'Yes! Simply navigate to the "Edit Profile" tab on this dashboard, update your college/branch name, and click "Save Profile Changes". It immediately updates your institutional records.',
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 cursor-pointer"
                    onClick={() => setExpandedFaq(expandedFaq === i ? -1 : i)}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                      <span>{faq.q}</span>
                      {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-brand" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                    {expandedFaq === i && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Right: Live Counselor Chat Simulator */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4 h-96">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Mountreach Academic Assistant</h5>
                    <span className="text-[10px] text-emerald-500 font-bold">● Active 24/7 Support</span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl ${
                          m.sender === 'user'
                            ? 'bg-brand text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-brand hover:bg-brand-dark text-white p-2.5 rounded-xl shadow transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: CERTIFICATE MODAL */}
      <CertificateModal
        certificate={selectedCertificate}
        user={user}
        isOpen={Boolean(selectedCertificate)}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* MODAL 2: INVOICE MODAL */}
      <InvoiceModal
        invoice={selectedInvoice}
        user={user}
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* MODAL 3: LESSON PLAYER MODAL */}
      <LessonPlayerModal
        course={activeLessonCourse}
        lessonIndex={lessonIndex}
        isOpen={Boolean(activeLessonCourse)}
        onClose={() => setActiveLessonCourse(null)}
        onLessonCompleted={(cId) => handleSimulateProgress(cId)}
      />

      {/* MODAL 4: SUBMIT SUPPORT TICKET MODAL */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Raise Academic Support Ticket</h3>
              <button onClick={() => setTicketModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Ticket Category
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option>Academic & Curriculum</option>
                  <option>LMS & Video Lab Technical</option>
                  <option>Internship Stipend & Hiring</option>
                  <option>ISO Certificate Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question on Lecture 4 Docker deployment"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your question or issue in detail..."
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-xs shadow"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
