import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      name,
      nickname,
      dailyBudgetTarget,
      medicalConditions,
      allergies,
      generalLocation,
    } = await request.json();

    // Validasi input
    if (!email || !password || !nickname || !generalLocation) {
      return NextResponse.json(
        { error: "Email, password, nickname, dan lokasi harus diisi" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cek user sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user dan profile bersama
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        userProfile: {
          create: {
            nickname,
            dailyBudgetTarget: dailyBudgetTarget || 30000,
            medicalConditions: medicalConditions || [],
            allergies: allergies || [],
            generalLocation: generalLocation, // Wajib, tidak boleh null
          },
        },
      },
      include: {
        userProfile: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userProfile: user.userProfile,
        },
        token,
      },
      {
        status: 201,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
        },
      },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 },
    );
  }
}
