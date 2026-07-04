import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Quote,
} from "lucide-react";

const stats = [
  { num: "27%",    desc: "do PIB brasileiro vem do agronegócio" },
  { num: "1°",     desc: "exportador mundial de soja, café e açúcar" },
  { num: "13 mi",  desc: "empregos diretos gerados no campo" },
  { num: "340 mi", desc: "hectares de área agropecuária" },
];

const isFor = [
  "Produtores rurais com visão de empresa, não só de fazenda",
  "Empresários do agro que querem escalar com estrutura",
  "Sucessores que precisam profissionalizar a gestão familiar",
  "Quem enxerga conhecimento como o maior ativo da propriedade",
  "Produtores dispostos a trocar experiências reais com pares",
];

const isNotFor = [
  "Quem busca atalhos sem comprometimento com o processo",
  "Produtores que não estão prontos para abrir o negócio",
  "Quem não vê valor em investir em gestão e pessoas",
];

const voices = [
  {
    quote: "Antes eu produzia bem. Agora eu giro bem. A diferença entre os dois é o que o Conselho me deu — visão de negócio.",
    name: "Produtor de grãos",
    detail: "3ª geração, 1.200 ha · Mato Grosso",
  },
  {
    quote: "Em seis meses de Conselho resolvi o que eu não conseguia resolver em anos sozinho: a sucessão da minha fazenda.",
    name: "Pecuarista",
    detail: "Criação intensiva · Mato Grosso do Sul",
  },
  {
    quote: "O networking aqui vale mais do que qualquer consultoria que já contratei. São pessoas reais com problemas reais e soluções reais.",
    name: "Empresária rural",
    detail: "Produção diversificada · São Paulo",
  },
];

