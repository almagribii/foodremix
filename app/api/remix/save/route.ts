import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";
import { triggerRemixNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { recipeName, ingredientsUsed, instructions, moneySaved, carbonPrevented } = body;

    if (!recipeName) {
      return NextResponse.json(
        { error: "Nama resep diperlukan" },
        { status: 400 },
      );
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profil pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    const historyLog = await prisma.remixHistory.create({
      data: {
        userId: userProfile.id,
        recipeName,
        ingredientsUsed: ingredientsUsed || [],
        instructions: instructions || [],
        moneySaved: moneySaved || 0,
        carbonPrevented: carbonPrevented || 0,
      },
    });

    triggerRemixNotification(
      userProfile.id,
      recipeName,
      moneySaved || 0,
      carbonPrevented || 0,
    ).catch(() => {});

    return NextResponse.json(
      { success: true, historyId: historyLog.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Save Recipe Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan resep." },
      { status: 500 },
    );
  }
}