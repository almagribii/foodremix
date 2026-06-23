import type { Metadata } from "next";
import NotificationsPage from "./components/NotifPage";

export const metadata: Metadata = {
  title: "Notifikasi - Foodremix",
  description:
    "Halaman ini berisi informasi tentang notifikasi yang diperoleh oleh para pengguna",
};

export default function NotifPage() {
  return <NotificationsPage />;
}
