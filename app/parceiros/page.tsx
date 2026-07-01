import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { Handshake, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Área de Parceiros | O Conselho Agro",
  description:
    "Portal exclusivo para parceiros do Conselho Agro — em breve disponível.",
};

export default function ParceirosPage() {
  return (
    <>
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center bg-cream min-h-screen">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
          <div className="relative">
            <Handshake className="h-16 w-16 text-navy/20" />
            <Clock className="h-8 w-8 text-gold absolute -bottom-2 -right-2" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-gold/40" />
            <Image src="/logos/digital.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
            <div className="h-px w-12 bg-gold/40" />
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl text-navy uppercase tracking-wide">
            Área de Parceiros
          </h1>

          <p className="text-navy/60 text-base leading-relaxed">
            O portal exclusivo para parceiros do Conselho Agro está em
            construção. Empresas e especialistas que desejam fazer parte desta
            rede receberão em breve acesso a este ambiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              href="/participe"
              className="px-8 py-3 rounded-full bg-gold text-navy font-heading font-bold text-sm tracking-wide uppercase hover:bg-gold-light transition-colors"
            >
              Quero ser Parceiro
            </Link>
            <Link
              href="/"
              className="px-8 py-3 rounded-full border border-navy/20 text-navy font-heading font-semibold text-sm tracking-wide uppercase hover:border-navy hover:bg-navy/5 transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
