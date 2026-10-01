import React, { useState } from 'react';
import { X, Play, Pause, CheckCircle2, BookOpen, Clock, FileText, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const LessonPlayerModal = ({ course, lessonIndex = 0, isOpen, onClose, onLessonCompleted }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');

  if (!isOpen || !course) return null;

  const syllabusList = Array.isArray(course.syllabus)
    ? course.syllabus
    : typeof course.syllabus === 'string'
    ? course.syllabus.split(',')
    : ['Foundations', 'Core Concepts', 'Advanced Project Architecture'];

  const currentLessonTitle = syllabusList[lessonIndex] || syllabusList[0] || 'Module Overview';

  const handleComplete = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}
    if (onLessonCompleted) {
      onLessonCompleted(course._id, currentLessonTitle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-brand dark:text-blue-400 bg-brand-accent/50 dark:bg-brand/20 px-2.5 py-0.5 rounded-md">
              {course.category || 'Engineering Curriculum'}
            </span>
            <h3 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl mt-1">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Current Module: {currentLessonTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Mockup Screen */}
        <div className="relative aspect-video rounded-2xl bg-slate-950 flex flex-col justify-between p-4 overflow-hidden shadow-inner group">
          {/* Ambient Video Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 via-transparent to-indigo-600/20 pointer-events-none" />
          
          {/* Top Status */}
          <div className="flex justify-between items-center text-xs text-slate-300 font-mono z-10">
            <span className="bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              1080p 60FPS • Industrial Recording
            </span>
            <span className="bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
              Speed: {speed}x
            </span>
          </div>

          {/* Central Play Button */}
          <div className="flex items-center justify-center z-10 my-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-16 w-16 rounded-full bg-brand/90 hover:bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/40 transform hover:scale-110 transition-all duration-200"
            >
              {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
            </button>
          </div>

          {/* Bottom Video Controls */}
          <div className="space-y-2 z-10">
            {/* Scrubber Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div className={`h-full bg-brand rounded-full transition-all duration-300 ${isPlaying ? 'w-2/3' : 'w-1/4'}`} />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white font-bold"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <div className="flex items-center gap-1 text-slate-400">
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>100%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      speed === s ? 'bg-brand text-white' : 'bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Notes & Actions */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-b-2 border-brand text-brand dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Instructor Lab Notes
            </button>
            <button
              onClick={() => setActiveTab('repo')}
              className={`pb-2 transition-colors ${
                activeTab === 'repo'
                  ? 'border-b-2 border-brand text-brand dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Code Starter & Resources
            </button>
          </div>

          {activeTab === 'notes' ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                Key Industrial Takeaways for {currentLessonTitle}:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                <li>Production-grade modular abstractions and error boundary handling.</li>
                <li>Best practices for environment variable secret isolation and API connection pooling.</li>
                <li>Write scalable test coverage using integration testing frameworks.</li>
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                Commercial Reference GitHub Repository:
              </p>
              <p className="font-mono text-[11px] text-brand dark:text-blue-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                git clone https://github.com/mountreach-corp/enterprise-production-starter.git
              </p>
            </div>
          )}
        </div>

        {/* Complete Lesson CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Finished this lecture? Mark completed to unlock quiz & advance certification.
          </span>
          <button
            onClick={handleComplete}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all duration-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Lesson Completed (+25%)
          </button>
        </div>

      </div>
    </div>
  );
};

export default LessonPlayerModal;
