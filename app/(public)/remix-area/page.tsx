import type { Metadata } from "next";
import RemixAreaPage from "./components/TestPage";

export const metadata: Metadata = {
  title: "Remix Area Test - Foodremix",
  description:
    "Halaman ini berisi informasi tentang remix area test yang akan dilakukakan oleh para pengguna",
};

export default function NotifPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F3]">
      <RemixAreaPage />
    </div>
  );
}
