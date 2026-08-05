import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiBriefcase,
  FiClock,
  FiKey,
  FiCreditCard,
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [extendDays, setExtendDays] = useState(7);
  const [newPasswordRes, setNewPasswordRes] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('Pro Plan');

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/companies');
      setCompanies(res.data?.data?.companies || []);
    } catch (error) {
      toast.error('Failed to load company workspaces');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleToggleStatus = async (company) => {
    const nextStatus = company.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await api.patch(`/super-admin/companies/${company._id}/status`, { status: nextStatus });
      toast.success(`Company ${company.companyName} set to ${nextStatus}`);
      fetchCompanies();
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
      fetchCompanies();
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
      fetchCompanies();
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
      fetchCompanies();
    } catch (err) {
      toast.error('Failed to update company plan');
    }
  };

  const exportCSV = () => {
    const headers = ['Company Name', 'Company Code', 'Owner Name', 'Owner Email', 'Status', 'Plan'];
    const rows = companies.map((c) => [
      c.companyName,
      c.companyCode || 'N/A',
      c.ownerName,
      c.ownerEmail,
      c.status || 'Active',
      c.subscription?.plan || 'Free Trial',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Companies_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    const nameStr = (c.companyName || '').toLowerCase();
    const idStr = (c.companyId || '').toLowerCase();
    const emailStr = (c.ownerEmail || '').toLowerCase();
    const matchesQuery = !q || nameStr.includes(q) || idStr.includes(q) || emailStr.includes(q);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter || c.subscription?.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const columns = [
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
      header: 'Organization Owner',
      accessor: 'ownerName',
      render: (row) => (
        <div>
          <span className="text-xs font-bold block text-gray-900 dark:text-gray-200">{row.ownerName}</span>
          <span className="text-xs text-gray-400">{row.ownerEmail}</span>
        </div>
      ),
    },
    {
      header: 'Plan / Status',
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
              {row.status || 'Active'} • {row.subscription?.trialDays || 14}d Trial
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

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Companies' }]} />

      <Card
        title="Registered Multi-Tenant Companies"
        subtitle="Govern tenant organizations, extend trial periods, alter subscription plans, and manage owner credentials."
        headerAction={
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search company, code, or owner..."
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
            <Button size="xs" variant="outline" onClick={fetchCompanies} title="Refresh">
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
            <Button size="xs" variant="secondary" onClick={exportCSV}>
              <FiDownload className="mr-1" /> Export CSV
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filteredCompanies} isLoading={loading} emptyMessage="No company workspaces found" />
      </Card>

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
      <Modal isOpen={planModalOpen} onClose={() => setPlanModalOpen(false)} title={`Change Plan - ${selectedCompany?.companyName}`}>
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
    </div>
  );
};

export default SuperAdminCompanies;
