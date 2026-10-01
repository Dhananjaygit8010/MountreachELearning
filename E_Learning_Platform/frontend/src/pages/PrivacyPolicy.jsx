import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            <div className="h-12 w-12 rounded-2xl bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand dark:text-blue-400">
                Legal & Compliance
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Mountreach Solution Private Limited ("Mountreach", "we", "us", or "our") is dedicated to safeguarding the privacy, confidentiality, and integrity of personal information collected through our ISO 9001:2015 certified industrial training and internship platform.
          </p>
          <div className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            Last Updated: January 15, 2026 • Effective Date: January 1, 2026
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">1</span>
              Information We Collect
            </h2>
            <p>
              When you enroll in our industrial training programs, register as a student, apply for internships, or interact with our learning management system, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Personal Identifiers:</strong> Legal full name, email address, telephone number, and residential address.</li>
              <li><strong>Academic Records:</strong> Enrolled college or polytechnic institution name, engineering branch, current semester, roll number, and graduation year.</li>
              <li><strong>Application Documents:</strong> Resumes, CVs, portfolio links (GitHub, LinkedIn), and letters of recommendation.</li>
              <li><strong>LMS Usage Data:</strong> Course progress, attendance check-ins, lab milestone submissions, quiz scores, and certificate issuance records.</li>
              <li><strong>Payment Information:</strong> Transaction identifiers, billing addresses, and payment receipts. Note: Credit card or banking credentials are processed via PCI-DSS compliant payment gateways and are never stored on our servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">2</span>
              How We Use Your Data
            </h2>
            <p>Your data is processed strictly for legitimate educational, academic, and verification purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Academic Delivery</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Delivering live lecture access, syllabus materials, and recording class attendance.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Certificate Verification</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Generating cryptographically unique, ISO-compliant credential IDs verifiable by employers.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Corporate Placement</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Forwarding shortlisted student profiles and resumes to our corporate partner hiring managers.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Regulatory Compliance</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Maintaining ISO 9001:2015 audit trails and Indian Information Technology (IT Act, 2000) adherence.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">3</span>
              Data Protection & Security Architecture
            </h2>
            <p>
              We implement industry-standard administrative, physical, and technological security controls:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>All web communication is encrypted in transit using Transport Layer Security (TLS 1.3).</li>
              <li>Sensitive credentials (passwords) are irreversibly hashed using standard bcrypt algorithms with salt rounds.</li>
              <li>MongoDB Atlas storage is protected by IP access control lists and encrypted at rest using AES-256.</li>
              <li>Role-based access control (RBAC) ensures student data is only accessible by verified platform administrators.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">4</span>
              Student Rights & Data Control
            </h2>
            <p>
              Under Indian Digital Personal Data Protection (DPDP) Act guidelines, you maintain complete rights over your information:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Right to Access:</strong> View all enrolled courses, invoices, and certificates anytime in your dashboard.</li>
              <li><strong>Right to Rectification:</strong> Edit your contact number, bio, academic semester, or GitHub/LinkedIn handles from your Profile tab.</li>
              <li><strong>Right to Erasure:</strong> Request permanent removal of inactive student accounts by contacting privacy@mountreach.com.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Grievance & Privacy Officer
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              For privacy inquiries, grievance redressals, or data access requests, please contact our designated Grievance Officer:
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200">Grievance Officer: Legal Department</p>
              <p className="text-slate-600 dark:text-slate-400">Mountreach Solution Private Limited</p>
              <p className="text-slate-600 dark:text-slate-400">Corporate Campus, Sector 62, Noida, Uttar Pradesh 201301, India</p>
              <p className="text-brand dark:text-blue-400 font-semibold">Email: privacy@mountreach.com • support@mountreach.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
