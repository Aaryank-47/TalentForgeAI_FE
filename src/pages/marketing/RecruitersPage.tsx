import Navbar from '../../components/landing/Navbar';
import {
  RecruiterFeatures,
  ATSShowcase,
  AnalyticsShowcase
} from '../../components/landing/MidLandingComponents';
import { Footer } from '../../components/landing/Footer';

export default function RecruitersPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] overflow-x-hidden">
      <Navbar />
      <main className="pt-24">
        <RecruiterFeatures />
        <ATSShowcase />
        <AnalyticsShowcase />
      </main>
      <Footer />
    </div>
  );
}
