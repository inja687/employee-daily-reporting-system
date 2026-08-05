import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiClock,
  FiFileText,
  FiBarChart2,
  FiUserCheck,
  FiMaximize2,
  FiX,
  FiCheckCircle,
} from 'react-icons/fi';

const mockTabs = [
  {
    id: 'dashboard',
    name: 'Company Dashboard',
    icon: FiGrid,
    title: 'Executive Organization Control Center',
    subtitle: 'Real-time overview of workforce attendance, daily report counts, and department status.',
  },
  {
    id: 'attendance',
    name: 'Attendance Tracking',
    icon: FiClock,
    title: 'Automated Check-In & Geolocation Log',
    subtitle: 'Track check-ins, check-outs, work durations, and shift statuses automatically.',
  },
  {
    id: 'reports',
    name: 'Daily Work Reports',
    icon: FiFileText,
    title: 'Structured Work Submission Pipeline',
    subtitle: 'Standardized daily progress reporting with manager approval workflows.',
  },
  {
    id: 'analytics',
    name: 'Recharts Analytics',
    icon: FiBarChart2,
    title: 'Operational Productivity & Trends',
    subtitle: 'Deep performance metrics, attendance velocity, and department output charts.',
  },
  {
    id: 'employee',
    name: 'Employee Portal',
    icon: FiUserCheck,
    title: 'Mobile-Optimized Staff Interface',
    subtitle: 'Simplified portal for staff check-ins, task management, and leave applications.',
  },
];

const DeviceMockupShowcase = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentTabData = mockTabs.find((t) => t.id === activeTab);

  return (
    <section id="demo" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            PRODUCT DEMO & SHOWCASE
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            Designed for Speed, Precision & Clarity
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Experience realistic multi-device preview of ReportPulse across Laptop, Tablet, and Mobile views.
          </p>
        </div>

        {/* Interactive Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {mockTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="text-sm shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Description */}
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{currentTabData?.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{currentTabData?.subtitle}</p>
        </div>

        {/* Multi-Device Interactive Mockup Frames */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Laptop Mockup Frame */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-3 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl relative"
          >
            {/* Window Top Controls */}
            <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-4 text-[11px] font-mono text-slate-500 hidden sm:inline">
                  https://app.reportpulse.com/workspace/{activeTab}
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(true)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                <FiMaximize2 className="text-xs" />
                <span>Enlarge Screen</span>
              </button>
            </div>

            {/* UI Mockup Content Canvas */}
            <div className="p-4 sm:p-8 bg-slate-950 rounded-2xl min-h-[380px] sm:min-h-[460px] text-left">
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h4 className="text-lg font-extrabold text-white">Acme Global Corporation</h4>
                      <p className="text-xs text-blue-400 font-mono">Company Workspace • Pro Plan</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/20">
                      ● Live Organization
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-bold">Total Staff</span>
                      <p className="text-2xl font-black text-white mt-1">128</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-bold">Today Present</span>
                      <p className="text-2xl font-black text-emerald-400 mt-1">124</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-bold">Reports Filed</span>
                      <p className="text-2xl font-black text-blue-400 mt-1">118</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase font-bold">Pending Leaves</span>
                      <p className="text-2xl font-black text-amber-400 mt-1">3</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Activity Stream</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                        <span className="text-white font-semibold">Sarah Connor (Engineering) filed Daily Work Report</span>
                        <span className="text-slate-500 text-[10px]">10 mins ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                        <span className="text-white font-semibold">John Doe checked in at HQ Location</span>
                        <span className="text-slate-500 text-[10px]">24 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-extrabold text-white">Daily Attendance & Geolocation Audit</h4>
                    <span className="text-xs text-slate-400 font-mono">Date: Today</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { name: 'Alex Morgan', dept: 'Engineering', in: '09:00 AM', out: '06:00 PM', status: 'Present' },
                      { name: 'David Miller', dept: 'Sales', in: '09:12 AM', out: '06:05 PM', status: 'Present' },
                      { name: 'Rachel Green', dept: 'Design', in: '09:30 AM', out: '05:45 PM', status: 'Late' },
                    ].map((row, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{row.name}</p>
                          <p className="text-[11px] text-slate-400">{row.dept}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-emerald-400 font-bold">{row.in} - {row.out}</p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-base font-extrabold text-white">Daily Work Report Submissions</h4>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-blue-400">Report #RPT-2026-902</span>
                      <span className="text-slate-400">Submitted by: Alex Morgan</span>
                    </div>
                    <p className="text-xs text-slate-300">Completed API endpoint optimization and deployed microservices build v2.4 to staging environment.</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">8 Hours Worked</span>
                      <span>•</span>
                      <span>Verified Status: Approved</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="text-base font-extrabold text-white">Workforce Productivity Analytics</h4>
                  <div className="h-48 w-full bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-bold">Monthly Report Completion Velocity (%)</span>
                    <div className="flex items-end space-x-3 h-32 pt-4">
                      {[40, 65, 80, 75, 95, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'employee' && (
                <div className="max-w-md mx-auto space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 text-center">
                    <span className="text-xs text-blue-300 font-bold">Employee Mobile View</span>
                    <h5 className="text-lg font-black text-white mt-1">Check-In Active</h5>
                    <p className="text-xs text-emerald-400 font-bold mt-1">Logged In: 09:00 AM</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between">
                    <span className="text-slate-300">Today's Assigned Tasks</span>
                    <span className="font-bold text-white">3 Tasks Pending</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
              <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full">
                <FiX className="text-xl" />
              </button>
              <h3 className="text-xl font-extrabold text-white mb-2">{currentTabData?.name} Fullscreen Preview</h3>
              <p className="text-xs text-slate-400 mb-4">{currentTabData?.subtitle}</p>
              <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-4">
                <p className="text-sm font-bold text-blue-400">High-Resolution Enterprise UI Framing</p>
                <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  Detailed inspection mode active. Every component in ReportPulse is built with responsive CSS, dark mode support, and strict role-based data permissions.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DeviceMockupShowcase;
