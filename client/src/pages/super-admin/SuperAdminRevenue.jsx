import { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminRevenue = () => {
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 24000 },
    { month: 'Apr', revenue: 31000 },
    { month: 'May', revenue: 42000 },
    { month: 'Jun', revenue: 58000 },
  ];

  const planDistributionData = [
    { name: 'Free Trial', value: 14, color: '#3B82F6' },
    { name: 'Pro Plan (₹2,999)', value: 8, color: '#10B981' },
    { name: 'Enterprise Plan (₹9,999)', value: 3, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Revenue Analytics' }]} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Recurring Revenue (MRR)</span>
          <p className="text-3xl font-black text-emerald-400 mt-2">₹58,000 INR</p>
          <span className="text-xs text-emerald-500 font-bold mt-1 block">+24.5% vs Last Month</span>
        </Card>

        <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual Run Rate (ARR)</span>
          <p className="text-3xl font-black text-blue-400 mt-2">₹6,96,000 INR</p>
          <span className="text-xs text-blue-400 font-bold mt-1 block">Projected Growth</span>
        </Card>

        <Card className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Revenue Per Tenant (ARPU)</span>
          <p className="text-3xl font-black text-purple-400 mt-2">₹3,450 / mo</p>
          <span className="text-xs text-purple-400 font-bold mt-1 block">High LTV / Retention</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Recurring Revenue Trend" subtitle="Subscription revenue accumulation over time">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevPage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevPage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue Distribution by Subscription Plan" subtitle="Percentage breakdown of tenant plan tier subscriptions">
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
      </div>
    </div>
  );
};

export default SuperAdminRevenue;
