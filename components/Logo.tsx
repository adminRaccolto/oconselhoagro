import Image from "next/image";
import { cn } from "@/lib/utils";

/** Ícone fingerprint O Conselho Agro — versão branca (para fundos escuros). */
export function FingerprintIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <Image
        src="/logos/digital_br.png"
        alt=""
        fill
        className="object-contain"
        sizes="80px"
      />
    </div>
  );
}

interface LogoProps {
  /**
   * Fundos escuros (navy, petróleo):
   *   combined-white  — horizontal "Raccolto | fingerprint | CONSELHO AGRO" branco  ← padrão
   *   white           — "O CONSELHO AGRO" empilhado branco
   *   digital-white   — só o fingerprint digital branco
   *   raccolto-white  — logotipo Raccolto branco + sementes douradas
   *
   * Fundos claros:
   *   combined        — horizontal "Raccolto | fingerprint | CONSELHO AGRO" colorido
   *   full            — "O CONSELHO AGRO" empilhado colorido
   *   centralizado    — versão centralizada colorida (hero)
   *   digital         — só o fingerprint digital colorido verde/dourado
   *   raccolto        — logotipo Raccolto colorido completo
   *
   * Ícone isolado (fingerprint dourado):
   *   logomark / seeds
   */
  variant?:
    | "full" | "white"
    | "combined" | "combined-white"
    | "raccolto" | "raccolto-white"
    | "logomark" | "seeds"
    | "digital" | "digital-white"
    | "centralizado";
  className?: string;
  priority?: boolean;
}

const logoMap: Record<NonNullable<LogoProps["variant"]>, { src: string; alt: string }> = {
  // Fundos escuros (navy, petróleo)
  "combined-white": { src: "/logos/Comp_Br.png",                    alt: "O Conselho Agro — Raccolto" },
  white:            { src: "/logos/oconselhoagro_br.png",            alt: "O Conselho Agro" },
  "digital-white":  { src: "/logos/digital_br.png",                  alt: "O Conselho Agro" },
  "raccolto-white": { src: "/logos/Logotipo_Br.png",                 alt: "Raccolto" },
  // Fundos claros
  combined:         { src: "/logos/Comp_Br_Oliva Amarela.png",       alt: "O Conselho Agro — Raccolto" },
  full:             { src: "/logos/oconselhoagro.png",                alt: "O Conselho Agro" },
  centralizado:     { src: "/logos/oconselhoagro_br.png",            alt: "O Conselho Agro" },
  digital:          { src: "/logos/digital.png",                      alt: "O Conselho Agro" },
  raccolto:         { src: "/logos/Completa_Original.png",            alt: "Raccolto" },
  // Ícone isolado — estrela Raccolto dourada
  logomark:         { src: "/logos/Logotipo_Br_Oliva Amarela.png",   alt: "Raccolto" },
  seeds:            { src: "/logos/Logotipo_Br_Oliva Amarela.png",   alt: "Raccolto" },
};

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
