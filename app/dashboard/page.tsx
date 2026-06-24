import type { Metadata } from "next";
import DashboardPage from "./components/DashboarPage";

export const metadata: Metadata = {
  title: "Dashboard - Foodremix",
  description:
    "Halaman ini berisi informasi tentang seluruh kegiatan para pengguna",
};

export default function NotifPage() {
  return <DashboardPage />;
}
