"use client";

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    ["12K+", "Menu Dihasilkan"],
    ["4.5K+", "Pengguna Aktif"],
    ["85%", "Kurangi Limbah"],
    ["Rp1.2JT", "Budget Tersimpan"],
  ];

  return (
    <section id="statistik" className="py-12 bg-[#FBFBFA]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-b from-white to-[#F5F5F3] rounded-[32px] p-2 border border-stone-200/40 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            {stats.map(([value, label], idx) => (
              <motion.div
                key={label}
                className="py-8 px-4 rounded-[24px] hover:bg-white hover:shadow-md hover:shadow-amber-500/[0.02] transition-all duration-300"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-2xl sm:text-3xl font-black text-[#a17e26] tracking-tight">
                  {value}
                </h3>
                <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-1.5">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}