import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiLifeBuoy,
  FiSearch,
  FiRefreshCw,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiMessageSquare,
  FiUser,
  FiX,
  FiFilter,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminSupportCenter = () => {
  const [tickets, setTickets] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    open: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected ticket for conversation drawer
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/support/admin');
      setTickets(res.data?.data?.tickets || []);
      setMetrics(res.data?.data?.metrics || {});
    } catch (error) {
      toast.error('Failed to load platform support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      setReplyLoading(true);
      const res = await api.post(`/support/admin/${selectedTicket._id}/reply`, {
        message: replyMessage,
      });
      setSelectedTicket(res.data?.data);
      setReplyMessage('');
      toast.success('Reply sent successfully!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, nextStatus) => {
    try {
      const res = await api.patch(`/support/admin/${ticketId}/status`, {
        status: nextStatus,
      });
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(res.data?.data);
      }
      toast.success(`Ticket status updated to ${nextStatus}`);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      await api.delete(`/support/admin/${ticketId}`);
      toast.success('Ticket deleted successfully');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to delete ticket');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      t.ticketId?.toLowerCase().includes(q) ||
      t.fullName?.toLowerCase().includes(q) ||
      t.companyName?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const columns = [
    {
      header: 'Ticket ID',
      accessor: 'ticketId',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-blue-400">{r.ticketId}</span>
      ),
    },
    {
      header: 'Customer & Company',
      accessor: 'fullName',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-gray-900 dark:text-white block">{r.fullName}</span>
          <span className="text-xs text-purple-400 font-semibold">{r.companyName}</span>
        </div>
      ),
    },
    {
      header: 'Subject & Category',
      accessor: 'subject',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-gray-800 dark:text-gray-200 block truncate max-w-xs">{r.subject}</span>
          <span className="text-[10px] text-gray-400">{r.category}</span>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            r.priority === 'High'
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              : r.priority === 'Medium'
              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
          }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            r.status === 'Open'
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : r.status === 'In Progress'
              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
              : r.status === 'Resolved'
              ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
              : 'bg-slate-800 text-gray-400'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <Button size="xs" variant="primary" className="bg-purple-600 border-none" onClick={() => setSelectedTicket(r)}>
            <FiMessageSquare className="mr-1" /> Open Chat
          </Button>
          <select
            value={r.status}
            onChange={(e) => handleStatusChange(r._id, e.target.value)}
            className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Support Center' }]} />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Tickets</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{metrics.open || 0}</p>
          <span className="text-[11px] text-gray-500 mt-1 block">Awaiting First Response</span>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</span>
          <p className="text-3xl font-black text-blue-400 mt-1">{metrics.inProgress || 0}</p>
          <span className="text-[11px] text-gray-500 mt-1 block">Active Conversations</span>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">High Priority</span>
          <p className="text-3xl font-black text-rose-400 mt-1">{metrics.highPriority || 0}</p>
          <span className="text-[11px] text-rose-400 font-bold mt-1 block">Requires Urgent Attention</span>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved / Closed</span>
          <p className="text-3xl font-black text-purple-400 mt-1">{(metrics.resolved || 0) + (metrics.closed || 0)}</p>
          <span className="text-[11px] text-gray-500 mt-1 block">Total Solved Tickets</span>
        </div>
      </div>

      {/* Main Tickets Table Card */}
      <Card
        title="Super Admin Help Desk & Customer Support Center"
        subtitle="Manage public contact submissions and Company Admin technical support tickets in real-time."
        headerAction={
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search ID, customer, company, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={FiSearch}
              className="py-1.5 text-xs w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <Button size="xs" variant="outline" onClick={fetchTickets}>
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filteredTickets} isLoading={loading} emptyMessage="No support tickets found" />
      </Card>

      {/* Zendesk-Style Conversation Drawer Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket ${selectedTicket?.ticketId} - Conversation Stream`} maxWidth="max-w-3xl">
        {selectedTicket && (
          <div className="space-y-4">
            {/* Ticket Header Metadata */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-blue-400">{selectedTicket.ticketId}</span>
                  <span className="text-xs font-bold text-white">{selectedTicket.subject}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Customer: <strong className="text-white">{selectedTicket.fullName}</strong> ({selectedTicket.email}) • Workspace: <span className="text-purple-400 font-bold">{selectedTicket.companyName}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="xs" variant="danger" onClick={() => handleDeleteTicket(selectedTicket._id)}>
                  Delete
                </Button>
              </div>
            </div>

            {/* Conversation Messages Feed */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
              {selectedTicket.conversation.map((msg, idx) => {
                const isSuperAdmin = msg.senderRole === 'Super Admin';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isSuperAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-white">{msg.senderName}</span>
                      <span>•</span>
                      <span className="font-mono text-purple-400">{msg.senderRole}</span>
                      <span>•</span>
                      <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        isSuperAdmin
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                required
                placeholder="Type your response to the customer..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
              />
              <Button type="submit" variant="primary" disabled={replyLoading} className="bg-purple-600 hover:bg-purple-500 border-none py-3 font-bold">
                <FiSend className="mr-1" /> Reply
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminSupportCenter;
