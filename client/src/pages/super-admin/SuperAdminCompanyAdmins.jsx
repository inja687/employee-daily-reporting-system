import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiRefreshCw, FiKey, FiUserCheck, FiUserX } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminCompanyAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/companies');
      const companies = res.data?.data?.companies || [];
      const derivedAdmins = companies.map((c) => ({
        id: c._id,
        name: c.ownerName,
        email: c.ownerEmail,
        phone: c.mobileNumber || 'N/A',
        companyName: c.companyName,
        companyCode: c.companyCode || 'COMP-A4D3',
        status: c.status || 'Active',
        createdAt: c.createdAt,
      }));
      setAdmins(derivedAdmins);
    } catch (error) {
      toast.error('Failed to load company admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = admins.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.companyName?.toLowerCase().includes(q)
    );
  });

  const columns = [
    { header: 'Admin Name', accessor: 'name', render: (r) => <span className="font-bold text-xs text-gray-900 dark:text-white">{r.name}</span> },
    { header: 'Email Address', accessor: 'email', render: (r) => <span className="text-xs text-gray-600 dark:text-gray-300">{r.email}</span> },
    { header: 'Company Workspace', accessor: 'companyName', render: (r) => <div><span className="font-bold text-xs text-purple-600 dark:text-purple-400 block">{r.companyName}</span><span className="text-[10px] font-mono text-gray-400">Code: {r.companyCode}</span></div> },
    { header: 'Phone Number', accessor: 'phone', render: (r) => <span className="text-xs text-gray-400">{r.phone}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{r.status}</span> },
    { header: 'Registration Date', accessor: 'createdAt', render: (r) => <span className="text-xs text-gray-400">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Company Admins' }]} />

      <Card
        title="Organization Owners Index"
        subtitle="Manage primary Company Admin accounts across all registered tenant organizations."
        headerAction={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search admin, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={FiSearch}
              className="py-1.5 text-xs w-64"
            />
            <Button size="xs" variant="outline" onClick={fetchAdmins}>
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filteredAdmins} isLoading={loading} emptyMessage="No company admin records found" />
      </Card>
    </div>
  );
};

export default SuperAdminCompanyAdmins;
