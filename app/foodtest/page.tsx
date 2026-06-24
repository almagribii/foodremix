import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifikasi - Foodremix",
  description:
    "Halaman ini berisi informasi tentang notifikasi yang diperoleh oleh para pengguna",
};

export default function NotifPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F3]">
      <h1 className="text-2xl font-bold text-zinc-800 mb-4">Notifikasi</h1>
      <p className="text-zinc-600 text-center">
        Halaman ini berisi informasi tentang notifikasi yang diperoleh oleh para
        pengguna.
      </p>
    </div>
  );
}
