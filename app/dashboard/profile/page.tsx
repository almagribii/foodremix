import type { Metadata } from "next";
import ProfilePage from "./components/ProfilePage";

export const metadata: Metadata = {
  title: "Profile - Foodremix",
  description:
    "Halaman ini berisi tentang informasi pengguna",
};

export default function NotifPage() {
  return <ProfilePage />;
}
