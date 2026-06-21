"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react"; // Globe tetap aman karena selalu ada di semua versi

export default function Footer() {
  return (
    <footer className="relative bg-[#FBFBFA] border-t border-stone-200/60 pt-20 pb-10 overflow-hidden select-none">
      
      {/* BACKGROUND PATTERN BATIK MINI */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] select-none z-0"
        style={{
          backgroundImage: "url('/bg-pattern.jpeg')", 
          backgroundRepeat: "repeat",
          backgroundSize: "240px auto", 
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* GRID UTAMA FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-stone-200/60">
          
          {/* KOLOM 1: BRANDING */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-[#a17e26] text-sm">✦</span>
              <span className="font-serif italic font-normal text-xl tracking-tight text-stone-800">
                Food<span className="font-extrabold text-[#c29b38] not-italic">remix</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 font-medium leading-relaxed max-w-xs">
              Platform berbasis AI untuk menciptakan mahakarya kuliner hemat budget dari sisa bahan makanan di kulkas kosanmu.
            </p>
          </div>

          {/* KOLOM 2: NAVIGATION */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Navigasi</h4>
            <ul className="space-y-2.5">
              {["Beranda", "Fitur", "Testimoni", "Harga"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-xs font-semibold text-stone-500 hover:text-[#c29b38] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM 3: LEGALITAS */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-2.5">
              {["Kebijakan Privasi", "Syarat & Ketentuan", "Pedoman Komunitas", "Kontak Kami"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs font-semibold text-stone-500 hover:text-[#c29b38] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM 4: SOSIAL MEDIA (MENGGUNAKAN INLINE SVG MURNI) */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Ikuti Kami</h4>
            <p className="text-xs text-stone-400 font-medium">Tetap terhubung dengan pembaruan resep kreatif komunitas kami.</p>
            <div className="flex items-center gap-3 pt-1">
              
              {/* Instagram */}
              <a href="#" className="p-2.5 rounded-xl border border-stone-200 bg-white/50 text-stone-500 hover:text-[#c29b38] hover:border-amber-500/30 hover:bg-white transition-all shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Twitter / X */}
              <a href="#" className="p-2.5 rounded-xl border border-stone-200 bg-white/50 text-stone-500 hover:text-[#c29b38] hover:border-amber-500/30 hover:bg-white transition-all shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>

              {/* Github */}
              <a href="#" className="p-2.5 rounded-xl border border-stone-200 bg-white/50 text-stone-500 hover:text-[#c29b38] hover:border-amber-500/30 hover:bg-white transition-all shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              {/* Website / Globe */}
              <a href="#" className="p-2.5 rounded-xl border border-stone-200 bg-white/50 text-stone-500 hover:text-[#c29b38] hover:border-amber-500/30 hover:bg-white transition-all shadow-sm">
                <Globe size={16} />
              </a>

            </div>
          </div>

        </div>

        {/* BARIS BAWAH: COPYRIGHT */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 text-[11px] font-semibold text-stone-400">
          <p>&copy; {new Date().getFullYear()} Foodremix. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-1 text-stone-300">
            <span>Premium Dapur Ecosystem</span>
            <span className="text-[#c29b38] text-[8px] ml-1">✦</span>
          </div>
        </div>

      </div>
    </footer>
  );
}