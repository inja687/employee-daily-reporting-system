import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FiCreditCard,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiX,
  FiZap,
  FiShield,
  FiClock,
  FiUser,
  FiStar,
  FiEye,
  FiRefreshCw,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    trialDays: 0,
    employeeLimit: 50,
    departmentLimit: 10,
    storageLimit: 5,
    status: 'Active',
    featured: false,
    popular: false,
    theme: {
      color: 'purple',
      gradient: 'from-purple-600 to-indigo-600',
      icon: 'FiZap',
      ribbonText: '',
      buttonText: 'Choose Plan',
    },
    features: {
      attendance: true,
      dailyReports: true,
      departments: true,
      leaveManagement: true,
      taskManagement: true,
      analytics: true,
      notifications: true,
      exportData: true,
      pdfReports: true,
      customBranding: false,
      prioritySupport: false,
      apiAccess: false,
      auditLogs: false,
    },
  });

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscription-plans/admin');
      setPlans(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      slug: '',
      shortDescription: '',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      trialDays: 0,
      employeeLimit: 50,
      departmentLimit: 10,
      storageLimit: 5,
      status: 'Active',
      featured: false,
      popular: false,
      theme: {
        color: 'blue',
        gradient: 'from-blue-600 to-indigo-600',
        icon: 'FiZap',
        ribbonText: 'Popular',
        buttonText: 'Choose Plan',
      },
      features: {
        attendance: true,
        dailyReports: true,
        departments: true,
        leaveManagement: true,
        taskManagement: true,
        analytics: true,
        notifications: true,
        exportData: true,
        pdfReports: true,
        customBranding: false,
        prioritySupport: false,
        apiAccess: false,
        auditLogs: false,
      },
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      shortDescription: plan.shortDescription || '',
      monthlyPrice: plan.monthlyPrice || 0,
      yearlyPrice: plan.yearlyPrice || 0,
      trialDays: plan.trialDays || 0,
      employeeLimit: plan.employeeLimit || 0,
      departmentLimit: plan.departmentLimit || 0,
      storageLimit: plan.storageLimit || 0,
      status: plan.status || 'Active',
      featured: plan.featured || false,
      popular: plan.popular || false,
      theme: plan.theme || {
        color: 'purple',
        gradient: 'from-purple-600 to-indigo-600',
        icon: 'FiZap',
        ribbonText: '',
        buttonText: 'Choose Plan',
      },
      features: plan.features || {
        attendance: true,
        dailyReports: true,
        departments: true,
        leaveManagement: true,
        taskManagement: true,
        analytics: true,
        notifications: true,
        exportData: true,
        pdfReports: true,
        customBranding: false,
        prioritySupport: false,
        apiAccess: false,
        auditLogs: false,
      },
    });
    setModalOpen(true);
  };

  const handleDuplicate = async (planId) => {
    try {
      await api.post(`/subscription-plans/admin/${planId}/duplicate`);
      toast.success('Subscription plan duplicated!');
      fetchPlans();
    } catch (err) {
      toast.error('Failed to duplicate plan');
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) return;
    try {
      await api.delete(`/subscription-plans/admin/${planId}`);
      toast.success('Subscription plan deleted!');
      fetchPlans();
    } catch (err) {
      toast.error('Failed to delete plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/subscription-plans/admin/${editingPlan._id}`, formData);
        toast.success(`Updated plan ${formData.name} successfully!`);
      } else {
        await api.post('/subscription-plans/admin', formData);
        toast.success(`Created plan ${formData.name} successfully!`);
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save subscription plan');
    }
  };

  const toggleFeature = (key) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Subscription Plans' }]} />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <FiCreditCard className="text-2xl" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Dynamic SaaS Engine</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Subscription Plan Control</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            Configure dynamic plans, pricing tiers, feature matrix switches, and employee limits. Changes automatically sync to the Landing Page and Billing Page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="xs" variant="outline" onClick={fetchPlans}>
            <FiRefreshCw className="mr-1" /> Refresh
          </Button>
          <Button variant="primary" onClick={handleOpenCreateModal} className="py-2.5 font-bold rounded-2xl bg-purple-600 hover:bg-purple-500 border-none">
            <FiPlus className="mr-2" /> Create Custom Plan
          </Button>
        </div>
      </div>

      {/* Grid of Dynamic Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan._id}
            className={`p-6 rounded-3xl relative flex flex-col justify-between border ${
              plan.popular ? 'border-purple-500 bg-slate-900 shadow-xl shadow-purple-500/10' : 'border-slate-800 bg-slate-900'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-full shadow-md">
                {plan.theme?.ribbonText || 'Most Popular'}
              </span>
            )}

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  <span className="text-xs font-mono text-gray-400">/{plan.slug}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${plan.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-gray-400'}`}>
                  {plan.status}
                </span>
              </div>

              <div className="mt-4 mb-4">
                <span className="text-3xl font-black text-white">
                  {plan.monthlyPrice === 0 ? 'Free' : `₹${plan.monthlyPrice}`}
                </span>
                {plan.monthlyPrice > 0 && <span className="text-xs text-gray-400"> / month</span>}
              </div>

              <p className="text-xs text-gray-400 mb-4 line-clamp-2">{plan.shortDescription}</p>

              {/* Limits */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 text-xs mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Staff Limit:</span>
                  <span className="font-bold text-white">{plan.employeeLimit === 0 ? 'Unlimited' : `${plan.employeeLimit} Staff`}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Departments:</span>
                  <span className="font-bold text-white">{plan.departmentLimit === 0 ? 'Unlimited' : `${plan.departmentLimit} Depts`}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Trial Days:</span>
                  <span className="font-bold text-amber-400">{plan.trialDays ? `${plan.trialDays} Days` : 'Direct Purchase'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
              <Button size="xs" variant="outline" className="flex-1 justify-center" onClick={() => handleOpenEditModal(plan)}>
                <FiEdit className="mr-1" /> Edit
              </Button>
              <Button size="xs" variant="secondary" onClick={() => handleDuplicate(plan._id)} title="Duplicate">
                <FiCopy />
              </Button>
              <Button size="xs" variant="danger" onClick={() => handleDelete(plan._id)} title="Delete">
                <FiTrash2 />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Modal (Create / Edit) */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPlan ? `Edit Plan - ${editingPlan.name}` : 'Create Custom Subscription Plan'} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Plan Name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                });
              }}
              required
            />
            <Input label="Slug (URL identifier)" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
            <Input label="Monthly Price (INR)" type="number" value={formData.monthlyPrice} onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })} required />
            <Input label="Yearly Price (INR)" type="number" value={formData.yearlyPrice} onChange={(e) => setFormData({ ...formData, yearlyPrice: Number(e.target.value) })} required />
            <Input label="Trial Duration (Days)" type="number" value={formData.trialDays} onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })} />
            <Input label="Employee Limit (0 = Unlimited)" type="number" value={formData.employeeLimit} onChange={(e) => setFormData({ ...formData, employeeLimit: Number(e.target.value) })} />
            <Input label="Department Limit (0 = Unlimited)" type="number" value={formData.departmentLimit} onChange={(e) => setFormData({ ...formData, departmentLimit: Number(e.target.value) })} />
            <Input label="Storage Limit (GB)" type="number" value={formData.storageLimit} onChange={(e) => setFormData({ ...formData, storageLimit: Number(e.target.value) })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Short Description</label>
            <textarea
              className="w-full p-3 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white"
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          {/* Feature Matrix Switcher */}
          <div>
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">Feature Matrix Controls (ON / OFF)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(formData.features).map((featKey) => (
                <label key={featKey} className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features[featKey]}
                    onChange={() => toggleFeature(featKey)}
                    className="rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-semibold capitalize text-gray-300">{featKey.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Theme & Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
            <Input label="CTA Button Text" value={formData.theme.buttonText} onChange={(e) => setFormData({ ...formData, theme: { ...formData.theme, buttonText: e.target.value } })} />
            <Input label="Ribbon Badge Text" value={formData.theme.ribbonText} onChange={(e) => setFormData({ ...formData, theme: { ...formData.theme, ribbonText: e.target.value } })} />
            <div className="flex items-center space-x-4 pt-6">
              <label className="flex items-center space-x-2 text-xs text-gray-300">
                <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} />
                <span>Popular Badge</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center bg-purple-600 hover:bg-purple-500 border-none font-bold">
            Save Subscription Plan
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SuperAdminSubscriptionPlans;
