import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';

const CtaSection = () => {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/30 text-center relative overflow-hidden shadow-2xl backdrop-blur-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Transform Your Enterprise Operations?
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Join hundreds of high-performing teams using ReportPulse for daily workforce transparency.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 group"
              >
                <FiZap className="text-lg group-hover:scale-110 transition-transform" />
                <span>Start 14-Day Free Trial</span>
                <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Workspace</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
