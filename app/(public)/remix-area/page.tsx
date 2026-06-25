import type { Metadata } from "next";
import RemixAreaPage from "./components/TestPage";

export const metadata: Metadata = {
  title: "Notifikasi - Foodremix",
  description:
    "Halaman ini berisi informasi tentang notifikasi yang diperoleh oleh para pengguna",
};

export default function NotifPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F3]">
      <RemixAreaPage />
    </div>
  );
}
