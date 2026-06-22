import { Link } from 'react-router-dom';
import { Bot, ArrowRight, PlayCircle, Sparkles, Shield, Lock, Globe, Award } from 'lucide-react';
import { finalCTAContent, footerContent } from '../../constants/landing/landingContent';

const trustIconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-4 h-4" />,
  lock: <Lock className="w-4 h-4" />,
  globe: <Globe className="w-4 h-4" />,
  award: <Award className="w-4 h-4" />,
};

const footerTrustIconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-3.5 h-3.5" />,
  lock: <Lock className="w-3.5 h-3.5" />,
  globe: <Globe className="w-3.5 h-3.5" />,
};

// ─── Final CTA ────────────────────────────────────────────────────────────────

const FinalCTA = () => (
  <section className="py-24 bg-white">
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[32px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/[0.08] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/[0.03] rounded-full blur-2xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[13px] font-semibold mb-8 backdrop-blur-sm border border-white/15">
            <Sparkles className="w-4 h-4" />
            {finalCTAContent.badge}
          </div>

          <h2 className="text-[36px] md:text-[52px] font-display font-extrabold text-white leading-tight mb-6 max-w-3xl mx-auto">
            {finalCTAContent.headline1}<br />{finalCTAContent.headline2}
          </h2>
          <p className="text-blue-100/90 text-[17px] max-w-xl mx-auto mb-10 leading-relaxed">
            {finalCTAContent.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to={finalCTAContent.primaryCTA.href}
              className="group inline-flex items-center justify-center gap-2 bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-[16px] px-8 py-4 rounded-[14px] transition-all shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl"
            >
              {finalCTAContent.primaryCTA.label}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={finalCTAContent.secondaryCTA.href}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/15 font-semibold text-[16px] px-8 py-4 rounded-[14px] transition-all backdrop-blur-sm"
            >
              <PlayCircle className="w-5 h-5" />
              {finalCTAContent.secondaryCTA.label}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {finalCTAContent.trustBadges.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-blue-100/80 bg-white/[0.07] px-4 py-2 rounded-full text-[12px] font-medium backdrop-blur-sm border border-white/10">
                {trustIconMap[item.iconKey]}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer id="footer" className="bg-[#0F172A] text-white pt-16 pb-8">
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-[#2563EB] p-2 rounded-[10px]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-[18px] tracking-tight">TalentForge</span>
          </div>
          <p className="text-[13px] text-slate-400 leading-relaxed mb-5">{footerContent.tagline}</p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#2563EB] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.735-8.87L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#2563EB] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#2563EB] flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
          </div>
        </div>

        {footerContent.columns.map((col) => (
          <div key={col.heading}>
            <h4 className="font-semibold text-[12px] text-slate-400 uppercase tracking-wider mb-4">{col.heading}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-slate-400 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800">
        <p className="text-[12px] text-slate-500">{footerContent.copyright}</p>
        <div className="flex items-center gap-4">
          {footerContent.trustBadges.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[12px] text-slate-500">
              {footerTrustIconMap[item.iconKey]} {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export { FinalCTA, Footer };
export default Footer;
