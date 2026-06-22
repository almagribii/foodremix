/**
 * lib/notifications.ts
 * Helper terpusat untuk membuat NotificationLog secara atomik.
 * Semua logika anti-spam, threshold, dan tipe notif ada di sini.
 */

import prisma from "@/lib/prisma";

// ─── Tipe Notifikasi ─────────────────────────────────────────────
export type NotifType = "BUDGET" | "WELLNESS" | "PICKER_ALERT" | "REMIX_ALERT";

// ─── Konstanta Threshold ─────────────────────────────────────────
const WELLNESS_WARNING_THRESHOLD = 70; // skor < 70 → waspada
const WELLNESS_DANGER_THRESHOLD = 50;  // skor < 50 → bahaya
const ANTI_SPAM_HOURS = 6;             // jeda minimum antar notif sejenis (jam)

// ─── Utility: cek apakah sudah cukup jeda sejak notif terakhir ───
function isAntiSpamPassed(lastSent: Date | null | undefined): boolean {
  if (!lastSent) return true;
  const diffMs = Date.now() - new Date(lastSent).getTime();
  return diffMs > ANTI_SPAM_HOURS * 60 * 60 * 1000;
}

// ─── Helper inti: buat satu baris NotificationLog ────────────────
async function createLog(
  profileId: string,
  title: string,
  message: string,
  type: NotifType,
): Promise<void> {
  await prisma.notificationLog.create({
    data: { userId: profileId, title, message, type },
  });
}

// ─── Pastikan NotificationSetting ada untuk user ─────────────────
async function ensureSetting(profileId: string) {
  return prisma.notificationSetting.upsert({
    where: { userId: profileId },
    update: {},
    create: { userId: profileId },
  });
}

// ════════════════════════════════════════════════════════════════════
// 1. WELLNESS / JOURNAL — dipanggil setelah WellnessJournal dibuat
// ════════════════════════════════════════════════════════════════════
export async function triggerWellnessNotification(
  profileId: string,
  healthScore: number,
  foodEaten: string,
): Promise<void> {
  try {
    const setting = await ensureSetting(profileId);

    if (!isAntiSpamPassed(setting.lastWellnessAlert)) return;

    let title: string;
    let message: string;

    if (healthScore < WELLNESS_DANGER_THRESHOLD) {
      title = "⚠️ Status Kesehatan: BAHAYA";
      message = `Skor kesehatanmu ${healthScore}/100 — makanan "${foodEaten}" terdeteksi berpotensi membahayakan kondisi medis atau alergimu. Segera tinjau pilihan asupan.`;
    } else if (healthScore < WELLNESS_WARNING_THRESHOLD) {
      title = "🟡 Status Kesehatan: WASPADA";
      message = `Skor kesehatanmu ${healthScore}/100 — makanan "${foodEaten}" mungkin kurang optimal. Pertimbangkan pilihan yang lebih sesuai profil kesehatanmu.`;
    } else {
      // Skor aman, tidak perlu notifikasi
      return;
    }

    await createLog(profileId, title, message, "WELLNESS");

    // Catat waktu terakhir alert agar anti-spam bekerja
    await prisma.notificationSetting.update({
      where: { userId: profileId },
      data: { lastWellnessAlert: new Date() },
    });
  } catch (err) {
    // Jangan crash route utama karena notif gagal
    console.error("[Notification] triggerWellnessNotification error:", err);
  }
}

// ════════════════════════════════════════════════════════════════════
// 2. REMIX AREA — dipanggil setelah remixHistory berhasil dibuat
// ════════════════════════════════════════════════════════════════════
export async function triggerRemixNotification(
  profileId: string,
  recipeName: string,
  moneySaved: number,
  carbonPrevented: number,
): Promise<void> {
  try {
    const setting = await ensureSetting(profileId);

    if (!isAntiSpamPassed(setting.lastBudgetAlert)) return;

    const title = "🍳 Remix Berhasil — Penghematan Tercatat!";
    const message = `Resep "${recipeName}" berhasil diracik. Kamu hemat Rp${moneySaved.toLocaleString("id-ID")} dan mencegah ${carbonPrevented} kg CO₂ terbuang ke lingkungan.`;

    await createLog(profileId, title, message, "REMIX_ALERT");

    await prisma.notificationSetting.update({
      where: { userId: profileId },
      data: { lastBudgetAlert: new Date() },
    });
  } catch (err) {
    console.error("[Notification] triggerRemixNotification error:", err);
  }
}

// ════════════════════════════════════════════════════════════════════
// 3. REMIX PICKER — dipanggil setelah scan selesai
//    - "CARI YANG LAIN" → alert picker
//    - Mengandung pemicu alergi/medis (dari verdict/analysisDetails) → alert lebih keras
// ════════════════════════════════════════════════════════════════════
export async function triggerPickerNotification(
  profileId: string,
  itemName: string,
  verdict: string,
  analysisDetails: string[],
): Promise<void> {
  try {
    await ensureSetting(profileId);

    const isDangerous =
      verdict === "CARI YANG LAIN" ||
      analysisDetails.some((d) =>
        d.toLowerCase().includes("alergi") ||
        d.toLowerCase().includes("pantangan") ||
        d.toLowerCase().includes("berbahaya") ||
        d.toLowerCase().includes("tidak layak"),
      );

    if (!isDangerous) return;

    const title = "🚫 Picker Alert — Bahan Tidak Direkomendasikan";
    const message = `"${itemName}" mendapat verdict "${verdict}". ${analysisDetails[0] ?? "Pertimbangkan bahan alternatif yang lebih aman."}`;

    await createLog(profileId, title, message, "PICKER_ALERT");
    // Picker alert tidak menggunakan lastBudgetAlert / lastWellnessAlert
    // agar tidak saling menghalangi; setiap scan berbahaya selalu dicatat
  } catch (err) {
    console.error("[Notification] triggerPickerNotification error:", err);
  }
}
