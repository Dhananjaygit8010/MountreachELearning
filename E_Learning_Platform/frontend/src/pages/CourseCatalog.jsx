import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import {
  BookOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  Sparkles,
  Layers,
  Award,
  Filter,
  CheckCircle2
} from 'lucide-react';
import GlareHover from '../components/CardHoverAnim';


const CourseCatalog = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showToast('Failed to load courses from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Compute unique dynamic categories from database courses
  const dynamicCategories = [
    'All',
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))),
  ];

  // Levels list
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Multi-faceted filtering
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeFilter === 'All' || c.category === activeFilter;
    const matchesLevel = selectedLevel === 'All' || (c.level && c.level.toLowerCase() === selectedLevel.toLowerCase());
    const matchesSearch =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Gradient configurations matching category styles
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Web Development':
        return {
          bg: 'from-blue-600 via-indigo-600 to-indigo-700',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'Mobile Development':
        return {
          bg: 'from-cyan-500 via-blue-600 to-indigo-600',
          badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        };
      case 'Data Science & AI':
        return {
          bg: 'from-purple-600 via-indigo-600 to-blue-700',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'Security':
        return {
          bg: 'from-slate-800 via-slate-900 to-black',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
        };
      case 'Cloud & DevOps':
        return {
          bg: 'from-sky-500 via-blue-600 to-slate-900',
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      default:
        return {
          bg: 'from-brand via-indigo-600 to-brand-dark',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-brand-accent text-brand px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Industrial Curriculums</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Accredited Engineering Programs
          </h1>
          <p className="text-slate-600 font-medium text-base">
            Master full-scale commercial software architectures, real-time AI models, and cloud technologies with live project portfolios and ISO credentials.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-10 space-y-5">
          {/* Top Search & Level Controls */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by keyword, technology, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
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

            {/* Level Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-extrabold uppercase text-slate-400 whitespace-nowrap">
                Level:
              </span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLevel === lvl
                        ? 'bg-white text-brand shadow-xs'
                        : 'text-slate-600 hover:text-brand'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {dynamicCategories.map((cat) => {
              const count =
                cat === 'All'
                  ? courses.length
                  : courses.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                    activeFilter === cat
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      activeFilter === cat
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="h-48 skeleton-shimmer w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-1/3 rounded skeleton-shimmer" />
                  <div className="h-8 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-16 w-full rounded skeleton-shimmer" />
                  <div className="h-10 w-full rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto shadow-sm space-y-4">
            <div className="h-14 w-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">No matching programs found</h3>
              <p className="text-slate-500 text-sm mt-1">
                Try adjusting your search terms or category selection.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveFilter('All');
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="bg-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-brand-dark transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const theme = getCategoryTheme(course.category);
              return (
                <GlareHover
                  key={course._id}
                  glareColor="#ffffff"
                  glareOpacity={0.25}
                  glareAngle={-35}
                  glareSize={280}
                  transitionDuration={750}
                  className="rounded-3xl h-full"
                >
                  <div
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-full"
                  >
                    {/* Card Visual Header */}
                    <div
                      className={`relative h-48 bg-gradient-to-br ${theme.bg} p-6 flex flex-col justify-between text-white overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none" />

                      <div className="flex justify-between items-start relative z-10">
                        <span
                          className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg border backdrop-blur-md ${theme.badgeBg}`}
                        >
                          {course.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {course.isDummy && (
                            <span className="text-[10px] uppercase font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
                              Demo
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20">
                            <ShieldCheck className="h-3 w-3" />
                            ISO Verified
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-xl font-black tracking-tight leading-snug group-hover:text-cyan-200 transition-colors duration-200 drop-shadow-sm">
                          {course.title}
                        </h3>
                        {course.level && (
                          <span className="text-[11px] font-semibold text-white/80 block mt-1">
                            Level: {course.level}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                        {course.description}
                      </p>

                      {/* Meta info chips */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-brand" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <Layers className="h-4 w-4 text-indigo-500" />
                            {course.projects?.length || 3} Projects
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                              Tuition Fee
                            </span>
                            <span className="text-xl font-black text-slate-900">
                              ₹{course.price.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            Lifetime Valid
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-brand hover:text-white border border-slate-200 hover:border-brand text-slate-800 font-extrabold py-3.5 rounded-2xl text-xs transition-all duration-200 group-hover:shadow-md">
                        <span>View Syllabus & Enroll</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </GlareHover>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
