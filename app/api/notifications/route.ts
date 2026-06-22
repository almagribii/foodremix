/**
 * GET /api/notifications
 * Dipakai Header.tsx untuk menampilkan dropdown bell.
 * Mengembalikan 20 notif terbaru (campuran read + unread).
 *
 * PATCH /api/notifications
 * Body: { ids: string[] } — tandai notifikasi tertentu sebagai dibaca.
 * Body: { markAll: true }  — tandai semua sebagai dibaca.
 */

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
      select: { id: true },
    });

    if (!profile) return NextResponse.json([], { status: 200 });

    const logs = await prisma.notificationLog.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true },
    });

    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await request.json();

    if (body.markAll) {
      await prisma.notificationLog.updateMany({
        where: { userId: profile.id, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, updated: "all" });
    }

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      await prisma.notificationLog.updateMany({
        where: { userId: profile.id, id: { in: body.ids } },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, updated: body.ids.length });
    }

    return NextResponse.json(
      { error: "Berikan 'markAll: true' atau 'ids: string[]'" },
      { status: 400 },
    );
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
