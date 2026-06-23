import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monster Junk",
  description:
    "Game edukatif Monster Junk di Paham untuk bermain fokus tanpa gangguan navigasi publik.",
};

export default function MonsterJunkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}