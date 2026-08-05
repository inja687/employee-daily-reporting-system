import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiUser, FiSettings, FiMoon, FiSun, FiLogOut, FiChevronDown } from 'react-icons/fi';

const UserDropdown = () => {
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logoutUser();
    navigate('/', { replace: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 hidden md:block">
          {user?.name}
        </span>
        <FiChevronDown className="text-gray-400 text-xs hidden md:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-fade-in text-sm">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
            <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <Link
            to="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center space-x-2.5 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <FiUser className="text-base text-gray-400" />
            <span>My Profile</span>
          </Link>

          <Link
            to="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center space-x-2.5 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <FiSettings className="text-base text-gray-400" />
            <span>Preferences</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center space-x-2.5">
              {isDark ? <FiSun className="text-base text-amber-400" /> : <FiMoon className="text-base text-indigo-500" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>

          <div className="border-t border-gray-100 dark:border-slate-800 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <FiLogOut className="text-base" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
