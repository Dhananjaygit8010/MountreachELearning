import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, Loader, Shield } from 'lucide-react';

const AuthPage = ({ defaultIsLogin = true }) => {
  const { user, login, register, showToast } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [errors, setErrors] = useState({});

  // Get redirect path
  const redirectPath = location.state?.from || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Sync isLogin state if URL changes
  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLogin(true);
    } else if (location.pathname === '/register') {
      setIsLogin(false);
    }
  }, [location.pathname]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!isLogin) {
      if (!name.trim()) newErrors.name = 'Full name is required';
      if (!college.trim()) newErrors.college = 'College/Institution name is required';
      if (!branch.trim()) newErrors.branch = 'Branch or diploma specialization is required';
      if (email.toLowerCase().trim() === 'admin@gmail.com') {
        newErrors.email = 'Admin account is pre-configured. Please switch to Sign In.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      setSubmitting(false);
      if (res.success) {
        if (res.user?.role === 'admin') {
          showToast('Welcome Administrator! Redirecting to Admin Dashboard...', 'success');
          navigate('/admin', { replace: true });
        } else {
          showToast(`Welcome back, ${res.user?.name}!`, 'success');
          navigate('/dashboard', { replace: true });
        }
      }
    } else {
      const res = await register(name, email, password, college, branch);
      setSubmitting(false);
      if (res.success) {
        showToast('Registration successful! Welcome to Mountreach.', 'success');
        navigate('/dashboard', { replace: true });
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Outer Card container */}
      <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex justify-center text-brand">
            <div className="bg-brand text-white p-2.5 rounded-xl shadow">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {isLogin ? 'Student Portal Login' : 'Register Student Account'}
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Mountreach Solution Private Limited
          </p>
        </div>

        {/* Toggle switch tab */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              navigate('/login');
              setErrors({});
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              isLogin ? 'bg-white text-brand shadow-sm' : 'text-slate-600 hover:text-brand'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              navigate('/register');
              setErrors({});
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              !isLogin ? 'bg-white text-brand shadow-sm' : 'text-slate-600 hover:text-brand'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register-Only Fields */}
          {!isLogin && (
            <>
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.name ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.name}</p>}
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Government Polytechnic, Pune"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  disabled={submitting}
                  className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.college ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                  }`}
                />
                {errors.college && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.college}</p>}
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Branch / Diploma Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diploma in Computer Tech"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={submitting}
                  className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.branch ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                  }`}
                />
                {errors.branch && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.branch}</p>}
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                errors.email ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
              }`}
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className={`w-full p-3 pr-10 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.password ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand hover:bg-brand-dark disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Validating Portal...
              </>
            ) : isLogin ? (
              'Sign In to Portal'
            ) : (
              'Create Account'
            )}
          </button>

          {/* Admin Credentials Helper */}
          {isLogin && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span className="flex items-center gap-1 text-slate-700">
                  <Shield className="h-3.5 w-3.5 text-indigo-600" />
                  Administrator Access
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('Admin@gmail.com');
                    setPassword('Admin@123');
                    setErrors({});
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-extrabold hover:underline"
                >
                  ⚡ Auto-Fill Admin Credentials
                </button>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-2.5 text-[11px] text-indigo-950 font-mono flex items-center justify-between">
                <span>User: <strong>Admin@gmail.com</strong></span>
                <span>Pass: <strong>Admin@123</strong></span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
