import { useState } from 'react';
import { FiPieChart, FiTrendingUp, FiActivity } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';

const SuperAdminPlatformAnalytics = () => {
  const growthData = [
    { month: 'Jan', registrations: 4, trials: 4 },
    { month: 'Feb', registrations: 7, trials: 6 },
    { month: 'Mar', registrations: 11, trials: 9 },
    { month: 'Apr', registrations: 16, trials: 14 },
    { month: 'May', registrations: 22, trials: 18 },
    { month: 'Jun', registrations: 29, trials: 25 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/super-admin/dashboard' }, { label: 'Platform Analytics' }]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Tenant Registration Growth" subtitle="New organization signups per month">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                <Bar dataKey="registrations" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="SaaS Key Performance Indicators" subtitle="Trial conversion & customer retention">
          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Free Trial to Paid Conversion Rate</span>
              <span className="text-lg font-black text-emerald-400">68.4%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Net Revenue Retention (NRR)</span>
              <span className="text-lg font-black text-blue-400">112%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Platform System Uptime</span>
              <span className="text-lg font-black text-purple-400">99.99%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPlatformAnalytics;
