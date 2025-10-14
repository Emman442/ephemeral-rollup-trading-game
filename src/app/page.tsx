import { Footer } from '@/components/landing/Footer';
import { GameList } from '@/components/landing/GameList';
import { Hero } from '@/components/landing/Hero';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col">
        <Hero />
        <GameList />
      </main>
      <Footer />
    </div>
  );
}
