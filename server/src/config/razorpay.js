import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TM2JrmfB3qkwtJ',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'IewZ26qnnhqxysT1XelrmyfE',
});

export default razorpayInstance;
