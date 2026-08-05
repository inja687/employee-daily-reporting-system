import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Organizations', value: '500+' },
  { label: 'Daily Work Reports Filed', value: '50,000+' },
  { label: 'Attendance Check-Ins', value: '10M+' },
  { label: 'System Uptime SLA', value: '99.99%' },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-950/80 via-slate-900 to-purple-950/80 text-white border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <p className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mt-2">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
