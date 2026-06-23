import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 2. Cari UserProfile ID terlebih dahulu
    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan" },
        { status: 404 },
      );
    }

    const history = await prisma.remixPicker.findMany({
      where: { userId: profile.id },
      orderBy: { scannedAt: "desc" },
      take: 10, 
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Fetch Picker History Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data riwayat scan." },
      { status: 500 },
    );
  }
}
