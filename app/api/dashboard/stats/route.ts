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
        nickname: true,
        dailyBudgetTarget: true,
        medicalConditions: true,
        allergies: true,
      },
    });

    if (!profile) {
      return NextResponse.json({
        totalMoneySaved: 0,
        totalCarbonPrevented: 0,
        averageHealthScore: 0,
        totalRemix: 0,
        totalPickerScans: 0,
        totalJournalEntries: 0,
        unreadNotifications: 0,
        recentHistory: [],
        recentJournals: [],
        profile: null,
      });
    }

    // Paralel query semua data
    const [
      remixAgg,
      remixRecent,
      journalAgg,
      journalRecent,
      pickerCount,
      unreadNotifs,
    ] = await Promise.all([
      // Aggregasi remix: total uang & carbon
      prisma.remixHistory.aggregate({
        where: { userId: profile.id },
        _sum: { moneySaved: true, carbonPrevented: true },
        _count: { id: true },
      }),
      // 5 riwayat remix terbaru
      prisma.remixHistory.findMany({
        where: { userId: profile.id },
        orderBy: { cookedAt: "desc" },
        take: 5,
      }),
      // Aggregasi jurnal: rata-rata health score
      prisma.wellnessJournal.aggregate({
        where: { userId: profile.id },
        _avg: { healthScore: true },
        _count: { id: true },
      }),
      // 3 jurnal terbaru
      prisma.wellnessJournal.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          foodEaten: true,
          healthScore: true,
          userMood: true,
          createdAt: true,
        },
      }),
      // Jumlah scan picker
      prisma.remixPicker.count({ where: { userId: profile.id } }),
      // Notifikasi belum dibaca
      prisma.notificationLog.count({
        where: { userId: profile.id, isRead: false },
      }),
    ]);

    return NextResponse.json({
      totalMoneySaved: remixAgg._sum.moneySaved || 0,
      totalCarbonPrevented: remixAgg._sum.carbonPrevented || 0,
      averageHealthScore: Math.round(journalAgg._avg.healthScore || 0),
      totalRemix: remixAgg._count.id,
      totalPickerScans: pickerCount,
      totalJournalEntries: journalAgg._count.id,
      unreadNotifications: unreadNotifs,
      recentHistory: remixRecent,
      recentJournals: journalRecent,
      profile: {
        nickname: profile.nickname,
        dailyBudgetTarget: profile.dailyBudgetTarget,
        medicalConditions: profile.medicalConditions,
        allergies: profile.allergies,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
