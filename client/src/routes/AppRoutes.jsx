import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Landing Page (Lazy Loaded)
const LandingPage = lazy(() => import('../pages/LandingPage'));

// Auth Pages (Lazy Loaded)
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Dashboard Pages (Lazy Loaded)
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const SubmitReport = lazy(() => import('../pages/dashboard/SubmitReport'));
const MyReports = lazy(() => import('../pages/dashboard/MyReports'));
const MyAttendance = lazy(() => import('../pages/dashboard/MyAttendance'));
const MyLeaves = lazy(() => import('../pages/dashboard/MyLeaves'));
const AssignedTasks = lazy(() => import('../pages/dashboard/AssignedTasks'));
const NoticesPage = lazy(() => import('../pages/dashboard/NoticesPage'));
const NotificationsPage = lazy(() => import('../pages/dashboard/NotificationsPage'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));

// Payment & Billing Pages (Lazy Loaded)
const BillingPage = lazy(() => import('../pages/dashboard/BillingPage'));
const PaymentHistory = lazy(() => import('../pages/dashboard/PaymentHistory'));
const PaymentSuccess = lazy(() => import('../pages/dashboard/PaymentSuccess'));
const PaymentFailed = lazy(() => import('../pages/dashboard/PaymentFailed'));
const InvoicePage = lazy(() => import('../pages/dashboard/InvoicePage'));

// Admin Dashboard Pages (Lazy Loaded)
const EmployeeManagement = lazy(() => import('../pages/dashboard/EmployeeManagement'));
const DepartmentsPage = lazy(() => import('../pages/dashboard/DepartmentsPage'));
const AllReportsPage = lazy(() => import('../pages/dashboard/AllReportsPage'));
const AllAttendancePage = lazy(() => import('../pages/dashboard/AllAttendancePage'));
const LeaveRequestsPage = lazy(() => import('../pages/dashboard/LeaveRequestsPage'));
const TasksManagementPage = lazy(() => import('../pages/dashboard/TasksManagementPage'));
const AnalyticsPage = lazy(() => import('../pages/dashboard/AnalyticsPage'));
// Super Admin Dedicated Pages (Lazy Loaded)
const SuperAdminDashboard = lazy(() => import('../pages/super-admin/SuperAdminDashboard'));
const SuperAdminCompanies = lazy(() => import('../pages/super-admin/SuperAdminCompanies'));
const SuperAdminCompanyAdmins = lazy(() => import('../pages/super-admin/SuperAdminCompanyAdmins'));
const SuperAdminEmployees = lazy(() => import('../pages/super-admin/SuperAdminEmployees'));
const SuperAdminSubscriptions = lazy(() => import('../pages/super-admin/SuperAdminSubscriptions'));
const SuperAdminSubscriptionPlans = lazy(() => import('../pages/super-admin/SuperAdminSubscriptionPlans'));
const SuperAdminPayments = lazy(() => import('../pages/super-admin/SuperAdminPayments'));
const SuperAdminRevenue = lazy(() => import('../pages/super-admin/SuperAdminRevenue'));
const SuperAdminPlatformAnalytics = lazy(() => import('../pages/super-admin/SuperAdminPlatformAnalytics'));
const SuperAdminAuditLogs = lazy(() => import('../pages/super-admin/SuperAdminAuditLogs'));
const SuperAdminCustomerSupport = lazy(() => import('../pages/super-admin/SuperAdminCustomerSupport'));
const CompanyAdminSupportPage = lazy(() => import('../pages/dashboard/CompanyAdminSupportPage'));

import SuperAdminLayout from '../layouts/SuperAdminLayout';
import CompanyAdminLayout from '../layouts/CompanyAdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen label="Loading ReportPulse..." />}>
      <Routes>
        {/* Public SaaS Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/super-admin/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* 1. Super Admin Protected Routes (/super-admin/*) */}
        <Route element={<ProtectedRoute allowedRoles={['Super Admin']} />}>
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="companies" element={<SuperAdminCompanies />} />
            <Route path="company-admins" element={<SuperAdminCompanyAdmins />} />
            <Route path="employees" element={<SuperAdminEmployees />} />
            <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
            <Route path="subscription-plans" element={<SuperAdminSubscriptionPlans />} />
            <Route path="payments" element={<SuperAdminPayments />} />
            <Route path="revenue" element={<SuperAdminRevenue />} />
            <Route path="platform-analytics" element={<SuperAdminPlatformAnalytics />} />
            <Route path="customer-support" element={<SuperAdminCustomerSupport />} />
            <Route path="support" element={<SuperAdminCustomerSupport />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="audit-logs" element={<SuperAdminAuditLogs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* 2. Company Admin Protected Routes (/dashboard/*) */}
        <Route element={<ProtectedRoute allowedRoles={['Company Admin', 'Admin']} />}>
          <Route path="/dashboard" element={<CompanyAdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance" element={<AllAttendancePage />} />
            <Route path="reports" element={<AllReportsPage />} />
            <Route path="leaves" element={<LeaveRequestsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="tasks" element={<TasksManagementPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="support" element={<CompanyAdminSupportPage />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-failed" element={<PaymentFailed />} />
            <Route path="invoices/:id" element={<InvoicePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* 3. Employee Protected Routes (/employee/*) */}
        <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="reports" element={<MyReports />} />
            <Route path="reports/submit" element={<SubmitReport />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="leaves" element={<MyLeaves />} />
            <Route path="tasks" element={<AssignedTasks />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
