import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiZap,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiCheck,
  FiCreditCard,
  FiAward,
  FiShield,
  FiLock,
  FiLogOut,
  FiSmartphone,
  FiGlobe,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import CheckoutButton from '../../components/payment/CheckoutButton';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';

const BillingPage = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [plans, setPlans] = useState([]);
  const [statusInfo, setStatusInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annual, setAnnual] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [plansRes, statusRes, historyRes] = await Promise.all([
        api.get('/subscription/plans').catch(() => ({ data: { data: [] } })),
        api.get('/subscription/status').catch(() => ({ data: { data: null } })),
        api.get('/subscription/history').catch(() => ({ data: { data: { invoices: [] } } })),
      ]);

      setPlans(plansRes.data.data || []);
      setStatusInfo(statusRes.data.data || null);
      setHistory(historyRes.data.data?.invoices || []);
    } catch (error) {
      toast.error('Failed to load billing & subscription details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const handleSubscriptionUpdate = () => {
      fetchData();
    };
    window.addEventListener('subscription:updated', handleSubscriptionUpdate);
    return () => window.removeEventListener('subscription:updated', handleSubscriptionUpdate);
  }, [fetchData]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  if (loading) {
    return <SkeletonLoader type="card" rows={4} />;
  }

  const sub = statusInfo?.subscription;
  const remainingDays = statusInfo?.remainingDays ?? 14;
  const isActivePaid = sub?.status === 'Active';
  const isExpired = statusInfo?.status === 'Expired' || (remainingDays <= 0 && !isActivePaid);

  const defaultPlans = [
    {
      _id: 'p-starter',
      name: 'Starter',
      priceMonthly: 499,
      priceAnnual: 399,
      features: ['Up to 10 Employees', 'Daily Work Reports', 'Attendance Tracking', 'Email Notifications'],
    },
    {
      _id: 'p-professional',
      name: 'Professional',
      priceMonthly: 1299,
      priceAnnual: 999,
      features: ['Unlimited Employees', 'Advanced Analytics & Exports', 'Custom Departments & Tasks', 'Priority Razorpay Support', 'Audit Logging & Roles'],
    },
    {
      _id: 'p-enterprise',
      name: 'Enterprise',
      priceMonthly: 2999,
      priceAnnual: 2499,
      features: ['Dedicated Tenant Isolation', 'SLA 99.9% Uptime Guarantee', '24/7 Account Manager', 'Custom API Integrations'],
    },
  ];

  const activePlans = plans.length > 0 ? plans : defaultPlans;

  const columns = [
    {
      header: 'Invoice No.',
      accessor: 'invoiceNumber',
      render: (row) => (
        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Plan Name',
      accessor: 'planName',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.planName} Plan</span>,
    },
    {
      header: 'Amount Paid',
      accessor: 'amount',
      render: (row) => <span className="font-bold">₹{row.amount} INR</span>,
    },
    {
      header: 'GST Tax (18%)',
      accessor: 'gstAmount',
      render: (row) => <span className="text-xs text-gray-500">₹{row.gstAmount || (row.amount * 0.18).toFixed(2)}</span>,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Link to={`/dashboard/invoices/${row._id}`}>
          <Button size="xs" variant="outline">
            <FiDownload className="mr-1" /> Download Invoice
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Billing & Subscription' }]} />

      {/* Trial Expired Lock Paywall Banner */}
      {isExpired && (
        <div className="p-6 bg-slate-900 text-white border-2 border-rose-500 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <FiLock className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">Your Trial Has Expired</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Renew your subscription to continue using ReportPulse. Business reporting modules are locked until payment is verified.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="#plans"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs whitespace-nowrap shadow-xl"
              >
                Upgrade Plan & Pay Now
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Supported Razorpay Payment Methods Callout */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 uppercase tracking-wider">Razorpay Test Mode Supported:</span>
            <span className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <FiSmartphone className="text-blue-400" /> <span>UPI (GPay / PhonePe / Paytm)</span>
            </span>
            <span className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <FiCreditCard className="text-emerald-400" /> <span>Credit / Debit Cards</span>
            </span>
            <span className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <FiGlobe className="text-purple-400" /> <span>Net Banking & EMI</span>
            </span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <FiZap className="text-amber-400 text-2xl" />
            <h1 className="text-2xl font-black tracking-tight">
              {isActivePaid ? `${sub.plan} Plan Active` : 'Billing & Subscription Hub'}
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            {isActivePaid
              ? `Your workspace is currently subscribed to the ${sub.plan} Plan with Razorpay 18% GST invoices.`
              : 'Manage workspace trial status, review renewal dates, and upgrade to Professional plans via Razorpay.'}
          </p>
        </div>

        {/* Current Plan & Remaining Trial Cards */}
        <div className="relative z-10 flex flex-wrap items-center gap-4">
          {/* Card 1: Current Plan Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 min-w-[140px]">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Current Plan Card</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <FiAward className="text-emerald-400 text-base" />
              <span className="text-base font-black text-blue-400">{sub?.plan || 'Free Trial'}</span>
            </div>
          </div>

          {/* Card 2: Professional Trial Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 min-w-[140px]">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Remaining Trial</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <FiClock className="text-amber-400 text-base" />
              <span className={`text-base font-black ${isActivePaid ? 'text-emerald-400' : isExpired ? 'text-rose-500' : 'text-amber-400'}`}>
                {isActivePaid ? 'Paid Active' : isExpired ? 'Expired' : `${remainingDays} Days Left`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div id="plans" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Upgrade Subscription Plans</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Select an enterprise plan with automated Razorpay checkout</p>
          </div>

          <div className="flex items-center space-x-3 bg-gray-200 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-xl transition-all ${!annual ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-500'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-xl transition-all ${annual ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-500'}`}
            >
              Annual Billing <span className="text-[10px] text-emerald-500 font-extrabold">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePlans.map((p) => {
            const isCurrentActive = isActivePaid && sub?.plan === p.name;
            const price = annual ? p.priceAnnual : p.priceMonthly;

            return (
              <Card
                key={p._id}
                className={`p-6 flex flex-col justify-between relative border rounded-3xl transition-all hover:shadow-2xl ${
                  isCurrentActive
                    ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/30'
                    : p.name === 'Professional'
                    ? 'border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-slate-800'
                }`}
              >
                {isCurrentActive && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <FiCheckCircle /> Current Active Plan
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{p.name}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">₹{price}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400"> / month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 mb-6">
                    {Array.isArray(p.features)
                      ? p.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2">
                            <FiCheck className="text-blue-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))
                      : p.features && typeof p.features === 'object'
                      ? Object.keys(p.features).map((featKey, fIdx) => {
                          if (!p.features[featKey]) return null;
                          return (
                            <li key={fIdx} className="flex items-center space-x-2">
                              <FiCheck className="text-blue-500 shrink-0" />
                              <span className="capitalize">{featKey.replace(/([A-Z])/g, ' $1')} Included</span>
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>

                <CheckoutButton
                  planName={p.name}
                  amount={price}
                  disabled={isCurrentActive}
                  buttonText={isCurrentActive ? 'Current Active Plan' : `Upgrade to ${p.name}`}
                  variant={isCurrentActive ? 'secondary' : p.name === 'Professional' ? 'primary' : 'outline'}
                  className="w-full justify-center py-3 font-bold rounded-2xl"
                />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment History Table */}
      <Card title="Payment & Invoice History" subtitle="Razorpay transactions with downloadable 18% GST invoices">
        <Table columns={columns} data={history} isLoading={loading} emptyMessage="No payment transactions recorded" />
      </Card>
    </div>
  );
};

export default BillingPage;


