import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDropdown from '../components/common/UserDropdown';
import GlobalSearchModal from '../components/common/GlobalSearchModal';
import NotificationDrawer from '../components/common/NotificationDrawer';
import api from '../services/api';
import {
  FiGrid,
  FiFileText,
  FiClock,
  FiCalendar,
  FiCheckSquare,
  FiBell,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiBarChart2,
  FiUser,
  FiCreditCard,
  FiShield,
  FiLock,
  FiAlertTriangle,
} from 'react-icons/fi';

const DashboardLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [isSubLoading, setIsSubLoading] = useState(true);

  const isSuperAdmin = user?.role === 'Super Admin';

  const fetchSubscriptionStatus = useCallback(async () => {
    if (isSuperAdmin) {
      setSubscription({ status: 'Active', isTrial: false, remainingDays: 999, plan: 'Platform Super Admin' });
      setIsSubLoading(false);
      return;
    }

    try {
      setIsSubLoading(true);
      const res = await api.get('/subscription/status');
      setSubscription(res.data.data);
    } catch (error) {
      setSubscription({
        status: 'Trial',
        isTrial: true,
        remainingDays: 14,
        plan: 'Free Trial',
      });
    } finally {
      setIsSubLoading(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    fetchSubscriptionStatus();

    const handleSubUpdated = () => fetchSubscriptionStatus();
    window.addEventListener('subscription:updated', handleSubUpdated);

    const handleGlobalSearchOpen = () => setSearchOpen(true);
    window.addEventListener('open:globalsearch', handleGlobalSearchOpen);

    return () => {
      window.removeEventListener('subscription:updated', handleSubUpdated);
      window.removeEventListener('open:globalsearch', handleGlobalSearchOpen);
    };
  }, [fetchSubscriptionStatus]);

  const isTrialExpired =
    !isSuperAdmin &&
    subscription &&
    subscription.status !== 'Active' &&
    (subscription.remainingDays <= 0 || subscription.status === 'Expired');

  // Enforce Redirect for Company Admin if trial expired and on non-billing dashboard page
  useEffect(() => {
    if (
      !isSubLoading &&
      isTrialExpired &&
      !isSuperAdmin &&
      !location.pathname.includes('/dashboard/billing') &&
      !location.pathname.includes('/profile')
    ) {
      if (user?.role === 'Company Admin' || user?.role === 'Admin') {
        navigate('/dashboard/billing', { replace: true });
      }
    }
  }, [isTrialExpired, isSubLoading, location.pathname, isSuperAdmin, user?.role, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // Build nav items dynamically based on role
  let navItems = [];

  if (isSuperAdmin) {
    // Dedicated Platform Owner Sidebar Items
    navItems = [
      { name: 'Dashboard', path: '/dashboard/super-admin', icon: FiGrid },
      { name: 'Companies', path: '/dashboard/super-admin?tab=companies', icon: FiShield },
      { name: 'Subscriptions', path: '/dashboard/super-admin?tab=subscriptions', icon: FiCreditCard },
      { name: 'Payments', path: '/dashboard/super-admin?tab=payments', icon: FiBarChart2 },
      { name: 'Users', path: '/dashboard/super-admin?tab=users', icon: FiUsers },
      { name: 'Analytics', path: '/dashboard/super-admin?tab=analytics', icon: FiBarChart2 },
      { name: 'Notifications', path: '/dashboard/notifications', icon: FiBell },
      { name: 'Audit Logs', path: '/dashboard/super-admin?tab=logs', icon: FiFileText },
      { name: 'Settings', path: '/dashboard/settings', icon: FiUser },
      { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
    ];
  } else if (isTrialExpired) {
    // Expired State: Show ONLY Billing, Profile, and Logout
    if (user?.role === 'Company Admin' || user?.role === 'Admin') {
      navItems = [{ name: 'Billing & Subscription', path: '/dashboard/billing', icon: FiCreditCard }];
    } else {
      navItems = [{ name: 'Trial Expired Notice', path: '/dashboard/billing', icon: FiLock }];
    }
  } else {
    // Normal Active State for Company Admin / Employees
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'Daily Reports', path: '/dashboard/reports', icon: FiFileText },
      { name: 'Attendance', path: '/dashboard/attendance', icon: FiClock },
      { name: 'Leaves', path: '/dashboard/leaves', icon: FiCalendar },
      { name: 'Tasks', path: '/dashboard/tasks', icon: FiCheckSquare },
      { name: 'Notifications', path: '/dashboard/notifications', icon: FiBell },
    ];

    if (user?.role === 'Admin' || user?.role === 'Company Admin') {
      navItems.push(
        { name: 'Billing & Subscription', path: '/dashboard/billing', icon: FiCreditCard },
        { name: 'Employees', path: '/dashboard/employees', icon: FiUsers },
        { name: 'Departments', path: '/dashboard/departments', icon: FiUsers },
        { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 }
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-200">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Branding */}
          <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg ${isSuperAdmin ? 'bg-purple-600' : 'bg-blue-600'} flex items-center justify-center font-bold text-white text-sm shadow-xs`}>
                {isSuperAdmin ? <FiShield /> : 'EDR'}
              </div>
              <div>
                <span className="font-bold text-base tracking-tight block text-white leading-none">ReportPulse</span>
                <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider">
                  {isSuperAdmin ? 'Platform Owner' : 'Multi-Tenant SaaS'}
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Expired Banner Notice on Sidebar (Company Users Only) */}
          {isTrialExpired && !isSuperAdmin && (
            <div className="p-4 m-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-rose-400">
                <FiAlertTriangle className="text-base shrink-0" />
                <span>Trial Has Expired</span>
              </div>
              <p className="text-[11px] text-rose-300/80 leading-relaxed">
                Business modules are locked. Renew your subscription to restore full access.
              </p>
            </div>
          )}

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard' || item.path === '/dashboard/super-admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? isSuperAdmin
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                  }`
                }
              >
                <item.icon className="text-lg" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className={`w-9 h-9 rounded-full ${isSuperAdmin ? 'bg-purple-600' : 'bg-blue-600'} text-white flex items-center justify-center font-semibold text-sm`}>
                {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-purple-300 font-bold truncate">{isSuperAdmin ? 'Software Owner' : user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <FiMenu className="text-xl" />
            </button>

            {isSuperAdmin ? (
              <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-600 dark:text-purple-400 text-xs font-bold">
                <FiShield />
                <span>Super Admin SaaS Governance Portal</span>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-400 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50 dark:bg-slate-800 text-xs transition-colors"
              >
                <FiSearch className="text-sm" />
                <span>Search dashboard (Ctrl+K)...</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell Drawer Trigger */}
            <button
              onClick={() => setNotifDrawerOpen(true)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <FiBell className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Dropdown */}
            <UserDropdown />
          </div>
        </header>

        {/* Global Overlays */}
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <NotificationDrawer isOpen={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* Employee Expired Notice Banner if employee attempts access during expired trial */}
          {isTrialExpired && user?.role === 'Employee' && (
            <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/30 rounded-3xl border border-rose-200 dark:border-rose-900/50 space-y-4 max-w-xl mx-auto my-8">
              <FiLock className="text-5xl text-rose-500 mx-auto" />
              <h2 className="text-2xl font-black text-rose-900 dark:text-rose-200">Company Subscription Expired</h2>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                Your organization's 14-day free trial has expired. Access to work logs, attendance, tasks, and reports is currently paused. Please contact your Company Admin to renew the subscription.
              </p>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {(!isTrialExpired || user?.role !== 'Employee') && <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

