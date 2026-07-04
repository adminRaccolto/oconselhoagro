"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/#sobre", label: "O Conselho" },
  { href: "/participe", label: "Participe" },
  { href: "/alunos", label: "Alunos" },
  { href: "/parceiros", label: "Parceiros" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo — O Conselho Agro branco */}
          <Link href="/" aria-label="O Conselho Agro — Início" className="shrink-0">
            <Logo
              variant="white"
              className="w-52 h-12 lg:w-64 lg:h-14"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-heading font-semibold text-sm tracking-wide uppercase transition-colors",
                  pathname === href
                    ? "text-gold"
                    : "text-white/85 hover:text-gold"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/participe"
            className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-gold text-navy font-heading font-bold text-sm tracking-wide uppercase hover:bg-gold-light transition-colors"
          >
            Quero Participar
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-white p-2"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden bg-navy-dark border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-heading font-semibold text-sm tracking-wide uppercase py-3 text-white/85 hover:text-gold border-b border-white/10 last:border-0 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/participe"
              onClick={() => setOpen(false)}
              className="mt-3 text-center px-5 py-3 rounded-full bg-gold text-navy font-heading font-bold text-sm tracking-wide uppercase"
            >
              Quero Participar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
