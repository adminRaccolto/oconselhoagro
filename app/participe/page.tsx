import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Participe | O Conselho Agro",
  description:
    "Faça parte do Conselho Agro e conecte-se a produtores rurais, especialistas e parceiros em um ambiente exclusivo de crescimento no agronegócio.",
};

const benefits = [
  "Acesso a conteúdos estratégicos exclusivos",
  "Discussões de alto nível com especialistas do agro",
  "Networking qualificado com produtores de todo o Brasil",
  "Ferramentas de gestão e profissionalização da fazenda",
  "Visão integrada: produção, finanças, mercado e legado",
  "Ambiente de troca de experiências e boas práticas",
  "Apoio à tomada de decisão com base em dados",
  "Crescimento estruturado, profissional e lucrativo",
];

export default function ParticipaPage() {
  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-20 px-4 text-center"
        style={{
          background:
            "linear-gradient(180deg, #0f1e3a 0%, #1a3566 50%, #1e3d0f 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, #c9a432 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-heading font-semibold tracking-widest uppercase mb-6">
            uma iniciativa da Raccolto
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-wide leading-tight">
            Mais do que produzir.{" "}
            <span className="text-gold block mt-1">
              É hora de construir legado.
            </span>
          </h1>
          <p className="mt-6 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Preencha o formulário abaixo e nossa equipe entrará em contato para
            apresentar o Conselho Agro e os próximos passos.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logos/digital.png" alt="" width={32} height={32} className="w-8 h-8 object-contain shrink-0" />
                <h2 className="font-heading font-black text-2xl text-navy uppercase tracking-wide">
                  O que você vai encontrar
                </h2>
              </div>
              <p className="text-navy/70 text-sm leading-relaxed">
                O Conselho Agro é um ambiente exclusivo onde produtores rurais e
                empresários do agro se reúnem para crescer juntos — de forma
                estruturada, profissional e com propósito.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-mid shrink-0 mt-0.5" />
                  <span className="text-navy/80 text-sm leading-snug">{b}</span>
                </li>
              ))}
            </ul>

            {/* Quote card */}
            <div className="bg-navy rounded-2xl p-6 flex flex-col gap-3">
              <blockquote className="text-white/80 text-sm italic leading-relaxed">
                "Cultivamos líderes. Fortalecemos famílias. Profissionalizamos
                propriedades. Transformamos conhecimento em resultado."
              </blockquote>
              <p className="text-gold text-xs font-heading font-semibold tracking-wide">
                — Propósito do Conselho Agro
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-xl border border-navy/10 p-8">
            <h2 className="font-heading font-black text-xl text-navy uppercase tracking-wide mb-1">
              Quero fazer parte
            </h2>
            <p className="text-navy/50 text-sm mb-6">
              Preencha seus dados e entraremos em contato.
            </p>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── VERSÍCULO ────────────────────────────────────────────────────── */}
      <section className="bg-navy py-12 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <blockquote className="font-heading font-bold text-base sm:text-lg text-white/80 italic leading-relaxed">
            "Você comerá do fruto do seu trabalho e será feliz e próspero."
          </blockquote>
          <cite className="text-gold font-heading font-semibold text-xs tracking-wide not-italic mt-2 block">
            Salmos 128:2
          </cite>
        </div>
      </section>

      <Footer />
    </>
  );
}
