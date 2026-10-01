import React from 'react';
import { Scale, BookOpen, AlertCircle, CheckCircle, ArrowLeft, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Terms of Agreement
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Terms and Conditions
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to Mountreach Solution Private Limited ("Mountreach"). By accessing or using our websites, course catalog, internship portal, or digital training facilities, you agree to be bound by these Terms of Service.
          </p>
          <div className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            Last Updated: January 15, 2026 • Governed by the Laws of India
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">1</span>
              Student Eligibility & Account Integrity
            </h2>
            <p>
              To register on Mountreach, you represent that you are an Engineering student, Polytechnic Diploma scholar, or tech professional seeking skill enhancement. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Provide accurate, authentic institutional identification (college name, branch, semester).</li>
              <li>Maintain the confidentiality of your portal credentials; you are solely responsible for all activities occurring under your account.</li>
              <li>Notify Mountreach administration immediately at support@mountreach.com in case of any unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">2</span>
              Industrial Training Curriculum & Accreditation
            </h2>
            <p>
              Mountreach is an ISO 9001:2015 certified technical training institute. All syllabi, project repos, and video modules are developed to bridge industrial readiness gaps.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <span className="font-extrabold flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Certification Criteria
              </span>
              <p>
                ISO-stamped certificates are granted exclusively upon fulfilling 100% course syllabus milestone completion, passing the practical industrial capstone evaluation, and maintaining minimum 75% attendance.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">3</span>
              Internship Selection & Stipend Guidelines
            </h2>
            <p>
              Applying for an industrial internship on Mountreach initiates a formal corporate evaluation process:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Submission of an internship application does not guarantee employment; candidates are screened based on academic merit and technical assessment.</li>
              <li>Disbursal of monthly stipends is governed by partner corporate policies and verified bi-weekly milestones.</li>
              <li>Students selected for client-facing internships must adhere to strict non-disclosure agreements (NDAs) concerning proprietary software codebases.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">4</span>
              Intellectual Property Rights
            </h2>
            <p>
              All course content, documentation, problem sets, video lectures, and platform code are the exclusive intellectual property of Mountreach Solution Private Limited. Users are granted a limited, personal, non-transferable license to access training materials solely for individual learning.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">5</span>
              Dispute Resolution & Jurisdiction
            </h2>
            <p>
              These Terms shall be construed and governed in accordance with the laws of India. Any legal dispute or controversy arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Gautam Buddha Nagar (Noida), Uttar Pradesh.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
