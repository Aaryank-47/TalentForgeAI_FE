import Navbar from '../../components/landing/Navbar';
import {
  Testimonials,
  FAQ
} from '../../components/landing/MidLandingComponents';
import { Footer } from '../../components/landing/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] overflow-x-hidden">
      <Navbar />
      <main className="pt-24">
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
