import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI, Part } from "@google/genai";
import { triggerRemixNotification } from "@/lib/notifications";

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
    const { ingredients, imageBase64, targetBudget } = body;

    if (
      (!ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0) &&
      !imageBase64
    ) {
      return NextResponse.json(
        {
          error:
            "Harap masukkan data (ambil foto kulkas via webcam atau ketik catatan teks bahan sisa)",
        },
        { status: 400 },
      );
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true, medicalConditions: true, allergies: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profil pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    const penyakitUser =
      userProfile.medicalConditions.join(", ") || "tidak ada pantangan medis";
    const alergiUser =
      userProfile.allergies.join(", ") || "tidak ada alergi makanan";

    // PROMPT ENGINEERING MULTILAYER VALIDATION (GAMBAR & TEKS)
    const systemInstruction = `
      Kamu adalah Engine Validasi & Chef Nutrisional AI dari aplikasi Foodremix.
      Tugas utamamu sebelum meracik resep adalah memvalidasi apakah input Gambar (dari webcam) atau Teks dari pengguna beneran berkaitan dengan MAKANAN, KULKAS, atau BAHAN BAKU PANGAN SISA.

      ATURAN VALIDASI KETAT (LANGKAH 1):
      1. VALIDASI GAMBAR (Jika ada): Jika user mengirim gambar hitam polos/gelap gulita, gambar sampah/kotak kemasan kosong, gambar hewan, objek non-makanan (seperti sepatu, obeng), atau gambar muka orang, maka status harus "INVALID".
      2. VALIDASI TEKS (Jika ada): Jika teks ketikan user berisi kata-kata kasar, sampah, resep racun, atau hal-hal di luar dunia kuliner/pangan sisa (misal: "cara memperbaiki motor", "baju tidur"), maka status harus "INVALID".
      3. Jika input TIDAK VALID, kamu DILARANG meracik resep. Isikan objek "recipe" dengan null, dan buatkan pesan "reason" serta "solution" yang spesifik menyindir/menjelaskan keanehan input tersebut.

      ATURAN RACIKAN RESEP (LANGKAH 2 - JIKA STATUS VALID):
      Jika valid, buatkan 1 menu makanan kreatif nan hemat sesuai bahan sisa kulkas tersebut dengan mematuhi batasan medis pengguna:
      - Penyakit: ${penyakitUser}
      - Alergi: ${alergiUser}
      - Batas Anggaran: Rp ${targetBudget || 30000}
    `;

    // Skema JSON yang mendukung struktur Validasi Dinamis
    const jsonSchema = {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["VALID", "INVALID"],
          description: "Status kelayakan konten input",
        },
        reason: {
          type: "string",
          description:
            "Alasan spesifik jika status INVALID (misal: 'Foto Anda tidak valid karena memasukkan foto sampah...')",
        },
        solution: {
          type: "string",
          description:
            "Solusi perbaikan bagi user (misal: 'Silakan masukkan foto makanan atau bahan makanan baku segar.')",
        },
        recipe: {
          type: "object",
          properties: {
            recipeName: { type: "string" },
            ingredientsUsed: { type: "array", items: { type: "string" } },
            instructions: { type: "array", items: { type: "string" } },
            moneySaved: { type: "number" },
            carbonPrevented: { type: "number" },
          },
          required: [
            "recipeName",
            "ingredientsUsed",
            "instructions",
            "moneySaved",
            "carbonPrevented",
          ],
        },
      },
      required: ["status", "reason", "solution"],
    };

    const contentParts: Part[] = [];

    if (imageBase64) {
      contentParts.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      });
    }

    const textCatatan =
      ingredients && ingredients.length > 0
        ? ingredients.join(", ")
        : "Tidak ada catatan teks manual.";
    const userMessage = `Input Teks: ${textCatatan}. Analisis kelayakan input gambar webcam dan teks ini sekarang.`;
    contentParts.push({ text: userMessage });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: contentParts }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    const replyText = response.text;
    if (!replyText) throw new Error("Gemini AI tidak mengembalikan output.");

    const parsedResult = JSON.parse(replyText);

    // Jika input VALID, baru simpan ke tabel data histori memasak PostgreSQL
    let historyId = null;
    if (parsedResult.status === "VALID" && parsedResult.recipe) {
      const moneySaved = parseFloat(parsedResult.recipe.moneySaved) || 20000;
      const carbonPrevented =
        parseFloat(parsedResult.recipe.carbonPrevented) || 0.4;

      const historyLog = await prisma.remixHistory.create({
        data: {
          userId: userProfile.id,
          recipeName: parsedResult.recipe.recipeName,
          ingredientsUsed: parsedResult.recipe.ingredientsUsed,
          moneySaved,
          carbonPrevented,
        },
      });
      historyId = historyLog.id;

      // Trigger notifikasi remix — fire-and-forget
      triggerRemixNotification(
        userProfile.id,
        parsedResult.recipe.recipeName,
        moneySaved,
        carbonPrevented,
      );
    }

    return NextResponse.json(
      {
        status: parsedResult.status,
        reason: parsedResult.reason,
        solution: parsedResult.solution,
        recipe: parsedResult.recipe,
        remixHistoryId: historyId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Remix Generate Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses validasi AI." },
      { status: 500 },
    );
  }
}
