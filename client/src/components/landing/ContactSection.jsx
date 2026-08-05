import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiMessageSquare,
  FiClock,
  FiGlobe,
} from 'react-icons/fi';
import api from '../../services/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phone: '',
    countryCode: '+1',
    subject: '',
    category: 'General Question',
    priority: 'Medium',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/support/public', formData);
      setTicketResult(res.data?.data);
      toast.success(`Support ticket ${res.data?.data?.ticketId} created!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Ambient Glowing Background Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            GET IN TOUCH WITH OUR SAAS EXPERTS
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            Let's Talk Enterprise Reporting
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Have questions about custom SLAs, dedicated MongoDB clusters, or team onboarding? Our enterprise architects are here to assist.
          </p>
        </div>

        {/* Split-Screen Glass Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column - Contact Info & Map Visual (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                <FiMessageSquare />
                <span>24/7 Enterprise Assistance</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Direct Communication Channels
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Connect directly with our solutions team for live walkthroughs, security audits, and custom billing requests.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-1 text-base">
                    <FiMail />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Enterprise Sales</span>
                    <a href="mailto:sales@reportpulse.com" className="text-sm font-extrabold text-white hover:text-blue-400 transition-colors">
                      sales@reportpulse.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-1 text-base">
                    <FiPhone />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Direct Phone Line</span>
                    <a href="tel:+18005557857" className="text-sm font-extrabold text-white hover:text-purple-400 transition-colors">
                      +1 (800) 555-PULSE
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1 text-base">
                    <FiMapPin />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Global Headquarters</span>
                    <p className="text-sm font-semibold text-white">San Francisco, CA & Bengaluru, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Visual Graphic */}
            <div className="mt-10 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <FiGlobe /> Global Data Hubs
                </span>
                <span className="text-[10px] text-slate-500">US-West / AP-South</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>San Francisco Hub</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>Bengaluru Hub</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col justify-between"
          >
            {ticketResult ? (
              <div className="py-12 text-center space-y-4 my-auto animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-emerald-500/10">
                  <FiCheckCircle />
                </div>
                <h4 className="text-2xl font-black text-white">Thank You! Your Request Has Been Submitted.</h4>
                <p className="text-xs text-slate-400">A support ticket has been created automatically in MongoDB:</p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-lg font-bold text-emerald-400 max-w-xs mx-auto">
                  Ticket Number: {ticketResult.ticketId}
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Our enterprise support engineering team has been notified. We will reply to <strong className="text-blue-400">{ticketResult.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => setTicketResult(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors mt-4"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white">Submit Support Request</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <FiClock className="text-blue-400" /> Auto-Generated Ticket ID
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Global Inc."
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Country Code</label>
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="+1">🇺🇸 +1 (US/CA)</option>
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+61">🇦🇺 +61 (Australia)</option>
                      <option value="+49">🇩🇪 +49 (Germany)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="(555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise Onboarding & Custom SLA Request"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical 🔥</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Message Details *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your inquiry or technical support request in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 py-3 rounded-xl font-extrabold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Generating Ticket...</span>
                    ) : (
                      <>
                        <FiSend />
                        <span>Send Message & Create Ticket</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 text-center pt-1">
                  🔒 Saved to MongoDB Atlas • Auto Ticket Number Generation (`SUP-XXXXXX`)
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
