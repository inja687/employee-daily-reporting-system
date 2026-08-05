import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiLifeBuoy,
  FiSearch,
  FiRefreshCw,
  FiSend,
  FiPhoneCall,
  FiMessageCircle,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiMessageSquare,
  FiUser,
  FiTrash2,
  FiFileText,
  FiShield,
  FiStar,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminCustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    open: 0,
    pending: 0,
    inProgress: 0,
    critical: 0,
    resolvedToday: 0,
    customerSatisfaction: '5.0',
    avgResponseTime: '< 15 mins',
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Selected ticket for conversation drawer
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('chat'); // 'chat' | 'notes'
  const [replyMessage, setReplyMessage] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      setActionLoading(true);
      const res = await api.post(`/support/admin/${selectedTicket._id}/reply`, {
        message: replyMessage,
      });
      setSelectedTicket(res.data?.data);
      setReplyMessage('');
      toast.success('Reply sent to customer!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddInternalNote = async (e) => {
    e.preventDefault();
    if (!internalNoteText.trim() || !selectedTicket) return;
    try {
      setActionLoading(true);
      const res = await api.post(`/support/admin/${selectedTicket._id}/note`, {
        note: internalNoteText,
      });
      setSelectedTicket(res.data?.data);
      setInternalNoteText('');
      toast.success('Private internal note saved!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to save internal note');
    } finally {
      setActionLoading(false);
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

  const getPlanBadge = (planName) => {
    const p = (planName || '').toLowerCase();
    if (p.includes('starter')) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">🔵 Starter</span>;
    if (p.includes('pro')) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20">🟣 Professional</span>;
    if (p.includes('enterprise')) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">🟡 Enterprise</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🟢 Free Trial</span>;
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      t.ticketId?.toLowerCase().includes(q) ||
      t.fullName?.toLowerCase().includes(q) ||
      t.companyName?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.phone?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesQuery && matchesStatus && matchesPriority;
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
          <span className="font-bold text-xs text-white block">{r.fullName}</span>
          <span className="text-xs text-purple-400 font-semibold">{r.companyName}</span>
          <div className="mt-1">{getPlanBadge(r.planName)}</div>
        </div>
      ),
    },
    {
      header: 'Phone Number Actions',
      accessor: 'phone',
      render: (r) => {
        const fullPhone = `${r.countryCode || '+1'} ${r.phone || 'N/A'}`;
        const cleanPhone = (r.phone || '').replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${(r.countryCode || '+1').replace('+', '')}${cleanPhone}`;

        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1 font-mono text-xs font-bold text-emerald-400">
              <span>{fullPhone}</span>
              <button
                onClick={() => copyToClipboard(fullPhone, 'phone number')}
                title="Copy Phone"
                className="p-1 hover:text-white text-slate-400"
              >
                <FiCopy />
              </button>
            </div>
            {r.phone && (
              <div className="flex items-center space-x-1.5 pt-0.5">
                <a
                  href={`tel:${r.countryCode || ''}${cleanPhone}`}
                  title="Click to Call"
                  className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <FiPhoneCall /> Call
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open WhatsApp Chat"
                  className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <FiMessageCircle /> WhatsApp
                </a>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (r) => (
        <div className="flex items-center space-x-1">
          <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">{r.email}</span>
          <button
            onClick={() => copyToClipboard(r.email, 'email')}
            title="Copy Email"
            className="p-1 hover:text-white text-slate-400"
          >
            <FiCopy />
          </button>
        </div>
      ),
    },
    {
      header: 'Subject & Priority',
      accessor: 'subject',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-slate-200 block truncate max-w-xs">{r.subject}</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[10px] text-slate-400">{r.category}</span>
            <span
              className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                r.priority === 'Critical'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : r.priority === 'High'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-blue-500/10 text-blue-400'
              }`}
            >
              {r.priority}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            r.status === 'Open'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : r.status === 'In Progress'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : r.status === 'Resolved'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : 'bg-slate-800 text-slate-400'
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
            <FiMessageSquare className="mr-1" /> Open Drawer
          </Button>
          <select
            value={r.status}
            onChange={(e) => handleStatusChange(r._id, e.target.value)}
            className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting Customer</option>
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
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Customer Support' }]} />

      {/* Enterprise Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Tickets</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{metrics.open || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
          <p className="text-2xl font-black text-blue-400 mt-1">{metrics.inProgress || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Priority</span>
          <p className="text-2xl font-black text-rose-500 mt-1">{metrics.critical || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Today</span>
          <p className="text-2xl font-black text-purple-400 mt-1">{metrics.resolvedToday || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Response</span>
          <p className="text-xl font-mono font-bold text-cyan-400 mt-1">{metrics.avgResponseTime || '< 15 mins'}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Satisfaction</span>
          <p className="text-xl font-mono font-bold text-amber-400 mt-1 flex items-center gap-1">
            <FiStar className="fill-amber-400 text-amber-400" /> {metrics.customerSatisfaction || '5.0'} / 5
          </p>
        </div>
      </div>

      {/* Support Queue Main Card */}
      <Card
        title="Customer Support Desk & Phone Communication Hub"
        subtitle="Full phone number visibility, click-to-call, WhatsApp integration, live subscription plan badges, and private internal notes."
        headerAction={
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search ID, phone, customer, company..."
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
              <option value="Waiting for Customer">Waiting Customer</option>
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
        <Table columns={columns} data={filteredTickets} isLoading={loading} emptyMessage="No support tickets in queue" />
      </Card>

      {/* Zendesk-Style Support Drawer with Customer Context Sidebar */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket ${selectedTicket?.ticketId} - Enterprise Support Drawer`} maxWidth="max-w-5xl">
        {selectedTicket && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Chat & Internal Notes Feed (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Drawer Tab Switcher */}
              <div className="flex border-b border-slate-800 space-x-4">
                <button
                  onClick={() => setActiveDrawerTab('chat')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${
                    activeDrawerTab === 'chat'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  💬 Conversation Stream ({selectedTicket.conversation?.length || 0})
                </button>
                <button
                  onClick={() => setActiveDrawerTab('notes')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${
                    activeDrawerTab === 'notes'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  🔒 Private Internal Notes ({selectedTicket.internalNotes?.length || 0})
                </button>
              </div>

              {activeDrawerTab === 'chat' ? (
                <>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
                    {selectedTicket.conversation.map((msg, idx) => {
                      const isSuperAdmin = msg.senderRole === 'Super Admin';
                      return (
                        <div key={idx} className={`flex flex-col ${isSuperAdmin ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
                            <span className="font-bold text-white">{msg.senderName}</span>
                            <span>•</span>
                            <span className="font-mono text-purple-400">{msg.senderRole}</span>
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

                  <form onSubmit={handleSendReply} className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      required
                      placeholder="Type reply to Company Admin..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
                    />
                    <Button type="submit" variant="primary" disabled={actionLoading} className="bg-purple-600 hover:bg-purple-500 border-none py-3 font-bold">
                      <FiSend className="mr-1" /> Send Reply
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
                    {selectedTicket.internalNotes?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">No private internal notes logged yet.</p>
                    ) : (
                      selectedTicket.internalNotes.map((n, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                          <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-amber-400">
                            <span>Author: {n.authorName}</span>
                            <span>{new Date(n.createdAt || Date.now()).toLocaleString()}</span>
                          </div>
                          <p>{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddInternalNote} className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      required
                      placeholder="Add private note (visible ONLY to Super Admins)..."
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      className="flex-1 p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                    />
                    <Button type="submit" variant="outline" disabled={actionLoading} className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 py-3 font-bold">
                      Log Private Note
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Right Column: Customer Context Sidebar (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Subscription Tier</span>
                {getPlanBadge(selectedTicket.planName)}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Customer Profile</span>
                <p className="font-bold text-white text-sm">{selectedTicket.fullName}</p>
                <p className="text-purple-400 font-semibold">{selectedTicket.companyName}</p>
                <p className="text-slate-400 font-mono">Tenant ID: {selectedTicket.tenantId || 'N/A'}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Direct Phone Actions</span>
                <p className="font-mono font-bold text-emerald-400">{selectedTicket.countryCode || '+1'} {selectedTicket.phone || 'N/A'}</p>
                {selectedTicket.phone && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <a
                      href={`tel:${selectedTicket.countryCode || ''}${selectedTicket.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FiPhoneCall /> Click to Call
                    </a>
                    <a
                      href={`https://wa.me/${(selectedTicket.countryCode || '+1').replace('+', '')}${selectedTicket.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FiMessageCircle /> Open WhatsApp
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button size="xs" variant="danger" className="w-full justify-center" onClick={() => handleDeleteTicket(selectedTicket._id)}>
                  <FiTrash2 className="mr-1" /> Delete Ticket Record
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminCustomerSupport;
