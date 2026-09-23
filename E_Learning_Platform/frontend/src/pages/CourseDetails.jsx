import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import EnrollmentModal from '../components/EnrollmentModal';
import { Calendar, Clock, Award, ShieldCheck, CheckCircle2, ChevronRight, Play } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('syllabus');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
        showToast('Failed to load course details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-8 animate-pulse">
        <div className="h-10 w-1/4 rounded bg-slate-200" />
        <div className="h-60 rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="h-10 w-1/3 rounded bg-slate-200" />
            <div className="h-40 rounded bg-slate-200" />
          </div>
          <div className="h-60 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-800">Program Not Found</h2>
        <p className="text-slate-500">The course you are trying to view does not exist or was removed.</p>
        <button onClick={() => navigate('/courses')} className="bg-brand text-white py-3 px-6 rounded-xl font-bold">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Check if student is already enrolled in this course
  const isEnrolled = user?.enrolledCourses?.some(c => c._id === course._id || c === course._id);

  const handleEnrollClick = () => {
    if (!user) {
      showToast('Please login to enroll in courses.', 'warning');
      navigate('/login', { state: { from: `/courses/${course._id}` } });
      return;
    }
    setCheckoutOpen(true);
  };

  const handleEnrollSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Course Banner Header */}
      <section className="bg-slate-900 text-white relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Meta Info */}
            <div className="lg:col-span-8 space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-brand-light/20 text-brand-light px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-light/30">
                <ShieldCheck className="h-4 w-4" />
                Verified Training Curriculum
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
                {course.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                {course.description}
              </p>
              
              {/* Course Meta Grid */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-light" />
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-light" />
                  <span>Includes 3 Live Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-light" />
                  <span>ISO 9001:2015 stamp</span>
                </div>
              </div>
            </div>

            {/* Price & CTA box */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-6 text-center">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Accredited Program Tuition</span>
              <div className="text-4xl sm:text-5xl font-black text-white">
                ₹{course.price.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                Tuition covers direct mentor reviews, certification stamps, and host server deployments.
              </p>

              {isEnrolled ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-base shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Already Enrolled (Dashboard)
                </button>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-brand/20 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200"
                >
                  Enroll Program Now
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Tabbed Navigation Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Tabs Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs Buttons */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`pb-4 px-6 font-bold text-sm sm:text-base border-b-2 transition-all duration-200 ${
                  activeTab === 'syllabus'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-brand'
                }`}
              >
                Syllabus & Modules
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-4 px-6 font-bold text-sm sm:text-base border-b-2 transition-all duration-200 ${
                  activeTab === 'projects'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-brand'
                }`}
              >
                Included Projects
              </button>
              <button
                onClick={() => setActiveTab('certification')}
                className={`pb-4 px-6 font-bold text-sm sm:text-base border-b-2 transition-all duration-200 ${
                  activeTab === 'certification'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-brand'
                }`}
              >
                Accreditation Details
              </button>
            </div>

            {/* Dynamic Content view pane */}
            <div className="bg-slate-50/50 rounded-3xl p-6 sm:p-8 border border-slate-100 min-h-[300px]">
              
              {activeTab === 'syllabus' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Syllabus Breakdown</h3>
                  <div className="space-y-4">
                    {course.syllabus.map((module, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm items-start">
                        <div className="h-8 w-8 bg-brand-accent text-brand rounded-lg font-bold flex items-center justify-center text-sm flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">{module.split(':')[0]}</h4>
                          {module.includes(':') && (
                            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">{module.split(':')[1]}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Core Commercial Projects</h3>
                  <p className="text-slate-500 text-sm font-semibold">
                    Mountreach Solution certifies students only after they demonstrate complete execution of these live assignments.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {course.projects.map((proj, idx) => (
                      <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">{proj}</h4>
                        <span className="text-[10px] text-brand bg-brand-accent px-2 py-0.5 rounded font-extrabold inline-block w-max uppercase tracking-wider">
                          Review Required
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'certification' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Certification Credential Details</h3>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="flex gap-4 items-start">
                      <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">Mountreach Solution Stamp</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mt-1 font-medium">
                          {course.certificationDetails}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 my-4" />

                    <div className="flex gap-4 items-start">
                      <ShieldCheck className="h-8 w-8 text-brand-light flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">Verifiable Digital Registration</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mt-1 font-medium">
                          Upon payment authorization and project completion, your details are synchronized to the Mountreach Solution database. A secure QR code is embedded on the certificate for academic verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Sidebar Guidelines Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
              <h3 className="font-bold text-lg mb-4">Application Roadmap</h3>
              
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex gap-3">
                  <span className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center">1</span>
                  <div>
                    <span className="block text-slate-300">Submit Tuition Authorization</span>
                    <span className="text-slate-400 font-medium">Pay secure program fee simulating credit gateways.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center">2</span>
                  <div>
                    <span className="block text-slate-300">Access Dashboard Platform</span>
                    <span className="text-slate-400 font-medium">Track your learning progress and projects.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center">3</span>
                  <div>
                    <span className="block text-slate-300">Earn Verified Accreditation</span>
                    <span className="text-slate-400 font-medium">Unlock shareable PDF certificates co-signed by corporate architects.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Checkout Modal Popup */}
      <EnrollmentModal
        course={course}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  );
};

export default CourseDetails;