const steps = [
  { n: "01", title: "Solicite sua vaga",    body: "Preencha o formulário. Nossa equipe avalia o seu perfil e entra em contato." },
  { n: "02", title: "Conversa de alinhamento", body: "Um encontro para entender seus objetivos e confirmar o encaixe no grupo." },
  { n: "03", title: "Acesse o ecossistema", body: "Especialistas, pares, conteúdos e encontros. Tudo em um único ambiente." },
  { n: "04", title: "Construa legado",      body: "Com estrutura, estratégia e as conexões certas, você vai mais longe — mais rápido." },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[96vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85"
          alt="Lavoura brasileira ao entardecer"
          fill
          className="object-cover object-center scale-x-[-1]"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(245,240,220,0.55) 0%, rgba(13,27,53,0.10) 28%, rgba(13,27,53,0.75) 55%, rgba(10,20,8,0.97) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{ background: "radial-gradient(ellipse at 50% 78%, #c9a432 0%, transparent 52%)" }}
          aria-hidden="true"
        />

        {/* Marca d'água digital — cobre todo o hero, bem discreta */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image
            src="/logos/digital_br.png"
            alt=""
            fill
            className="object-contain opacity-[0.07]"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 max-w-4xl mx-auto pt-28 pb-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-700 border border-red-500/40 text-white text-xs font-heading font-bold tracking-widest uppercase shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Vagas Limitadas
          </span>

          <Logo variant="centralizado" className="w-96 h-36 sm:w-xl sm:h-54 filter-[drop-shadow(0_0_24px_rgba(255,255,255,0.7))_drop-shadow(0_0_48px_rgba(255,255,255,0.35))]" priority />

          <div className="w-24 h-px bg-gold/60" />

          <h1 className="text-white font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-wide uppercase leading-tight max-w-3xl">
            Ecossistema de{" "}
            <span className="text-gold">Inteligência e Crescimento</span>{" "}
            do Agro
          </h1>

          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">
            O sistema que transforma produtores rurais em{" "}
            <span className="text-white font-semibold">empresários preparados para crescer.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/participe"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-navy font-heading font-bold text-sm tracking-wide uppercase hover:bg-gold-light transition-colors shadow-lg shadow-black/30"
            >
              Solicitar Minha Vaga <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#selecao"
              className="px-8 py-3 rounded-full border border-white/30 text-white/80 font-heading font-semibold text-sm tracking-wide uppercase hover:border-gold hover:text-gold transition-colors"
            >
              Isso é para mim?
            </Link>
          </div>

          <p className="text-white/35 text-xs font-heading tracking-wide mt-1">
            As vagas são avaliadas individualmente. Não aceitamos todo mundo.
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30" aria-hidden="true">
          <div className="w-px h-8 bg-linear-to-b from-transparent to-white/30" />
          <span className="text-[10px] tracking-widest uppercase">Role</span>
        </div>
      </section>

      {/* ── DORES DO PRODUTOR ───────────────────────────────────────────── */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
          {[
            "Você produz muito.",
            "Mas não vê o resultado do esforço.",
            "Sente que a fazenda depende demais de você.",
            "As decisões ficam fragmentadas.",
            "Os especialistas não conversam entre si.",
            "A sucessão preocupa.",
            "A produtividade cresce...",
            "Mas o lucro não acompanha.",
            "A gestão não evolui.",
          ].map((text, i) => (
            <p key={i} className="font-heading font-bold text-xl sm:text-2xl text-navy leading-snug">
              {text}
            </p>
          ))}
          <div className="w-24 h-px bg-gold mx-auto my-6" />
          <p className="font-heading font-black text-2xl sm:text-3xl text-gold uppercase tracking-wide leading-snug">
            Foi para resolver isso que nasceu o Conselho Agro.
          </p>
        </div>
      </section>

      {/* ── ANTES / DEPOIS ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-navy">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-heading font-semibold text-xs tracking-[0.3em] uppercase mb-3">Transformação</p>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-wide">
              O que muda
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { antes: "Produtor resolve tudo sozinho.", depois: "Você passa a contar com um conselho estratégico." },
              { antes: "Cada especialista fala uma língua.", depois: "Todos trabalham alinhados." },
              { antes: "Problemas aparecem quando já são grandes.", depois: "As decisões passam a ser preventivas." },
            ].map(({ antes, depois }) => (
              <div key={antes} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                <div className="bg-white/8 rounded-2xl p-5 sm:p-6 border border-white/10 text-right">
                  <p className="text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-white/30 mb-2">Antes</p>
                  <p className="text-white/70 text-sm sm:text-base leading-snug font-heading font-semibold">{antes}</p>
                </div>
                <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gold shrink-0 shadow-lg shadow-gold/30">
                  <ArrowRight className="h-4 w-4 text-navy" />
                </div>
                <div className="bg-gold/10 rounded-2xl p-5 sm:p-6 border border-gold/30">
                  <p className="text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-gold/70 mb-2">Depois</p>
                  <p className="text-white font-heading font-bold text-sm sm:text-base leading-snug">{depois}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A POTÊNCIA DO AGRO ───────────────────────────────────────────── */}
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0d1b35 0%, #1a3a0e 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-white font-heading font-semibold text-3xl tracking-[0.3em] uppercase mb-3">
              Por que o Conselho Agro existe
            </p>
            <h2 className="font-heading font-black text-2xl sm:text-2xl text-white uppercase tracking-wide">
              O Agronegócio Brasileiro é{" "}
              <span className="text-gold">o Maior do Mundo</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {stats.map(({ num, desc }) => (
              <div
                key={num}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gold/15 bg-white/5 text-center"
              >
                <span className="font-heading font-black text-2xl text-gold">{num}</span>
                <span className="text-white/55 text-xs leading-snug">{desc}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-5 max-w-2xl mx-auto">
            <div className="w-full h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />
            <p className="text-white font-heading font-black text-2xl sm:text-3xl leading-snug text-center px-4 uppercase tracking-wide">
              Uma força dessa magnitude{" "}
              <span className="text-gold">merece uma rede à altura</span>
            </p>
            <p className="text-white/80 font-heading font-bold text-lg sm:text-xl text-center px-4">
              Estruturada, especializada e completamente focada no produtor.
            </p>
            <div className="w-full h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── ISSO É PARA MIM? (SELEÇÃO) ───────────────────────────────────── */}
      <section id="selecao" className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-16 bg-gold/40" />
              <Image src="/logos/digital.png" alt="" width={32} height={32} className="w-8 h-8 object-contain" />
              <div className="h-px flex-1 max-w-16 bg-gold/40" />
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-navy uppercase tracking-wide">
              O Conselho Seleciona
            </h2>
            <p className="text-navy/60 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Não aceitamos qualquer produtor — aceitamos os produtores certos.
              Porque um grupo de alto nível só funciona quando todo mundo joga no mesmo nível.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* É para você */}
            <div className="bg-navy rounded-2xl p-8 border border-navy">
              <h3 className="font-heading font-black text-base text-white uppercase tracking-wide mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                É para você se…
              </h3>
              <ul className="flex flex-col gap-4">
                {isFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Não é para você */}
            <div className="bg-white rounded-2xl p-8 border-2 border-navy/15">
              <h3 className="font-heading font-black text-base text-navy uppercase tracking-wide mb-6 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-navy/40 shrink-0" />
                Não é para você se…
              </h3>
              <ul className="flex flex-col gap-4">
                {isNotFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-navy/30 shrink-0 mt-0.5" />
                    <span className="text-navy/60 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-navy/10">
                <p className="text-navy/50 text-xs leading-relaxed italic">
                  "Se você chegou até aqui e se reconheceu no primeiro bloco,
                  provavelmente você já é o perfil que buscamos."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── O ECOSSISTEMA (MANDALA) ──────────────────────────────────────── */}
      <section id="ecossistema" className="bg-navy py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-wide">
              O Ecossistema
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
              Montar uma equipe assim por conta própria custaria fortunas.
              No Conselho, você acessa todas as áreas em um único ecossistema —
              especialistas de referência, disponíveis para os membros.
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/logos/Mandala.png"
              alt="Ecossistema O Conselho Agro — Financeiro, Comunidade, Conselho, Gestão, Jurídico, Capital, Contabilidade, Especialistas"
              width={700}
              height={747}
              className="w-full max-w-2xl h-auto"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        </div>
      </section>

      {/* ── VOZES DE MEMBROS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-heading font-semibold text-xs tracking-[0.3em] uppercase mb-3">
              Quem está dentro
            </p>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy uppercase tracking-wide">
              O que os membros dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {voices.map(({ quote, name, detail }) => (
              <div
                key={name}
                className="relative bg-white rounded-2xl p-8 border-2 border-navy/10 flex flex-col gap-5 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-200"
              >
                <Quote className="h-8 w-8 text-gold/50 shrink-0" />
                <p className="text-navy/70 text-sm leading-relaxed flex-1 italic">{quote}</p>
                <div className="border-t border-navy/10 pt-4">
                  <p className="text-gold font-heading font-bold text-xs tracking-wide">{name}</p>
                  <p className="text-navy/40 text-xs mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────────────────────── */}
      <section className="bg-navy py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold font-heading font-semibold text-xs tracking-[0.3em] uppercase mb-3">Processo</p>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-wide">
              Como Funciona
            </h2>
            <p className="text-white/50 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              O processo de entrada no Conselho Agro é simples — e intencional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div
              className="hidden lg:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gold/30"
              aria-hidden="true"
            />
            {steps.map(({ n, title, body }) => (
              <div key={n} className="flex flex-col items-center text-center gap-4 relative">
                <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shrink-0 relative z-10 shadow-lg shadow-gold/20">
                  <span className="font-heading font-black text-navy text-sm">{n}</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wide">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A RACCOLTO ───────────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start gap-6">
              <Logo variant="full" className="w-52 h-24" />
              <div className="h-1 w-16 bg-gold rounded-full" />
              <p className="text-2xl sm:text-3xl font-heading font-black text-navy leading-tight">
                Mais do que consultoria.{" "}
                <span className="text-green-dark">Somos parceiros na construção de um legado.</span>
              </p>
              <p className="text-navy/70 leading-relaxed text-sm">
                A Raccolto nasceu para ajudar produtores rurais a administrarem suas
                propriedades com visão empresarial. O Conselho Agro é a nossa maior
                expressão: um ecossistema completo, exclusivo e focado em resultado real.
              </p>
              <Link
                href="/participe"
                className="inline-flex items-center gap-2 text-sm font-heading font-bold text-navy uppercase tracking-wide hover:text-gold transition-colors"
              >
                Solicitar uma vaga <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { num: "360°", desc: "Visão integrada: gestão, mercado, liderança e legado" },
                { num: "8",    desc: "Áreas de expertise reunidas em um único conselho" },
                { num: "1°",   desc: "Ecossistema exclusivo de alto padrão no agronegócio" },
                { num: "∞",    desc: "Conexões, aprendizados e oportunidades de crescimento" },
              ].map(({ num, desc }) => (
                <div key={num} className="bg-cream rounded-2xl p-6 flex flex-col gap-2 border border-gold/10">
                  <span className="font-heading font-black text-3xl text-gold">{num}</span>
                  <span className="text-navy/60 text-xs leading-snug">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VERSÍCULO ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4 text-center border-t border-navy/8">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-gold/40" />
          <blockquote className="font-heading font-bold text-xl sm:text-2xl text-navy italic leading-relaxed">
            "Você comerá do fruto do seu trabalho e será feliz e próspero."
          </blockquote>
          <cite className="text-gold font-heading font-semibold text-sm tracking-wide not-italic">
            Salmos 128:2
          </cite>
          <div className="h-px w-12 bg-gold/40" />
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-4 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80"
          alt="Campos agrícolas ao amanhecer"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,27,53,0.93) 0%, rgba(26,58,14,0.93) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at center, #c9a432 0%, transparent 60%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
          <Logo variant="white" className="w-48 h-20 sm:w-64 sm:h-28 mb-2" />
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight">
            As vagas são <span className="text-gold">limitadas.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-md">
            Se você chegou até aqui, provavelmente já sabe que o Conselho Agro
            é o que faltava. Não deixe a vaga passar.
          </p>
          <Link
            href="/participe"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors shadow-lg shadow-black/30"
          >
            Solicitar Minha Vaga <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-white/35 text-xs font-heading tracking-wide">
            Vagas avaliadas individualmente · Turma 2025
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
