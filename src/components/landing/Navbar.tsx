import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { FaRegUserCircle } from 'react-icons/fa';
import { RiBuilding4Line } from 'react-icons/ri';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import jobportal from '../../assets/jobportal_logo2.jpg';
import { navbarContent } from '../../constants/landing/landingContent';

// Map icon keys to actual components
const iconComponents: Record<string, React.ElementType> = {
  building: RiBuilding4Line,
  'user-circle': FaRegUserCircle,
  'currency-rupee': HiOutlineCurrencyRupee,
  'question-circle': AiOutlineQuestionCircle,
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-slate-100/80' : 'bg-transparent'}`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-[#0175b2] to-[#0175b2] p-2 rounded-[10px] shadow-md shadow-blue-200/50">
              <img src={jobportal} className="h-5 w-5 text-white" alt="TalentForge logo" />
            </div>
            <span className="font-display font-bold text-[20px] tracking-tight text-[#0F172A]">TalentForge<span className="text-[#2563EB]"> AI</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navbarContent.navItems.map((item) => {
              const Icon = iconComponents[item.iconKey];
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 text-[14px] font-medium text-slate-600 hover:text-[#2563EB] transition-colors px-4 py-2 rounded-lg hover:bg-blue-50/70"
                >
                  {Icon && <Icon className="h-5 w-5" />} {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to={navbarContent.ctaLoginPath} className="text-[14px] font-medium text-slate-600 hover:text-[#0F172A] transition-colors px-4 py-2">
              {navbarContent.ctaLoginLabel}
            </Link>
            <Link to={navbarContent.ctaRegisterPath} className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-all shadow-md shadow-blue-200/60 hover:-translate-y-0.5 flex items-center gap-2">
              {navbarContent.ctaRegisterLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-600 hover:text-[#0F172A] p-2">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 p-4 absolute w-full shadow-xl">
          <div className="flex flex-col gap-2">
            {navbarContent.mobileNavItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[15px] font-medium text-slate-600 px-4 py-3 rounded-lg hover:bg-slate-50" onClick={() => setIsOpen(false)}>
                {item}
              </a>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <Link to={navbarContent.ctaLoginPath} className="text-[15px] font-medium text-slate-600 px-4 py-3 rounded-lg" onClick={() => setIsOpen(false)}>{navbarContent.ctaLoginLabel}</Link>
            <Link to={navbarContent.ctaRegisterPath} className="bg-[#2563EB] text-white text-center font-semibold px-5 py-3 rounded-[10px]" onClick={() => setIsOpen(false)}>{navbarContent.ctaRegisterLabel}</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
