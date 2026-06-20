"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-20 bg-[#FBFBFA]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          className="relative bg-gradient-to-b from-white to-[#F5F5F3] border border-stone-200/50 rounded-[40px] p-10 md:p-16 text-center overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Semburan gradasi ambient super soft */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#EAB308]/5 rounded-full blur-[70px] pointer-events-none" />
          
          <div className="relative z-10 max-w-md mx-auto space-y-6 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#a17e26] leading-tight">
              Siap Hemat Pengeluaran Makan?
            </h2>

            <p className="text-xs sm:text-sm text-stone-400 font-medium leading-relaxed">
              Mulai gunakan Foodremix sekarang secara gratis. <br />
              Campurn AI premium untuk anak kost, hemat budget dan eco-friendly.
            </p>

            <button className="bg-white text-amber-800 border border-amber-500/20 px-8 py-3.5 rounded-full font-bold shadow-md shadow-amber-500/[0.02] hover:bg-amber-50 hover:border-amber-500/50 transition-all duration-300 text-xs">
              Mulai Gratis
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}