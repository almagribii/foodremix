<img src="public/logo-food.png" alt="Foodremix Logo" width="120" height="120" align="center" />

# Foodremix

**Platform Penyelamatan Pangan Berbasis AI Multimodal**

Foodremix adalah aplikasi inovatif yang membantu Anda mengurangi limbah makanan dengan menciptakan resep kreatif dari bahan sisa di kulkas. Dengan teknologi AI multimodal, platform ini dapat memindai isi kulkas melalui webcam, meracik menu gizi yang hemat anggaran, dan berkontribusi untuk lingkungan.

## ✨ Fitur Utama

### 🤖 Remix AI

Modul utama untuk menciptakan resep dari bahan sisa. Mendukung dua mode:

- **Remix Mode**: Membuat resep kreatif dari bahan yang dimiliki di kulkas
- **Detect Mode**: Mendeteksi makanan dari foto dan memberikan tutorial memasak lengkap

### 📸 Picker

Pemindai makanan dengan dukungan webcam dan upload file. Mengidentifikasi bahan makanan, nutrisi, dan memberikan informasi detail secara otomatis menggunakan AI vision.

### 📊 Journal

Pencatatan asupan harian dengan visualisasi nutrisi melalui:

- Daily Macro Donut Chart - Visualisasi makronutrien harian
- Nutrient Bar Chart - Grafik nutrisi terperinci
- Journal Card untuk tracking makanan dan mood harian

### 💬 Chat AI

Asisten AI untuk konsultasi resep, alternatif makanan alergi, dan tips hemat memasak. Dukungan chat dengan history context untuk percakapan yang lebih natural.

### 🎮 Monster Junk Game

Game edukatif yang mengajarkan pentingnya mengurangi limbah makanan melalui gameplay yang menyenangkan. Pemain mengendalikan karakter untuk mengumpulkan sampah makanan dengan fitur:

- Puzzle sampah makanan
- Audio aktif (backsound, sound effects)
- Kontrol joystick untuk perangkat mobile
- Full screen mode

### 👤 Profil

Manajemen profil pengguna termasuk:

- Nickname dan target budget harian
- Medical conditions (riwayat penyakit)
- Allergies (alergi makanan)
- Statistik penghematan uang dan carbon footprint

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) dengan App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss3.com)
- **Database**: [Prisma ORM](https://prisma.io)
- **AI**: [Google Gemini API](https://ai.google.dev)
- **Animation**: [Framer Motion](https://framer.com/motion)
- **Maps**: [Leaflet](https://leafletjs.com)
- **Icons**: [Lucide React](https://lucide.dev)

## 📁 Struktur Project

```
foodremix/
├── app/
│   ├── (public)/           # Halaman publik
│   │   ├── page.tsx        # Homepage
│   │   ├── tentang/        # Halaman tentang
│   │   └── remix-area/     # Halaman preview remix
│   ├── dashboard/          # Halaman dashboard (protected)
│   │   ├── chat/           # AI Chat Assistant
│   │   ├── game/           # Game monster junk
│   │   ├── journal/        # Jurnal nutrisi
│   │   ├── notifications/  # Notifikasi
│   │   ├── picker/         # Pemindai makanan
│   │   ├── profile/        # Profil pengguna
│   │   └── remix/          # AI Remix Menu
│   ├── api/                # API Routes
│   ├── login/              # Halaman login
│   ├── register/           # Halaman registrasi
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Komponen UI reusable
│   │   ├── Button.tsx      # Button component elegan
│   │   ├── PageLoader.tsx  # Loading component
│   │   └── Toast.tsx       # Toast notification
│   ├── landing/            # Komponen landing page
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Tentang.tsx
│   │   └── Navbar.tsx
│   └── rekam-gizi/         # Komponen jurnal gizi
├── lib/
│   ├── auth.ts             # Authentication utilities
│   ├── prisma.ts           # Prisma client
│   └── hooks/
│       └── useAuth.ts      # Auth hook
└── prisma/
    └── schema.prisma       # Database schema
```

## 🎨 Tema & Warna

Project ini menggunakan tema custom dengan variabel CSS:

```css
:root {
  --background: #f5f5f3;
  --foreground: #1a1a1a;
  --primary: #1a1a1a;
  --accent: #eab308;
  --bg-light: #f5f5f3;
  --card: #ffffff;
}
```

## 🛠️ Instalasi

1. Clone repository ini
2. Install dependencies:

```bash
bun install
# atau
npm install
```

3. Setup environment variables:

```bash
cp .env.example .env
# Edit .env dengan konfigurasi database dan API key
```

4. Jalankan migrasi database:

```bash
bun run migrate
```

5. Jalankan development server:

```bash
bun run dev
# atau
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) dengan browser untuk melihat hasilnya.

## 📦 Scripts

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `bun run dev`     | Menjalankan development server  |
| `bun run build`   | Build aplikasi untuk production |
| `bun run start`   | Menjalankan production server   |
| `bun run migrate` | Menjalankan database migration  |
| `bun run studio`  | Membuka Prisma Studio           |

## 🔧 Komponen UI

### Button Component

Button component elegan dengan 6 variant:

```tsx
import { Button } from "@/components/ui/Button";

// Variants: primary, secondary, outline, ghost, destructive, accent
<Button variant="accent" size="md" loading={false}>
  Racik Menu Sekarang
</Button>;
```

**Props:**

- `variant`: `primary` | `secondary` | `outline` | `ghost` | `destructive` | `accent`
- `size`: `sm` | `md` | `lg`
- `loading`: boolean - menampilkan spinner loading
- `disabled`: boolean - menonaktifkan button
- `className`: string - custom styling tambahan

## 🔌 API Endpoints

| Endpoint               | Method   | Description               |
| ---------------------- | -------- | ------------------------- |
| `/api/auth/login`      | POST     | Autentikasi pengguna      |
| `/api/auth/register`   | POST     | Registrasi pengguna baru  |
| `/api/auth/logout`     | POST     | Keluar dari sesi          |
| `/api/auth/me`         | GET      | Mendapatkan data pengguna |
| `/api/remix/generate`  | POST     | Generate resep dari bahan |
| `/api/remix/history`   | GET      | Riwayat resep yang dibuat |
| `/api/picker/scan`     | POST     | Scan makanan dari gambar  |
| `/api/picker/history`  | GET      | Riwayat pemindaian        |
| `/api/journal`         | POST/GET | Manajemen jurnal nutrisi  |
| `/api/chat`            | POST     | Chat dengan AI            |
| `/api/user/profile`    | GET/PUT  | Profil pengguna           |
| `/api/dashboard/stats` | GET      | Statistik dashboard       |
| `/api/notifications/*` | GET/POST | Notifikasi sistem         |

## 🤝 Kontribusi

Project ini menggunakan standar coding dengan:

- TypeScript untuk type safety
- ESLint untuk code linting
- Tailwind CSS untuk styling utility-first
- Prisma untuk database ORM

## 📄 Lisensi

Copyright © 2024 Foodremix. All rights reserved.

---

Made with ❤️ for reducing food waste and saving the planet.
