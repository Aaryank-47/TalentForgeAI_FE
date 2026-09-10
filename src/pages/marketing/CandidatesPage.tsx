import Navbar from '../../components/landing/Navbar';
import {
  CandidateFeatures,
  AIInterviewShowcase
} from '../../components/landing/MidLandingComponents';
import { Footer } from '../../components/landing/Footer';

export default function CandidatesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] overflow-x-hidden">
      <Navbar />
      <main className="pt-24">
        <CandidateFeatures />
        <AIInterviewShowcase />
      </main>
      <Footer />
    </div>
  );
}
