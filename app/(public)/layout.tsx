import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import { Footer } from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <ChatbotWidget/>
      <Footer />
    </div>
  );
}
