import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI, Type } from "@google/genai";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 1. Cari dulu profil user untuk mendapatkan CUID profilnya
    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
    });

    // Jika profil belum dibuat, otomatis riwayat masih kosong
    if (!profile) {
      return NextResponse.json([]);
    }

    // 2. Ambil jurnal berdasarkan profile ID yang fiks terikat di skema database
    const journals = await prisma.wellnessJournal.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(journals);
  } catch (error) {
    console.error("Fetch wellness journal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Konfigurasi AI server belum lengkap." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { userMood, foodEaten, userStory } = body;

    if (!userMood || !foodEaten || !userStory) {
      return NextResponse.json(
        { error: "Semua input harian wajib diisi" },
        { status: 400 },
      );
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId: payload.userId },
      update: {},
      create: {
        nickname: "User Remix",
        dailyBudgetTarget: 30000,
        generalLocation: "Belum disetel",
        medicalConditions: [] as string[],
        allergies: [] as string[],
        user: {
          connect: { id: payload.userId },
        },
      },
    });

    const conditions = profile.medicalConditions || [];
    const allergies = profile.allergies || [];

    const systemInstruction = `
      Kamu adalah AI Ahli Gizi Medis dan Konselor Kesehatan Mental untuk aplikasi Foodremix.
      Tugasmu adalah menganalisis keselarasan makanan harian dan cerita kondisi fisik/mental pengguna berdasarkan profil riwayat medis dan alergi mereka.
      Berikan respon yang berempati tinggi, edukatif, praktis, dan informatif. Jangan sertakan karakter emoji apa pun dalam teks analisis.
      
      Aturan Penilaian Kesehatan (healthScore: 1 - 100):
      1. Jika pengguna melanggar ALERGI aktifnya, berikan nilai skor di bawah 50.
      2. Jika pengguna melanggar KONDISI MEDIS (misal maag makan pedas/kopi), potong skor secara proporsional (skor kisaran 60-79).
      3. Jika makanan aman dan mendukung kondisi psikologis/fisik mereka, berikan nilai prima (85-100).
    `;

    const userPrompt = `
      [PROFIL KESEHATAN PENGGUNA]
      - Riwayat Penyakit/Medis: ${conditions.join(", ") || "Tidak ada"}
      - Alergi Makanan aktif: ${allergies.join(", ") || "Tidak ada"}

      [ENTRI HARIAN PENGGUNA]
      - Mood saat ini: ${userMood}
      - Makanan yang dikonsumsi hari ini: ${foodEaten}
      - Keluhan Fisik & Cerita Mental: ${userStory}
    `;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: {
              type: Type.INTEGER,
              description:
                "Skala angka 1-100 tingkat kepatuhan asupan gizi terhadap kondisi medis pengguna.",
            },
            aiInsight: {
              type: Type.STRING,
              description:
                "Solusi gizi, tips pencegahan, dan pesan dukungan psikologis tanpa menggunakan emoji.",
            },
          },
          required: ["healthScore", "aiInsight"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Gemini AI did not return output.");

    const aiResult = JSON.parse(responseText);

    const newJournal = await prisma.wellnessJournal.create({
      data: {
        userId: profile.id, // Menyimpan menggunakan Profile ID fiks
        userMood,
        foodEaten,
        userStory,
        aiInsight: aiResult.aiInsight,
        healthScore: aiResult.healthScore,
      },
    });

    return NextResponse.json(newJournal);
  } catch (error) {
    console.error("Create wellness journal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
