import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiCreditCard, FiClock, FiCheckCircle, FiSearch, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminSubscriptions = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/companies');
      setCompanies(res.data?.data?.companies || []);
    } catch (error) {
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filtered = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.companyName?.toLowerCase().includes(q) || c.ownerEmail?.toLowerCase().includes(q);
  });

  const columns = [
    { header: 'Company Workspace', accessor: 'companyName', render: (r) => <span className="font-bold text-xs text-gray-900 dark:text-white">{r.companyName}</span> },
    { header: 'Active Plan', accessor: 'subscription', render: (r) => <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">{r.subscription?.plan || 'Free Trial'}</span> },
    { header: 'Subscription Status', accessor: 'subscription', render: (r) => <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{r.subscription?.status || 'Active'}</span> },
    { header: 'Trial Duration', accessor: 'subscription', render: (r) => <span className="text-xs text-gray-400">{r.subscription?.trialDays || 14} Days Active</span> },
    { header: 'Owner Email', accessor: 'ownerEmail', render: (r) => <span className="text-xs text-gray-400">{r.ownerEmail}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Subscriptions' }]} />

      <Card
        title="Global Subscription Plan Audit"
        subtitle="Overview of active plan tiers, trial expirations, and subscription statuses platform-wide."
        headerAction={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search company or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={FiSearch}
              className="py-1.5 text-xs w-64"
            />
            <Button size="xs" variant="outline" onClick={fetchSubscriptions}>
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filtered} isLoading={loading} emptyMessage="No active subscription records found" />
      </Card>
    </div>
  );
};

export default SuperAdminSubscriptions;
