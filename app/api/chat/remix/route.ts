import { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyToken } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY_REMIX || "";
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
    const { question, recipeName, ingredients, instructions } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Pertanyaan tidak boleh kosong." },
        { status: 400 },
      );
    }

    const systemInstruction = `
    Kamu adalah Chef AI dari Foodremix yang sudah mengerti resep "${recipeName}".
    
    Informasi resep yang sudah ada:
    - Bahan: ${ingredients.join(", ")}
    - Langkah: ${instructions.join(" | ")}
    
    Jawab pertanyaan user dengan singkat, praktis, dan relevan. 
    Jika ditanya substitusi bahan, berikan alternatif yang sesuai dengan konteks Indonesia.
    Jika ditanya penyesuaian, berikan perubahan langkah yang jelas.
    Selalu gunakan bahasa Indonesia yang mudah dipahami.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: question }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text;

    return NextResponse.json(
      { answer: replyText || "Maaf, tidak ada jawaban." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Chat Remix Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pertanyaan." },
      { status: 500 },
    );
  }
}