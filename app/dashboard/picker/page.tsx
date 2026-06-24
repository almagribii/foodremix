import type { Metadata } from "next";
import RemixPickerPage from "./components/PickerPage";

export const metadata: Metadata = {
  title: "Remix Picker - Foodremix",
  description:
    "Halaman ini berisi informasi tentang notifikasi yang diperoleh oleh para pengguna",
};

export default function NotifPage() {
  return <RemixPickerPage />;
}
