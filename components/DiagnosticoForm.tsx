"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────────
type Atividade = "soja" | "milho" | "algodao" | "cana" | "gado" | "outro"
type SistemaGado = "pasto" | "semi" | "confinado"
type Step = "identificacao" | "atividade" | "operacao" | "custos" | "financeiro" | "gestao" | "enviando"

interface FormState {
  nomeCompleto: string; cpfCnpj: string; celular: string; email: string
  atividade: Atividade | null; sistemaGado: SistemaGado | null
  // Bloco 1
  temEstruturaPropria: boolean | null
  percentualArrendado: number | null
  arrendamentoValor: string
  arrendamentoUnidade: "sacas" | "arrobas"
  operacoesTerceirizadas: string[]
  producaoMedia: string
  // Bloco 1 — Gado pasto/semi
  taxaLotacao: string; taxaDesfrute: string; pastageDegradada: string; mesesSemiConf: string
  // Bloco 1 — Gado confinado
  gpdMedio: string; diasConfinamento: string
  // Bloco 2
  custoInsumos: string
  hectaresPorTrabalhador: number | null
  travaComercializacao: boolean | null
  boaLeituraMercado: boolean | null
  // Bloco 2 — Confinado
  conversaoAlimentar: string; custoDietaArroba: string
  // Bloco 3
  frustracaoSafraIdx: number | null; sacasPerdidas: string; percentualCusteio: string; captacoes: string
  // Bloco 4
  usaSoftwareGestao: string; sabeCustoPorUnidade: boolean | null
  clarezaCustos: boolean | null; baseDecisoes: string; reuniaoFechamento: boolean | null
}

// ── Constants ──────────────────────────────────────────────────────────────────

const ATIVIDADES = [
  { valor: "soja",    label: "Soja" },
  { valor: "milho",   label: "Milho" },
  { valor: "algodao", label: "Algodão" },
  { valor: "gado",    label: "Gado" },
  { valor: "cana",    label: "Cana" },
  { valor: "outro",   label: "Outro" },
]

const SISTEMAS_GADO = [
  { valor: "pasto",     label: "Boi a pasto" },
  { valor: "semi",      label: "Semi-confinado" },
  { valor: "confinado", label: "Confinamento" },
]

const ARRENDADO_OPCOES = [
  { valor: 0,  label: "Tudo próprio — sem área arrendada" },
  { valor: 15, label: "Até 30% da área é arrendada" },
  { valor: 45, label: "30% a 60% da área é arrendada" },
  { valor: 75, label: "Mais de 60% da área é arrendada" },
]

const HA_TRABALHADOR_OPCOES = [
  { valor: 100, label: "Menos de 150 ha por colaborador" },
  { valor: 200, label: "150 a 300 ha por colaborador" },
  { valor: 400, label: "300 a 500 ha por colaborador" },
  { valor: 600, label: "Mais de 500 ha por colaborador" },
]

const SOFTWARE_GESTAO_OPCOES = [
  { valor: "utilizo_confio",        label: "Utilizo e confio nos dados — base para decisão" },
  { valor: "so_escritorio",         label: "Somente o escritório usa — não acompanho" },
  { valor: "utilizo_sem_seguranca", label: "Utilizo, mas sem segurança nos lançamentos" },
  { valor: "nao_utilizo",           label: "Não utilizo software de gestão" },
]

const BASE_DECISOES_OPCOES = [
  { valor: "dados",       label: "Principalmente em dados e relatórios" },
  { valor: "ambos",       label: "Combinação de dados e experiência" },
  { valor: "experiencia", label: "Principalmente na experiência e intuição" },
]

const CUSTEIO_OPCOES = [
  { valor: "nao_utilizo", label: "Não utilizo custeio bancário" },
  { valor: "25",          label: "Aproximadamente 25%" },
  { valor: "26_50",       label: "Entre 26% e 50%" },
  { valor: "51_75",       label: "Entre 51% e 75%" },
  { valor: "76_100",      label: "Entre 76% e 100%" },
]

const CAPTACOES_OPCOES = [
  { valor: "nao_precisei", label: "Não precisei captar recursos — opera com capital próprio" },
  { valor: "diminuiu",     label: "Diminuíram ou se mantiveram — saúde financeira estável" },
  { valor: "aumentou",     label: "Aumentaram — cresceu a dependência de crédito" },
]

// ── Per-culture helpers ────────────────────────────────────────────────────────

function isGraos(a: Atividade | null) { return a === "soja" || a === "milho" }

