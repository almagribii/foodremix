import type { Metadata } from "next";
import PremiumEcosystemUnified from "./components/TentangPage";

export const metadata: Metadata = {
  title: "Tentang - Foodremix",
  description:
    "Halaman ini berisi informasi tentang Foodremix dan misi kami untuk membantu pengguna dalam meracik menu makanan dari sisa kulkas mereka.",
};

export default function NotifPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F3]">
      <PremiumEcosystemUnified />
    </div>
  );
}
