import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiUserCheck, FiShield, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('company'); // 'company' | 'employee' | 'superadmin'

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginUser(data);
      const userRole = res?.data?.user?.role;
      toast.success(`Welcome back, ${res?.data?.user?.name || 'User'}!`);

      if (userRole === 'Super Admin') {
        navigate('/super-admin/dashboard', { replace: true });
      } else if (userRole === 'Employee') {
        navigate('/employee/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Invalid username or password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userGoogleEmail = prompt('Enter your registered Google email:', 'owner@mycompany.com');
      if (!userGoogleEmail) return;

      const res = await loginWithGoogle({ email: userGoogleEmail });
      toast.success(`Google authentication successful! Welcome ${res.data?.user?.name || ''}`);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google authentication failed');
    }
  };

  const fillSuperAdminDemo = () => {
    setValue('email', 'superadmin12');
    setValue('password', 'Super44');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Sign in to ReportPulse
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Access your multi-tenant employee reporting workspace.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 mb-6 bg-gray-100 dark:bg-slate-800/80 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setLoginMode('company');
            setValue('email', '');
            setValue('password', '');
          }}
          className={`py-2 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginMode === 'company'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FiBriefcase className="text-xs" />
          <span>Company</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginMode('employee');
            setValue('email', '');
            setValue('password', '');
          }}
          className={`py-2 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginMode === 'employee'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FiUserCheck className="text-xs" />
          <span>Employee</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginMode('superadmin');
            fillSuperAdminDemo();
          }}
          className={`py-2 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginMode === 'superadmin'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FiShield className="text-xs" />
          <span>Super Admin</span>
        </button>
      </div>

      {/* Google Login Option (For Company Admins & Employees) */}
      {loginMode !== 'superadmin' && (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mb-5 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-gray-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>
        </>
      )}

      {loginMode === 'superadmin' && (
        <div className="p-3 mb-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-800 dark:text-purple-300 flex items-center justify-between">
          <span>Demo Super Admin Account: <strong>superadmin12 / Super44</strong></span>
          <button type="button" onClick={fillSuperAdminDemo} className="font-extrabold text-purple-600 dark:text-purple-400 underline ml-2">
            Auto-fill
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label={loginMode === 'superadmin' ? 'Super Admin Username / Email' : loginMode === 'employee' ? 'Employee Work Email' : 'Company Admin Email'}
          type="text"
          placeholder={loginMode === 'superadmin' ? 'superadmin12' : 'user@company.com'}
          icon={FiMail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Username or email is required',
          })}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={FiLock}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded-xs border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
        >
          <span>Sign In as {loginMode === 'superadmin' ? 'Super Admin' : loginMode === 'employee' ? 'Employee' : 'Company Admin'}</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Direct link to Company Registration only for company mode */}
      {loginMode === 'company' && (
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Need a company workspace?{' '}
          <Link to="/signup" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Register Company (14-Day Free Trial)
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;


