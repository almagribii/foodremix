import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    // 1. Proteksi Autentikasi Sesi Token
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

    // 2. Ekstraksi Payload Gambar Base64 dari Frontend
    const body = await request.json();
    const { imageBase64 } = body;
    if (!imageBase64) {
      return NextResponse.json(
        { error: "Data gambar wajib disertakan" },
        { status: 400 },
      );
    }

    // 3. Tarik Riwayat Medis & Alergi Aktif User dari Database
    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: {
        id: true,
        medicalConditions: true,
        allergies: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    const conditions = profile.medicalConditions || [];
    const allergies = profile.allergies || [];

    const contextMedis = `
      [PROFIL KESEHATAN HARUS DIPATUHI]
      - Pantangan Medis: ${conditions.join(", ") || "Tidak ada pantangan khusus."}
      - Alergi Aktif: ${allergies.join(", ") || "Tidak ada alergi aktif."}
      
      ATURAN PROTEKSI MUTLAK: Jika bahan makanan pada gambar secara jelas memicu/membahayakan kondisi medis atau alergi pengguna di atas, Anda WAJIB memberikan nilai verdict: "CARI YANG LAIN", status: "VALID", dan jelaskan risikonya secara eksplisit pada poin pertama array analysisDetails.
    `;

    // 4. Sanitasi String Base64 untuk Kebutuhan InlineData Google Gen AI SDK
    const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        data: base64Clean,
        mimeType: "image/jpeg",
      },
    };

    // 5. Prompt Engineering dengan Keluaran Terstruktur JSON
    const systemInstruction = `
      Anda adalah Pakar Inspeksi Kesegaran Komoditas Pangan dan Konsultan Penyimpanan Zero-Waste untuk aplikasi Foodremix.
      Tugas Anda adalah memindai gambar bahan pangan mentah (sayur, buah, lauk-pauk) yang difoto pengguna langsung dari etalase pasar/supermarket.
      
      DILARANG KERAS menggunakan karakter emoji apa pun dalam teks analisis Anda.
      
      ${contextMedis}

      KONDISI PENGECUALIAN OBJEK (INVALID SCREENING):
      Jika gambar gelap gulita, blur parah, atau memotret objek non-pangan (seperti wajah orang, dinding, kendaraan, barang elektronik), Anda WAJIB mengembalikan struktur JSON dengan status: "INVALID", verdict: "CARI YANG LAIN", itemName: "Objek Tidak Dikenal", serta mengisi isi array detail dengan peringatan instruksi kamera.

      Anda WAJIB membalas tepat sesuai skema struktur JSON ini:
      {
        "status": "VALID" | "INVALID",
        "itemName": "Nama komoditas pangan spesifik hasil deteksi visual. Contoh: Alpukat Mentega",
        "verdict": "LAYAK BELI (FRESH)" | "CARI YANG LAIN",
        "expectedLifespan": "Estimasi rentang daya tahan di suhu ruang. Contoh: 4-5 Days",
        "analysisDetails": ["Array string berisi TEPAT 3 poin analisis taktil visual fisik objek di gambar"],
        "storageBlueprint": ["Array string berisi TEPAT 3 langkah instruksi taktis penyimpanan pasca-pasar agar awet tanpa alat mahal"]
      }
    `;

    // 6. Eksekusi Panggilan AI Multimodal Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        imagePart,
        "Lakukan inspeksi kelayakan kesegaran pada objek bahan pangan ini.",
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const aiText = response.text;
    if (!aiText) throw new Error("Gemini AI gagal memproses visual gambar.");

    const aiData = JSON.parse(aiText);

    // 7. Simpan Riwayat Inspeksi secara Atomik ke Postgres via Prisma jika Status "VALID"
    let savedRecordId = null;
    if (aiData.status === "VALID") {
      const newPickerLog = await prisma.remixPicker.create({
        data: {
          userId: profile.id, // Berelasi ke UserProfile ID
          itemName: aiData.itemName,
          status: aiData.status,
          verdict: aiData.verdict,
          expectedLifespan: aiData.expectedLifespan,
          analysisDetails: aiData.analysisDetails,
          storageBlueprint: aiData.storageBlueprint,
        },
      });
      savedRecordId = newPickerLog.id;
    }

    // 8. Kembalikan Respon Utuh ke Frontend
    return NextResponse.json({
      ...aiData,
      pickerHistoryId: savedRecordId,
    });
  } catch (error) {
    console.error("Remix Picker Engine Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses analisis kesegaran bahan makanan." },
      { status: 500 },
    );
  }
}
