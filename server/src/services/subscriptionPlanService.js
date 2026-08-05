import SubscriptionPlan from '../models/SubscriptionPlan.js';
import ApiError from '../utils/ApiError.js';
import AuditLog from '../models/AuditLog.js';

export const seedDefaultPlans = async () => {
  const count = await SubscriptionPlan.countDocuments();
  if (count === 0) {
    const defaultPlans = [
      {
        name: 'Free Trial',
        slug: 'free-trial',
        shortDescription: 'Ideal for trying out ReportPulse with full features for 14 days.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        trialDays: 14,
        employeeLimit: 10,
        departmentLimit: 3,
        storageLimit: 1,
        displayOrder: 1,
        status: 'Active',
        featured: false,
        popular: false,
        theme: {
          color: 'blue',
          gradient: 'from-blue-600 to-cyan-600',
          icon: 'FiClock',
          ribbonText: '14-Day Free Access',
          buttonText: 'Start 14-Day Free Trial',
        },
        features: {
          attendance: true,
          dailyReports: true,
          departments: true,
          leaveManagement: true,
          taskManagement: true,
          analytics: false,
          notifications: true,
          exportData: false,
          pdfReports: false,
          customBranding: false,
          prioritySupport: false,
          apiAccess: false,
          auditLogs: false,
        },
      },
      {
        name: 'Starter Plan',
        slug: 'starter-plan',
        shortDescription: 'Designed for small growing teams needing daily activity tracking.',
        monthlyPrice: 999,
        yearlyPrice: 9990,
        trialDays: 0,
        employeeLimit: 25,
        departmentLimit: 5,
        storageLimit: 5,
        displayOrder: 2,
        status: 'Active',
        featured: false,
        popular: false,
        theme: {
          color: 'teal',
          gradient: 'from-teal-600 to-emerald-600',
          icon: 'FiUser',
          ribbonText: 'Small Teams',
          buttonText: 'Choose Starter',
        },
        features: {
          attendance: true,
          dailyReports: true,
          departments: true,
          leaveManagement: true,
          taskManagement: true,
          analytics: true,
          notifications: true,
          exportData: true,
          pdfReports: true,
          customBranding: false,
          prioritySupport: false,
          apiAccess: false,
          auditLogs: false,
        },
      },
      {
        name: 'Pro Plan',
        slug: 'pro-plan',
        shortDescription: 'Complete operational suite for medium-sized organizations.',
        monthlyPrice: 2999,
        yearlyPrice: 29990,
        trialDays: 0,
        employeeLimit: 100,
        departmentLimit: 15,
        storageLimit: 20,
        displayOrder: 3,
        status: 'Active',
        featured: true,
        popular: true,
        theme: {
          color: 'purple',
          gradient: 'from-purple-600 to-indigo-600',
          icon: 'FiZap',
          ribbonText: 'Most Popular',
          buttonText: 'Get Started with Pro',
        },
        features: {
          attendance: true,
          dailyReports: true,
          departments: true,
          leaveManagement: true,
          taskManagement: true,
          analytics: true,
          notifications: true,
          exportData: true,
          pdfReports: true,
          customBranding: true,
          prioritySupport: true,
          apiAccess: false,
          auditLogs: true,
        },
      },
      {
        name: 'Enterprise Plan',
        slug: 'enterprise-plan',
        shortDescription: 'Custom capacity, SLA guarantees, and dedicated account manager.',
        monthlyPrice: 9999,
        yearlyPrice: 99990,
        trialDays: 0,
        employeeLimit: 0, // Unlimited
        departmentLimit: 0, // Unlimited
        storageLimit: 100,
        displayOrder: 4,
        status: 'Active',
        featured: true,
        popular: false,
        theme: {
          color: 'amber',
          gradient: 'from-amber-500 to-orange-600',
          icon: 'FiShield',
          ribbonText: 'Unlimited Access',
          buttonText: 'Contact Enterprise',
        },
        features: {
          attendance: true,
          dailyReports: true,
          departments: true,
          leaveManagement: true,
          taskManagement: true,
          analytics: true,
          notifications: true,
          exportData: true,
          pdfReports: true,
          customBranding: true,
          prioritySupport: true,
          apiAccess: true,
          auditLogs: true,
        },
      },
    ];

    await SubscriptionPlan.insertMany(defaultPlans);
    console.log('✅ Subscription plans seeded into MongoDBAtlas successfully.');
  }
};

export const getPublicPlans = async () => {
  return await SubscriptionPlan.find({ status: 'Active' }).sort({ displayOrder: 1 });
};

export const getAllPlans = async () => {
  return await SubscriptionPlan.find().sort({ displayOrder: 1 });
};

export const createPlan = async (adminUser, data) => {
  const existing = await SubscriptionPlan.findOne({
    $or: [{ name: data.name }, { slug: data.slug }],
  });
  if (existing) {
    throw new ApiError(400, 'A plan with this name or slug already exists');
  }

  const plan = await SubscriptionPlan.create(data);

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    action: 'CREATE_SUBSCRIPTION_PLAN',
    details: `Created new subscription plan: ${plan.name} (${plan.monthlyPrice} INR/mo)`,
  });

  return plan;
};

export const updatePlan = async (adminUser, planId, data) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(planId, data, {
    new: true,
    runValidators: true,
  });
  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    action: 'UPDATE_SUBSCRIPTION_PLAN',
    details: `Updated subscription plan: ${plan.name} - Price: ₹${plan.monthlyPrice}`,
  });

  return plan;
};

export const deletePlan = async (adminUser, planId) => {
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  await SubscriptionPlan.findByIdAndDelete(planId);

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    action: 'DELETE_SUBSCRIPTION_PLAN',
    details: `Deleted subscription plan: ${plan.name}`,
  });
};

export const duplicatePlan = async (adminUser, planId) => {
  const original = await SubscriptionPlan.findById(planId);
  if (!original) {
    throw new ApiError(404, 'Original subscription plan not found');
  }

  const planObj = original.toObject();
  delete planObj._id;
  delete planObj.createdAt;
  delete planObj.updatedAt;

  planObj.name = `${original.name} (Copy)`;
  planObj.slug = `${original.slug}-copy-${Date.now().toString(36)}`;
  planObj.status = 'Draft';

  const newPlan = await SubscriptionPlan.create(planObj);

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    action: 'DUPLICATE_SUBSCRIPTION_PLAN',
    details: `Duplicated subscription plan ${original.name} to ${newPlan.name}`,
  });

  return newPlan;
};
