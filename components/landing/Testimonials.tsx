"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-24 bg-[#FBFBFA] border-t border-stone-200/30">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-center text-3xl font-black tracking-tight text-stone-800">
          Disukai Anak Kost
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((item, idx) => (
            <motion.div
              key={item}
              className="bg-white border border-stone-200/40 rounded-[28px] p-8 shadow-sm text-center flex flex-col items-center justify-between"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-stone-500 font-medium leading-relaxed text-xs sm:text-sm italic">
                "Foodremix beneran ngebantu hemat pengeluaran bulanan. Resep AI-nya praktis dan pas sama bahan sisa."
              </p>

              <div className="mt-6 flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-[#a17e26] flex items-center justify-center font-bold text-[10px] shadow-inner">
                  A
                </div>
                <h4 className="font-bold text-xs text-stone-700">Anak Kost Aktif</h4>
                <p className="text-[10px] font-medium text-stone-400">Bandung, Indonesia</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}