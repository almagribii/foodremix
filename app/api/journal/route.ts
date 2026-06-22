import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI, Type } from "@google/genai";
import { triggerWellnessNotification } from "@/lib/notifications";

const apiKey = process.env.GEMINI_API_KEY || "";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const targetDateParam = searchParams.get("date");

    // DISELARASKAN: Gunakan select eksplisit agar aman dari cache kolom spasial lama
    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: {
        id: true,
        userId: true,
        nickname: true,
        dailyBudgetTarget: true,
        medicalConditions: true,
        allergies: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ journals: [], analytics: null });
    }

    const journals = await prisma.wellnessJournal.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    const targetDateString = targetDateParam
      ? new Date(targetDateParam).toDateString()
      : new Date().toDateString();

    let totalKaloriTargetHari = 0;
    let totalGulaTargetHari = 0;
    let totalProteinTargetHari = 0;

    let hitungVitC = 0,
      hitungZatBesi = 0,
      hitungKalsium = 0,
      hitungKalium = 0,
      hitungVitamin = 0;
    let totalKarboKeseluruhan = 0,
      totalLemakKeseluruhan = 0,
      totalProteinKeseluruhan = 0;

    journals.forEach((j) => {
      const teksLower =
        `${j.foodEaten} ${j.aiInsight} ${j.userStory}`.toLowerCase();
      const tanggalJurnal = new Date(j.createdAt).toDateString();

      if (tanggalJurnal === targetDateString) {
        const kaloriMatch = teksLower.match(/(\d+)\s*(kcal|kalori)/);
        const gulaMatch = teksLower.match(/(\d+)\s*g\s*(gula|glukosa)/);
        const proteinMatch = teksLower.match(/(\d+)\s*g\s*protein/);

        if (kaloriMatch) totalKaloriTargetHari += parseInt(kaloriMatch[1]);
        if (gulaMatch) totalGulaTargetHari += parseInt(gulaMatch[1]);
        if (proteinMatch) totalProteinTargetHari += parseInt(proteinMatch[1]);
      }

      if (
        teksLower.includes("vitamin c") ||
        teksLower.includes("jeruk") ||
        teksLower.includes("buah")
      )
        hitungVitC += 25;
      if (
        teksLower.includes("zat besi") ||
        teksLower.includes("daging") ||
        teksLower.includes("bayam")
      )
        hitungZatBesi += 20;
      if (
        teksLower.includes("kalsium") ||
        teksLower.includes("susu") ||
        teksLower.includes("keju")
      )
        hitungKalsium += 20;
      if (
        teksLower.includes("kalium") ||
        teksLower.includes("pisang") ||
        teksLower.includes("kentang")
      )
        hitungKalium += 25;
      if (
        teksLower.includes("vitamin b") ||
        teksLower.includes("telur") ||
        teksLower.includes("hati")
      )
        hitungVitamin += 15;

      if (
        teksLower.includes("karbo") ||
        teksLower.includes("nasi") ||
        teksLower.includes("mie") ||
        teksLower.includes("roti")
      )
        totalKarboKeseluruhan += 1;
      if (
        teksLower.includes("lemak") ||
        teksLower.includes("gorengan") ||
        teksLower.includes("santan") ||
        teksLower.includes("minyak")
      )
        totalLemakKeseluruhan += 1;
      if (
        teksLower.includes("protein") ||
        teksLower.includes("ayam") ||
        teksLower.includes("ikan") ||
        teksLower.includes("tahu") ||
        teksLower.includes("tempe")
      )
        totalProteinKeseluruhan += 1;
    });

    const totalSesiMakro =
      totalKarboKeseluruhan + totalLemakKeseluruhan + totalProteinKeseluruhan ||
      1;
    const persenKarbo =
      totalKarboKeseluruhan > 0
        ? Math.round((totalKarboKeseluruhan / totalSesiMakro) * 100)
        : 55;
  const persenLemak =
    totalLemakKeseluruhan > 0
      ? Math.round((totalLemakKeseluruhan / totalSesiMakro) * 100)
      : 25;
    const persenProtein = 100 - (persenKarbo + persenLemak);

    return NextResponse.json({
      journals,
      analytics: {
        daily: {
          calories: totalKaloriTargetHari || 0,
          sugar: totalGulaTargetHari || 0,
          protein: totalProteinTargetHari || 0,
        },
        minerals: [
          { label: "Vitamin C", value: Math.min(hitungVitC || 70, 100) },
          { label: "Zat Besi", value: Math.min(hitungZatBesi || 40, 100) },
          { label: "Kalsium", value: Math.min(hitungKalsium || 35, 100) },
          { label: "Kalium", value: Math.min(hitungKalium || 65, 100) },
          { label: "Vitamin B", value: Math.min(hitungVitamin || 50, 100) },
        ],
        macro: {
          karbo: persenKarbo,
          lemak: persenLemak,
          protein: persenProtein,
        },
      },
    });
  } catch (error) {
    console.error("Fetch rekam gizi error:", error);
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
        medicalConditions: [],
        allergies: [],
        user: { connect: { id: payload.userId } },
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

      PENTING: Selipkan juga estimasi kasar angka kandungan gizi makronya di dalam narasi teks dengan format baku agar sistem regex kami bisa membacanya, contoh: "Makanan ini diperkirakan menyumbang 450 kcal kalori, 12g gula, dan 25g protein bagi tubuhmu."
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
            healthScore: { type: Type.INTEGER },
            aiInsight: { type: Type.STRING },
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
        userId: profile.id,
        userMood,
        foodEaten,
        userStory,
        aiInsight: aiResult.aiInsight,
        healthScore: aiResult.healthScore,
      },
    });

    // Trigger notifikasi wellness berdasarkan healthScore (fire-and-forget)
    triggerWellnessNotification(profile.id, aiResult.healthScore, foodEaten);

    return NextResponse.json(newJournal);
  } catch (error) {
    console.error("Create wellness journal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
