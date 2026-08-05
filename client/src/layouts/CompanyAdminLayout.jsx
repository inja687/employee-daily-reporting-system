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
  FiLock,
  FiAlertTriangle,
  FiLifeBuoy,
} from 'react-icons/fi';

const CompanyAdminLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [isSubLoading, setIsSubLoading] = useState(true);

  const fetchSubscriptionStatus = useCallback(async () => {
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
  }, []);

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
    subscription &&
    subscription.status !== 'Active' &&
    (subscription.remainingDays <= 0 || subscription.status === 'Expired');

  useEffect(() => {
    if (
      !isSubLoading &&
      isTrialExpired &&
      !location.pathname.includes('/dashboard/billing') &&
      !location.pathname.includes('/profile')
    ) {
      navigate('/dashboard/billing', { replace: true });
    }
  }, [isTrialExpired, isSubLoading, location.pathname, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/', { replace: true });
  };

  let navItems = [];

  if (isTrialExpired) {
    navItems = [{ name: 'Billing & Subscription', path: '/dashboard/billing', icon: FiCreditCard }];
  } else {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'Employees', path: '/dashboard/employees', icon: FiUsers },
      { name: 'Attendance', path: '/dashboard/attendance', icon: FiClock },
      { name: 'Daily Reports', path: '/dashboard/reports', icon: FiFileText },
      { name: 'Leaves', path: '/dashboard/leaves', icon: FiCalendar },
      { name: 'Departments', path: '/dashboard/departments', icon: FiUsers },
      { name: 'Tasks', path: '/dashboard/tasks', icon: FiCheckSquare },
      { name: 'Billing & Subscription', path: '/dashboard/billing', icon: FiCreditCard },
      { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
      { name: 'Support', path: '/dashboard/support', icon: FiLifeBuoy },
      { name: 'Notifications', path: '/dashboard/notifications', icon: FiBell },
      { name: 'Settings', path: '/dashboard/settings', icon: FiUser },
      { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-200">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dedicated Company Admin Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                EDR
              </div>
              <div>
                <span className="font-bold text-base tracking-tight block text-white leading-none">ReportPulse</span>
                <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider">
                  Company Admin
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FiX className="text-xl" />
            </button>
          </div>

          {isTrialExpired && (
            <div className="p-4 m-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-rose-400">
                <FiAlertTriangle className="text-base shrink-0" />
                <span>Trial Has Expired</span>
              </div>
              <p className="text-[11px] text-rose-300/80 leading-relaxed">
                Business modules locked. Renew subscription under Billing to restore full access.
              </p>
            </div>
          )}

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
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

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-blue-300 font-bold truncate">Company Owner</p>
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <FiMenu className="text-xl" />
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-400 bg-gray-50 dark:bg-slate-800 text-xs transition-colors"
            >
              <FiSearch className="text-sm" />
              <span>Search dashboard (Ctrl+K)...</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setNotifDrawerOpen(true)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <FiBell className="text-xl" />
            </button>
            <UserDropdown />
          </div>
        </header>

        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <NotificationDrawer isOpen={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyAdminLayout;
