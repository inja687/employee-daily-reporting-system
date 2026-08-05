import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiFileText, FiSearch, FiRefreshCw, FiDownload } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/audit-logs');
      setLogs(res.data?.data?.logs || []);
    } catch (error) {
      toast.error('Failed to load platform audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filtered = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.actorName?.toLowerCase().includes(q) ||
      l.action?.toLowerCase().includes(q) ||
      l.companyName?.toLowerCase().includes(q) ||
      l.details?.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const headers = ['Actor', 'Action Event', 'Target Company', 'Log Details', 'Timestamp'];
    const rows = logs.map((l) => [l.actorName || 'Super Admin', l.action, l.companyName || 'Platform Global', l.details, new Date(l.createdAt || Date.now()).toLocaleString()]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { header: 'Actor', accessor: 'actorName', render: (r) => <span className="font-semibold text-xs text-gray-200">{r.actorName || 'Super Admin'}</span> },
    { header: 'Action Event', accessor: 'action', render: (r) => <span className="font-mono text-xs font-bold text-purple-400">{r.action}</span> },
    { header: 'Target Workspace', accessor: 'companyName', render: (r) => <span className="text-xs text-gray-300">{r.companyName || 'Platform Global'}</span> },
    { header: 'Activity Log Details', accessor: 'details', render: (r) => <span className="text-xs text-gray-400">{r.details}</span> },
    { header: 'Timestamp', accessor: 'createdAt', render: (r) => <span className="text-xs font-mono text-gray-500">{new Date(r.createdAt || Date.now()).toLocaleString()}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Audit Logs' }]} />

      <Card
        title="Super Admin Platform Audit Logs"
        subtitle="Permanent system activity trail recording company activations, trial extensions, password resets, and announcements."
        headerAction={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search action, actor, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={FiSearch}
              className="py-1.5 text-xs w-64"
            />
            <Button size="xs" variant="outline" onClick={fetchLogs}>
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
            <Button size="xs" variant="secondary" onClick={exportCSV}>
              <FiDownload className="mr-1" /> Export CSV
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filtered} isLoading={loading} emptyMessage="No audit logs recorded" />
      </Card>
    </div>
  );
};

export default SuperAdminAuditLogs;
