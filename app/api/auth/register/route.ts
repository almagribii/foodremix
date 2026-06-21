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
    } = await request.json();

    // 1. Validasi Input Utama Form (generalLocation dihapus)
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: "Email, password, dan nickname harus diisi lengkap" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal harus 6 karakter" },
        { status: 400 },
      );
    }

    // 2. Cek Akun Terduplikasi
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email tersebut sudah terdaftar di sistem Foodremix" },
        { status: 409 },
      );
    }

    // 3. Hash Password dengan Aman
    const hashedPassword = await hashPassword(password);

    // 4. Sanitasi Array Medis & Alergi
    const sanitizeToArray = (data: unknown): string[] => {
      if (Array.isArray(data)) {
        return data
          .map((item) => String(item).trim().toLowerCase())
          .filter(Boolean);
      }
      return [];
    };

    // 5. Transaksi Pembuatan User & UserProfile (Tanpa field spasial/wilayah)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        userProfile: {
          create: {
            nickname,
            dailyBudgetTarget: parseFloat(String(dailyBudgetTarget)) || 30000,
            medicalConditions: sanitizeToArray(medicalConditions),
            allergies: sanitizeToArray(allergies),
          },
        },
      },
      include: {
        userProfile: true,
      },
    });

    // 6. Generate JWT Session Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        message: "Registrasi akun Foodremix berhasil",
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
    console.error("Register database error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses registrasi" },
      { status: 500 },
    );
  }
}
