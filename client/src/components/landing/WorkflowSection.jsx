import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Register Workspace', desc: 'Create your organization workspace in seconds with unique company code.' },
  { step: '02', title: '14-Day Free Trial', desc: 'Instant access to all features without requiring a credit card.' },
  { step: '03', title: 'Onboard Staff', desc: 'Add employees and assign department managers with role permissions.' },
  { step: '04', title: 'Attendance Check-In', desc: 'Employees log check-ins and check-outs with automated geolocation logging.' },
  { step: '05', title: 'Daily Work Reports', desc: 'Staff submit structured daily reports and drafts for manager verification.' },
  { step: '06', title: 'Scale & Grow', desc: 'Review Recharts analytics, export data, and upgrade subscription plans seamlessly.' },
];

const WorkflowSection = () => {
  return (
    <section id="workflow" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            SEAMLESS WORKFLOW
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            6 Simple Steps to Total Workforce Visibility
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            From initial signup to full enterprise deployment in less than 5 minutes.
          </p>
        </div>

        {/* Workflow Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all relative overflow-hidden backdrop-blur-xl"
            >
              <span className="text-4xl font-black text-blue-500/20 block mb-4 font-mono">{s.step}</span>
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
