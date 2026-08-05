import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiPlay,
  FiShield,
  FiCheckCircle,
  FiUsers,
  FiClock,
  FiFileText,
  FiBarChart2,
  FiZap,
} from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-slate-950 text-white">
      {/* Premium Ambient Glowing Gradient Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[15%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-[50px] right-[15%] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-[200px] left-[35%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-xl shadow-lg shadow-blue-500/10 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-blue-300">Announcing ReportPulse 2.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 flex items-center gap-1 group cursor-pointer hover:text-white transition-colors">
            Explore Enterprise SaaS Suite <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto"
        >
          Operational Intelligence for Modern{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Enterprise Workforce
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Streamline daily reporting, automated attendance tracking, multi-tenant department management, and real-time performance analytics in a single unified SaaS platform.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-3 group"
          >
            <FiZap className="text-lg group-hover:scale-110 transition-transform" />
            <span>Start 14-Day Free Trial</span>
            <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 backdrop-blur-xl shadow-lg"
          >
            <FiPlay className="text-blue-400 text-sm fill-current" />
            <span>Watch Live Product Demo</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400"
        >
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400" />
            <span>14-Day Full Access</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400" />
            <span>Instant Tenant Provisioning</span>
          </div>
          <div className="flex items-center gap-2">
            <FiShield className="text-blue-400" />
            <span>Enterprise Multi-Tenant Isolation</span>
          </div>
        </motion.div>

        {/* Floating Live Metric Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Today's Attendance</span>
                  <FiClock className="text-emerald-400 text-base" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">98.4%</div>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">↑ +2.4% vs Yesterday</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Reports Submitted</span>
                  <FiFileText className="text-blue-400 text-base" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">1,420</div>
                <span className="text-[11px] text-blue-400 font-semibold mt-1 block">100% Verified Entries</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Employees</span>
                  <FiUsers className="text-purple-400 text-base" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">450 Staff</div>
                <span className="text-[11px] text-purple-400 font-semibold mt-1 block">Across 12 Departments</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">SaaS SLA Uptime</span>
                  <FiBarChart2 className="text-amber-400 text-base" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">99.99%</div>
                <span className="text-[11px] text-amber-400 font-semibold mt-1 block">MongoDB Atlas High Availability</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
