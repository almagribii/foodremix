import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI, Part } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY_REMIX || "";
const ai = new GoogleGenAI({ apiKey });

interface RecipeOption {
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
  estimatedCalories: number;
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json(
        {
          error: "Sesi berakhir",
          message: "Silakan login kembali untuk menggunakan layanan ini.",
        },
        { status: 401 },
      );

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json(
        {
          error: "Token tidak valid",
          message: "Silakan login kembali untuk menggunakan layanan ini.",
        },
        { status: 401 },
      );

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Server belum siap",
          message: "Mohon maaf, layanan AI sedang dalam pemelihahan. Silakan coba lagi nanti.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { ingredients, imageBase64, targetBudget, mode } = body;

    const isDetectMode = mode === "detect";

    if (
      (!ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0) &&
      !imageBase64
    ) {
      return NextResponse.json(
        {
          error: "Belum ada input",
          message: "Silakan masukkan bahan atau foto makanan terlebih dahulu.",
        },
        { status: 400 },
      );
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          error: "Profil tidak ditemukan",
          message: "Silakan lengkapi profil terlebih dahulu di halaman profil.",
        },
        { status: 404 },
      );
    }

    const systemInstruction = isDetectMode
      ? `
      Anda adalah Chef AI & Food Identifier dari aplikasi Foodremix.
      Tugas utama adalah mendeteksi nama makanan dari gambar atau teks, lalu memberikan 3 opsi resep/tutorial cara membuatnya.

      Aturan deteksi:
      - Jika tidak valid, status = "INVALID" dengan reason dan solution
      - Jika valid, buatkan 3 opsi resep BERBEDA dengan karakter unik masing-masing

      Aturan resep:
      - Setiap opsi punya cita rasa/konsep berbeda (pedas, sehat, gurih)
      - ingredientsUsed, instructions, moneySaved, carbonPrevented, estimatedCalories
      - Variasi biaya 5-15% antar opsi
      - Perhatikan pantangan medis dan alergi pengguna
      `
      : `
      Anda adalah Chef AI dari aplikasi Foodremix.
      Tugas: validasi input (gambar/teks) lalu racik 3 opsi resep dari bahan sisa.

      Aturan validasi:
      - Gambar tidak jelas/objek non-makanan = INVALID
      - Teks tidak relevan = INVALID

      Aturan resep:
      - Buatkan 3 menu BERBEDA dengan konsep unik
      - Setiap opsi punya estimatedCalories
      - Perhatikan budget${targetBudget > 0 ? ` (Rp ${targetBudget})` : ""}
      `;

    const jsonSchema = {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["VALID", "INVALID"],
        },
        reason: { type: "string" },
        solution: { type: "string" },
        options: {
          type: "array",
          items: {
            type: "object",
            properties: {
              recipeName: { type: "string" },
              ingredientsUsed: { type: "array", items: { type: "string" } },
              instructions: { type: "array", items: { type: "string" } },
              moneySaved: { type: "number" },
              carbonPrevented: { type: "number" },
              estimatedCalories: { type: "number" },
            },
          },
        },
      },
      required: ["status", "reason", "solution", "options"],
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
    const userMessage = isDetectMode
      ? `Deteksi makanan ini dan berikan 3 opsi resep/tutorial cara membuatnya: ${textCatatan}`
      : `Bahan yang tersedia: ${textCatatan}. Buatkan 3 opsi resep dari bahan ini.`;
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

    if (parsedResult.status === "VALID" && parsedResult.options) {
      parsedResult.options = parsedResult.options.map((opt: RecipeOption) => ({
        ...opt,
        moneySaved: Number(opt.moneySaved) || 0,
        carbonPrevented: Number(opt.carbonPrevented) || 0,
        estimatedCalories: Number(opt.estimatedCalories) || 300,
      }));
    }

    return NextResponse.json(
      {
        status: parsedResult.status,
        reason: parsedResult.reason,
        solution: parsedResult.solution,
        options: parsedResult.options || [],
        mode: isDetectMode ? "detect" : "remix",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Remix Generate Options Error:", error);

    const errorMessage =
      error instanceof Error && error.message.includes("quota")
        ? "Mohon tunggu sebentar, server sedang sibuk. Silakan coba lagi dalam beberapa menit."
        : "Terjadi gangguan pada server. Silakan coba lagi nanti.";

    return NextResponse.json(
      {
        error: "Server error",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}