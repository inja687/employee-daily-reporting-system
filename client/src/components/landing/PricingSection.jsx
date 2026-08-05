import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiZap, FiShield, FiStar } from 'react-icons/fi';
import CheckoutButton from '../payment/CheckoutButton';
import api from '../../services/api';

const defaultFallbackPlans = [
  {
    name: 'Free Trial',
    shortDescription: 'Ideal for trying out ReportPulse with full features for 14 days.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: { attendance: true, dailyReports: true, leaveManagement: true, taskManagement: true },
    popular: false,
    employeeLimit: 10,
    departmentLimit: 3,
    storageLimit: 1,
    displayOrder: 1,
    theme: { ribbonText: '14-Day Trial', buttonText: 'Start Free Trial' },
  },
  {
    name: 'Starter Plan',
    shortDescription: 'Designed for small growing teams needing daily activity tracking.',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: { attendance: true, dailyReports: true, leaveManagement: true, taskManagement: true, analytics: true },
    popular: false,
    employeeLimit: 25,
    departmentLimit: 5,
    storageLimit: 5,
    displayOrder: 2,
    theme: { ribbonText: 'Small Teams', buttonText: 'Choose Starter' },
  },
  {
    name: 'Pro Plan',
    shortDescription: 'Complete operational suite for scaling companies and departments.',
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    features: { attendance: true, dailyReports: true, leaveManagement: true, taskManagement: true, analytics: true, customBranding: true, prioritySupport: true, auditLogs: true },
    popular: true,
    employeeLimit: 100,
    departmentLimit: 15,
    storageLimit: 20,
    displayOrder: 3,
    theme: { ribbonText: 'Most Popular Choice', buttonText: 'Get Started with Pro' },
  },
  {
    name: 'Enterprise Plan',
    shortDescription: 'Custom capacity, SLA guarantees, & dedicated governance.',
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    features: { attendance: true, dailyReports: true, leaveManagement: true, taskManagement: true, analytics: true, customBranding: true, prioritySupport: true, apiAccess: true, auditLogs: true },
    popular: false,
    employeeLimit: 0,
    departmentLimit: 0,
    storageLimit: 100,
    displayOrder: 4,
    theme: { ribbonText: 'Unlimited Access', buttonText: 'Contact Enterprise' },
  },
];

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const [plansList, setPlansList] = useState(defaultFallbackPlans);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await api.get('/subscription-plans/public');
        if (res.data?.data && res.data.data.length > 0) {
          // Sort by displayOrder
          const sorted = [...res.data.data].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
          setPlansList(sorted);
        }
      } catch (err) {
        // Fallback to defaultFallbackPlans
      }
    };
    loadPlans();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-3">
            TRANSPARENT PRICING TIERS
          </h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight">
            Flexible Plans Built for Every Stage
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            No hidden fees. All subscription rules and feature limits are managed dynamically from MongoDB.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className={`text-sm font-semibold ${!annual ? 'text-white font-bold' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-14 h-8 rounded-full bg-slate-900 p-1 relative border border-slate-700 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full bg-purple-600 transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${annual ? 'text-white font-bold' : 'text-slate-400'}`}>
              Annual Billing <span className="text-xs text-purple-400 font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* 4 Cards Single Row Desktop Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plansList.map((p, idx) => {
            const monthlyVal = p.monthlyPrice || 0;
            const annualVal = p.yearlyPrice ? Math.round(p.yearlyPrice / 12) : monthlyVal;
            const priceVal = annual ? annualVal : monthlyVal;

            const isPopular = p.popular || p.name?.toLowerCase().includes('pro');
            const isEnterprise = p.name?.toLowerCase().includes('enterprise');

            return (
              <motion.div
                key={p._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between h-full relative transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl ${
                  isPopular
                    ? 'bg-slate-900 border-purple-500 shadow-2xl ring-2 ring-purple-500/30 scale-102 lg:scale-105 z-20'
                    : isEnterprise
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-xl'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-purple-600/30 whitespace-nowrap">
                    {p.theme?.ribbonText || 'Most Popular Choice'}
                  </span>
                )}

                {isEnterprise && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md whitespace-nowrap">
                    {p.theme?.ribbonText || 'Unlimited Access'}
                  </span>
                )}

                <div className="flex flex-col flex-1">
                  <div>
                    <h3 className="text-xl font-black text-white">{p.name}</h3>
                    <p className="text-slate-400 text-xs mt-1 mb-4 leading-relaxed min-h-[36px]">
                      {p.shortDescription || p.tagline}
                    </p>

                    <div className="flex items-baseline space-x-1 mb-6 pb-6 border-b border-slate-800">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {priceVal === 0 ? 'Free' : `₹${priceVal}`}
                      </span>
                      <span className="text-slate-400 text-xs">/ mo per org</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="flex-1">
                    <ul className="space-y-3 text-xs text-slate-300 mb-8">
                      <li className="flex items-center space-x-2.5">
                        <FiCheck className="text-purple-400 text-sm shrink-0" />
                        <span className="font-semibold text-white">
                          {p.employeeLimit === 0 ? 'Unlimited Employees' : `Up to ${p.employeeLimit} Staff`}
                        </span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <FiCheck className="text-purple-400 text-sm shrink-0" />
                        <span>{p.departmentLimit === 0 ? 'Unlimited Departments' : `Up to ${p.departmentLimit || 5} Departments`}</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <FiCheck className="text-purple-400 text-sm shrink-0" />
                        <span>Attendance & Geolocation</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <FiCheck className="text-purple-400 text-sm shrink-0" />
                        <span>Daily Work Reports & Drafts</span>
                      </li>

                      {p.features && typeof p.features === 'object' && Object.keys(p.features).map((featKey, fIdx) => {
                        if (['attendance', 'dailyReports', 'departments', 'leaveManagement', 'taskManagement'].includes(featKey)) return null;
                        if (!p.features[featKey]) return null;
                        return (
                          <li key={fIdx} className="flex items-center space-x-2.5">
                            <FiCheck className="text-purple-400 text-sm shrink-0" />
                            <span className="capitalize">{featKey.replace(/([A-Z])/g, ' $1')} Included</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <CheckoutButton
                    planName={p.name}
                    amount={priceVal}
                    buttonText={p.theme?.buttonText || (p.monthlyPrice === 0 ? 'Start 14-Day Free Trial' : `Subscribe to ${p.name}`)}
                    variant={isPopular ? 'primary' : 'outline'}
                    className="w-full justify-center py-3 font-bold"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expandable Plan Comparison Matrix Table */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-purple-400 hover:text-white hover:border-slate-700 transition-all inline-flex items-center gap-2 shadow-lg"
          >
            <span>{showCompare ? 'Hide Full Plan Comparison Matrix' : 'Compare All Plan Features & Limits'}</span>
            <span>{showCompare ? '↑' : '↓'}</span>
          </button>

          {showCompare && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-x-auto text-left border border-slate-800 rounded-3xl bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
            >
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-4 px-4 font-bold uppercase tracking-wider">Features & Capabilities</th>
                    {plansList.map((p, idx) => (
                      <th key={idx} className="py-4 px-4 font-bold text-white uppercase">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Staff Member Limit</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4 font-mono font-bold text-blue-400">{p.employeeLimit === 0 ? 'Unlimited' : `${p.employeeLimit} Staff`}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Department Limit</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4 font-mono font-bold text-purple-400">{p.departmentLimit === 0 ? 'Unlimited' : `${p.departmentLimit || 5} Depts`}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Cloud Storage Space</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4 font-mono font-bold text-emerald-400">{p.storageLimit || 5} GB</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Attendance Tracking & Geolocation</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4 text-emerald-400 font-bold">✓ Included</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Daily Work Reports & Drafts</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4 text-emerald-400 font-bold">✓ Included</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Recharts Performance Analytics</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4">{p.features?.analytics ? <span className="text-emerald-400 font-bold">✓ Included</span> : <span className="text-slate-600">—</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Custom Branding & Company Logo</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4">{p.features?.customBranding ? <span className="text-emerald-400 font-bold">✓ Included</span> : <span className="text-slate-600">—</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Priority Support (24/7)</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4">{p.features?.prioritySupport ? <span className="text-emerald-400 font-bold">✓ Included</span> : <span className="text-slate-600">—</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">API Integration Access</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4">{p.features?.apiAccess ? <span className="text-emerald-400 font-bold">✓ Included</span> : <span className="text-slate-600">—</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">System Winston Audit Logs</td>
                    {plansList.map((p, idx) => (
                      <td key={idx} className="py-3 px-4">{p.features?.auditLogs ? <span className="text-emerald-400 font-bold">✓ Included</span> : <span className="text-slate-600">—</span>}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
