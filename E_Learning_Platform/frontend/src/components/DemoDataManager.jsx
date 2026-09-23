import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Database, Sparkles, Trash2, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

const DemoDataManager = ({ isOpen, onClose, onDataChanged }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dummy/status');
      setStatus(res.data);
    } catch (err) {
      console.error('Failed to load dummy status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setActionMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInject = async () => {
    try {
      setLoading(true);
      const res = await api.post('/dummy/inject');
      setActionMessage({ type: 'success', text: res.data.message });
      await fetchStatus();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to inject dummy data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClean = async () => {
    try {
      setLoading(true);
      const res = await api.delete('/dummy/clean');
      setActionMessage({ type: 'success', text: res.data.message });
      await fetchStatus();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to clean dummy data.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden space-y-6">
        {/* Glow Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-accent text-brand rounded-2xl flex items-center justify-center shadow-sm">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                Live Data & Demo Manager
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                100% dynamic MongoDB Atlas synchronization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Database Status Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider">Cloud Atlas Status</span>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="text-brand hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 block">Courses in DB</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {status?.database?.totalCourses ?? '...'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {status?.database?.realCourses ?? 0} Real
                </span>
                {status?.database?.dummyCourses > 0 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    {status.database.dummyCourses} Demo
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 block">Internships in DB</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {status?.database?.totalInternships ?? '...'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {status?.database?.realInternships ?? 0} Real
                </span>
                {status?.database?.dummyInternships > 0 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    {status.database.dummyInternships} Demo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dummy File Status Info */}
        <div className="p-4 rounded-2xl border text-xs leading-relaxed space-y-1 bg-blue-50/50 border-blue-100 text-slate-600">
          <div className="flex items-center gap-2 font-bold text-brand">
            <Sparkles className="h-4 w-4" />
            <span>Deletable Temp Data Architecture</span>
          </div>
          <p>
            The test dummy data is stored in <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">backend/src/config/dummyData.js</code>. You can delete or edit this file anytime! Real data and database operations remain 100% functional.
          </p>
        </div>

        {/* Action feedback message */}
        {actionMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleInject}
            disabled={loading || !status?.dummyFileExists}
            className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Inject Demo Data
          </button>
          <button
            onClick={handleClean}
            disabled={loading}
            className="flex-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoDataManager;
