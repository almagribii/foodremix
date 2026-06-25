import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Tentang from "@/components/landing/Tentang";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda - Foodremix",
  description:
    "Foodremix adalah platform penyelamatan pangan berbasis AI Multimodal. Pindai isi kulkas lewat webcam, racik menu gizi hemat anggaran, tekan emisi karbon.",
  openGraph: {
    title: "Foodremix — Racik Bahan Sisa Kulkas via AI",
    description:
      "Foodremix adalah platform penyelamatan pangan berbasis AI Multimodal. Pindai isi kulkas lewat webcam, racik menu gizi hemat anggaran, tekan emisi karbon.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans antialiased text-[#1A1A1A]">
      
      <main>
        <Hero />
        <Features />
        <Tentang />
      </main>

    </div>
  );
}