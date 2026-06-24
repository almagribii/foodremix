import type { Metadata } from "next";
import RekamGiziPage from "./components/JournalPage";

export const metadata: Metadata = {
  title: "Rekam Gizi - Foodremix",
  description:
    "Halaman ini berisi tentang pencatatan jurnal harian yang digunakan oleh para pengguna",
};

export default function NotifPage() {
  return <RekamGiziPage/>;
}
