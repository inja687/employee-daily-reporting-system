import 'dotenv/config';
import connectDB from './database/db.js';
import Plan from './models/Plan.js';
import Subscription from './models/Subscription.js';
import { getActivePlans } from './services/subscriptionService.js';

const test = async () => {
  try {
    await connectDB();
    const plans = await getActivePlans();
    console.log('Active Plans fetched from MongoDB Atlas count:', plans.length);
    plans.forEach((p) => {
      console.log(`- ${p.name}: ₹${p.priceMonthly}/mo (Max Employees: ${p.maxEmployees})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Subscription Test error:', err);
    process.exit(1);
  }
};

test();
