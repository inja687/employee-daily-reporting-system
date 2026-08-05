import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Sarah Connor',
    role: 'VP of Operations',
    company: 'Apex Dynamics',
    content: 'ReportPulse completely replaced our manual daily check-in spreadsheets. The multi-tenant structure and department analytics give us complete visibility.',
  },
  {
    name: 'Michael Chang',
    role: 'CTO',
    company: 'NovaTech Solutions',
    content: 'The 14-day trial let us test everything with 50 staff members before committing. Upgrading to the Pro plan via Razorpay was instant and flawless.',
  },
  {
    name: 'Elena Rostova',
    role: 'Head of People',
    company: 'GlobalCorp Global',
    content: 'Automated daily report filing combined with attendance audit trails has saved our team over 15 hours every single week.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            CUSTOMER STORIES
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            Loved by Fast-Growing Enterprise Teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-current text-sm" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-6 font-normal">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role} • <span className="text-blue-400">{t.company}</span></p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Buyer
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
