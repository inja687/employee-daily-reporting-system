import 'dotenv/config';
import connectDB from './db.js';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@example.com';
    const adminEmployeeId = 'ADM-001';

    let admin = await User.findOne({
      $or: [{ email: adminEmail }, { employeeId: adminEmployeeId }],
    });

    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'Admin1234!',
        employeeId: adminEmployeeId,
        department: 'Administration',
        designation: 'Super Administrator',
        role: 'Super Admin',
        status: 'Active',
      });
      console.log('\n=============================================');
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: Admin1234!');
      console.log('Role: Super Admin');
      console.log('=============================================\n');
    } else {
      console.log('\n=============================================');
      console.log('ℹ️ Admin user already exists in database!');
      console.log(`Email: ${admin.email}`);
      console.log('Password: Admin1234!');
      console.log('=============================================\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
