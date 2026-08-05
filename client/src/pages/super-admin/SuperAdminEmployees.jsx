import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiRefreshCw, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/companies');
      const companies = res.data?.data?.companies || [];
      const derivedEmployees = [];

      companies.forEach((c) => {
        derivedEmployees.push({
          id: `EMP-${c._id}-1`,
          name: `${c.ownerName} (Owner)`,
          email: c.ownerEmail,
          department: 'Executive Board',
          companyName: c.companyName,
          role: 'Company Admin',
          status: c.status || 'Active',
        });
      });
      setEmployees(derivedEmployees);
    } catch (error) {
      toast.error('Failed to load global employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.companyName?.toLowerCase().includes(q)
    );
  });

  const columns = [
    { header: 'Employee Name', accessor: 'name', render: (r) => <span className="font-bold text-xs text-gray-900 dark:text-white">{r.name}</span> },
    { header: 'Email', accessor: 'email', render: (r) => <span className="text-xs text-gray-600 dark:text-gray-300">{r.email}</span> },
    { header: 'Department', accessor: 'department', render: (r) => <span className="text-xs text-gray-400">{r.department}</span> },
    { header: 'Company Workspace', accessor: 'companyName', render: (r) => <span className="font-bold text-xs text-purple-600 dark:text-purple-400">{r.companyName}</span> },
    { header: 'Role', accessor: 'role', render: (r) => <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{r.role}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{r.status}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Employees Monitoring' }]} />

      <Card
        title="Global Employee Monitoring Index"
        subtitle="Read-only observation center of staff accounts across all tenant organizations."
        headerAction={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search employee, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={FiSearch}
              className="py-1.5 text-xs w-64"
            />
            <Button size="xs" variant="outline" onClick={fetchEmployees}>
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filteredEmployees} isLoading={loading} emptyMessage="No employee records found" />
      </Card>
    </div>
  );
};

export default SuperAdminEmployees;
