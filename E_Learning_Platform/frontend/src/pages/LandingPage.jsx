import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Building2,
  Award,
  Briefcase,
  Brain,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  Code2,
  Layers,
  Laptop
} from 'lucide-react';
import RippleDistortion from '../components/RippleDistortion';
import GlareHover from '../components/CardHoverAnim';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('industrial');
  const [activeCodeTab, setActiveCodeTab] = useState('react');
  const [openFaq, setOpenFaq] = useState(0);

  // Smooth counter animation
  const [stats, setStats] = useState({ students: 0, partners: 0, placements: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const studentsDone = prev.students >= 15000;
        const partnersDone = prev.partners >= 45;
        const placementsDone = prev.placements >= 98;

        if (studentsDone && partnersDone && placementsDone) {
          clearInterval(interval);
          return prev;
        }

        return {
          students: studentsDone ? 15000 : prev.students + 300,
          partners: partnersDone ? 45 : prev.partners + 1,
          placements: placementsDone ? 98 : prev.placements + 2,
        };
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const featureTabs = {
    industrial: {
      title: 'ISO 9001:2015 Industrial Training',
      subtitle: 'Bridge the gap between academic theory and corporate production.',
      description:
        'Tailored specifically for B.Tech, B.E., and Polytechnic Diploma students. Master full-stack architectures, AI pipelines, and cloud DevOps standard in top tech organizations.',
      bullets: [
        'Hands-on building of 3 commercial-grade deployed projects.',
        'Mentorship from corporate team leads and software architects.',
        'Verifiable industrial credentials with unique verification IDs.',
      ],
      icon: Terminal,
      badge: 'Practical Architecture',
      color: 'from-blue-600 to-indigo-600',
    },
    internships: {
      title: 'Corporate Paid Internships',
      subtitle: 'Gain professional experience while earning performance stipends.',
      description:
        'Step directly into production sprints. Work on live enterprise client applications, participate in code reviews, and build an unshakeable resume portfolio.',
      bullets: [
        'Dedicated corporate supervisor guidance throughout your term.',
        'Guaranteed ISO 9001:2015 industrial experience certificates.',
        'Flexible schedules designed around college semester exams.',
      ],
      icon: Briefcase,
      badge: 'Stipend Backed',
      color: 'from-indigo-600 to-purple-600',
    },
    certifications: {
      title: 'Global Professional Accreditation',
      subtitle: 'Stand out in hiring pipelines with verifiable corporate credentials.',
      description:
        'Every Mountreach certificate features a digital verification ID, QR code validation, and ISO 9001:2015 corporate stamp recognized across IT enterprises.',
      bullets: [
        'Instant digital verification shareable on LinkedIn and resumes.',
        'Co-signed stamps by managing architects and academic deans.',
        'Permanent credential hosting in Mountreach cloud registry.',
      ],
      icon: Award,
      badge: 'ISO Accredited',
      color: 'from-emerald-600 to-teal-600',
    },
  };

  const currentTab = featureTabs[activeTab];

  const codeSnippets = {
    react: {
      filename: 'FullstackApp.jsx',
      lang: 'JSX',
      code: `// Enterprise LMS Component with Auth & Enrollment
import { useState, useEffect } from 'react';
import api from '../utils/api';

export function CourseEnrollment({ courseId }) {
  const [status, setStatus] = useState('idle');

  const handleEnroll = async () => {
    setStatus('enrolling');
    const res = await api.post(\`/courses/\${courseId}/enroll\`);
    if (res.data.enrolledCourses) {
      setStatus('enrolled');
    }
  };

  return (
    <button onClick={handleEnroll} className="btn-brand">
      {status === 'enrolled' ? 'Enrolled ✓' : 'Enroll Now'}
    </button>
  );
}`,
    },
    python: {
      filename: 'AI_Diagnostic_Model.py',
      lang: 'Python',
      code: `# Real-Time Computer Vision & Diagnostic Pipeline
import torch
import torch.nn as nn
from torchvision import models, transforms

class MedicalDiagnosticsCNN(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()
        self.backbone = models.resnet50(weights='DEFAULT')
        self.backbone.fc = nn.Sequential(
            nn.Linear(self.backbone.fc.in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)`,
    },
    kotlin: {
      filename: 'TaskRepository.kt',
      lang: 'Kotlin',
      code: `// Native Android MVVM Room Repository
package com.mountreach.android.data

import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class TaskRepository @Inject constructor(
    private val taskDao: TaskDao,
    private val apiService: MountreachApiService
) {
    val allTasks: Flow<List<TaskEntity>> = taskDao.getLiveTasks()

    suspend fun syncRemoteTasks() {
        val remoteData = apiService.fetchStudentSprintTasks()
        taskDao.insertAll(remoteData.map { it.toEntity() })
    }
}`,
    },
  };

  const partners = [
    'Google Cloud',
    'Microsoft',
    'Amazon Web Services',
    'Oracle',
    'IBM Watson',
    'TCS',
    'Infosys',
    'Wipro',
    'Cognizant',
    'HCL Tech',
    'L&T Technology Services',
  ];

  const faqs = [
    {
      q: 'Are these courses and internships recognized by engineering colleges?',
      a: 'Yes! All courses and internship certificates are ISO 9001:2015 verified and comply with AICTE/University guidelines for academic credit transfer and industrial training requirements.',
    },
    {
      q: 'Do internships include a monthly stipend?',
      a: 'Yes, our industrial internships offer performance stipends ranging between ₹5,000 and ₹15,000 per month depending on the technical domain and candidate evaluation.',
    },
    {
      q: 'How does the digital certificate verification work?',
      a: 'Each issued certificate contains a unique credential verification ID (e.g. MR-AIML-1234) and secure verification link that prospective recruiters or colleges can verify in real-time.',
    },
    {
      q: 'Can polytechnic diploma students apply?',
      a: 'Absolutely! Our curriculum is specifically crafted to support both Polytechnic Diploma and B.Tech/B.E. engineering students from beginner to advanced industry readiness.',
    },
  ];

  const testimonials = [
    {
      name: 'Aditya Deshpande',
      college: 'Pune Institute of Computer Technology',
      role: 'Placed at Cognizant',
      comment:
        'The MERN stack curriculum at Mountreach gave me the exact hands-on experience I needed. I submitted my internship project in my final year viva and cleared my technical interview seamlessly!',
      rating: 5,
    },
    {
      name: 'Sneha Patil',
      college: 'Government Polytechnic College',
      role: 'Full Stack Intern at TechNova',
      comment:
        'As a diploma student, getting actual corporate code reviews was game-changing. The ISO verified certificate and real project portfolio gave me confidence in interviews.',
      rating: 5,
    },
    {
      name: 'Rohan Sharma',
      college: 'MIT College of Engineering',
      role: 'Placed at L&T Infotech',
      comment:
        'The AI/ML program with hands-on computer vision assignments was phenomenal. Direct mentorship from senior architects was worth every minute.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50/30 to-white">
        {/* Glowing Background Radial Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none">
          <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-24 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-glow delay-1000" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-brand/20 text-brand px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-sm shadow-brand/10 hover:scale-105 transition-all">
              <span className="flex h-2 w-2 rounded-full bg-brand animate-ping" />
              <ShieldCheck className="h-4 w-4 text-brand-light" />
              <span>ISO 9001:2015 Accredited Enterprise Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] sm:leading-[1.1]">
              Engineered for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-indigo-600 to-blue-500">
                Future Tech Leads
              </span>
              <br />
              & Industrial Internships
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Master production-ready development, cloud architectures, and machine learning models with hands-on corporate assignments and verified ISO accreditation.
            </p>

            {/* Action Buttons & Chips */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <Link
                to="/courses"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-brand to-indigo-600 hover:from-brand-dark hover:to-brand text-white px-8 py-4 rounded-2xl text-base font-extrabold shadow-xl shadow-brand/25 hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-300"
              >
                <span>Explore Curriculums</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/internships"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-2xl text-base font-extrabold border border-slate-200 shadow-sm hover:shadow transition-all duration-200"
              >
                <Briefcase className="h-4 w-4 text-brand" />
                <span>Apply for Internships</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>AICTE Compliant Syllabus</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verifiable QR Certificates</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Stipend-Backed Internships</span>
              </div>
            </div>

            {/* Interactive WebGL Ripple Distortion Showcase */}
            <div className="pt-8 max-w-5xl mx-auto">
              <div className="relative group rounded-3xl overflow-hidden border-2 border-slate-800/80 shadow-2xl bg-slate-950 p-2 sm:p-3 transition-all duration-500 hover:shadow-brand/20 hover:border-brand/50">
                {/* Floating Studio Status Badge */}
                <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 text-white shadow-xl pointer-events-none">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">Interactive Studio</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• Hover or click to distort & ripple</span>
                </div>

                {/* WebGL Canvas Container */}
                <div className="w-full h-[280px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden relative">
                  <RippleDistortion
                    src="/hero.jpg"
                    brushSize={150}
                    strength={0.25}
                    swirl={1.2}
                    rings={4}
                    grayscale={false}
                    spread={5}
                    fade={3}
                    spacing={11}
                    dispersion={0.015}
                    glint={0.2}
                    tint="#6366f1"
                    tintAmount={0.15}
                    highlightColor="#ffffff"
                    trigger="hover"
                    clickStrength={2.2}
                    quality="high"
                    enabled={true}
                  />
                </div>

                {/* Floating Tech Stack Details */}
                <div className="absolute bottom-5 right-5 z-20 hidden sm:flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 shadow-xl pointer-events-none">
                  <span className="text-indigo-400 font-bold font-mono">OGL WebGL</span>
                  <span>•</span>
                  <span>Interactive Shaders</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Fluid Distortion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Counter Grid */}
      <section className="py-10 border-y border-slate-200/80 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Stat Item 1 */}
            <GlareHover glareColor="#ffffff" glareOpacity={0.35} glareAngle={-30} glareSize={250} transitionDuration={700} className="rounded-3xl h-full">
              <div className="p-6 sm:p-8 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group h-full">
                <div className="inline-flex p-3.5 bg-blue-100 text-brand rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7" />
                </div>
                <div className="text-3xl sm:text-5xl font-black text-slate-900 mb-1">
                  {stats.students.toLocaleString()}+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-extrabold uppercase tracking-wider">
                  Engineering Graduates Trained
                </div>
              </div>
            </GlareHover>

            {/* Stat Item 2 */}
            <GlareHover glareColor="#ffffff" glareOpacity={0.35} glareAngle={-30} glareSize={250} transitionDuration={700} className="rounded-3xl h-full">
              <div className="p-6 sm:p-8 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group h-full">
                <div className="inline-flex p-3.5 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="text-3xl sm:text-5xl font-black text-slate-900 mb-1">
                  {stats.partners}+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-extrabold uppercase tracking-wider">
                  Hiring Corporate Partners
                </div>
              </div>
            </GlareHover>

            {/* Stat Item 3 */}
            <GlareHover glareColor="#ffffff" glareOpacity={0.35} glareAngle={-30} glareSize={250} transitionDuration={700} className="rounded-3xl h-full">
              <div className="p-6 sm:p-8 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group h-full">
                <div className="inline-flex p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7" />
                </div>
                <div className="text-3xl sm:text-5xl font-black text-slate-900 mb-1">
                  {stats.placements}%
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-extrabold uppercase tracking-wider">
                  Placement & Viva Success Rate
                </div>
              </div>
            </GlareHover>
          </div>
        </div>
      </section>

      {/* Interactive Code Architecture Showcase */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand/30 text-brand-light border border-brand-light/30">
                <Code2 className="h-3.5 w-3.5" />
                Live Production Code
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Learn Real Tech Stacks, Not Just Syntax.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed font-medium">
                Our modules immerse you directly into clean architecture, design patterns, and industry best practices. Write code that gets merged into production.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-300 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Modular Model-View-Controller (MVC) API backend standards</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>React 18 + Tailwind CSS modern responsive component trees</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Automated test suites & continuous deployment pipelines</span>
                </div>
              </div>
            </div>

            {/* Right Terminal Window */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
                {/* Terminal Titlebar */}
                <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="ml-3 font-mono text-xs text-slate-400">
                      mountreach-workspace ~ {codeSnippets[activeCodeTab].filename}
                    </span>
                  </div>
                  {/* Tab switchers */}
                  <div className="flex gap-1">
                    {Object.keys(codeSnippets).map((tabKey) => (
                      <button
                        key={tabKey}
                        onClick={() => setActiveCodeTab(tabKey)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          activeCodeTab === tabKey
                            ? 'bg-brand text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {codeSnippets[tabKey].lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Window Body */}
                <div className="p-6 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed bg-slate-950/80">
                  <pre className="text-emerald-400">
                    <code>{codeSnippets[activeCodeTab].code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Marquee Section */}
      <section className="py-12 overflow-hidden bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest">
            Recognized & Endorsed by Leading Tech Enterprises
          </p>
        </div>
        <div className="relative w-full overflow-hidden select-none">
          <div className="animate-marquee-slow flex items-center gap-14 text-slate-500 font-bold text-lg py-2">
            {partners.map((partner, index) => (
              <span
                key={`p1-${index}`}
                className="flex items-center gap-2.5 hover:text-brand transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <Brain className="h-5 w-5 text-brand" />
                {partner}
              </span>
            ))}
            {partners.map((partner, index) => (
              <span
                key={`p2-${index}`}
                className="flex items-center gap-2.5 hover:text-brand transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <Brain className="h-5 w-5 text-brand" />
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento-Styled Feature Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-brand font-extrabold text-xs uppercase tracking-widest bg-brand-accent px-3 py-1 rounded-full">
              Why Mountreach Solution
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Elite Academic & Career Ecosystem
            </h2>
            <p className="text-slate-600 font-medium">
              Explore our core pillars designed to launch your engineering career with maximum impact.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center p-1.5 bg-slate-100 rounded-2xl max-w-xl mx-auto mb-12 border border-slate-200">
            <button
              onClick={() => setActiveTab('industrial')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'industrial' ? 'bg-white text-brand shadow-md' : 'text-slate-600 hover:text-brand'
              }`}
            >
              Industrial Training
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'internships' ? 'bg-white text-brand shadow-md' : 'text-slate-600 hover:text-brand'
              }`}
            >
              Paid Internships
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'certifications' ? 'bg-white text-brand shadow-md' : 'text-slate-600 hover:text-brand'
              }`}
            >
              Global Accreditation
            </button>
          </div>

          {/* Active Tab Bento Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Details */}
              <div className="p-8 sm:p-12 md:col-span-7 space-y-6 flex flex-col justify-center">
                <div className={`inline-flex p-3 bg-gradient-to-r ${currentTab.color} text-white rounded-2xl w-max shadow-md`}>
                  <currentTab.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {currentTab.title}
                  </h3>
                  <p className="text-brand text-xs sm:text-sm font-extrabold mt-1 uppercase tracking-wider">
                    {currentTab.subtitle}
                  </p>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium text-sm sm:text-base">
                  {currentTab.description}
                </p>
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {currentTab.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm font-semibold">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Action Graphic */}
              <div className="bg-slate-900 md:col-span-5 p-8 sm:p-12 flex flex-col justify-between text-white relative">
                <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />
                <div className="relative space-y-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Live Registry Status
                    </span>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white">ISO 9001:2015 Portal</span>
                      <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-slate-300 italic text-sm border-l-2 border-brand-light pl-4 py-1 leading-relaxed font-medium">
                    "Mountreach industrial certifications provide our final-year engineering students an undeniable edge during corporate placement interviews."
                    <footer className="text-slate-400 font-bold text-xs mt-2 not-italic">
                      — Head of Placement, Engineering Faculty
                    </footer>
                  </blockquote>
                </div>

                <div className="pt-8 relative">
                  <button
                    onClick={() => navigate('/courses')}
                    className="w-full bg-gradient-to-r from-brand to-indigo-600 hover:from-brand-dark hover:to-brand text-white py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>View All Programs</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-brand font-extrabold text-xs uppercase tracking-widest bg-brand-accent px-3 py-1 rounded-full">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Loved by Students Across Engineering Colleges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <GlareHover
                key={idx}
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-35}
                glareSize={280}
                transitionDuration={700}
                className="rounded-3xl h-full"
              >
                <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 h-full">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand to-brand-light text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{t.name}</h4>
                      <p className="text-xs text-brand font-bold">{t.role}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{t.college}</p>
                    </div>
                  </div>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Everything you need to know about enrollments, internships, and certification.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 font-extrabold text-slate-900 text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-brand flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 bg-slate-50/50 text-slate-600 text-sm font-medium leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Glowing CTA */}
      <section className="py-16 bg-gradient-to-tr from-brand-dark via-brand to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-brand-accent">
            <Sparkles className="h-3.5 w-3.5" /> Start Your Journey Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Elevate Your Engineering Career?
          </h2>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Join over 15,000 students gaining verified industrial accreditation and corporate internship opportunities with Mountreach Solution.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-brand font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
            >
              Browse All Programs
            </Link>
            <Link
              to="/internships"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold px-8 py-4 rounded-2xl text-base transition-all duration-200"
            >
              Explore Paid Internships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
