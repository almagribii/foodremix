import { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Proteksi Autentikasi Token JWT Session
    const token = extractToken(request.headers.get("Authorization") || "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { postType, title, description, budgetInfo } = body;

    // 2. Validasi input form P2P
    if (!postType || !title || !description) {
      return NextResponse.json(
        { error: "Kategori, judul, dan detail deskripsi wajib diisi" },
        { status: 400 },
      );
    }

    // 3. Tarik lokasi spasial valid akun pengguna untuk ditanam di postingan komunitas
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
      select: { id: true, latitude: true, longitude: true },
    });

    if (!userProfile || !userProfile.latitude || !userProfile.longitude) {
      return NextResponse.json(
        {
          error:
            "Gagal memproses. Harap lengkapi koordinat GPS valid pada menu profil akun Anda terlebih dahulu!",
        },
        { status: 400 },
      );
    }

    // 4. Simpan ke database PostgreSQL sesuai korelasi skema CommunityPost
    const newPost = await prisma.communityPost.create({
      data: {
        userId: userProfile.id, // Relasi merujuk pada field id milik UserProfile
        postType: postType, // "DONASI" atau "PATUNGAN"
        title: title,
        description: description,
        budgetInfo: budgetInfo ? parseFloat(String(budgetInfo)) : null,
        postLat: userProfile.latitude, // Mengunci letak latitude saat ini
        postLng: userProfile.longitude, // Mengunci letak longitude saat ini
        isCompleted: false,
      },
    });

    return NextResponse.json(
      {
        message: "Aksi Remix Share Anda berhasil dipublish ke publik!",
        post: newPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Community Post API Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah postingan ke sirkuit komunitas" },
      { status: 500 },
    );
  }
}
