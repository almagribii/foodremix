import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY_CHATBOT || "";
const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Konfigurasi AI server belum lengkap." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { message, history } = body; // 'history' berisi susunan chat terdahulu jika diperlukan

    if (!message) {
      return NextResponse.json({ error: "Pesan wajib diisi" }, { status: 400 });
    }

    // Ambil data profil medis dan alergi user untuk dipersonalisasi oleh AI
    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
    });

    const conditions = profile?.medicalConditions || [];
    const allergies = profile?.allergies || [];
    const nickname = profile?.nickname || "User Remix";

    // PROMPT ENGINEERING: Menjadikan AI asisten personal yang tahu batasan penyakit user
    const systemInstruction = `
      Kamu adalah Remix Chat, asisten gizi cerdas dan ahli memasak hemat dari aplikasi Foodremix.
      Nama pengguna yang sedang kamu ajak bicara adalah: ${nickname}.
      
      Informasi Medis Penting Pengguna:
      - Riwayat Penyakit: ${conditions.join(", ") || "Tidak ada pantangan medis khusus."}
      - Alergi Makanan: ${allergies.join(", ") || "Tidak ada alergi makanan aktif."}

      Aturan Obrolan:
      1. Berikan rekomendasi resep, tips belanja murah, dan saran kesehatan gizi yang aman sesuai profil medis di atas.
      2. Jika pengguna menanyakan menu yang melanggar riwayat penyakit/alerginya, ingatkan mereka dengan tegas namun santun, dan berikan opsi alternatif menu sehat pengganti.
      3. Jawab dengan gaya yang suportif, ramah, scannable (gunakan bolding/bullet points jika menjelaskan resep), dan dilarang keras menggunakan karakter emoji apa pun.
    `;

    // Menyusun format pesan termasuk riwayat percakapan singkat (jika dikirim oleh frontend)
    const formattedContents = [
      ...(history || []).map((msg: { role: string; text: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const replyText = response.text;
    if (!replyText) throw new Error("Gemini AI did not return output.");

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Remix Chat AI error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
