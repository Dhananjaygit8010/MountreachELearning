import React from 'react';
import { RefreshCcw, CreditCard, ShieldCheck, Clock, ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
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
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Payment Guarantee
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Refund & Cancellation Policy
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            At Mountreach Solution Private Limited, our goal is to deliver unparalleled training satisfaction. We offer transparent, hassle-free cancellation and refund guarantees for student enrollments.
          </p>
          <div className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            Last Updated: January 15, 2026 • 7-Day Money-Back Guarantee
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">1</span>
              7-Day Academic Trial Window
            </h2>
            <p>
              Students enrolling in any paid Mountreach industrial certification program are entitled to a full, unconditional refund within <strong>7 calendar days</strong> from the date of enrollment, provided:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Less than 25% of the total course syllabus curriculum has been consumed.</li>
              <li>No course certificate of completion has been claimed or issued.</li>
              <li>Capstone project repositories or proprietary corporate starter codebases have not been downloaded.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">2</span>
              How to Claim a Refund
            </h2>
            <p>
              To initiate your refund request, simply follow these steps:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-brand font-black text-lg block">01.</span>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">Email Support</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Send an email to refunds@mountreach.com with your enrolled email & Invoice ID.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-brand font-black text-lg block">02.</span>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">Quick Verification</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Our finance desk will verify your syllabus consumption metric within 24 hours.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-brand font-black text-lg block">03.</span>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">Direct Disbursal</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Amount will be credited back to your original payment method in 5-7 business days.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center font-black">3</span>
              Non-Refundable Circumstances
            </h2>
            <p>
              Refunds will not be approved under the following scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Requests submitted after 7 days from the initial enrollment date.</li>
              <li>Courses where an ISO-verified Certificate of Completion has already been generated.</li>
              <li>Internship application processing fees (if any third-party background verification fees were incurred).</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Billing & Refund Inquiries
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Have questions regarding an invoice or payment transaction? Contact our accounts division:
            </p>
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Mail className="h-5 w-5 text-brand" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Direct Finance Desk</span>
                <a href="mailto:refunds@mountreach.com" className="text-brand dark:text-blue-400 hover:underline">
                  refunds@mountreach.com • billing@mountreach.com
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
