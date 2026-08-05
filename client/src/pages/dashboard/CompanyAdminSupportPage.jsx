import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiLifeBuoy,
  FiPlus,
  FiSend,
  FiClock,
  FiMessageSquare,
  FiCheckCircle,
  FiRefreshCw,
  FiRotateCcw,
  FiStar,
  FiSearch,
  FiFilter,
  FiUser,
  FiShield,
  FiPaperclip,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Breadcrumb from '../../components/common/Breadcrumb';

const CompanyAdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Technical Issue',
    priority: 'Medium',
    countryCode: '+1',
    phone: '',
    message: '',
  });

  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Satisfaction Rating State
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/support/company');
      setTickets(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/support/company', formData);
      toast.success(`Support ticket ${res.data?.data?.ticketId} created successfully!`);
      setCreateModalOpen(false);
      setFormData({
        subject: '',
        category: 'Technical Issue',
        priority: 'Medium',
        countryCode: '+1',
        phone: '',
        message: '',
      });
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit support ticket');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      setReplyLoading(true);
      const res = await api.post(`/support/company/${selectedTicket._id}/reply`, {
        message: replyMessage,
      });
      setSelectedTicket(res.data?.data);
      setReplyMessage('');
      toast.success('Reply sent to Super Admin support team!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReopenTicket = async (ticketId) => {
    try {
      const res = await api.post(`/support/company/${ticketId}/reopen`);
      setSelectedTicket(res.data?.data);
      toast.success('Ticket reopened!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to reopen ticket');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      const res = await api.post(`/support/company/${selectedTicket._id}/rate`, {
        score: ratingScore,
        feedback: ratingFeedback,
      });
      setSelectedTicket(res.data?.data);
      toast.success('Thank you for rating our support service!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to save rating');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      t.ticketId?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesQuery && matchesStatus && matchesPriority;
  });

  // Calculate Metrics
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress' || t.status === 'Pending').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  const columns = [
    {
      header: 'Ticket ID',
      accessor: 'ticketId',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-blue-500 dark:text-blue-400">
          {r.ticketId}
        </span>
      ),
    },
    {
      header: 'Subject & Category',
      accessor: 'subject',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-gray-900 dark:text-white block">{r.subject}</span>
          <span className="text-[10px] text-gray-400 font-semibold">{r.category}</span>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
            r.priority === 'Critical'
              ? 'bg-rose-600 text-white animate-pulse'
              : r.priority === 'High'
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
      header: 'Last Updated',
      accessor: 'updatedAt',
      render: (r) => (
        <span className="text-xs font-mono text-gray-400">
          {new Date(r.updatedAt || Date.now()).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (r) => (
        <Button size="xs" variant="primary" onClick={() => setSelectedTicket(r)}>
          <FiMessageSquare className="mr-1" /> View Conversation ({r.conversation?.length || 0})
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Company Support Help Desk' }]} />

      {/* Support Desk Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Submitted</span>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{tickets.length}</p>
          <span className="text-[11px] text-gray-500 mt-1 block">Help Desk History</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Open</span>
          <p className="text-3xl font-black text-emerald-500 mt-1">{openCount}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Awaiting First Reply</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</span>
          <p className="text-3xl font-black text-blue-500 mt-1">{inProgressCount}</p>
          <span className="text-[11px] text-blue-600 font-bold mt-1 block">Active Engineering Chat</span>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved / Closed</span>
          <p className="text-3xl font-black text-purple-500 mt-1">{resolvedCount}</p>
          <span className="text-[11px] text-gray-500 mt-1 block">Solved Requests</span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        title="Company Help Desk & Platform Engineering Support"
        subtitle="Submit technical tickets, request custom plan changes, and communicate directly with Super Admin engineers."
        headerAction={
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search by Ticket ID or Subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={FiSearch}
              className="py-1.5 text-xs w-56"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical 🔥</option>
            </select>
            <Button size="xs" variant="outline" onClick={fetchTickets}>
              <FiRefreshCw className="mr-1" /> Refresh
            </Button>
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              <FiPlus className="mr-1" /> Create Ticket
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={filteredTickets} isLoading={loading} emptyMessage="No support tickets found" />
      </Card>

      {/* Create Support Ticket Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Enterprise Support Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Subject *"
            required
            placeholder="e.g. Need help configuring daily reporting department rules"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Billing">Billing</option>
                <option value="Subscription">Subscription</option>
                <option value="Payment">Payment</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Question">General Question</option>
                <option value="Account Recovery">Account Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Issue 🔥</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Country Code</label>
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+91">🇮🇳 +91 (IN)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+61">🇦🇺 +61 (AU)</option>
              </select>
            </div>
            <div className="col-span-2">
              <Input
                label="Direct Phone Number"
                placeholder="(555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Detailed Description *</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your issue or technical inquiry in detail..."
              className="w-full p-3 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center py-3 font-bold">
            Submit Support Ticket
          </Button>
        </form>
      </Modal>

      {/* Ticket Conversation Stream Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Support Conversation - Ticket ${selectedTicket?.ticketId}`} maxWidth="max-w-3xl">
        {selectedTicket && (
          <div className="space-y-4">
            {/* Ticket Summary Header */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-blue-400">{selectedTicket.ticketId}</span>
                  <span className="text-xs text-slate-400 font-semibold">({selectedTicket.category})</span>
                </div>
                <h4 className="text-sm font-bold mt-0.5">{selectedTicket.subject}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">
                  {selectedTicket.status}
                </span>
                {(selectedTicket.status === 'Resolved' || selectedTicket.status === 'Closed') && (
                  <Button size="xs" variant="outline" onClick={() => handleReopenTicket(selectedTicket._id)}>
                    <FiRotateCcw className="mr-1" /> Reopen Ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
              {selectedTicket.conversation.map((msg, idx) => {
                const isCompanyUser = msg.senderRole === 'Company Admin';
                return (
                  <div key={idx} className={`flex flex-col ${isCompanyUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-white">{msg.senderName}</span>
                      <span>•</span>
                      <span className="font-mono text-blue-400">{msg.senderRole}</span>
                      <span>•</span>
                      <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${isCompanyUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'}`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rating Box for Resolved Tickets */}
            {(selectedTicket.status === 'Resolved' || selectedTicket.status === 'Closed') && !selectedTicket.rating?.score && (
              <form onSubmit={handleSubmitRating} className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-3">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FiStar className="text-amber-400" /> How satisfied are you with our resolution?
                </h5>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= ratingScore ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Optional feedback about our support team..."
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <Button type="submit" size="xs" variant="primary">Submit Satisfaction Rating</Button>
              </form>
            )}

            {/* Reply Box */}
            <form onSubmit={handleSendReply} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                required
                placeholder="Type your reply to Super Admin support team..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
              />
              <Button type="submit" variant="primary" disabled={replyLoading} className="py-3 font-bold">
                <FiSend className="mr-1" /> Send Reply
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyAdminSupportPage;
