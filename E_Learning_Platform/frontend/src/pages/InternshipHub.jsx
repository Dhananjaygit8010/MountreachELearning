import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import ApplicationModal from '../components/ApplicationModal';
import {
  Briefcase,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Search,
  X,
  Sparkles,
  Building2,
  Clock,
  Coins
} from 'lucide-react';

const InternshipHub = () => {
  const navigate = useNavigate();
  const { user, myApplications, showToast } = useContext(AuthContext);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch internships from backend
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await api.get('/internships');
      setInternships(response.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
      showToast('Failed to load internship listings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleApplyClick = (internship) => {
    if (!user) {
      showToast('Please login to apply for internships.', 'warning');
      navigate('/login', { state: { from: '/internships' } });
      return;
    }
    setSelectedInternship(internship);
    setModalOpen(true);
  };

  // Check if user has already applied for this specific internship
  const hasApplied = (internshipId) => {
    return myApplications?.some(
      (app) => app.internship === internshipId || app.internship?._id === internshipId
    );
  };

  // Search filtering
  const filteredInternships = internships.filter((intern) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      intern.title.toLowerCase().includes(q) ||
      intern.description.toLowerCase().includes(q) ||
      intern.skillsRequired?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-slate-50/50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
            <span>Industrial Experience Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Corporate Internship Openings
          </h1>
          <p className="text-slate-600 font-medium text-base">
            Work directly on production sprints with performance stipends and earn ISO 9001:2015 verified industrial experience credentials.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search internships by role or skill (e.g. React, Python, Kotlin, Cloud)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm"
              >
                <div className="h-6 w-1/3 rounded skeleton-shimmer" />
                <div className="h-8 w-2/3 rounded skeleton-shimmer" />
                <div className="h-16 w-full rounded skeleton-shimmer" />
                <div className="h-10 w-full rounded skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-sm space-y-3">
            <div className="h-14 w-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">No internships found</h3>
            <p className="text-slate-500 text-xs font-medium">
              Try searching for different keywords or reset your search.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredInternships.map((intern) => {
              const applied = hasApplied(intern._id);
              return (
                <div
                  key={intern._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                  {/* Top Meta */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-black tracking-wider bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                          {intern.duration}
                        </span>
                        {intern.isDummy && (
                          <span className="text-[10px] uppercase font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
                            Demo
                          </span>
                        )}
                      </div>
                      {intern.isoCertified && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          ISO 9001:2015
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight group-hover:text-brand transition-colors">
                        {intern.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-wider flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {intern.company}
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                      {intern.description}
                    </p>

                    {/* Skills Required */}
                    <div className="space-y-1.5 pt-2">
                      <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Skills Required
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {intern.skillsRequired?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded-lg border border-slate-200 font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Commercial Projects */}
                    {intern.projects && intern.projects.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Key Sprint Deliverables
                        </span>
                        <ul className="text-xs text-slate-600 font-semibold space-y-1.5">
                          {intern.projects.map((proj, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                              <span>{proj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4 relative z-10">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        Monthly Stipend
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {intern.stipend}
                      </span>
                    </div>

                    {applied ? (
                      <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-xs">
                        <UserCheck className="h-4 w-4" />
                        Application Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyClick(intern)}
                        className="bg-gradient-to-r from-brand to-indigo-600 hover:from-brand-dark hover:to-brand text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand/20 hover:shadow-lg transition-all"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        internship={selectedInternship}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default InternshipHub;
