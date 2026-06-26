import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY_PICKER || "";
const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Konfigurasi AI server belum lengkap." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { imageBase64 } = body;
    if (!imageBase64) {
      return NextResponse.json(
        { error: "Data gambar wajib disertakan" },
        { status: 400 },
      );
    }

    // Bersihkan base64 string
    const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        data: base64Clean,
        mimeType: "image/jpeg",
      },
    };

    // Karena ini tamu/guest, contextMedis kita kosongkan/buat default bersih
    const contextMedis = `
      [PROFIL KESEHATAN TAMU]
      - Pengguna adalah tamu anonim. Tidak ada pantangan medis atau alergi spesifik yang diterapkan.
    `;

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

    return NextResponse.json({
      ...aiData,
      pickerHistoryId: null, // Set null karena tidak disimpan di DB
    });
  } catch (error) {
    console.error("Remix Picker Guest Engine Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses analisis kesegaran bahan makanan." },
      { status: 500 },
    );
  }
}
