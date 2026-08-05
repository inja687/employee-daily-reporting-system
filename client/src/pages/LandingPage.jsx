import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import DeviceMockupShowcase from '../components/landing/DeviceMockupShowcase';
import TrustedBySection from '../components/landing/TrustedBySection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WhyUsSection from '../components/landing/WhyUsSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import StatsSection from '../components/landing/StatsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import ContactSection from '../components/landing/ContactSection';
import FaqSection from '../components/landing/FaqSection';
import CtaSection from '../components/landing/CtaSection';
import FooterSection from '../components/landing/FooterSection';
import { FiBriefcase, FiGrid, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  const { user } = useAuth();

  const companyName =
    user?.companyId?.companyName ||
    user?.companyName ||
    (user?.role === 'Company Admin' ? 'My Company Workspace' : '');

  const dashboardTarget =
    user?.role === 'Super Admin'
      ? '/super-admin/dashboard'
      : user?.role === 'Employee'
      ? '/employee/dashboard'
      : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-white">
      {/* 1. Sticky Enterprise Navbar */}
      <Navbar />

      {/* Authenticated Workspace Shortcut Hero Banner */}
      {user && (
        <div className="pt-28 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-blue-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                <FiBriefcase />
                <span>Active User Session</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">{user.name}</span>!
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                You are currently logged into <strong className="text-white">{companyName || 'ReportPulse Platform'}</strong> as <span className="text-blue-400 font-semibold">{user.role}</span>.
              </p>
            </div>

            <Link
              to={dashboardTarget}
              className="px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 group"
            >
              <FiGrid />
              <span>Go to {user.role} Dashboard</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Multi-Device Mockup Showcase */}
      <DeviceMockupShowcase />

      {/* 4. Trusted By Logo Marquee */}
      <TrustedBySection />

      {/* 5. Features Grid */}
      <FeaturesSection />

      {/* 6. Why Choose ReportPulse */}
      <WhyUsSection />

      {/* 8. Workflow Timeline */}
      <WorkflowSection />

      {/* 9. Key Statistics Counters */}
      <StatsSection />

      {/* 10. Testimonials */}
      <TestimonialsSection />

      {/* 11. Dynamic MongoDB Pricing Cards & Compare Table */}
      <PricingSection />

      {/* 12. FAQ Accordion */}
      <FaqSection />

      {/* 13. Contact Us Split-Screen Glass Section */}
      <ContactSection />

      {/* 14. Bottom CTA Banner (Only for unauthenticated visitors) */}
      {!user && <CtaSection />}

      {/* 15. Enterprise Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
