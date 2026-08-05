import 'dotenv/config';
import connectDB from './database/db.js';
import { saasLogin } from './services/saasAuthService.js';

const test = async () => {
  try {
    await connectDB();
    const email = 'superadmin12';
    const password = 'Super44';

    const result = await saasLogin(email, password);
    console.log('Super Admin Login Result:');
    console.log('Name:', result.user.name);
    console.log('Email:', result.user.email);
    console.log('Role:', result.user.role);
    console.log('Access Token generated:', !!result.accessToken);
    process.exit(0);
  } catch (err) {
    console.error('Super Admin Login error:', err.message);
    process.exit(1);
  }
};

test();

