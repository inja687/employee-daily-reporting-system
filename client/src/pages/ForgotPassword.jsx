import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { forgotPasswordApi } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordApi(data);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email.');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
      // Still set submitted state for security pattern if required
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Sign In
        </Link>
      </div>

      {isSubmitted ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            We have sent password recovery instructions to your email address if an account exists.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Return to Login
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={FiMail}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />

            <Button type="submit" isLoading={isLoading} className="w-full py-3 text-base">
              Send Reset Link
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
