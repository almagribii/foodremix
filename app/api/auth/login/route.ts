import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 },
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Hapus session lama user ini
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Simpan session ke database
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      },
    });

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
        },
      },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 },
    );
  }
}
