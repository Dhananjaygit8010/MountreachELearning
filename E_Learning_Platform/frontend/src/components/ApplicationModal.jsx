import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Briefcase, FileText, CheckCircle, Loader } from 'lucide-react';

const ApplicationModal = ({ internship, isOpen, onClose }) => {
  const { user, applyForInternship } = useContext(AuthContext);
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-fill from user profile when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setCollege(user.college || '');
      setBranch(user.branch || '');
      setResumeName('');
      setErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen || !internship) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!college.trim()) newErrors.college = 'College Name is required';
    if (!branch.trim()) newErrors.branch = 'Branch / Diploma specialization is required';
    if (!resumeName) newErrors.resume = 'Please upload a resume (PDF/DOCX format)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    // Simulate minor delay
    setTimeout(async () => {
      const result = await applyForInternship(internship._id, college, branch, resumeName);
      setProcessing(false);
      if (result.success) {
        setAppliedSuccess(true);
        setTimeout(() => {
          setAppliedSuccess(false);
          onClose();
        }, 2000);
      }
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative transform transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={processing}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {appliedSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 animate-bounce-short">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Application Submitted!</h3>
            <p className="text-slate-500 font-semibold">
              Your profile has been queued for review by Mountreach HR.
            </p>
            <div className="text-xs text-brand font-bold bg-brand-accent px-4 py-1.5 rounded-full uppercase tracking-wider">
              Storing application details in MongoDB...
            </div>
          </div>
        ) : (
          /* Application Form Screen */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Internship Application
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Apply for {internship.title}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Company: <strong className="text-slate-700">{internship.company}</strong>
              </p>
            </div>

            {/* Inputs Container */}
            <div className="space-y-4">
              {/* Name (Read-only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Applicant Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full p-3 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed"
                />
              </div>

              {/* College Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Government Polytechnic, Mumbai"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  disabled={processing}
                  className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.college ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                  }`}
                />
                {errors.college && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.college}</p>}
              </div>

              {/* Branch / Specialization */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Branch / Diploma Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diploma in Computer Engineering"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={processing}
                  className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.branch ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                  }`}
                />
                {errors.branch && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.branch}</p>}
              </div>

              {/* Resume File Upload (Simulated) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Upload Resume / CV (PDF/DOCX)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-all duration-200">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={processing}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-8 w-8 text-slate-400" />
                    {resumeName ? (
                      <span className="text-sm font-semibold text-brand truncate max-w-xs">
                        {resumeName}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm text-slate-600 font-semibold">
                          Click to browse or drag resume file here
                        </span>
                        <span className="text-xs text-slate-400">PDF, DOC, DOCX up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
                {errors.resume && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.resume}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-brand hover:bg-brand-dark disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
              >
                {processing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