function getEstruturaLabel(a: Atividade | null, s: SistemaGado | null) {
  if (isGraos(a)) return "A fazenda possui silo ou armazém próprio?"
  if (a === "algodao") return "A fazenda possui estrutura própria de armazenamento ou enfardamento?"
  if (a === "cana") return "A fazenda possui colhedora ou frota própria de corte?"
  if (a === "gado" && s === "confinado") return "Possui instalações próprias de confinamento (cochos, bebedouros, curral)?"
  return "A fazenda possui estrutura de manejo adequada (curral, brete, balança)?"
}

function getProducaoLabel(a: Atividade | null) {
  if (a === "soja")    return "Produção média de soja por hectare (sc/ha)"
  if (a === "milho")   return "Produção média de milho por hectare (sc/ha)"
  if (a === "algodao") return "Produção média de algodão em caroço por hectare (@/ha)"
  return "Produção média de cana por hectare (TCH)"
}

function getOperacoesOpcoes(a: Atividade | null, s: SistemaGado | null) {
  if (a === "gado" && s === "confinado") return [
    { valor: "nutricao",   label: "Formulação de dieta / nutrição" },
    { valor: "compra",     label: "Compra de animais" },
    { valor: "transporte", label: "Transporte" },
    { valor: "nenhuma",    label: "Nenhuma — tudo próprio" },
  ]
  if (a === "gado") return [
    { valor: "peao",          label: "Mão de obra de peão" },
    { valor: "sanitario",     label: "Manejo sanitário" },
    { valor: "suplementacao", label: "Suplementação" },
    { valor: "transporte",    label: "Transporte de gado" },
    { valor: "nenhuma",       label: "Nenhuma — tudo próprio" },
  ]
  if (a === "cana") return [
    { valor: "colheita",   label: "Corte / Colheita" },
    { valor: "plantio",    label: "Plantio e Reforma" },
    { valor: "aplicacao",  label: "Aplicação" },
    { valor: "transporte", label: "Transporte" },
    { valor: "nenhuma",    label: "Nenhuma — tudo próprio" },
  ]
  return [
    { valor: "colheita",   label: "Colheita" },
    { valor: "plantio",    label: a === "algodao" ? "Plantio e Reforma" : "Plantio" },
    { valor: "aplicacao",  label: "Aplicação" },
    { valor: "transporte", label: "Transporte" },
    { valor: "nenhuma",    label: "Nenhuma — tudo próprio" },
  ]
}

function getCustoInsumoLabel(a: Atividade | null, s: SistemaGado | null) {
  if (isGraos(a))   return "Custos de insumos diretos (sementes, fertilizantes e defensivos) em sacas por hectare"
  if (a === "algodao") return "Custos de insumos diretos em arrobas de pluma por hectare"
  if (a === "cana")    return "Custos de insumos diretos em toneladas de cana por hectare (TCH/ha)"
  if (a === "gado" && s !== "confinado")
    return "Custo de suplementação, sal mineral e insumos veterinários por UA/ano (em arrobas equivalentes)"
  return ""
}

function getCustoInsumoOpcoes(a: Atividade | null, s: SistemaGado | null): { valor: string; label: string }[] {
  if (isGraos(a)) return [
    { valor: "lte26", label: "≤ 26 sc/ha" },
    { valor: "27",    label: "27 sc/ha" },
    { valor: "28",    label: "28 sc/ha" },
    { valor: "29",    label: "29 sc/ha" },
    { valor: "30",    label: "30 sc/ha" },
    { valor: "31",    label: "31 sc/ha" },
    { valor: "32",    label: "32 sc/ha" },
    { valor: "gte32", label: "≥ 32 sc/ha" },
  ]
  if (a === "algodao") return [
    { valor: "lte50", label: "Até 50 @/ha" },
    { valor: "55",    label: "55 @/ha" },
    { valor: "60",    label: "60 @/ha" },
    { valor: "65",    label: "65 @/ha" },
    { valor: "70",    label: "70 @/ha" },
    { valor: "75",    label: "75 @/ha" },
    { valor: "80",    label: "80 @/ha" },
    { valor: "gte80", label: "Acima de 80 @/ha" },
  ]
  if (a === "cana") return [
    { valor: "lte15", label: "Até 15 TCH/ha" },
    { valor: "16_20", label: "16 a 20 TCH/ha" },
    { valor: "21_25", label: "21 a 25 TCH/ha" },
    { valor: "26_30", label: "26 a 30 TCH/ha" },
    { valor: "gte31", label: "Acima de 31 TCH/ha" },
  ]
  if (a === "gado" && s !== "confinado") return [
    { valor: "lte1", label: "Até 1 @/UA/ano" },
    { valor: "1_15", label: "1 a 1,5 @/UA/ano" },
    { valor: "15_2", label: "1,5 a 2 @/UA/ano" },
    { valor: "gte2", label: "Acima de 2 @/UA/ano" },
  ]
  return []
}

