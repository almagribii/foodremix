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
      where: { id: payload.userId },
    });

    return NextResponse.json(profile);
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
    const {
      nickname,
      dailyBudgetTarget,
      medicalConditions,
      allergies,
      generalLocation,
      latitude,
      longitude,
    } = body;

    if (!nickname || !generalLocation) {
      return NextResponse.json(
        { error: "Nickname dan lokasi wajib diisi" },
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
      where: { id: payload.userId },
      data: {
        nickname,
        dailyBudgetTarget: parseFloat(String(dailyBudgetTarget)) || 30000,
        medicalConditions: sanitizeToArray(medicalConditions),
        allergies: sanitizeToArray(allergies),
        generalLocation,
        latitude: latitude ? parseFloat(String(latitude)) : null,
        longitude: longitude ? parseFloat(String(longitude)) : null,
      },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      userProfile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile DB error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan ke database" },
      { status: 500 },
    );
  }
}
