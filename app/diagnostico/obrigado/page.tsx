"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/components/Logo"
import { ArrowRight, CheckCircle2, Play } from "lucide-react"

export default function DiagnosticoObrigadoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFinalizado, setVideoFinalizado] = useState(false)
  const [reproduzindo, setReproduzindo] = useState(false)

  function iniciarVideo() {
    videoRef.current?.play()
    setReproduzindo(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <header className="bg-navy py-4 px-6 flex items-center justify-center">
        <Logo variant="white" className="w-48 h-10" priority />
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">

          {/* Confirmação */}
          <div className="text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-mid flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-navy uppercase tracking-wide">
              Diagnóstico enviado!
            </h1>
            <p className="text-navy/60 text-sm max-w-md leading-relaxed">
              Verifique seu e-mail — seu diagnóstico está a caminho.
              Enquanto isso, assista à mensagem que preparamos para você.
            </p>
          </div>

          {/* Player de vídeo */}
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-navy relative aspect-video">
            {/* Substitua o src abaixo pela URL do vídeo quando estiver pronto */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onEnded={() => setVideoFinalizado(true)}
              playsInline
              src=""
            />

            {/* Thumbnail / botão play enquanto não reproduz */}
            {!reproduzindo && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Image
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1280&q=80"
                  alt=""
                  fill
                  className="object-cover opacity-40 scale-x-[-1]"
                  sizes="800px"
                />
                <button
                  onClick={iniciarVideo}
                  className="relative z-10 w-20 h-20 rounded-full bg-gold flex items-center justify-center shadow-xl hover:bg-gold-light transition-colors"
                  aria-label="Reproduzir vídeo"
                >
                  <Play className="w-8 h-8 text-navy fill-navy ml-1" />
                </button>
                <p className="relative z-10 text-white/70 text-xs font-heading font-semibold tracking-widest uppercase">
                  Assistir agora
                </p>
              </div>
            )}
          </div>

          {/* CTA — aparece após o vídeo terminar */}
          {videoFinalizado && (
            <div className="w-full bg-white rounded-2xl border border-gold/20 shadow-xl p-8 flex flex-col items-center gap-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Image src="/logos/digital.png" alt="" width={48} height={48} className="w-12 h-12 object-contain" />
              <h2 className="font-heading font-black text-2xl text-navy uppercase tracking-wide">
                Pronto para o próximo nível?
              </h2>
              <p className="text-navy/65 text-sm max-w-sm leading-relaxed">
                O Conselho Agro tem vagas limitadas. Se o diagnóstico mostrou que
                você está pronto, este é o momento de solicitar sua vaga.
              </p>
              <Link
                href="/participe"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors shadow-lg shadow-black/10"
              >
                Solicitar Minha Vaga <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-navy/35 text-xs font-heading tracking-wide">
                Vagas avaliadas individualmente · Turma 2025
              </p>
            </div>
          )}

          {/* Enquanto o vídeo não terminar, mostra hint */}
          {!videoFinalizado && reproduzindo && (
            <p className="text-navy/40 text-xs text-center font-heading tracking-wide">
              Assista até o final para continuar
            </p>
          )}
        </div>
      </main>

      <footer className="bg-navy py-6 px-4 text-center">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} O Conselho Agro · Uma iniciativa da Raccolto
        </p>
      </footer>
    </div>
  )
}
