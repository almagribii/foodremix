"use client";

import { useState } from "react";

interface ShareLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (
    postType: "DONASI" | "PATUNGAN",
    title: string,
    description: string,
  ) => void;
}

export default function ShareLockModal({
  isOpen,
  onClose,
  onSubmitPost,
}: ShareLockModalProps) {
  const [postType, setPostType] = useState<"DONASI" | "PATUNGAN">("DONASI");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    onSubmitPost(postType, title, description);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white border border-zinc-200 rounded-[2rem] max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-[#1A1A1A] tracking-tight">
              Buka Antrean Remix Share
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium leading-normal">
              Bagikan kelebihan bahan makanan atau buka patungan belanja kuliner
              bareng warga.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-xl font-black p-1 transition"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipe Kategori */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black tracking-widest uppercase text-zinc-400 block">
              Kategori Distribusi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPostType("DONASI")}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  postType === "DONASI"
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-[#F5F5F3] border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                🎁 Donasi Sisa
              </button>
              <button
                type="button"
                onClick={() => setPostType("PATUNGAN")}
                className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  postType === "PATUNGAN"
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-[#F5F5F3] border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                🤝 Patungan Masak
              </button>
            </div>
          </div>

          {/* Judul */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black tracking-widest uppercase text-zinc-400 block">
              Judul Informasi Publik
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kelebihan kubis setengah bonggol segar"
              className="w-full px-4 py-2.5 text-xs bg-[#F5F5F3] border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 font-medium transition placeholder:text-zinc-400"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black tracking-widest uppercase text-zinc-400 block">
              Detail Ketentuan & Cara Klaim
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sebutkan masa kedaluwarsa atau kesepakatan tempat temu patungan belanja secara sopan..."
              rows={3}
              className="w-full px-4 py-2.5 text-xs bg-[#F5F5F3] border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 font-medium resize-none transition placeholder:text-zinc-400"
              required
            />
          </div>

          {/* Navigasi Aksi */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-xl hover:bg-zinc-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition shadow-md shadow-black/5"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
