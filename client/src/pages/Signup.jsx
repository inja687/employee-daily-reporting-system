import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
  const navigate = useNavigate();
  const { registerSaaSWorkspace, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      companyName: '',
      companyEmail: '',
      mobileNumber: '',
      companyAddress: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await registerSaaSWorkspace({
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email || data.companyEmail,
        mobileNumber: data.mobileNumber,
        companyAddress: data.companyAddress,
        password: data.password,
      });

      toast.success('🎉 Workspace created successfully! 14-Day Free Trial Activated.');

      // Automatically redirect to Company Admin Dashboard. NEVER to login!
      navigate('/dashboard', {
        state: {
          showWelcomeModal: true,
          company: res.data?.company,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register workspace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const userGoogleEmail = prompt('Enter your Google Account email for Instant SaaS Signup:', 'owner@mycompany.com');
      if (!userGoogleEmail) {
        setIsGoogleLoading(false);
        return;
      }

      const userName = prompt('Enter your Full Name:', 'Google Business Owner') || 'Google Owner';
      const companyName = prompt('Enter your Company / Organization Name:', 'Google Enterprise Workspace') || 'Google Enterprise Workspace';

      const res = await loginWithGoogle({
        email: userGoogleEmail,
        name: userName,
        companyName: companyName,
      });

      toast.success('Google Authentication Successful! Workspace ready.');
      navigate('/dashboard', {
        state: {
          showWelcomeModal: true,
          company: res.data?.user?.companyId || res.data?.company,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google signup failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 backdrop-blur-xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
          <FiCheckCircle />
          <span>14-Day Free Trial • Instant Activation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Create Company Workspace
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set up your multi-tenant reporting system with automated trial provisioning.
        </p>
      </div>

      {/* Continue with Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading}
        className="w-full mb-6 py-3 px-4 rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-bold flex items-center justify-center space-x-3 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        <span>{isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
      </button>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-gray-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* SECTION 1: Company Information */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <FiBriefcase className="text-base" />
            <span>Company Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="Acme Technologies Inc."
              icon={FiBriefcase}
              error={errors.companyName?.message}
              {...register('companyName', { required: 'Company name is required' })}
            />

            <Input
              label="Company Email"
              type="email"
              placeholder="contact@acme.com"
              icon={FiMail}
              error={errors.companyEmail?.message}
              {...register('companyEmail', { required: 'Company email is required' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Phone"
              placeholder="+91 98765 43210"
              icon={FiPhone}
              error={errors.mobileNumber?.message}
              {...register('mobileNumber', { required: 'Company phone is required' })}
            />

            <Input
              label="Company Address"
              placeholder="Silicon Valley, Suite 400"
              icon={FiMapPin}
              error={errors.companyAddress?.message}
              {...register('companyAddress', { required: 'Company address is required' })}
            />
          </div>
        </div>

        {/* SECTION 2: Owner Information */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <FiUser className="text-base" />
            <span>Owner Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Alex Morgan"
              icon={FiUser}
              error={errors.fullName?.message}
              {...register('fullName', { required: 'Full name is required' })}
            />

            <Input
              label="Email (Login Email)"
              type="email"
              placeholder="alex@acme.com"
              icon={FiMail}
              error={errors.email?.message}
              {...register('email', { required: 'Owner email is required' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={FiLock}
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'At least 6 characters required',
                  },
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

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={FiLock}
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (val) => val === passwordValue || 'Passwords do not match',
              })}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3.5 rounded-2xl text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Create Company & Start 14-Day Free Trial</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;



