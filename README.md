# 🚀 ReportPulse – Enterprise Employee Daily Reporting System

<div align="center">

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Under%20Development-orange)

### Enterprise Multi-Tenant SaaS Employee Management Platform

Manage employees, attendance, daily reports, tasks, departments, subscriptions and analytics with a secure multi-tenant architecture.

</div>

---

# 📌 Overview

**ReportPulse** is a modern **Enterprise Multi-Tenant SaaS Employee Daily Reporting System** built with the **MERN Stack**.

The platform enables organizations to manage their workforce, attendance, daily reporting, leave requests, departments, subscriptions, and analytics from a centralized dashboard.

The application follows a **role-based architecture** with complete tenant isolation to ensure every organization has its own secure workspace.

---

# ✨ Features

## 🌐 Public Landing Page

- Modern Enterprise Landing Page
- Responsive Design
- Dark / Light Theme
- Dynamic Pricing Plans
- Contact Us
- Book Demo
- FAQ
- Smooth Animations
- Product Showcase

---

# 👑 Super Admin Portal

Platform Owner Dashboard

### Features

- Platform Analytics
- Company Management
- Subscription Management
- Revenue Analytics
- Payment Monitoring
- Customer Support Center
- Public Contact Management
- Notifications
- Audit Logs
- Platform Settings
- Profile Management

Super Admin has access to every registered company but cannot perform company-specific operations.

---

# 🏢 Company Admin Portal

Each company receives its own isolated workspace.

### Features

- Dashboard
- Employee Management
- Attendance Management
- Daily Reports
- Leave Management
- Department Management
- Task Management
- Analytics
- Billing & Subscription
- Company Settings
- Support Center

Every company can access only its own data.

---

# 👨‍💼 Employee Portal

Employees receive credentials from the Company Admin.

### Features

- Dashboard
- Attendance
- Daily Reports
- Leave Requests
- Tasks
- Notices
- Notifications
- Profile Management

Employees can only access their own workspace.

---

# 💳 SaaS Subscription System

- Free Trial
- Starter Plan
- Professional Plan
- Enterprise Plan

Dynamic pricing is managed directly from the Super Admin Dashboard.

No hardcoded plans.

---

# 💬 Customer Support System

## Public Contact

Visitors can contact the platform directly from the landing page.

Support tickets are visible in the Super Admin Support Center.

---

## Company Support

Company Admins can create support tickets directly from their dashboard.

Features

- Ticket System
- Live Conversation
- Ticket History
- Priority Management
- Status Tracking
- Attachments

---

# 🔐 Authentication

- JWT Authentication
- HTTP Only Cookies
- Refresh Token
- Role Based Access Control
- Protected Routes

---

# 🏗 Multi-Tenant Architecture

The application follows a true multi-tenant SaaS architecture.

```
Super Admin
        │
        ├──────────────┐
        │              │
        ▼              ▼

Company A         Company B

   │                  │

Employees       Employees

Attendance      Attendance

Reports         Reports

Tasks           Tasks

Departments     Departments

```

Each company has a completely isolated database workspace.

---

# 🛡 Security

- JWT Authentication
- HTTP Only Cookies
- Tenant Isolation
- Role Based Authorization
- Protected APIs
- Helmet
- Rate Limiting
- MongoDB Sanitization
- Input Validation
- Audit Logs

---

# ⚙ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- TanStack Query
- React Hook Form
- Axios

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Cookie Parser

---

## Database

- MongoDB Atlas

---

## Payment

- Razorpay (Test Mode)

---

## Deployment

- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

---

# 📂 Project Structure

```
ReportPulse/

├── client/
│
├── server/
│
├── docs/
│
└── README.md
```

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/your-username/reportpulse.git
```

## Frontend

```bash
cd client
npm install
npm run dev
```

## Backend

```bash
cd server
npm install
npm run dev
```

---

# 🔑 Environment Variables

Backend

```env
PORT=

MONGODB_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

CLIENT_URL=

COOKIE_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

Frontend

```env
VITE_API_URL=
```

---

# 📸 Screenshots

> Screenshots and demo GIFs will be added soon.

---

# 🗺 Roadmap

- [x] Multi-Tenant Authentication
- [x] Super Admin Dashboard
- [x] Company Admin Dashboard
- [x] Employee Dashboard
- [x] Dynamic Subscription Plans
- [x] Customer Support Center
- [x] Contact Management
- [x] Billing Module
- [x] Razorpay Integration
- [ ] Google OAuth
- [ ] Real-Time Chat
- [ ] Mobile App
- [ ] AI Analytics
- [ ] Email Notifications
- [ ] WebSocket Notifications

---

# 📈 Current Status

This project is currently under active development.

Core architecture has been completed.

Some enterprise modules are still being enhanced before production deployment.

---

# 👨‍💻 Author

**Injamamul Hoque**

B.Tech – Computer Science & Engineering (AI & ML)

MERN Stack Developer

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you like this project, consider giving it a Star on GitHub!