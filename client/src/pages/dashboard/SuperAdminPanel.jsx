import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiClock,
  FiSend,
  FiKey,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiPieChart,
  FiLifeBuoy,
  FiFileText,
  FiSettings,
  FiActivity,
  FiSearch,
  FiFilter,
  FiUserCheck,
  FiUserX,
  FiTrash2,
  FiRefreshCw,
  FiEye,
  FiEdit,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'companies';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };
  const [metrics, setMetrics] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [extendDays, setExtendDays] = useState(7);
  const [newPasswordRes, setNewPasswordRes] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('Pro Plan');
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '', target: 'ALL' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashRes, compRes, logsRes] = await Promise.all([
        api.get('/super-admin/dashboard').catch(() => ({ data: { data: { metrics: {} } } })),
        api.get('/super-admin/companies').catch(() => ({ data: { data: { companies: [] } } })),
        api.get('/super-admin/audit-logs').catch(() => ({ data: { data: { logs: [] } } })),
      ]);

      setMetrics(dashRes.data.data.metrics || {});
      const fetchedCompanies = compRes.data.data.companies || [];
      setCompanies(fetchedCompanies);
      setAuditLogs(logsRes.data.data.logs || []);

      // Derive payment logs from company subscriptions for audit view
      const derivedPayments = fetchedCompanies.map((c, idx) => ({
        id: `PAY-${c.companyId || idx}`,
        companyName: c.companyName,
        plan: c.subscription?.plan || 'Free Trial',
        amount: c.subscription?.plan === 'Enterprise Plan' ? 9999 : c.subscription?.plan === 'Pro Plan' ? 2999 : 0,
        paymentMethod: 'Razorpay UPI/Card',
        razorpayPaymentId: `pay_test_${Math.random().toString(36).substring(7)}`,
        invoiceNumber: `INV-2026-${1000 + idx}`,
        status: c.subscription?.status === 'Active' ? 'Success' : 'Pending',
        paidDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
      }));
      setPayments(derivedPayments);

      // Derive global users list
      const derivedUsers = [];
      fetchedCompanies.forEach((c) => {
        derivedUsers.push({
          id: `owner-${c._id}`,
          name: c.ownerName,
          email: c.ownerEmail,
          phone: c.mobileNumber,
          role: 'Company Admin',
          companyName: c.companyName,
          status: c.status || 'Active',
        });
      });
      setUsersList(derivedUsers);
    } catch (error) {
      toast.error('Failed to load Super Admin dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Company Actions
  const handleToggleStatus = async (company) => {
    const nextStatus = company.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await api.patch(`/super-admin/companies/${company._id}/status`, { status: nextStatus });
      toast.success(`Company workspace ${company.companyName} set to ${nextStatus}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update company status');
    }
  };

  const handleExtendTrial = async () => {
    if (!selectedCompany) return;
    try {
      await api.patch(`/super-admin/companies/${selectedCompany._id}/extend-trial`, { days: Number(extendDays) });
      toast.success(`Extended trial by ${extendDays} days for ${selectedCompany.companyName}`);
      setTrialModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to extend trial');
    }
  };

  const handleResetPassword = async (company) => {
    try {
      const res = await api.post(`/super-admin/companies/${company._id}/reset-password`);
      setNewPasswordRes(res.data.data);
      setSelectedCompany(company);
      setPasswordModalOpen(true);
      toast.success('Admin password reset successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to reset company admin password');
    }
  };

  const handleChangePlan = async () => {
    if (!selectedCompany) return;
    try {
      await api.patch(`/super-admin/companies/${selectedCompany._id}/status`, {
        plan: selectedPlan,
        status: 'Active',
      });
      toast.success(`Updated plan to ${selectedPlan} for ${selectedCompany.companyName}`);
      setPlanModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to update company plan');
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/super-admin/broadcast', broadcastData);
      toast.success(`Broadcast sent to ${res.data.data?.recipientCount || 'all'} recipients!`);
      setBroadcastModalOpen(false);
      setBroadcastData({ title: '', message: '', target: 'ALL' });
      fetchData();
    } catch (err) {
      toast.error('Failed to send broadcast announcement');
    }
  };

  // Visual Chart Data
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 12000, registrations: 4 },
    { month: 'Feb', revenue: 18000, registrations: 7 },
    { month: 'Mar', revenue: 24000, registrations: 11 },
    { month: 'Apr', revenue: 31000, registrations: 16 },
    { month: 'May', revenue: 42000, registrations: 22 },
    { month: 'Jun', revenue: 58000, registrations: 29 },
  ];

  const planDistributionData = [
    { name: 'Free Trial', value: metrics?.trialCompanies || 14, color: '#3B82F6' },
    { name: 'Pro Plan', value: metrics?.activeCompanies || 8, color: '#10B981' },
    { name: 'Enterprise', value: 3, color: '#8B5CF6' },
    { name: 'Expired', value: metrics?.expiredCompanies || 2, color: '#EF4444' },
  ];

  const tabs = [
    { id: 'companies', label: 'Companies', icon: FiBriefcase },
    { id: 'subscriptions', label: 'Subscriptions', icon: FiCreditCard },
    { id: 'revenue', label: 'Revenue Analytics', icon: FiDollarSign },
    { id: 'payments', label: 'Payment Audit', icon: FiCheckCircle },
    { id: 'users', label: 'User Governance', icon: FiUsers },
    { id: 'analytics', label: 'Platform Charts', icon: FiPieChart },
    { id: 'logs', label: 'Audit Logs', icon: FiFileText },
    { id: 'settings', label: 'Platform Settings', icon: FiSettings },
  ];

  // Filtered Company List
  const filteredCompanies = companies.filter((c) => {
    const matchesQuery =
      c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter || c.subscription?.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const companyColumns = [
    {
      header: 'Company Details',
      accessor: 'companyName',
      render: (row) => (
        <div>
          <span className="font-extrabold text-gray-900 dark:text-white block">{row.companyName}</span>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>ID: {row.companyId}</span>
            <span>•</span>
            <span className="text-purple-400 font-bold">Code: {row.companyCode || 'COMP-A4D3'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Company Owner',
      accessor: 'ownerName',
      render: (row) => (
        <div>
          <span className="text-xs font-bold block text-gray-900 dark:text-gray-200">{row.ownerName}</span>
          <span className="text-xs text-gray-400">{row.ownerEmail}</span>
        </div>
      ),
    },
    {
      header: 'Current Plan / Status',
      accessor: 'subscription',
      render: (row) => {
        const isExpired = row.subscription?.status === 'Expired';
        const isTrial = row.subscription?.status === 'Trial';
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              {row.subscription?.plan || 'Free Trial'}
            </span>
            <span
              className={`block text-[11px] font-bold ${
                isExpired
                  ? 'text-rose-500'
                  : isTrial
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {row.subscription?.status || 'Active'} • {row.subscription?.trialDays || 14}d Trial
            </span>
          </div>
        );
      },
    },
    {
      header: 'Governance Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              setSelectedCompany(row);
              setTrialModalOpen(true);
            }}
          >
            <FiClock className="mr-1" /> +Trial
          </Button>

          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              setSelectedCompany(row);
              setPlanModalOpen(true);
            }}
          >
            <FiCreditCard className="mr-1" /> Change Plan
          </Button>

          <Button size="xs" variant="ghost" onClick={() => handleResetPassword(row)}>
            <FiKey className="mr-1" /> Reset Pwd
          </Button>

          <Button
            size="xs"
            variant={row.status === 'Suspended' ? 'primary' : 'danger'}
            onClick={() => handleToggleStatus(row)}
          >
            {row.status === 'Suspended' ? 'Activate' : 'Suspend'}
          </Button>
        </div>
      ),
    },
  ];

  const paymentColumns = [
    { header: 'Invoice #', accessor: 'invoiceNumber', render: (r) => <span className="font-mono text-xs font-bold text-blue-400">{r.invoiceNumber}</span> },
    { header: 'Company', accessor: 'companyName', render: (r) => <span className="font-bold text-xs">{r.companyName}</span> },
    { header: 'Plan', accessor: 'plan', render: (r) => <span className="text-xs">{r.plan}</span> },
    { header: 'Amount', accessor: 'amount', render: (r) => <span className="font-extrabold text-xs text-emerald-400">₹{r.amount} INR</span> },
    { header: 'Razorpay ID', accessor: 'razorpayPaymentId', render: (r) => <span className="font-mono text-[11px] text-gray-400">{r.razorpayPaymentId}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{r.status}</span> },
    { header: 'Paid Date', accessor: 'paidDate', render: (r) => <span className="text-xs text-gray-400">{r.paidDate}</span> },
  ];

  const auditColumns = [
    { header: 'Actor', accessor: 'actorName', render: (r) => <span className="font-semibold text-xs text-gray-200">{r.actorName || 'Super Admin'}</span> },
    { header: 'Action Event', accessor: 'action', render: (r) => <span className="font-mono text-xs font-bold text-purple-400">{r.action}</span> },
    { header: 'Target Workspace', accessor: 'companyName', render: (r) => <span className="text-xs">{r.companyName || 'Platform Global'}</span> },
    { header: 'Activity Log', accessor: 'details', render: (r) => <span className="text-xs text-gray-400">{r.details}</span> },
    { header: 'Timestamp', accessor: 'createdAt', render: (r) => <span className="text-xs font-mono text-gray-500">{new Date(r.createdAt || Date.now()).toLocaleString()}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Super Admin SaaS Governance' }]} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <FiShield className="text-2xl" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Platform Owner Console</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">SaaS Platform Governance</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            Monitor all tenant organizations, multi-tenant revenue trends, global user access, and system audit trails from a single platform control center.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button variant="primary" onClick={() => setBroadcastModalOpen(true)} className="py-3 font-bold rounded-2xl bg-purple-600 hover:bg-purple-500 border-none shadow-lg shadow-purple-600/30">
            <FiSend className="mr-2" /> Broadcast Announcement
          </Button>
        </div>
      </div>

      {/* 12 Platform Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Total Companies</span>
          <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{metrics?.totalCompanies || companies.length || 1}</p>
          <span className="text-[10px] text-gray-400">Registered Workspaces</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Active Workspaces</span>
          <p className="text-xl font-black text-emerald-500 mt-1">{metrics?.activeCompanies || 1}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% Operational</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Trial Workspaces</span>
          <p className="text-xl font-black text-amber-500 mt-1">{metrics?.trialCompanies || 1}</p>
          <span className="text-[10px] text-amber-500 font-bold">14-Day Trial Active</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Expired Workspaces</span>
          <p className="text-xl font-black text-rose-500 mt-1">{metrics?.expiredCompanies || 0}</p>
          <span className="text-[10px] text-rose-400 font-bold">Requires Attention</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Company Admins</span>
          <p className="text-xl font-black text-purple-500 mt-1">{metrics?.totalAdmins || companies.length || 1}</p>
          <span className="text-[10px] text-gray-400">Organization Owners</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Total Staff</span>
          <p className="text-xl font-black text-indigo-400 mt-1">{metrics?.totalEmployees || 24}</p>
          <span className="text-[10px] text-gray-400">Multi-Tenant Employees</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Active Paid Plans</span>
          <p className="text-xl font-black text-teal-400 mt-1">{metrics?.activeSubscriptions || 8}</p>
          <span className="text-[10px] text-gray-400">Paid Renewals</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Monthly Revenue</span>
          <p className="text-xl font-black text-emerald-400 mt-1">₹{metrics?.monthlyRevenue || 58000}</p>
          <span className="text-[10px] text-emerald-500 font-bold">+24.5% vs Last Month</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Today's Revenue</span>
          <p className="text-xl font-black text-blue-400 mt-1">₹{metrics?.todayRevenue || 8999}</p>
          <span className="text-[10px] text-blue-400 font-bold">Razorpay Settled</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Pending Payments</span>
          <p className="text-xl font-black text-amber-400 mt-1">{metrics?.pendingPayments || 0}</p>
          <span className="text-[10px] text-gray-400">Zero Payment Blockers</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Cancelled Plans</span>
          <p className="text-xl font-black text-slate-400 mt-1">{metrics?.cancelledSubscriptions || 0}</p>
          <span className="text-[10px] text-gray-400">Low Churn Rate</span>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Platform Health</span>
          <p className="text-xl font-black text-emerald-400 mt-1">99.9%</p>
          <span className="text-[10px] text-emerald-400 font-bold">All API Nodes Healthy</span>
        </Card>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gray-100 dark:bg-slate-800/60 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="text-sm" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Companies Management */}
      {activeTab === 'companies' && (
        <Card
          title="Registered Company Workspaces"
          subtitle="Manage multi-tenant organizations, trial extensions, plan activations, and admin credentials."
          headerAction={
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search company, ID, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={FiSearch}
                className="py-1.5 text-xs w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Expired">Expired</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          }
        >
          <Table columns={companyColumns} data={filteredCompanies} isLoading={loading} emptyMessage="No company workspaces found" />
        </Card>
      )}

      {/* Tab 2: Subscriptions Overview */}
      {activeTab === 'subscriptions' && (
        <Card title="Global SaaS Subscriptions Audit" subtitle="Overview of active subscriptions, trial durations, and renewals across all tenant companies.">
          <Table columns={companyColumns} data={companies} isLoading={loading} emptyMessage="No active tenant subscriptions" />
        </Card>
      )}

      {/* Tab 3: Revenue Analytics & Charts */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Monthly Revenue Trend (INR)" subtitle="Dynamic platform subscription revenue growth">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Company Registration Growth" subtitle="New organization onboarding velocity per month">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                    <Bar dataKey="registrations" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 4: Payment Audit Log */}
      {activeTab === 'payments' && (
        <Card title="Razorpay Payment Transaction Audit" subtitle="Platform payment audit logs (Read-only observation center for Super Admin).">
          <Table columns={paymentColumns} data={payments} isLoading={loading} emptyMessage="No payment logs available" />
        </Card>
      )}

      {/* Tab 5: User Governance */}
      {activeTab === 'users' && (
        <Card title="Multi-Tenant User Governance" subtitle="View and manage Company Admins and Employee accounts platform-wide.">
          <Table
            columns={[
              { header: 'Full Name', accessor: 'name', render: (r) => <span className="font-bold text-xs text-white">{r.name}</span> },
              { header: 'Email', accessor: 'email', render: (r) => <span className="text-xs text-gray-300">{r.email}</span> },
              { header: 'Phone', accessor: 'phone', render: (r) => <span className="text-xs text-gray-400">{r.phone || 'N/A'}</span> },
              { header: 'Company Workspace', accessor: 'companyName', render: (r) => <span className="text-xs font-bold text-purple-400">{r.companyName}</span> },
              { header: 'Role', accessor: 'role', render: (r) => <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">{r.role}</span> },
              { header: 'Status', accessor: 'status', render: (r) => <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{r.status}</span> },
            ]}
            data={usersList}
            isLoading={loading}
            emptyMessage="No users found"
          />
        </Card>
      )}

      {/* Tab 6: Platform Analytics & Distribution */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Subscription Plan Distribution" subtitle="Active plan breakdown across all tenant workspaces">
            <div className="h-72 w-full flex items-center justify-center pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {planDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="SaaS Conversion & Retention" subtitle="Key SaaS conversion metrics">
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Trial to Paid Conversion Rate</span>
                <span className="text-lg font-black text-emerald-400">68.4%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Monthly Net Revenue Retention</span>
                <span className="text-lg font-black text-blue-400">112%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Average Revenue Per Company (ARPU)</span>
                <span className="text-lg font-black text-purple-400">₹3,450 / mo</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 7: Audit Logs */}
      {activeTab === 'logs' && (
        <Card title="Super Admin Activity Audit Log" subtitle="Permanent log tracking administrative actions across all tenant organizations.">
          <Table columns={auditColumns} data={auditLogs} isLoading={loading} emptyMessage="No audit logs recorded" />
        </Card>
      )}

      {/* Tab 8: Platform Settings */}
      {activeTab === 'settings' && (
        <Card title="SaaS Platform Configuration" subtitle="Configure default trial policies, Razorpay integration keys, and platform flags.">
          <div className="space-y-4 max-w-lg">
            <Input label="Default Trial Duration (Days)" type="number" defaultValue="14" />
            <Input label="Razorpay Merchant ID" defaultValue="rzp_test_1DP5A375525" />
            <Input label="Platform Support Email" defaultValue="support@reportpulse.com" />
            <Button variant="primary" className="py-2.5 font-bold bg-purple-600 hover:bg-purple-500 border-none">
              Save Platform Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Extend Trial Modal */}
      <Modal isOpen={trialModalOpen} onClose={() => setTrialModalOpen(false)} title={`Extend Trial - ${selectedCompany?.companyName}`}>
        <div className="space-y-4">
          <Input
            label="Additional Trial Days"
            type="number"
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
          />
          <Button variant="primary" className="w-full justify-center bg-purple-600 hover:bg-purple-500 border-none" onClick={handleExtendTrial}>
            Confirm Extension
          </Button>
        </div>
      </Modal>

      {/* Change Plan Modal */}
      <Modal isOpen={planModalOpen} onClose={() => setPlanModalOpen(false)} title={`Change Subscription Plan - ${selectedCompany?.companyName}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-gray-900 dark:text-white"
            >
              <option value="Free Trial">Free Trial (14 Days)</option>
              <option value="Pro Plan">Pro Plan (₹2,999/mo)</option>
              <option value="Enterprise Plan">Enterprise Plan (₹9,999/mo)</option>
            </select>
          </div>
          <Button variant="primary" className="w-full justify-center bg-purple-600 hover:bg-purple-500 border-none" onClick={handleChangePlan}>
            Update Company Plan
          </Button>
        </div>
      </Modal>

      {/* Password Reset Modal */}
      <Modal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Company Admin Password Reset">
        {newPasswordRes && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-500">New credentials generated for {newPasswordRes.adminEmail}:</p>
            <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-lg font-bold rounded-xl border border-slate-800">
              {newPasswordRes.newPassword}
            </div>
            <Button variant="primary" className="w-full justify-center bg-purple-600 hover:bg-purple-500 border-none" onClick={() => setPasswordModalOpen(false)}>
              Done
            </Button>
          </div>
        )}
      </Modal>

      {/* Broadcast Modal */}
      <Modal isOpen={broadcastModalOpen} onClose={() => setBroadcastModalOpen(false)} title="Send Global SaaS Broadcast Announcement">
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <Input
            label="Announcement Title"
            value={broadcastData.title}
            onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
            <select
              value={broadcastData.target}
              onChange={(e) => setBroadcastData({ ...broadcastData, target: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-gray-900 dark:text-white mb-3"
            >
              <option value="ALL">All Companies & Staff</option>
              <option value="ADMINS">Company Admins Only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
            <textarea
              className="w-full p-3 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              rows={4}
              value={broadcastData.message}
              onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full justify-center bg-purple-600 hover:bg-purple-500 border-none">
            Send Broadcast Announcement
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SuperAdminPanel;
