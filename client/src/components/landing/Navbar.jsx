import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiBell,
  FiUser,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiChevronDown,
  FiBriefcase,
} from 'react-icons/fi';

import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visitorLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#workflow' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const companyName =
    user?.companyId?.companyName ||
    user?.companyName ||
    (user?.role === 'Company Admin' ? 'My Company' : '');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logoutUser();
    navigate('/', { replace: true });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            RP
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Report<span className="text-blue-500">Pulse</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
              Enterprise SaaS
            </span>
          </div>
        </Link>

        {/* Visitor Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {visitorLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Action Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Dashboard Direct Button */}
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl font-semibold text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all flex items-center gap-2"
              >
                <FiGrid className="text-sm" />
                <span>Dashboard</span>
              </Link>

              {/* Notification Bell */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                title="Notifications"
              >
                <FiBell className="text-lg" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </Link>

              {/* Authenticated User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>

                  <div className="flex flex-col max-w-[130px]">
                    <span className="text-xs font-semibold text-white truncate leading-tight">
                      {user.name}
                    </span>
                    {companyName && (
                      <span className="text-[11px] text-blue-400 font-medium truncate flex items-center gap-1">
                        <FiBriefcase className="inline text-[10px]" />
                        {companyName}
                      </span>
                    )}
                  </div>

                  <FiChevronDown className={`text-slate-400 text-sm transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-slate-800/80">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                        {user.role}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <FiGrid className="text-blue-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <FiUser className="text-indigo-400" />
                        <span>Profile</span>
                      </Link>

                      {(user.role === 'Company Admin' || user.role === 'Super Admin') && (
                        <Link
                          to="/dashboard/billing"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                        >
                          <FiCreditCard className="text-emerald-400" />
                          <span>Billing & Subscription</span>
                        </Link>
                      )}

                      <Link
                        to="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <FiSettings className="text-purple-400" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 group"
              >
                <span>Get Started</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2"
        >
          {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          {visitorLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-300 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-800/60 rounded-xl mb-3">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  {companyName && (
                    <p className="text-xs text-blue-400 font-medium mt-1">Company: {companyName}</p>
                  )}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-xl font-semibold text-sm bg-blue-600 text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 rounded-xl font-medium text-sm bg-slate-800 text-slate-300"
                >
                  Profile
                </Link>
                {(user.role === 'Company Admin' || user.role === 'Super Admin') && (
                  <Link
                    to="/dashboard/billing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 rounded-xl font-medium text-sm bg-slate-800 text-slate-300"
                  >
                    Billing & Subscription
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 rounded-xl font-medium text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-sm font-semibold text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-xl font-semibold text-sm bg-blue-600 text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

