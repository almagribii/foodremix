"use client";

import Image from "next/image";

export default function Footer() {
  // Fungsi smooth scroll yang diselaraskan dengan Navbar
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 64; // Menyesuaikan tinggi sticky navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-[#FBFBFA] border-t border-stone-200/50 py-12 px-6 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* KIRI: BRAND LOGO & TEXT */}
        <div className="flex gap-2.5 items-center">
          <div className="w-6 h-6 relative rounded-lg overflow-hidden border border-stone-200/80 shadow-xs">
            <Image 
              src="/favicon.ico" 
              alt="Foodremix Logo" 
              fill
              className="object-cover"
            />
          </div>
          <span className="font-serif italic font-normal text-base tracking-tight text-stone-700">
            Food<span className="font-extrabold text-[#a17e26] not-italic">remix</span>
          </span>
        </div>

        {/* TENGAH: LINK NAVIGASI MINIMALIS */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-bold tracking-widest text-stone-400">
          <a 
            href="#fitur" 
            onClick={(e) => handleScroll(e, "fitur")}
            className="hover:text-[#a17e26] transition-colors duration-200 uppercase cursor-pointer"
          >
            Beranda
          </a>
          <a 
            href="#cara-kerja" 
            onClick={(e) => handleScroll(e, "cara-kerja")}
            className="hover:text-[#a17e26] transition-colors duration-200 uppercase cursor-pointer"
          >
            RemixAI
          </a>
          <a 
            href="#testimoni" 
            onClick={(e) => handleScroll(e, "testimoni")}
            className="hover:text-[#a17e26] transition-colors duration-200 uppercase cursor-pointer"
          >
            Tentang
          </a>
        </div>

        {/* KANAN: COPYRIGHT */}
        <p className="text-[11px] text-stone-400 font-medium tracking-tight">
          &copy; {new Date().getFullYear()} Foodremix. All rights reserved.
        </p>

      </div>
    </footer>
  );
}