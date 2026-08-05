import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    q: 'How does the 14-Day Free Trial work?',
    a: 'When you register your company workspace, you receive immediate 14-day access to all features with full employee and department capabilities. No credit card is required.',
  },
  {
    q: 'Can employees register themselves directly?',
    a: 'No. To enforce security and tenant isolation, all employees are created strictly by the Company Admin inside their organization workspace.',
  },
  {
    q: 'How are subscription plans updated dynamically?',
    a: 'All plans, features, and pricing are stored dynamically in MongoDB. When the Super Admin updates a plan, changes immediately sync across the platform without code modifications.',
  },
  {
    q: 'Is my company data isolated from other organizations?',
    a: 'Yes. ReportPulse strictly enforces multi-tenant data isolation. Every query automatically filters by your authenticated tenantId at the middleware level.',
  },
  {
    q: 'What payment methods are supported for plan upgrades?',
    a: 'We support instant Razorpay checkout for Credit Cards, Debit Cards, NetBanking, UPI, and Corporate Wallets.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            Everything You Need to Know
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden backdrop-blur-xl transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-base sm:text-lg text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <FiChevronDown className={`text-xl text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
