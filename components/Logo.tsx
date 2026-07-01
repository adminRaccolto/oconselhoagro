import Image from "next/image";
import { cn } from "@/lib/utils";

/* Fingerprint icon — elemento decorativo SVG (não há arquivo separado para ele). */
export function FingerprintIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fp-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1B4A1B" />
          <stop offset="35%" stopColor="#2D6A1F" />
          <stop offset="65%" stopColor="#6B7C2B" />
          <stop offset="100%" stopColor="#C9A432" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="30" rx="27" ry="27" stroke="#C9A432" strokeWidth="2.5" />
      <ellipse cx="30" cy="30" rx="22" ry="22" stroke="#B8960C" strokeWidth="2.5" />
      <ellipse cx="30" cy="30" rx="17" ry="17" stroke="#8B7A2A" strokeWidth="2.5" />
      <ellipse cx="30" cy="30" rx="12" ry="12" stroke="#6B7C2B" strokeWidth="2.5" />
      <ellipse cx="30" cy="30" rx="7.5" ry="7.5" stroke="#4A7C20" strokeWidth="2.5" />
      <ellipse cx="30" cy="30" rx="3" ry="3" stroke="#2D6A1F" strokeWidth="2.5" />
      <line x1="10" y1="50" x2="50" y2="50" stroke="#C9A432" strokeWidth="1.2" opacity="0.6" />
      <line x1="14" y1="53" x2="46" y2="53" stroke="#C9A432" strokeWidth="1.2" opacity="0.4" />
      <line x1="18" y1="56" x2="42" y2="56" stroke="#C9A432" strokeWidth="1.2" opacity="0.2" />
    </svg>
  );
}

interface LogoProps {
  /**
   * full          — "O CONSELHO AGRO" empilhado colorido (fundos claros)
   * white         — versão branca para fundos escuros
   * combined      — logo horizontal "Raccolto | O CONSELHO AGRO" colorido
   * combined-white — logo horizontal branco para fundos escuros
   * raccolto      — logotipo Raccolto completo colorido
   * raccolto-white — Raccolto branco + sementes douradas
   * seeds         — só as sementes douradas
   * digital       — só o ícone digital (impressão) colorido verde/dourado
   * digital-white — só o ícone digital branco
   */
  variant?: "full" | "white" | "combined" | "combined-white" | "raccolto" | "raccolto-white" | "seeds" | "digital" | "digital-white" | "centralizado";
  className?: string;
  priority?: boolean;
}

const logoMap = {
  full:            { src: "/logos/conselho_agro_br.png",                   alt: "O Conselho Agro" },
  white:           { src: "/logos/conselho_agro_br_branco.png",            alt: "O Conselho Agro" },
  combined:        { src: "/logos/conselho_agro_br_Raccolto.png",          alt: "O Conselho Agro — Raccolto" },
  "combined-white":{ src: "/logos/conselho_agro_br_branco_Raccolto.png",   alt: "O Conselho Agro — Raccolto" },
  raccolto:        { src: "/logos/Completa_Original.png",                  alt: "Raccolto" },
  "raccolto-white":{ src: "/logos/Comp_Br_Oliva Amarela.png",             alt: "Raccolto" },
  seeds:           { src: "/logos/Logotipo_Br_Oliva Amarela.png",         alt: "Raccolto" },
  digital:         { src: "/logos/digital.png",                            alt: "O Conselho Agro" },
  "digital-white": { src: "/logos/digital_br.png",                        alt: "O Conselho Agro" },
  centralizado:    { src: "/logos/conselho_agro_br_Centralizado.png",      alt: "O Conselho Agro" },
} as const;

export function Logo({ variant = "combined-white", className, priority = false }: LogoProps) {
  const { src, alt } = logoMap[variant];
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-left"
        priority={priority}
        sizes="(max-width: 768px) 200px, 280px"
      />
    </div>
  );
}
