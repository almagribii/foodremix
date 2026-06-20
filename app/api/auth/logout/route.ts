import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    // Hapus session
    await prisma.session.deleteMany({
      where: {
        userId: payload.userId,
        token,
      },
    });

    return NextResponse.json(
      { message: "Logout berhasil" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=; Path=/; Max-Age=0`,
        },
      },
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 },
    );
  }
}
