import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getProductivityAnalyticsApi,
  getAttendanceTrendsApi,
  getWeeklyAnalyticsApi,
} from '../../services/analyticsService';
import Card from '../../components/ui/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const AnalyticsPage = () => {
  const [productivity, setProductivity] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [prodRes, attRes, weekRes] = await Promise.all([
          getProductivityAnalyticsApi(14),
          getAttendanceTrendsApi(30),
          getWeeklyAnalyticsApi(),
        ]);
        setProductivity(prodRes.data || []);
        setAttendanceTrends(attRes.data || []);
        setWeeklyData(weekRes.data || []);
      } catch (error) {
        toast.error('Failed to load analytics metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <SkeletonLoader type="card" rows={3} />;
  }

  const attendancePieData = (attendanceTrends || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Productivity & Analytics' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Hours Worked Area Chart */}
        <Card title="Productivity Trends (Hours Worked)" subtitle="Daily total work hours logged over the last 14 days">
          <div className="h-64 w-full">
            {productivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="_id" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="totalHours" stroke="#2563eb" fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 py-12 text-center">No productivity data available</p>
            )}
          </div>
        </Card>

        {/* Weekly Activity Line Chart */}
        <Card title="Weekly Report Submission Trends" subtitle="Weekly report submission volume">
          <div className="h-64 w-full">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="_id" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalReports" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 py-12 text-center">No weekly trends available</p>
            )}
          </div>
        </Card>

        {/* Attendance Distribution Pie Chart */}
        <Card title="Attendance Breakdown (Past 30 Days)" subtitle="Distribution of attendance status logs">
          <div className="h-64 w-full flex items-center justify-center">
            {attendancePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 py-12 text-center">No attendance trends available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
