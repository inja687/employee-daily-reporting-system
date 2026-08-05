import { motion } from 'framer-motion';
import {
  FiClock,
  FiFileText,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiShield,
  FiBell,
  FiDownload,
  FiLock,
  FiZap,
} from 'react-icons/fi';

const features = [
  {
    icon: FiClock,
    title: 'Automated Attendance Check-In',
    description: 'Instant clock-in/out with automated geolocation verification, shift duration logging, and daily presence audit trail.',
    badge: 'Core Engine',
    color: 'emerald',
  },
  {
    icon: FiFileText,
    title: 'Structured Work Reports',
    description: 'Eliminate manual status updates with structured daily work report submission, draft saves, and manager verification pipelines.',
    badge: 'High Impact',
    color: 'blue',
  },
  {
    icon: FiUsers,
    title: 'Multi-Tenant Department Control',
    description: 'Isolate company teams into structured departments with dedicated department heads and role-based permissions.',
    badge: 'Enterprise',
    color: 'purple',
  },
  {
    icon: FiCheckSquare,
    title: 'Task Delegation & Tracking',
    description: 'Assign, prioritize, and track work tasks directly integrated into daily employee status reports.',
    badge: 'Productivity',
    color: 'indigo',
  },
  {
    icon: FiBarChart2,
    title: 'Recharts Analytics Suite',
    description: 'Visualize operational trends, daily report filing velocity, department attendance percentage, and workforce growth.',
    badge: 'Analytics',
    color: 'amber',
  },
  {
    icon: FiShield,
    title: 'Strict Multi-Tenant Isolation',
    description: 'Guaranteed tenant isolation with tenantId parameters verified at API middleware level for enterprise compliance.',
    badge: 'Security',
    color: 'rose',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            POWERFUL CAPABILITIES
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            Built for Modern High-Growth Enterprise Operations
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Everything your organization needs to monitor, measure, and scale employee productivity seamlessly.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className="text-8xl text-blue-400" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <Icon />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300 cursor-pointer">
                  <span>Explore Feature</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
