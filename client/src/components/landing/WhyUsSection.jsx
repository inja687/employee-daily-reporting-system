import { motion } from 'framer-motion';
import { FiCheck, FiShield, FiZap, FiDatabase, FiLock, FiCpu } from 'react-icons/fi';

const whyUsItems = [
  {
    title: 'Zero Code Configuration',
    desc: 'Deploy instantly with ready-made subscription plans, department structures, and roles.',
  },
  {
    title: 'Enterprise Multi-Tenant Security',
    desc: 'Every API query automatically enforces tenantId isolation so data never leaks across organizations.',
  },
  {
    title: 'High Availability & Scaling',
    desc: 'Built on MongoDB Atlas replica sets with index optimization for sub-second response times.',
  },
  {
    title: 'Role-Based Dashboards',
    desc: 'Dedicated interfaces tailored specifically for Super Admin, Company Admin, and Employee users.',
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
              WHY REPORTPULSE
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Architected for Reliability, Security & Speed
            </h3>
            <p className="mt-4 text-slate-400 text-base leading-relaxed mb-8">
              Legacy reporting systems rely on messy spreadsheets and fragmented apps. ReportPulse consolidates attendance, daily logs, tasks, and analytics into one unified enterprise hub.
            </p>

            <div className="space-y-4">
              {whyUsItems.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck className="text-base" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column Interactive Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                  <FiCpu className="text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-white">Enterprise Architecture Guard</h4>
                  <p className="text-xs text-slate-400">Strict Tenant Separation Enforced</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Authentication Claims:</span>
                  <span className="text-emerald-400 font-bold">JWT Verified</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tenant Isolation Middleware:</span>
                  <span className="text-blue-400 font-bold">enforceTenantIsolation()</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Database Connection:</span>
                  <span className="text-purple-400 font-bold">MongoDB Atlas Replica</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Security Audit Log:</span>
                  <span className="text-amber-400 font-bold">Active Logging</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
