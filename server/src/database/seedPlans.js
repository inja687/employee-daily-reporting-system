import 'dotenv/config';
import connectDB from './db.js';
import Plan from '../models/Plan.js';

const seedPlans = async () => {
  try {
    await connectDB();

    const plansData = [
      {
        name: 'Starter',
        priceMonthly: 2499,
        priceAnnual: 1999,
        maxEmployees: 25,
        features: [
          'Up to 25 Employees',
          'Daily Work Reports & Drafts',
          'Basic Attendance Check-Ins',
          'Leave Management & Approvals',
          'Standard Email Support',
        ],
        isActive: true,
      },
      {
        name: 'Professional',
        priceMonthly: 6499,
        priceAnnual: 4999,
        maxEmployees: 100,
        features: [
          'Up to 100 Employees',
          'All Starter Features Included',
          'Recharts Analytics & Export',
          'Task Assignment & Status Tracking',
          'Department Management & Head Roles',
          'Priority 24/7 Support',
        ],
        isActive: true,
      },
      {
        name: 'Enterprise',
        priceMonthly: 15999,
        priceAnnual: 12999,
        maxEmployees: -1, // Unlimited
        features: [
          'Unlimited Staff & Departments',
          'Custom Role-Based Access Tiers',
          'Winston Audit Logs & Retention',
          'Dedicated Account Manager',
          'Custom API Integrations',
          '99.99% SLA Uptime Guarantee',
        ],
        isActive: true,
      },
    ];

    for (const plan of plansData) {
      await Plan.findOneAndUpdate({ name: plan.name }, plan, {
        upsert: true,
        new: true,
      });
    }

    console.log('\n=============================================');
    console.log('✅ Subscription Plans seeded in MongoDB Atlas!');
    console.log('Plans: Starter (₹2499), Professional (₹6499), Enterprise (₹15999)');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();
