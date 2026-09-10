import Navbar from '../../components/landing/Navbar';
import Pricing from '../../components/landing/Pricing';
import { Footer } from '../../components/landing/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] overflow-x-hidden">
      <Navbar />
      <main className="pt-24">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
