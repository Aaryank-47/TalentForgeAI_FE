import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Check } from 'lucide-react';
import { pricingContent } from '../../constants/landing/landingContent';

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const { plans, enterpriseLogos } = pricingContent;

  return (
    <section id="pricing" className="py-28 bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#2563EB] text-[12px] font-bold uppercase tracking-wider mb-5">
            <Briefcase className="w-3.5 h-3.5" /> {pricingContent.badge}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-display font-extrabold text-[#0F172A] leading-tight mb-4">
            {pricingContent.headline1}<br /><span className="text-[#2563EB]">{pricingContent.headline2}</span>
          </h2>
          <p className="text-[16px] text-slate-500 mb-8">{pricingContent.subheadline}</p>

          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${!annual ? 'bg-white shadow-sm text-[#0F172A]' : 'text-slate-500'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-[#0F172A]' : 'text-slate-500'}`}>
              Annual
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-[24px] p-8 flex flex-col transition-all duration-300 ${plan.highlight
                ? 'bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] shadow-2xl shadow-blue-200/50 ring-2 ring-[#2563EB]'
                : 'bg-white border border-slate-100 shadow-sm hover:shadow-lg'
                }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-[18px] font-display font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{plan.name}</h3>
                <p className={`text-[13px] mb-5 ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>{plan.desc}</p>
                <div className="flex items-end gap-1">
                  {plan.priceLabel ? (
                    <span className={`text-[36px] font-black leading-none ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{plan.priceLabel}</span>
                  ) : (
                    <>
                      <span className={`text-[36px] font-black leading-none ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className={`text-[13px] mb-1 ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>/mo</span>
                    </>
                  )}
                </div>
                {!plan.priceLabel && annual && (
                  <div className={`text-[11px] mt-1 ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                    Billed annually (${((annual ? plan.annualPrice! : plan.monthlyPrice!) * 12)}/yr)
                  </div>
                )}
              </div>

              <Link
                to={plan.ctaLink}
                className={`w-full py-3 rounded-[12px] font-bold text-[14px] text-center transition-all mb-8 block ${plan.highlight
                  ? 'bg-white text-[#2563EB] hover:bg-blue-50 shadow-md'
                  : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-md shadow-blue-200/40'
                  }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3 flex-1">
                <p className={`text-[11px] font-bold uppercase tracking-wide ${plan.highlight ? 'text-blue-300' : 'text-slate-400'}`}>
                  {i === 0 ? "What's included" : i === 1 ? 'Everything in Starter, plus:' : 'Everything in Pro, plus:'}
                </p>
                {plan.features.map((f, fi) => (
                  <div key={fi} className="flex items-start gap-2.5">
                    <div className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-blue-300' : 'text-emerald-500'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-[13px] ${plan.highlight ? 'text-blue-100' : 'text-slate-600'}`}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[12px] text-slate-400 mb-4">Enterprise customers include</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            {enterpriseLogos.map(n => (
              <span key={n} className="font-display font-bold text-[15px] text-slate-600">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
