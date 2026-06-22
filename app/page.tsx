import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer"; 
import Tentang from "@/components/landing/Tentang";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans antialiased text-[#1A1A1A]">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <Tentang />
      </main>

      {/* Footer elegan baru menggantikan susunan footer lama */}
      <Footer />
    </div>
  );
}