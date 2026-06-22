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

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { nickname, dailyBudgetTarget, medicalConditions, allergies } = body;

    if (!nickname) {
      return NextResponse.json(
        { error: "Nickname wajib diisi" },
        { status: 400 },
      );
    }

    const sanitizeToArray = (data: unknown): string[] => {
      if (Array.isArray(data)) {
        return data
          .map((item) => String(item).trim().toLowerCase())
          .filter(Boolean);
      }
      if (typeof data === "string") {
        return data
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean);
      }
      return [];
    };

    const updatedProfile = await prisma.userProfile.update({
      where: { userId: payload.userId },
      data: {
        nickname,
        dailyBudgetTarget: parseFloat(String(dailyBudgetTarget)) || 30000.0,
        medicalConditions: sanitizeToArray(medicalConditions),
        allergies: sanitizeToArray(allergies),
      },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile DB error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan ke database" },
      { status: 500 },
    );
  }
}
