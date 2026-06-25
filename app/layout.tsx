import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Foodremix | Multimodal AI Kitchen & P2P Zero-Waste Network",
    template: "%s | Foodremix",
  },

  description:
    "Foodremix adalah platform penyelamatan pangan berbasis Gemini AI Multimodal dan sirkuit logistik P2P terdekat. Pindai isi kulkas lewat webcam, racik menu gizi hemat anggaran, tekan emisi karbon, dan bagikan surplus pangan ke warga sekitar.",

  keywords: [
    "Foodremix",
    "AI Kulkas",
    "Gemini AI Kuliner",
    "Zero Waste Food Indonesia",
    "Aplikasi SDGs Pangan",
    "Patungan Masak P2P",
    "Donasi Makanan Terdekat",
    "Smart Kitchen Dashboard",
  ],

  authors: [{ name: "Brucad Al Magribi", url: "https://github.com/almagribi" }],
  creator: "Brucad Al Magribi",

  openGraph: {
    title: "Foodremix — Racik Bahan Sisa Kulkas via AI & Berbagi P2P Terdekat",
    description:
      "Ubah bahan sisa kulkas menjadi menu masakan bernutrisi tinggi. Deteksi radar live warga terdekat untuk donasi pangan gratis atau patungan belanja dapur hemat demi menekan angka food waste.",
    url: "https://foodremix.vercel.app", // Sesuaikan dengan domain deployment kamu nanti
    siteName: "Foodremix Ecosystem",
    images: [
      {
        url: "https://foodremix.vercel.app/og-banner.png", // Taruh file banner rasio 1.91:1 di folder /public
        width: 1200,
        height: 630,
        alt: "Foodremix Aesthetic Minimalist Dashboard Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },


  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
