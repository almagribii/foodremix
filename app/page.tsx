import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer"; // Import footer baru

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans antialiased text-[#1A1A1A]">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>

      {/* Footer elegan baru menggantikan susunan footer lama */}
      <Footer />
    </div>
  );
}