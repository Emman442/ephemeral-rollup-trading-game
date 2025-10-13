import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