function getTravaLabel(a: Atividade | null) {
  if (isGraos(a))   return "Costuma travar seus custos com venda antecipada de grãos?"
  if (a === "algodao") return "Faz hedge (B3/HedgePoint) para proteção de preço?"
  if (a === "cana")    return "Fixa o preço do ATR ou tem contrato de fornecimento negociado com antecedência?"
  if (a === "gado")    return "Negocia com mais de um frigorífico?"
  return "Faz proteção de preço ou trava de comercialização?"
}

function getMercadoLabel(a: Atividade | null) {
  if (a === "cana") return "Considera ter boa posição de negociação com a usina?"
  if (a === "gado") return "Considera ter boa leitura do mercado de boi gordo?"
  return "Considera ter boa leitura do mercado de comercialização?"
}

function getFrustracaoLabel(a: Atividade | null) {
  if (a === "gado") return "Houve evento crítico no rebanho nos últimos 3 anos (seca severa, surto de doença, mortalidade elevada)?"
  return "Houve frustração de safra nos últimos 3 anos?"
}

function getFrustracaoOpcoes(a: Atividade | null) {
  if (a === "gado") return [
    { label: "Nenhum — sem eventos críticos" },
    { label: "1 evento nos últimos 3 anos" },
    { label: "2 eventos" },
    { label: "3 ou mais eventos" },
  ]
  return [
    { label: "Nenhuma — sem perdas relevantes" },
    { label: "1 safra afetada nos últimos 3 anos" },
    { label: "2 safras afetadas" },
    { label: "3 ou mais safras afetadas" },
  ]
}

function getPerdaUnidade(a: Atividade | null) {
  if (a === "cana")    return "TCH/ha"
  if (a === "algodao") return "@/ha"
  if (a === "gado")    return "arrobas"
  return "sacas/ha"
}

function getSacaLabel(a: Atividade | null) {
  if (a === "gado" || a === "algodao") return "Sabe o custo de produção por arroba (@)?"
  if (a === "cana") return "Sabe o custo de produção por tonelada de cana?"
  return "Sabe o custo de produção por saca?"
}

// ── Progress steps ─────────────────────────────────────────────────────────────

const STEPS: Step[] = ["identificacao", "atividade", "operacao", "custos", "financeiro", "gestao"]
const STEP_LABELS = ["Identificação", "Atividade", "Operação", "Custos", "Financeiro", "Gestão"]

// ── Component ──────────────────────────────────────────────────────────────────

