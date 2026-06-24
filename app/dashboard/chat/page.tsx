import type { Metadata } from "next";
import RemixChatPage from "./components/ChatPage";

export const metadata: Metadata = {
  title: "Chatbot - Foodremix",
  description:
    "Halaman ini berisi tentang chatbot yang bisa digunakan oleh para pengguna",
};

export default function NotifPage() {
  return <RemixChatPage />;
}
