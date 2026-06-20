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

    // Tarik id UserProfile terlebih dahulu
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true },
    });

    if (!userProfile) return NextResponse.json({ histories: [] });

    // Ambil daftar riwayat masak diurutkan dari yang paling baru
    const histories = await prisma.remixHistory.findMany({
      where: { userId: userProfile.id },
      orderBy: { cookedAt: "desc" },
    });

    return NextResponse.json({ histories });
  } catch (error) {
    console.error("Fetch remix history error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
