import type { Metadata } from "next"
import Image from "next/image"
import { DiagnosticoForm } from "@/components/DiagnosticoForm"
import { Logo } from "@/components/Logo"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Diagnóstico Gratuito | O Conselho Agro",
  description: "Receba um diagnóstico gratuito da sua propriedade e descubra como o Conselho Agro pode transformar sua gestão.",
}

const beneficios = [
  "Diagnóstico personalizado da sua propriedade",
  "Identificação dos seus principais gargalos",
  "Visão das áreas que mais impactam sua rentabilidade",
  "Apresentação do ecossistema do Conselho Agro",
]

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header minimalista ── */}
      <header className="bg-navy py-4 px-6 flex items-center justify-center">
        <Logo variant="white" className="w-48 h-10" priority />
      </header>

      {/* ── Hero strip ── */}
      <div className="relative py-12 px-4 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          className="object-cover object-center scale-x-[-1]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/85" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-heading font-bold tracking-widest uppercase mb-4">
            Gratuito e sem compromisso
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white uppercase tracking-wide leading-tight">
            Descubra o que está freando{" "}
            <span className="text-gold">o crescimento da sua propriedade</span>
          </h1>
          <p className="text-white/65 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
            Responda algumas perguntas e receba um diagnóstico gratuito — direto no seu e-mail.
          </p>
        </div>
      </div>

      {/* ── Conteúdo principal ── */}
      <main className="flex-1 bg-cream py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Lado esquerdo — benefícios */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logos/digital.png" alt="" width={36} height={36} className="w-9 h-9 object-contain" />
                <h2 className="font-heading font-black text-xl text-navy uppercase tracking-wide">
                  O que você vai receber
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {beneficios.map(b => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-mid shrink-0 mt-0.5" />
                    <span className="text-navy/80 text-sm leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy rounded-2xl p-6 flex flex-col gap-3">
              <blockquote className="text-white/80 text-sm italic leading-relaxed">
                "Antes eu produzia bem. Agora eu giro bem. A diferença entre os dois
                é o que o Conselho me deu — visão de negócio."
              </blockquote>
              <p className="text-gold text-xs font-heading font-bold tracking-wide">
                — Produtor de grãos, 1.200 ha · Mato Grosso
              </p>
            </div>

            <div className="flex items-center gap-3 text-navy/40 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-mid" />
              100% gratuito · Sem spam · Dados protegidos
            </div>
          </div>

          {/* Lado direito — formulário */}
          <div className="bg-white rounded-2xl shadow-xl border border-navy/8 p-8">
            <h2 className="font-heading font-black text-lg text-navy uppercase tracking-wide mb-1">
              Faça seu diagnóstico
            </h2>
            <p className="text-navy/50 text-sm mb-6">
              Leva menos de 3 minutos.
            </p>
            <DiagnosticoForm />
          </div>
        </div>
      </main>

      {/* ── Footer minimalista ── */}
      <footer className="bg-navy py-6 px-4 text-center">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} O Conselho Agro · Uma iniciativa da Raccolto
        </p>
      </footer>
    </div>
  )
}
