import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, GraduationCap, LogOut, Briefcase, LayoutDashboard, LogIn, Database, Sparkles } from 'lucide-react';
import DemoDataManager from './DemoDataManager';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Programs & Courses', path: '/courses', icon: GraduationCap },
    { name: 'Internship Hub', path: '/internships', icon: Briefcase },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-nav shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center gap-3 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="h-11 w-11 bg-gradient-to-tr from-brand to-brand-light text-white rounded-2xl shadow-lg shadow-brand/25 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-brand transition-colors">
                    MOUNTREACH
                  </span>
                  <span className="text-[10px] text-brand font-bold tracking-widest uppercase mt-0.5">
                    Solution Pvt. Ltd.
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      active
                        ? 'text-brand bg-brand-accent/60 shadow-sm'
                        : 'text-slate-600 hover:text-brand hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-brand' : 'text-slate-400'}`} />
                    {link.name}
                  </Link>
                );
              })}

              {/* Demo Data Quick Manager Button */}
              <button
                onClick={() => setDemoModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:text-brand bg-slate-100 hover:bg-brand-accent/50 border border-slate-200/80 transition-all duration-200 hover:scale-105"
                title="Manage Live & Demo Data"
              >
                <Database className="h-3.5 w-3.5 text-brand" />
                <span>Live DB</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-2" />

              {user ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Chip */}
                  <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-slate-100 border border-slate-200/80">
                    <div
                      className={`h-8 w-8 rounded-full text-white font-black text-xs flex items-center justify-center shadow-sm ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 ring-2 ring-amber-400/40'
                          : 'bg-gradient-to-tr from-brand to-indigo-600'
                      }`}
                    >
                      {user.role === 'admin' ? '👑' : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                      {user.role === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-xs font-bold text-slate-800 leading-none max-w-[110px] truncate hover:text-brand transition-colors"
                          title="Go to Admin Dashboard"
                        >
                          {user.name}
                        </Link>
                      ) : (
                        <span className="text-xs font-bold text-slate-800 leading-none max-w-[110px] truncate">
                          {user.name}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider ${
                          user.role === 'admin' ? 'text-amber-600' : 'text-slate-400'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="hover:text-brand transition-colors"
                            title="Go to Admin Dashboard"
                          >
                            System Administrator
                          </Link>
                        ) : 'Student'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-200"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-brand/20 hover:shadow-lg hover:translate-y-[-1px] transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  Student Portal
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-brand"
                title="Manage Live & Demo Data"
              >
                <Database className="h-4 w-4 text-brand" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 p-2.5 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-6 space-y-3 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                    isActive(link.path)
                      ? 'bg-brand text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}

            {user ? (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                    isActive('/dashboard')
                      ? 'bg-brand text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand text-white font-black text-sm flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.college || user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white py-3.5 rounded-2xl text-base font-bold shadow-md transition-all"
                >
                  <LogIn className="h-5 w-5" />
                  Student Portal Login
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Live & Demo Data Modal */}
      <DemoDataManager
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onDataChanged={() => {
          // If on courses or internships page, trigger soft reload
          if (location.pathname === '/courses' || location.pathname === '/internships') {
            window.location.reload();
          }
        }}
      />
    </>
  );
};

export default Navbar;