export function DiagnosticoForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("identificacao")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const [form, setForm] = useState<FormState>({
    nomeCompleto: "", cpfCnpj: "", celular: "", email: "",
    atividade: null, sistemaGado: null,
    temEstruturaPropria: null, percentualArrendado: null,
    arrendamentoValor: "", arrendamentoUnidade: "sacas",
    operacoesTerceirizadas: [], producaoMedia: "",
    taxaLotacao: "", taxaDesfrute: "", pastageDegradada: "", mesesSemiConf: "",
    gpdMedio: "", diasConfinamento: "",
    custoInsumos: "", hectaresPorTrabalhador: null,
    travaComercializacao: null, boaLeituraMercado: null,
    conversaoAlimentar: "", custoDietaArroba: "",
    frustracaoSafraIdx: null, sacasPerdidas: "", percentualCusteio: "", captacoes: "",
    usaSoftwareGestao: "", sabeCustoPorUnidade: null,
    clarezaCustos: null, baseDecisoes: "", reuniaoFechamento: null,
  })

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(f => ({ ...f, [field]: value }))
    setErro("")
  }

  function toggleOperacao(valor: string) {
    setForm(f => {
      const curr = f.operacoesTerceirizadas
      if (valor === "nenhuma") return { ...f, operacoesTerceirizadas: ["nenhuma"] }
      const sem = curr.filter(v => v !== "nenhuma")
      return { ...f, operacoesTerceirizadas: sem.includes(valor) ? sem.filter(v => v !== valor) : [...sem, valor] }
    })
    setErro("")
  }

  const a = form.atividade
  const s = form.sistemaGado

  // ── Navigation ─────────────────────────────────────────────────────────────

  async function avancarParaAtividade() {
    if (!form.nomeCompleto || !form.celular || !form.email)
      return setErro("Preencha todos os campos obrigatórios.")
    setLoading(true)
    try {
      fetch("/api/diagnostico/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ celular: form.celular, nomeCompleto: form.nomeCompleto, email: form.email, cpfCnpj: form.cpfCnpj }),
      }).catch(() => {})
      setStep("atividade")
    } finally {
      setLoading(false)
    }
  }

  async function avancarParaOperacao() {
    if (!a) return setErro("Selecione a atividade principal.")
    if (a === "gado" && !s) return setErro("Selecione o sistema de produção.")
    if (a === "outro") return submitOutro()
    setErro("")
    setStep("operacao")
  }

  function avancarParaCustos() {
    if (form.temEstruturaPropria === null || form.percentualArrendado === null)
      return setErro("Responda todas as perguntas antes de continuar.")
    if (form.operacoesTerceirizadas.length === 0)
      return setErro("Selecione ao menos uma opção de operações.")
    if (a !== "gado" && !form.producaoMedia)
      return setErro("Informe a produção média.")
    if (a === "gado" && s !== "confinado") {
      if (!form.taxaLotacao || !form.taxaDesfrute || !form.pastageDegradada)
        return setErro("Responda todas as perguntas antes de continuar.")
      if (s === "semi" && !form.mesesSemiConf)
        return setErro("Informe os meses de semi-confinamento.")
    }
    if (a === "gado" && s === "confinado" && (!form.gpdMedio || !form.diasConfinamento))
      return setErro("Responda todas as perguntas antes de continuar.")
    setErro("")
    setStep("custos")
  }

  function avancarParaFinanceiro() {
    if (a === "gado" && s === "confinado") {
      if (!form.conversaoAlimentar || !form.custoDietaArroba)
        return setErro("Responda todas as perguntas antes de continuar.")
    } else {
      if (!form.custoInsumos)
        return setErro("Responda todas as perguntas antes de continuar.")
    }
    if (form.hectaresPorTrabalhador === null)
      return setErro("Responda todas as perguntas antes de continuar.")
    if (form.travaComercializacao === null || form.boaLeituraMercado === null)
      return setErro("Responda todas as perguntas antes de continuar.")
    setErro("")
    setStep("financeiro")
  }

  function avancarParaGestao() {
    if (form.frustracaoSafraIdx === null || !form.percentualCusteio || !form.captacoes)
      return setErro("Responda todas as perguntas antes de continuar.")
    setErro("")
    setStep("gestao")
  }

  async function submitOutro() {
    setStep("enviando")
    try {
      await fetch("/api/diagnostico/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nomeCompleto, email: form.email,
          telefone: form.celular, cpfCnpj: form.cpfCnpj || undefined,
          atividade: "outro",
        }),
      })
      router.push("/diagnostico/obrigado")
    } catch {
      setStep("atividade")
      setErro("Erro de conexão. Tente novamente.")
    }
  }

  async function enviarDiagnostico() {
    if (!form.usaSoftwareGestao || form.sabeCustoPorUnidade === null ||
        form.clarezaCustos === null || !form.baseDecisoes || form.reuniaoFechamento === null)
      return setErro("Responda todas as perguntas antes de enviar.")
    setStep("enviando")
    try {
      const res = await fetch("/api/diagnostico/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nomeCompleto, email: form.email,
          telefone: form.celular, cpfCnpj: form.cpfCnpj || undefined,
          atividade: a, sistemaGado: s,
          // B1
          temEstruturaPropria: form.temEstruturaPropria,
          percentualArrendado: form.percentualArrendado,
          arrendamentoValor: form.arrendamentoValor || undefined,
          arrendamentoUnidade: form.arrendamentoValor ? form.arrendamentoUnidade : undefined,
          operacoesTerceirizadas: form.operacoesTerceirizadas,
          producaoMedia: form.producaoMedia || undefined,
          taxaLotacao: form.taxaLotacao || undefined,
          taxaDesfrute: form.taxaDesfrute || undefined,
          pastageDegradada: form.pastageDegradada || undefined,
          mesesSemiConf: form.mesesSemiConf || undefined,
          gpdMedio: form.gpdMedio || undefined,
          diasConfinamento: form.diasConfinamento || undefined,
          // B2
          custoInsumos: form.custoInsumos || undefined,
          hectaresPorTrabalhador: form.hectaresPorTrabalhador,
          travaComercializacao: form.travaComercializacao,
          boaLeituraMercado: form.boaLeituraMercado,
          conversaoAlimentar: form.conversaoAlimentar || undefined,
          custoDietaArroba: form.custoDietaArroba || undefined,
          // B3
          frustracaoSafra: form.frustracaoSafraIdx,
          sacasPerdidas: form.sacasPerdidas ? Number(form.sacasPerdidas) : undefined,
          percentualCusteio: form.percentualCusteio,
          captacoes: form.captacoes,
          // B4
          usaSoftwareGestao: form.usaSoftwareGestao,
          sabeCustoPorUnidade: form.sabeCustoPorUnidade,
          clarezaCustos: form.clarezaCustos,
          baseDecisoes: form.baseDecisoes,
          reuniaoFechamento: form.reuniaoFechamento,
        }),
      })
      if (!res.ok) { setStep("gestao"); return setErro("Erro ao enviar. Tente novamente.") }
      router.push("/diagnostico/obrigado")
    } catch {
      setStep("gestao")
      setErro("Erro de conexão. Tente novamente.")
    }
  }

  // ── Shared styles ───────────────────────────────────────────────────────────
  const labelCls = "block text-xs font-heading font-semibold text-navy/60 uppercase tracking-wide mb-2"
  const inputCls = "w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"

  function BoolBtn({ valor, atual, onChange }: { valor: boolean; atual: boolean | null; onChange: (v: boolean) => void }) {
    return (
      <button type="button" onClick={() => onChange(valor)}
        className={`flex-1 py-3 rounded-xl border text-sm font-heading font-bold transition-colors ${atual === valor ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy/60 hover:border-navy/40"}`}>
        {valor ? "Sim" : "Não"}
      </button>
    )
  }

  function RadioGroup<T extends string | number>({ opcoes, valor, onChange }: {
    opcoes: { valor: T; label: string }[]; valor: T | null; onChange: (v: T) => void
  }) {
    return (
      <div className="flex flex-col gap-2">
        {opcoes.map(op => (
          <button key={String(op.valor)} type="button" onClick={() => onChange(op.valor)}
            className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${valor === op.valor ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}>
            {op.label}
          </button>
        ))}
      </div>
    )
  }

  const stepIdx = step === "enviando" ? -1 : STEPS.indexOf(step as Step)

  const btnCls = "mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors"

  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Barra de progresso */}
      {step !== "enviando" && (
        <div className="flex items-center gap-1.5 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-black shrink-0 transition-colors ${i < stepIdx ? "bg-green-mid text-white" : i === stepIdx ? "bg-gold text-navy" : "bg-navy/10 text-navy/30"}`}>
                {i < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-heading font-semibold hidden sm:block truncate ${i === stepIdx ? "text-navy" : "text-navy/30"}`}>{label}</span>
              {i < STEP_LABELS.length - 1 && <div className={`h-px flex-1 ${i < stepIdx ? "bg-green-mid/40" : "bg-navy/10"}`} />}
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 1: Identificação ── */}
      {step === "identificacao" && (
        <div className="flex flex-col gap-5">
          <div>
            <label className={labelCls}>Nome Completo *</label>
            <input className={inputCls} placeholder="Seu nome completo" value={form.nomeCompleto} onChange={e => set("nomeCompleto", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>CPF ou CNPJ</label>
            <input className={inputCls} placeholder="000.000.000-00" value={form.cpfCnpj} onChange={e => set("cpfCnpj", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Celular com DDD *</label>
            <input className={inputCls} placeholder="(00) 00000-0000" type="tel" value={form.celular} onChange={e => set("celular", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>E-mail — onde receberá o diagnóstico *</label>
            <input className={inputCls} placeholder="seu@email.com.br" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaAtividade} disabled={loading}
            className={`${btnCls} disabled:opacity-60`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continuar <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      )}

      {/* ── STEP 2: Atividade ── */}
      {step === "atividade" && (
        <div className="flex flex-col gap-6">
          <div>
            <label className={labelCls}>Qual sua atividade principal?</label>
            <div className="grid grid-cols-2 gap-2">
              {ATIVIDADES.map(op => (
                <button key={op.valor} type="button"
                  onClick={() => { set("atividade", op.valor as Atividade); set("sistemaGado", null) }}
                  className={`py-3 rounded-xl border text-sm font-heading font-bold transition-colors ${form.atividade === op.valor ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}>
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {form.atividade === "gado" && (
            <div>
              <label className={labelCls}>Sistema de produção predominante</label>
              <RadioGroup opcoes={SISTEMAS_GADO} valor={form.sistemaGado}
                onChange={v => set("sistemaGado", v as SistemaGado)} />
            </div>
          )}

          {form.atividade === "outro" && (
            <div className="rounded-xl border border-navy/10 bg-navy/5 px-5 py-4">
              <p className="text-sm text-navy/70 leading-relaxed">
                Os questionários específicos para outras atividades estão em desenvolvimento.
                Ao continuar, seus dados serão registrados e entraremos em contato em breve.
              </p>
            </div>
          )}

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaOperacao} className={btnCls}>
            {form.atividade === "outro" ? "Registrar interesse" : "Continuar"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 3: Operação ── */}
      {step === "operacao" && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 1 — Operação & Produção</p>
            <p className="text-navy/50 text-xs mb-5">Estrutura física e autonomia operacional da fazenda.</p>
          </div>

          <div>
            <label className={labelCls}>{getEstruturaLabel(a, s)}</label>
            <div className="flex gap-3">
              <BoolBtn valor={true} atual={form.temEstruturaPropria} onChange={v => set("temEstruturaPropria", v)} />
              <BoolBtn valor={false} atual={form.temEstruturaPropria} onChange={v => set("temEstruturaPropria", v)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Qual o percentual de área arrendada?</label>
            <RadioGroup opcoes={ARRENDADO_OPCOES} valor={form.percentualArrendado}
              onChange={v => set("percentualArrendado", v)} />
          </div>

          {form.percentualArrendado !== null && form.percentualArrendado > 0 && (
            <div>
              <label className={labelCls}>Quanto paga de arrendamento por hectare?</label>
              {a === "gado" && (
                <div className="flex gap-2 mb-3">
                  {(["sacas", "arrobas"] as const).map(u => (
                    <button key={u} type="button" onClick={() => set("arrendamentoUnidade", u)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-heading font-bold transition-colors ${form.arrendamentoUnidade === u ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy/60 hover:border-navy/40"}`}>
                      {u === "sacas" ? "Sacas de soja" : "Arrobas (@)"}
                    </button>
                  ))}
                </div>
              )}
              <input className={inputCls} type="number" step="0.1"
                placeholder={a === "gado"
                  ? `Qtd de ${form.arrendamentoUnidade === "arrobas" ? "arrobas (@)" : "sacas de soja"} por hectare`
                  : "Sacas de soja por hectare"}
                value={form.arrendamentoValor}
                onChange={e => set("arrendamentoValor", e.target.value)} />
            </div>
          )}

          <div>
            <label className={labelCls}>Quais operações são terceirizadas? (pode selecionar mais de uma)</label>
            <div className="flex flex-col gap-2">
              {getOperacoesOpcoes(a, s).map(op => {
                const ativo = form.operacoesTerceirizadas.includes(op.valor)
                return (
                  <button key={op.valor} type="button" onClick={() => toggleOperacao(op.valor)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${ativo ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}>
                    {ativo ? "✓ " : ""}{op.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Produção média — grãos, algodão, cana */}
          {a !== "gado" && (
            <div>
              <label className={labelCls}>{getProducaoLabel(a)}</label>
              <input className={inputCls} type="number" step="0.5"
                placeholder={a === "cana" ? "Ex: 85" : a === "algodao" ? "Ex: 280" : "Ex: 62"}
                value={form.producaoMedia}
                onChange={e => set("producaoMedia", e.target.value)} />
            </div>
          )}

          {/* Gado pasto e semi */}
          {a === "gado" && s !== "confinado" && (
            <>
              <div>
                <label className={labelCls}>Taxa de lotação atual da pastagem</label>
                <RadioGroup opcoes={[
                  { valor: "lte08", label: "Menos de 0,8 UA/ha" },
                  { valor: "08_12", label: "0,8 a 1,2 UA/ha" },
                  { valor: "12_20", label: "1,2 a 2,0 UA/ha" },
                  { valor: "gte20", label: "Mais de 2,0 UA/ha" },
                ]} valor={form.taxaLotacao} onChange={v => set("taxaLotacao", v)} />
              </div>
              <div>
                <label className={labelCls}>Taxa de desfrute (% do rebanho vendido por ano)</label>
                <RadioGroup opcoes={[
                  { valor: "lte40", label: "Menos de 40%" },
                  { valor: "40_55", label: "40% a 55%" },
                  { valor: "55_70", label: "55% a 70%" },
                  { valor: "gte70", label: "Mais de 70%" },
                ]} valor={form.taxaDesfrute} onChange={v => set("taxaDesfrute", v)} />
              </div>
              <div>
                <label className={labelCls}>Percentual de pastagem degradada</label>
                <RadioGroup opcoes={[
                  { valor: "lte20", label: "Menos de 20%" },
                  { valor: "20_40", label: "20% a 40%" },
                  { valor: "40_60", label: "40% a 60%" },
                  { valor: "gte60", label: "Mais de 60%" },
                ]} valor={form.pastageDegradada} onChange={v => set("pastageDegradada", v)} />
              </div>
              {s === "semi" && (
                <div>
                  <label className={labelCls}>Quantos meses por ano os animais ficam no semi-confinamento?</label>
                  <RadioGroup opcoes={[
                    { valor: "lte2", label: "Menos de 2 meses" },
                    { valor: "2_4",  label: "2 a 4 meses" },
                    { valor: "4_6",  label: "4 a 6 meses" },
                    { valor: "gte6", label: "Mais de 6 meses" },
                  ]} valor={form.mesesSemiConf} onChange={v => set("mesesSemiConf", v)} />
                </div>
              )}
            </>
          )}

          {/* Gado confinado */}
          {a === "gado" && s === "confinado" && (
            <>
              <div>
                <label className={labelCls}>GPD médio dos lotes no confinamento (kg/dia)</label>
                <input className={inputCls} type="number" step="0.1" placeholder="Ex: 1.6"
                  value={form.gpdMedio} onChange={e => set("gpdMedio", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Média de dias de confinamento por lote</label>
                <RadioGroup opcoes={[
                  { valor: "lte90",   label: "Menos de 90 dias" },
                  { valor: "90_120",  label: "90 a 120 dias" },
                  { valor: "120_150", label: "120 a 150 dias" },
                  { valor: "gte150",  label: "Mais de 150 dias" },
                ]} valor={form.diasConfinamento} onChange={v => set("diasConfinamento", v)} />
              </div>
            </>
          )}

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaCustos} className={btnCls}>
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 4: Custos ── */}
      {step === "custos" && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 2 — Custos & Comercialização</p>
            <p className="text-navy/50 text-xs mb-5">Estrutura de custos e posicionamento comercial.</p>
          </div>

          {a === "gado" && s === "confinado" ? (
            <>
              <div>
                <label className={labelCls}>Conversão alimentar média (kg de ração por kg de ganho)</label>
                <RadioGroup opcoes={[
                  { valor: "lte6", label: "Até 6:1 — muito eficiente" },
                  { valor: "6_7",  label: "6 a 7:1" },
                  { valor: "7_8",  label: "7 a 8:1" },
                  { valor: "8_9",  label: "8 a 9:1" },
                  { valor: "gte9", label: "Acima de 9:1" },
                ]} valor={form.conversaoAlimentar} onChange={v => set("conversaoAlimentar", v)} />
              </div>
              <div>
                <label className={labelCls}>Custo da dieta por arroba produzida (R$/@)</label>
                <RadioGroup opcoes={[
                  { valor: "lte90",   label: "Até R$ 90/@" },
                  { valor: "90_110",  label: "R$ 90 a R$ 110/@" },
                  { valor: "110_130", label: "R$ 110 a R$ 130/@" },
                  { valor: "130_150", label: "R$ 130 a R$ 150/@" },
                  { valor: "gte150",  label: "Acima de R$ 150/@" },
                ]} valor={form.custoDietaArroba} onChange={v => set("custoDietaArroba", v)} />
              </div>
            </>
          ) : (
            <div>
              <label className={labelCls}>{getCustoInsumoLabel(a, s)}</label>
              <RadioGroup opcoes={getCustoInsumoOpcoes(a, s)} valor={form.custoInsumos}
                onChange={v => set("custoInsumos", v)} />
            </div>
          )}

          <div>
            <label className={labelCls}>Produtividade de mão de obra (hectares por colaborador)</label>
            <RadioGroup opcoes={HA_TRABALHADOR_OPCOES} valor={form.hectaresPorTrabalhador}
              onChange={v => set("hectaresPorTrabalhador", v)} />
          </div>

          <div>
            <label className={labelCls}>{getTravaLabel(a)}</label>
            <div className="flex gap-3">
              <BoolBtn valor={true} atual={form.travaComercializacao} onChange={v => set("travaComercializacao", v)} />
              <BoolBtn valor={false} atual={form.travaComercializacao} onChange={v => set("travaComercializacao", v)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{getMercadoLabel(a)}</label>
            <div className="flex gap-3">
              <BoolBtn valor={true} atual={form.boaLeituraMercado} onChange={v => set("boaLeituraMercado", v)} />
              <BoolBtn valor={false} atual={form.boaLeituraMercado} onChange={v => set("boaLeituraMercado", v)} />
            </div>
          </div>

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaFinanceiro} className={btnCls}>
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 5: Financeiro ── */}
      {step === "financeiro" && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 3 — Financeiro</p>
            <p className="text-navy/50 text-xs mb-5">Saúde financeira, crédito e histórico.</p>
          </div>

          <div>
            <label className={labelCls}>{getFrustracaoLabel(a)}</label>
            <div className="flex flex-col gap-2">
              {getFrustracaoOpcoes(a).map((op, i) => (
                <button key={i} type="button" onClick={() => { set("frustracaoSafraIdx", i); if (i === 0) set("sacasPerdidas", "") }}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${form.frustracaoSafraIdx === i ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}>
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {form.frustracaoSafraIdx !== null && form.frustracaoSafraIdx > 0 && (
            <div>
              <label className={labelCls}>
                Em média, quantas <strong>{getPerdaUnidade(a)}</strong> você DEIXOU de produzir nos anos afetados?
              </label>
              <input
                className={inputCls}
                type="number"
                min="0"
                step="1"
                placeholder={`Ex: ${a === "cana" ? "20" : a === "gado" ? "50" : "8"}`}
                value={form.sacasPerdidas}
                onChange={e => set("sacasPerdidas", e.target.value.replace(/[.,]/g, ""))}
              />
            </div>
          )}

          <div>
            <label className={labelCls}>Qual o percentual do custo de produção financiado com custeio bancário?</label>
            <RadioGroup opcoes={CUSTEIO_OPCOES} valor={form.percentualCusteio}
              onChange={v => set("percentualCusteio", v)} />
          </div>

          <div>
            <label className={labelCls}>Nos últimos 3 anos, a captação de recursos financeiros (custeio):</label>
            <RadioGroup opcoes={CAPTACOES_OPCOES} valor={form.captacoes}
              onChange={v => set("captacoes", v)} />
          </div>

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaGestao} className={btnCls}>
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 6: Gestão ── */}
      {step === "gestao" && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 4 — Gestão</p>
            <p className="text-navy/50 text-xs mb-5">Maturidade gerencial e uso de dados para decisão.</p>
          </div>

          <div>
            <label className={labelCls}>Como é o uso de software de gestão na fazenda?</label>
            <RadioGroup opcoes={SOFTWARE_GESTAO_OPCOES} valor={form.usaSoftwareGestao}
              onChange={v => set("usaSoftwareGestao", v)} />
          </div>

          <div>
            <label className={labelCls}>{getSacaLabel(a)}</label>
            <div className="flex gap-3">
              <BoolBtn valor={true} atual={form.sabeCustoPorUnidade} onChange={v => set("sabeCustoPorUnidade", v)} />
              <BoolBtn valor={false} atual={form.sabeCustoPorUnidade} onChange={v => set("sabeCustoPorUnidade", v)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tem clareza sobre todas as despesas da fazenda?</label>
            <div className="flex gap-3">
              <BoolBtn valor={true} atual={form.clarezaCustos} onChange={v => set("clarezaCustos", v)} />
              <BoolBtn valor={false} atual={form.clarezaCustos} onChange={v => set("clarezaCustos", v)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Suas decisões de gestão são baseadas principalmente em:</label>
            <RadioGroup opcoes={BASE_DECISOES_OPCOES} valor={form.baseDecisoes}
              onChange={v => set("baseDecisoes", v)} />
          </div>

          <div>
            <label className={labelCls}>Realiza reunião de fechamento de safra com análise dos resultados?</label>
            <div className="flex gap-3">
              <BoolBtn valor={true} atual={form.reuniaoFechamento} onChange={v => set("reuniaoFechamento", v)} />
              <BoolBtn valor={false} atual={form.reuniaoFechamento} onChange={v => set("reuniaoFechamento", v)} />
            </div>
          </div>

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={enviarDiagnostico} className={btnCls}>
            Receber meu diagnóstico <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-navy/40 text-xs">
            O diagnóstico será enviado para <strong>{form.email}</strong>
          </p>
        </div>
      )}

      {/* ── Enviando ── */}
      {step === "enviando" && (
        <div className="flex flex-col items-center gap-6 py-12 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
          <div>
            <p className="font-heading font-black text-xl text-navy">Processando seu diagnóstico...</p>
            <p className="text-navy/50 text-sm mt-1">Calculando resultados e preparando o envio.</p>
          </div>
        </div>
      )}
    </div>
  )
}
