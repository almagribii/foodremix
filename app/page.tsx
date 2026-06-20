import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans antialiased text-[#1A1A1A]">
      <Navbar />
      
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <CTA />
      </main>

      <footer className="bg-white border-t border-black/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center text-xs text-slate-400 font-medium">
          <p>&copy; 2026 Foodremix. Campur Bahan Sisa, Hemat Isi Dompet.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1A1A1A] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#1A1A1A] transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}