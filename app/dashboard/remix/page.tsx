import type { Metadata } from "next";
import RemixAreaPage from "./components/RemixPage";

export const metadata: Metadata = {
  title: "Remix Area - Foodremix",
  description:
    "Halaman ini berisi tentang fitur utama Foodremix",
};

export default function NotifPage() {
  return <RemixAreaPage />;
}
