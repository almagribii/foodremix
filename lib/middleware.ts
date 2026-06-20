import { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>,
): Promise<NextResponse> {
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
      return NextResponse.json(
        { error: "Token tidak valid atau expired" },
        { status: 401 },
      );
    }

    // Verify session masih aktif
    const session = await prisma.session.findFirst({
      where: {
        userId: payload.userId,
        token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session tidak valid" },
        { status: 401 },
      );
    }

    // Call handler dengan userId
    return handler(request, payload.userId);
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
