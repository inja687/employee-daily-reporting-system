import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiBriefcase,
  FiClock,
  FiAward,
  FiArrowRight,
  FiCopy,
  FiShield,
  FiKey,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const WelcomeModal = ({ isOpen, onClose, company }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const companyName = company?.companyName || 'Your Workspace';
  const companyCode = company?.companyCode || 'COMP-A8F2';
  const companyId = company?.companyId || 'CMP-849201';
  const tenantId = company?.tenantId || 'TEN-4F25DA';
  const trialDays = company?.subscription?.trialDays || 14;
  const currentPlan = company?.subscription?.plan || 'Free Trial';

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleUpgradeClick = () => {
    onClose();
    navigate('/dashboard/billing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-white">
        {/* Glow Background Effect */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
            <FiCheckCircle className="text-3xl text-white" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-2">
            Provisioning Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Congratulations!
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Your Company Workspace is Ready & Active.
          </p>
        </div>

        {/* Info Grid */}
        <div className="relative z-10 space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 mb-6">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <FiBriefcase className="text-blue-400" /> Company Name
            </span>
            <span className="text-xs font-bold text-white">{companyName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60 bg-blue-950/30 p-2 rounded-xl border border-blue-500/20">
            <span className="text-xs text-blue-300 font-bold flex items-center gap-2">
              <FiKey className="text-blue-400" /> Company Code (For Onboarding)
            </span>
            <button
              onClick={() => copyToClipboard(companyCode, 'Company Code')}
              className="text-xs font-mono font-black text-emerald-400 hover:underline flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800"
            >
              {companyCode} <FiCopy className="text-[10px]" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <FiShield className="text-indigo-400" /> Company ID
            </span>
            <button
              onClick={() => copyToClipboard(companyId, 'Company ID')}
              className="text-xs font-mono font-semibold text-blue-400 hover:underline flex items-center gap-1"
            >
              {companyId} <FiCopy className="text-[10px]" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <FiShield className="text-purple-400" /> Tenant ID
            </span>
            <button
              onClick={() => copyToClipboard(tenantId, 'Tenant ID')}
              className="text-[11px] font-mono font-semibold text-slate-300 hover:underline truncate max-w-[180px] flex items-center gap-1"
              title={tenantId}
            >
              {tenantId} <FiCopy className="text-[10px]" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <FiClock className="text-amber-400" /> Remaining Trial
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
              {trialDays} Days Free Trial
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <FiAward className="text-emerald-400" /> Current Plan
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              {currentPlan}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleUpgradeClick}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
          >
            <FiAward className="text-sm" />
            <span>Professional Upgrade</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <span>Continue to Dashboard</span>
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

