import Navbar from '../../components/landing/Navbar';
import {
  HeroSection,
  TrustedCompanies,
  HowItWorks
} from '../../components/landing/MidLandingComponents';
import { FinalCTA, Footer } from '../../components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedCompanies />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
