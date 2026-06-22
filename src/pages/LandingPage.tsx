import Navbar from '../components/landing/Navbar';
import {
  HeroSection,
  TrustedCompanies,
  RecruiterFeatures,
  CandidateFeatures,
  ATSShowcase,
  AIInterviewShowcase,
  AnalyticsShowcase,
  HowItWorks,
  Testimonials,
  FAQ
} from '../components/landing/MidLandingComponents';
import Pricing from '../components/landing/Pricing';
import { FinalCTA, Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedCompanies />
        <RecruiterFeatures />
        <CandidateFeatures />
        <ATSShowcase />
        <AIInterviewShowcase />
        <AnalyticsShowcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
