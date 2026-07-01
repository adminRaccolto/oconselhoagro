import Link from "next/link";
import { Logo } from "./Logo";
import { Separator } from "@/components/ui/separator";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://instagram.com/raccolto_gestao",
    label: "@raccolto_gestao no Instagram",
    icon: IconInstagram,
    text: "@raccolto_gestao",
  },
  {
    href: "https://linkedin.com/company/raccolto-gestao",
    label: "Raccolto Gestão no LinkedIn",
    icon: IconLinkedin,
    text: "Raccolto Gestão",
  },
  {
    href: "https://youtube.com/@raccoltogestao",
    label: "Raccolto Gestão no YouTube",
    icon: IconYoutube,
    text: "Raccolto Gestão",
  },
];

const footerLinks = [
  { href: "/", label: "Início" },
  { href: "/#sobre", label: "O Conselho" },
  { href: "/participe", label: "Participe" },
  { href: "/alunos", label: "Alunos" },
  { href: "/parceiros", label: "Parceiros" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & tagline */}
          <div className="flex flex-col gap-4">
            {/* combined-white = Raccolto | O CONSELHO AGRO branco, para fundo escuro */}
            <Logo variant="combined-white" className="w-56 h-16" />
            <p className="text-white/60 text-sm leading-relaxed mt-2 max-w-xs italic">
              "Cultivamos muito mais do que a terra. Cultivamos o propósito que
              Deus confiou às nossas mãos."
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-bold text-xs tracking-widest uppercase text-gold mb-4">
              Navegação
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-gold text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & contact */}
          <div>
            <h3 className="font-heading font-bold text-xs tracking-widest uppercase text-gold mb-4">
              Conecte-se Conosco
            </h3>
            <ul className="flex flex-col gap-3">
              {socialLinks.map(({ href, label, icon: Icon, text }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center gap-3 text-white/70 hover:text-gold text-sm transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Logo variant="seeds" className="w-5 h-5 opacity-80 shrink-0" />
            <span>
              © {new Date().getFullYear()} Raccolto Gestão. Todos os direitos
              reservados.
            </span>
          </div>
          <p className="text-white/40 text-xs text-center sm:text-right">
            oconselhoagro.com.br · Uma iniciativa da Raccolto
          </p>
        </div>
      </div>
    </footer>
  );
}
