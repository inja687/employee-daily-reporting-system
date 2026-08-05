import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiClock,
  FiFileText,
  FiBarChart2,
  FiCreditCard,
  FiUserCheck,
  FiMaximize2,
  FiX,
} from 'react-icons/fi';

const galleryCategories = [
  { id: 'all', name: 'All Modules' },
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'attendance', name: 'Attendance' },
  { id: 'reports', name: 'Reports' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'billing', name: 'Billing' },
];

const galleryItems = [
  {
    id: 1,
    category: 'dashboard',
    title: 'Company Admin Executive Dashboard',
    desc: 'Real-time overview of present staff, filed reports, pending leave requests, and department metrics.',
    badge: 'Executive',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 2,
    category: 'attendance',
    title: 'Attendance Check-In & Geolocation Audit',
    desc: 'Automated check-ins, shift duration logs, late arrival flags, and exportable monthly attendance logs.',
    badge: 'Attendance',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 3,
    category: 'reports',
    title: 'Daily Work Report Submissions Feed',
    desc: 'Standardized daily progress logs with draft saving, supervisor review tags, and PDF report downloads.',
    badge: 'Reporting',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 4,
    category: 'analytics',
    title: 'Recharts Performance & Trend Analytics',
    desc: 'Interactive data charts displaying daily report velocity, attendance compliance, and department output.',
    badge: 'Analytics',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 5,
    category: 'billing',
    title: 'Dynamic Subscription & Razorpay Billing',
    desc: 'Transparent plan tiers, instant Razorpay payment checkout, invoice history, and trial status audit.',
    badge: 'Billing',
    color: 'from-indigo-600 to-purple-600',
  },
  {
    id: 6,
    category: 'dashboard',
    title: 'Employee Mobile Reporting Portal',
    desc: 'Dedicated staff portal for check-ins, submitting daily work reports, applying for leaves, and task tracking.',
    badge: 'Employee Portal',
    color: 'from-cyan-600 to-blue-600',
  },
];

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            PLATFORM INTERFACE GALLERY
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            High-Fidelity Enterprise UI Screenshots
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Inspect live screens of ReportPulse built specifically for commercial enterprise deployment.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedItem(item)}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group hover:-translate-y-1 backdrop-blur-xl relative flex flex-col justify-between"
            >
              <div>
                <div className={`h-40 rounded-2xl bg-gradient-to-tr ${item.color} p-4 flex flex-col justify-between relative overflow-hidden mb-4 shadow-lg`}>
                  <div className="flex justify-between items-center z-10">
                    <span className="px-2.5 py-1 bg-slate-950/80 text-white text-[10px] font-extrabold uppercase rounded-full backdrop-blur-md">
                      {item.badge}
                    </span>
                    <FiMaximize2 className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="z-10 text-xs font-mono font-bold text-white/90">
                    Module: {item.title}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Click to Preview Screen</span>
                <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
              >
                <FiX className="text-xl" />
              </button>

              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
                {selectedItem.badge} Inspection
              </span>
              <h3 className="text-2xl font-black text-white mb-2">{selectedItem.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">{selectedItem.desc}</p>

              <div className={`p-8 sm:p-12 rounded-2xl bg-gradient-to-tr ${selectedItem.color} border border-slate-800 text-white space-y-4 shadow-2xl`}>
                <p className="text-base font-extrabold">ReportPulse High-Fidelity User Interface</p>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono">
                  Module Route: /app/workspace/{selectedItem.category} • Strict Tenant Isolation • Role Permission Protected
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
