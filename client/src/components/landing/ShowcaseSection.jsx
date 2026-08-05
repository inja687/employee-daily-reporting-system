import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiFileText, FiClock, FiUsers } from 'react-icons/fi';

const tabs = [
  { id: 'analytics', label: 'Real-Time Analytics', icon: FiBarChart2 },
  { id: 'reports', label: 'Daily Work Reports', icon: FiFileText },
  { id: 'attendance', label: 'Attendance & Check-Ins', icon: FiClock },
  { id: 'teams', label: 'Team Performance', icon: FiUsers },
];

const ShowcaseSection = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <section id="showcase" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
            DASHBOARD SHOWCASE
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Designed for Speed, Clarity & Action
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Experience an enterprise portal built with precision typography, responsive cards, dark mode, and zero clutter.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="text-base" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl relative min-h-[340px]">
          <AnimatePresence mode="wait">
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Executive Analytics & Workload Metrics</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    Live Data
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Weekly Work Hours</p>
                    <p className="text-3xl font-extrabold text-blue-400 mt-2">4,820 hrs</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Report Completion Rate</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-2">99.1%</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Active Departments</p>
                    <p className="text-3xl font-extrabold text-purple-400 mt-2">8 Units</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Daily Report Submissions & Drafts</h3>
                  <span className="text-xs text-slate-400">Showing today's submissions</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">Frontend Integration Task Report</p>
                      <p className="text-xs text-slate-400 mt-0.5">Submitted by Sarah Jenkins • 8.5 Hours Worked</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                      Submitted
                    </span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">Database Schema Migration Log</p>
                      <p className="text-xs text-slate-400 mt-0.5">Submitted by Michael Vance • 7.0 Hours Worked</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold">
                      Draft Saved
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'attendance' && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Smart Attendance & Late Calculation</h3>
                  <span className="text-xs text-slate-400">Shift Threshold: 09:30 AM</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-sm font-bold text-white mb-1">Morning Shift Check-in</p>
                    <p className="text-xs text-emerald-400">Checked in at 09:14 AM (On Time)</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-sm font-bold text-white mb-1">Evening Shift Check-out</p>
                    <p className="text-xs text-blue-400">Checked out at 06:02 PM (8h 48m logged)</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'teams' && (
              <motion.div
                key="teams"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Team Breakdown & Task Status</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Engineering</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">42 Staff</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Design & Product</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">18 Staff</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Sales & Marketing</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">35 Staff</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
