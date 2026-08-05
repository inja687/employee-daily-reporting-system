import { motion } from 'framer-motion';

const logos = [
  { name: 'Acme Corp', symbol: '▲ ACME' },
  { name: 'NovaTech', symbol: '◆ NOVATECH' },
  { name: 'GlobalCorp', symbol: '● GLOBALCORP' },
  { name: 'Apex Dynamics', symbol: '■ APEX' },
  { name: 'Horizon SaaS', symbol: '◈ HORIZON' },
  { name: 'Vertex Systems', symbol: '▲ VERTEX' },
  { name: 'Nexus Cloud', symbol: '❖ NEXUS' },
  { name: 'Starlight Tech', symbol: '★ STARLIGHT' },
];

const TrustedBySection = () => {
  return (
    <section className="py-16 bg-slate-950 border-y border-slate-800/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          TRUSTED BY HIGH-PERFORMING ENTERPRISE TEAMS GLOBALLY
        </p>
      </div>

      {/* Infinite Logo Marquee Scroller */}
      <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <div className="flex space-x-12 animate-marquee whitespace-nowrap py-2">
          {[...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 text-slate-400 hover:text-white font-extrabold text-sm sm:text-base tracking-wider transition-colors cursor-pointer px-4"
            >
              <span className="text-blue-400 font-mono">{logo.symbol}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
