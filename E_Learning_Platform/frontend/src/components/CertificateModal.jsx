import React, { useEffect } from 'react';
import { X, Printer, Share2, Award, ShieldCheck, GraduationCap, ExternalLink, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const CertificateModal = ({ certificate, user, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti celebration
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#4f46e5', '#f59e0b', '#10b981'],
        });
      } catch (e) {
        console.error('Confetti animation error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen || !certificate) return null;

  const credentialId = `MR-2026-${(certificate._id || 'CERT99').slice(-6).toUpperCase()}-${(user?._id || 'STU10').slice(-4).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Share to LinkedIn generator
  const handleLinkedInShare = () => {
    const certName = encodeURIComponent(certificate.title || 'Full Stack Industrial Training');
    const orgName = encodeURIComponent('Mountreach Solution Private Limited');
    const certUrl = encodeURIComponent(window.location.origin);
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=2026&issueMonth=1&certUrl=${certUrl}&certId=${credentialId}`;
    window.open(linkedInUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-12 relative overflow-hidden flex flex-col justify-between gap-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 print:hidden transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Certificate Frame */}
        <div className="border-8 border-slate-200/80 p-6 sm:p-10 rounded-2xl relative bg-[#fdfdfc] border-double shadow-inner">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex justify-center text-brand mb-1">
              <div className="h-16 w-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shadow-xs">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-wider uppercase">
              Certificate of Completion
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <span>Mountreach Solution Private Limited</span>
              <span>•</span>
              <span className="text-amber-600">ISO 9001:2015 Industrial Certified</span>
            </div>
            <div className="h-0.5 w-1/3 bg-gradient-to-r from-transparent via-brand to-transparent mx-auto mt-2" />
          </div>

          {/* Body */}
          <div className="text-center mt-8 space-y-5 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-500 italic">This is officially presented to acknowledge that</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 border-b-2 border-slate-200 pb-2 max-w-md mx-auto tracking-wide">
              {user?.name || 'Student Graduate'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
              has satisfactorily completed all syllabus modules, practical lab milestones, and commercial evaluations for
              <br />
              <strong className="text-brand text-lg sm:text-xl font-black block mt-2 font-sans tracking-tight">
                {certificate.title}
              </strong>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Conducted under live industry supervision over a curriculum term of {certificate.duration || '8 Weeks'}. The candidate demonstrated commercial grade competencies in software architecture and modern production deployment.
            </p>
          </div>

          {/* Signature and Verification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 items-end pt-6 border-t border-slate-200">
            {/* Stamp */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 border-4 border-brand/30 bg-blue-50 text-brand rounded-full flex flex-col items-center justify-center font-black text-[9px] text-center shadow-xs">
                <ShieldCheck className="h-5 w-5 mb-0.5 text-brand" />
                VERIFIED
                <span className="text-[7px] text-slate-500 font-bold">ISO 9001:2015</span>
              </div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1.5">Official Quality Seal</span>
            </div>

            {/* Credential ID and QR */}
            <div className="text-center font-mono text-[10px] sm:text-xs text-slate-600 bg-slate-100/80 p-2.5 rounded-xl border border-slate-200 self-center">
              <span className="block font-bold uppercase text-[9px] text-slate-400 font-sans tracking-wider">Credential ID</span>
              <span className="font-black text-slate-900">{credentialId}</span>
              <span className="block text-[9px] text-slate-400 font-sans mt-0.5">Issued: {issueDate}</span>
            </div>

            {/* Authorized Signature */}
            <div className="text-center flex flex-col items-center justify-center">
              <div className="font-serif italic text-slate-800 text-sm font-black border-b border-slate-300 pb-1 w-32">
                Dhananjay S.
              </div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-1.5">
                Managing Director
              </span>
            </div>
          </div>

        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all"
          >
            <Printer className="h-4 w-4" />
            Print / Save Certificate PDF
          </button>
          <button
            onClick={handleLinkedInShare}
            className="flex items-center gap-2 bg-[#0a66c2] hover:bg-[#084e96] text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all"
          >
            <Share2 className="h-4 w-4" />
            Add to LinkedIn Profile
          </button>
          <button
            onClick={onClose}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-xl text-xs transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default CertificateModal;
