import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { loadRazorpayScript } from '../../utils/loadRazorpay';
import { createSubscriptionOrderApi, verifySubscriptionPaymentApi } from '../../services/subscriptionService';
import Button from '../ui/Button';
import { FiCreditCard } from 'react-icons/fi';

const CheckoutButton = ({ planName, amount, buttonText = 'Upgrade Plan', className = '', variant = 'primary', disabled = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (disabled) return;

    if (!user) {
      toast.error('Please log in to upgrade your subscription');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 1: Create Subscription Order in Backend
      const orderRes = await createSubscriptionOrderApi({ planName, amount, billingCycle: 'monthly' });
      const { orderId, amount: razorpayAmount, currency } = orderRes.data;

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TM2JrmfB3qkwtJ';

      // Step 2: Open Razorpay Test Mode Checkout Modal
      const options = {
        key: keyId,
        amount: razorpayAmount,
        currency: currency,
        name: 'ReportPulse Enterprise',
        description: `${planName} Subscription Plan (Test Mode)`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        order_id: orderId,
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || '9876543210',
        },
        theme: {
          color: '#2563eb',
        },
        notes: {
          test_mode: 'Razorpay India Test Mode',
          supported_methods: 'UPI, GPay, PhonePe, Paytm, BHIM, Amazon Pay, Cards, NetBanking, Wallets, EMI, PayLater',
        },
        handler: async (response) => {
          try {
            // Step 3: Verify Subscription Payment Signature & Activate Subscription in Backend
            const verifyRes = await verifySubscriptionPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName,
              amount,
              billingCycle: 'monthly',
            });

            // Dispatch global event for instant cache & state refresh across components
            window.dispatchEvent(new Event('subscription:updated'));

            toast.success(`Subscription updated to ${planName} Plan!`);
            navigate('/dashboard/payment-success', {
              state: { payment: verifyRes.data.payment, subscription: verifyRes.data.subscription },
            });
          } catch (err) {
            toast.error(err.response?.data?.message || 'Subscription verification failed');
            navigate('/dashboard/payment-failed', {
              state: { error: err.response?.data?.message || 'Verification Error' },
            });
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast('Payment modal closed');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        navigate('/dashboard/payment-failed', {
          state: { error: response.error.description },
        });
      });

      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate Razorpay payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      isLoading={loading}
      disabled={disabled}
      onClick={handlePayment}
      className={className}
    >
      <FiCreditCard className="mr-2" /> {buttonText}
    </Button>
  );
};

export default CheckoutButton;
