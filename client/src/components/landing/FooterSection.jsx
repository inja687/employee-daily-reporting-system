import { Link } from 'react-router-dom';
import { FiShield, FiHeart } from 'react-icons/fi';

const FooterSection = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-black text-white text-sm">
                RP
              </div>
              <span className="text-xl font-extrabold text-white">ReportPulse</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              Enterprise Multi-Tenant Employee Daily Reporting System. Operational transparency, attendance audit trails, and productivity analytics for modern companies.
            </p>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • 99.99% SLA Uptime</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Dynamic Pricing</a></li>
              <li><a href="#workflow" className="hover:text-white transition-colors">SaaS Workflow</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#faq" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">API References</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">System Uptime</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Security Controls</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Legal & Security</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#gdpr" className="hover:text-white transition-colors">GDPR & Isolation</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Multi-Tenant Audit</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ReportPulse Enterprise SaaS. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted for high-performing modern teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
