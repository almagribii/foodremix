/**
 * GET  /api/notifications/settings  — ambil setting notif user
 * PATCH /api/notifications/settings  — update setting notif user
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

    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const setting = await prisma.notificationSetting.upsert({
      where: { userId: profile.id },
      update: {},
      create: { userId: profile.id },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("GET /api/notifications/settings error:", error);
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

    // Hanya perbolehkan field yang memang ada di schema
    const allowed = ["dinnerReminderTime", "journalReminderTime"] as const;
    const updateData: Record<string, string> = {};
    for (const key of allowed) {
      if (typeof body[key] === "string" && body[key].trim()) {
        updateData[key] = body[key].trim();
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada field yang valid untuk diupdate." },
        { status: 400 },
      );
    }

    const updated = await prisma.notificationSetting.upsert({
      where: { userId: profile.id },
      update: updateData,
      create: { userId: profile.id, ...updateData },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/notifications/settings error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
