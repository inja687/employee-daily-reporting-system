import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDropdown from '../components/common/UserDropdown';
import GlobalSearchModal from '../components/common/GlobalSearchModal';
import NotificationDrawer from '../components/common/NotificationDrawer';
import {
  FiGrid,
  FiShield,
  FiBriefcase,
  FiUserCheck,
  FiUsers,
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiPieChart,
  FiBell,
  FiFileText,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiLifeBuoy,
} from 'react-icons/fi';

const SuperAdminLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/', { replace: true });
  };

  const navGroups = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/super-admin/dashboard', icon: FiGrid },
      ],
    },
    {
      groupTitle: 'ORGANIZATION',
      items: [
        { name: 'Companies', path: '/super-admin/companies', icon: FiBriefcase },
        { name: 'Company Admins', path: '/super-admin/company-admins', icon: FiUserCheck },
        { name: 'Employees', path: '/super-admin/employees', icon: FiUsers },
      ],
    },
    {
      groupTitle: 'SUBSCRIPTIONS',
      items: [
        { name: 'Subscriptions', path: '/super-admin/subscriptions', icon: FiCreditCard },
        { name: 'Subscription Plans', path: '/super-admin/subscription-plans', icon: FiCreditCard },
        { name: 'Payments', path: '/super-admin/payments', icon: FiDollarSign },
      ],
    },
    {
      groupTitle: 'ANALYTICS',
      items: [
        { name: 'Revenue Analytics', path: '/super-admin/revenue', icon: FiTrendingUp },
        { name: 'Platform Analytics', path: '/super-admin/platform-analytics', icon: FiPieChart },
      ],
    },
    {
      groupTitle: 'SYSTEM',
      items: [
        { name: 'Customer Support', path: '/super-admin/customer-support', icon: FiLifeBuoy },
        { name: 'Notifications', path: '/super-admin/notifications', icon: FiBell },
        { name: 'Audit Logs', path: '/super-admin/audit-logs', icon: FiFileText },
      ],
    },
    {
      groupTitle: 'ADMINISTRATION',
      items: [
        { name: 'Platform Settings', path: '/super-admin/settings', icon: FiSettings },
        { name: 'Profile', path: '/super-admin/profile', icon: FiUser },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-200">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Grouped Enterprise Super Admin Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                <FiShield />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight block text-white leading-none">ReportPulse</span>
                <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider">
                  Platform Owner
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold tracking-widest text-slate-500 uppercase block mb-1">
                  {group.groupTitle}
                </span>
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                      }`
                    }
                  >
                    <item.icon className="text-base" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Super Admin'}</p>
                <p className="text-xs text-purple-300 font-bold truncate">Software Owner</p>
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

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-600 dark:text-purple-400 text-xs font-bold">
              <FiShield />
              <span>Super Admin SaaS Governance Portal</span>
            </div>
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

export default SuperAdminLayout;
