import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  ChefHat,
  Gamepad2,
  House,
  Info,
  Mail,
  Phone,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/remix-area", label: "Remix Area", icon: ChefHat },
  { href: "/dashboard/game", label: "Game", icon: Gamepad2 },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#1a1a1a] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-food.png"
                alt="Foodremix Logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl bg-white/10 p-1 object-contain"
              />
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Foodremix
              </h3>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              Platform penyelamatan pangan berbasis AI Multimodal untuk membantu
              Anda mengurangi limbah makanan dapur dengan meracik menu kreatif
              dari bahan sisa kulkas.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-3 rounded-lg px-2 py-1 text-slate-400 transition duration-200 hover:text-[#eab308]"
                    >
                      <Icon className="h-4 w-4 text-[#eab308]/80" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white tracking-wide">
              Kontak
            </h4>
            <ul className="mt-5 space-y-4 text-slate-400">
              <li className="flex items-center gap-3">
                <AtSign className="h-5 w-5 text-[#eab308]" />
                <span className="hover:text-white transition duration-200 cursor-pointer">
                  foodremix.xyz
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#eab308]" />
                <span className="hover:text-white transition duration-200 cursor-pointer">
                  fooderemix@foodremix.xyz
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#eab308]" />
                <span className="hover:text-white transition duration-200 cursor-pointer">
                  +62 822-1098-0898
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-900/80 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Foodremix. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500">
            <span className="py-1 text-xs sm:text-sm font-medium">
              Made with ❤️ for reducing food waste and saving the planet.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
