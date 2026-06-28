"use client";

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";

const benefits = [
  "Pindai sisa kulkas via Webcam / Foto",
  "Racik resep kreatif hemat anggaran",
  "Aman dari riwayat penyakit & alergi",
  "Pantau rekam gizi & metrik SDGs harian",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const CTASection = () => {
  return (
    <section className="relative pb-24 px-4 overflow-hidden bg-[#f5f5f3]">
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
          className="backdrop-blur-xl bg-white/80 rounded-[2rem] border-2 border-[#1a1a1a]/10 shadow-2xl shadow-[#1a1a1a]/5 p-8 md:p-12 lg:p-16 text-[#1a1a1a]"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block px-4 py-2 bg-[#eab308]/15 rounded-full text-sm font-semibold text-[#eab308] dark:text-amber-600 mb-6"
              >
                🌱 Jadilah Agen Perubahan Zero-Waste
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight text-[#1a1a1a]"
              >
                Ubah bahan sisa jadi{" "}
                <span
                  className="bg-gradient-to-r from-[#1a1a1a] via-[#eab308] to-[#1a1a1a] bg-clip-text text-transparent animate-gradient-shift"
                  style={{ backgroundSize: "200%" }}
                >
                  hidangan lezat
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-gray-600 mb-8"
              >
                Selamatkan pangan domestik dan pangkas dana belanja bulanan
                lewat bantuan AI Multimodal, rekam gizi otomatis, dan game
                edukasi interaktif.
              </motion.p>

              <motion.ul
                variants={containerVariants}
                className="space-y-4 mb-8"
              >
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#eab308]/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#eab308]" />
                    </div>
                    <span className="text-[#1a1a1a] font-medium">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <Link href="/login">
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button variant="accent" size="lg">
                    Racik Menu Sekarang
                  </Button>
                </motion.div>
              </Link>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-sm text-gray-500 mt-4"
              >
                ✨ Kurangi Jejak Karbon • Jaga Kesehatan Tubuh
              </motion.p>
            </div>

            <motion.div variants={containerVariants} className="space-y-6">
              {[
                {
                  value: "AI Vision",
                  label: "Deteksi instan kondisi kesegaran pangan baku",
                  color: "from-[#1a1a1a] to-[#eab308]",
                },
                {
                  value: "2 Mode",
                  label:
                    "Remix masakan kulkas & Deteksi tutorial menu hidangan",
                  color: "from-[#eab308] to-amber-600",
                },
                {
                  value: "SDGs Match",
                  label:
                    "Kalkulasi riil dana belanja & jejak karbon karbon harian",
                  color: "from-[#1a1a1a] to-gray-600",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group backdrop-blur-sm bg-white/60 rounded-2xl p-6 border border-[#1a1a1a]/5 lg:hover:border-[#eab308]/50 transition-all duration-300 lg:hover:scale-105 lg:hover:shadow-lg lg:hover:shadow-[#eab308]/5"
                >
                  <div
                    className={`text-3xl font-bold mb-2 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
