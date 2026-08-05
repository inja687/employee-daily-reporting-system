import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDropdown from '../components/common/UserDropdown';
import GlobalSearchModal from '../components/common/GlobalSearchModal';
import NotificationDrawer from '../components/common/NotificationDrawer';
import {
  FiGrid,
  FiFileText,
  FiClock,
  FiCalendar,
  FiCheckSquare,
  FiVolume2,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
} from 'react-icons/fi';

const EmployeeLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: FiGrid },
    { name: 'Daily Reports', path: '/employee/reports', icon: FiFileText },
    { name: 'Attendance', path: '/employee/attendance', icon: FiClock },
    { name: 'Leaves', path: '/employee/leaves', icon: FiCalendar },
    { name: 'Tasks', path: '/employee/tasks', icon: FiCheckSquare },
    { name: 'Notices', path: '/employee/notices', icon: FiVolume2 },
    { name: 'Notifications', path: '/employee/notifications', icon: FiBell },
    { name: 'Profile', path: '/employee/profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-200">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dedicated Employee Sidebar */}
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
                  Employee Portal
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FiX className="text-xl" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
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
                <p className="text-xs text-gray-400 truncate">Employee</p>
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
              <span>Search workspace...</span>
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

export default EmployeeLayout;
