"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mx-4 sm:mx-6 lg:mx-8 mb-6 p-5 bg-white border border-zinc-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-2">
        <Image
          src="/logo-trans.png"
          alt="FoodRemix Logo"
          width={20}
          height={20}
          className="object-contain"
        />
        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-800">
          FoodRemix{" "}
          <span className="text-zinc-400 font-medium">· Platform</span>
        </div>
      </div>

      <div className="text-[9px] text-zinc-400 font-black uppercase tracking-widest text-center sm:text-right">
        &copy; {new Date().getFullYear()} FOODREMIX TEAM. ALL RIGHTS
        RESERVED.
      </div>
    </footer>
  );
}
