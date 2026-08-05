export const generateWelcomeEmailHTML = (companyName, ownerName, adminEmail) => `
<!DOCTYPE html>
<html>
<head><style>body{font-family:sans-serif;background:#f4f6f8;padding:20px;} .card{background:#fff;padding:30px;border-radius:12px;max-width:600px;margin:auto;} .btn{background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;}</style></head>
<body>
  <div className="card">
    <h2 style="color:#1e293b;">Welcome to ReportPulse, ${ownerName}! 🎉</h2>
    <p>Your 14-day free trial workspace for <strong>${companyName}</strong> is now active.</p>
    <p>Automated Company Admin Login Email: <strong>${adminEmail}</strong></p>
    <br/>
    <a href="http://localhost:5173/login" className="btn">Access Workspace</a>
  </div>
</body>
</html>
`;

export const generateTrialReminderEmailHTML = (companyName, remainingDays) => `
<!DOCTYPE html>
<html>
<head><style>body{font-family:sans-serif;background:#f4f6f8;padding:20px;} .card{background:#fff;padding:30px;border-radius:12px;max-width:600px;margin:auto;}</style></head>
<body>
  <div className="card">
    <h2 style="color:#d97706;">Trial Expiring Soon ⏰</h2>
    <p>Your 14-day free trial for <strong>${companyName}</strong> will expire in <strong>${remainingDays} days</strong>.</p>
    <p>Upgrade to a paid plan to prevent service interruption for your team.</p>
  </div>
</body>
</html>
`;

export const generateTrialExpiryEmailHTML = (companyName) => `
<!DOCTYPE html>
<html>
<head><style>body{font-family:sans-serif;background:#f4f6f8;padding:20px;} .card{background:#fff;padding:30px;border-radius:12px;max-width:600px;margin:auto;}</style></head>
<body>
  <div className="card">
    <h2 style="color:#dc2626;">Free Trial Expired 🔒</h2>
    <p>The 14-day free trial for <strong>${companyName}</strong> has expired.</p>
    <p>Feature access is temporarily locked. Please log in and upgrade your plan to restore full access.</p>
  </div>
</body>
</html>
`;

export const generatePaymentSuccessEmailHTML = (companyName, planName, amount, invoiceNumber) => `
<!DOCTYPE html>
<html>
<head><style>body{font-family:sans-serif;background:#f4f6f8;padding:20px;} .card{background:#fff;padding:30px;border-radius:12px;max-width:600px;margin:auto;}</style></head>
<body>
  <div className="card">
    <h2 style="color:#16a34a;">Payment Verified & Invoice Generated ✅</h2>
    <p>Thank you for subscribing to <strong>ReportPulse ${planName} Plan</strong> for ${companyName}.</p>
    <p>Amount Paid: <strong>₹${amount} INR</strong> (Includes 18% GST)</p>
    <p>Invoice Number: <strong>${invoiceNumber}</strong></p>
  </div>
</body>
</html>
`;
