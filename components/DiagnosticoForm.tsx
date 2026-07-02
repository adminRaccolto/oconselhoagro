"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

type Step = "identificacao" | "operacao" | "financeiro" | "gestao" | "enviando"

const OPERACOES_TERCEIRIZADAS = [
  { valor: "colheita", label: "Colheita" },
  { valor: "plantio", label: "Plantio" },
  { valor: "aplicacao", label: "Aplicação" },
  { valor: "transporte", label: "Transporte" },
  { valor: "nenhuma", label: "Nenhuma — tudo próprio" },
]

const CUSTOS_INSUMOS_OPCOES = [
  { valor: "abaixo", label: "Abaixo do mercado — boa negociação" },
  { valor: "esperado", label: "Na média do mercado" },
  { valor: "altos", label: "Acima do mercado — há oportunidade de melhoria" },
]

const HA_TRABALHADOR_OPCOES = [
  { valor: 100, label: "Menos de 150 ha por colaborador" },
  { valor: 200, label: "150 a 300 ha por colaborador" },
  { valor: 400, label: "300 a 500 ha por colaborador" },
  { valor: 600, label: "Mais de 500 ha por colaborador" },
]

const CUSTEIO_OPCOES = [
  { valor: "Não utilizo Custeio", label: "Não utilizo custeio bancário" },
  { valor: "10%", label: "Custeio de até 30% do custo de produção" },
  { valor: "40%", label: "Custeio de 30% a 60% do custo de produção" },
  { valor: "70%", label: "Custeio acima de 60% do custo de produção" },
]

const SOFTWARE_GESTAO_OPCOES = [
  { valor: "utilizo_confio", label: "Utilizo e confio nos dados — base para decisão" },
  { valor: "so_escritorio", label: "Somente o escritório usa — não acompanho" },
  { valor: "utilizo_sem_seguranca", label: "Utilizo, mas sem segurança nos lançamentos" },
  { valor: "nao_utilizo", label: "Não utilizo software de gestão" },
]

const BASE_DECISOES_OPCOES = [
  { valor: "dados", label: "Principalmente em dados e relatórios" },
  { valor: "ambos", label: "Combinação de dados e experiência" },
  { valor: "experiencia", label: "Principalmente na experiência e intuição" },
]

const FRUSTRACAO_OPCOES = [
  { safras: {}, label: "Nenhuma — sem perdas relevantes" },
  { safras: { s2023_24: null }, label: "1 safra afetada nos últimos 3 anos" },
  { safras: { s2023_24: null, s2022_23: null }, label: "2 safras afetadas" },
  { safras: { s2023_24: null, s2022_23: null, s2021_22: null }, label: "3 ou mais safras afetadas" },
]

const ARRENDADO_OPCOES = [
  { valor: 0, label: "Tudo próprio — sem área arrendada" },
  { valor: 15, label: "Até 30% da área é arrendada" },
  { valor: 45, label: "30% a 60% da área é arrendada" },
  { valor: 75, label: "Mais de 60% da área é arrendada" },
]

interface FormState {
  nomeCompleto: string
  cpfCnpj: string
  celular: string
  email: string
  // Bloco 1 — Operação
  temSiloArmazem: boolean | null
  percentualArrendado: number | null
  operacoesTerceirizadas: string[]
  // Bloco 2 — Custos
  custosInsumosDiretos: string
  hectaresPorTrabalhador: number | null
  travaAntecipada: boolean | null
  boaLeituraComercializacao: boolean | null
  // Bloco 3 — Financeiro
  frustracaoSafra: Record<string, null>
  frustracaoSafraIdx: number | null
  percentualCusteio: string
  captouMaisQuePageu: string
  // Bloco 4 — Gestão
  usaSoftwareGestao: string
  sabeCustoPorSaca: boolean | null
  clarezaCustos: boolean | null
  baseDecisoes: string
  reuniaoFechamento: boolean | null
}

const STEPS: Step[] = ["identificacao", "operacao", "financeiro", "gestao"]
const STEP_LABELS = ["Identificação", "Operação & Custos", "Financeiro", "Gestão"]

export function DiagnosticoForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("identificacao")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const [form, setForm] = useState<FormState>({
    nomeCompleto: "", cpfCnpj: "", celular: "", email: "",
    temSiloArmazem: null, percentualArrendado: null, operacoesTerceirizadas: [],
    custosInsumosDiretos: "", hectaresPorTrabalhador: null, travaAntecipada: null, boaLeituraComercializacao: null,
    frustracaoSafra: {}, frustracaoSafraIdx: null, percentualCusteio: "", captouMaisQuePageu: "",
    usaSoftwareGestao: "", sabeCustoPorSaca: null, clarezaCustos: null, baseDecisoes: "", reuniaoFechamento: null,
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
      return {
        ...f,
        operacoesTerceirizadas: sem.includes(valor) ? sem.filter(v => v !== valor) : [...sem, valor],
      }
    })
    setErro("")
  }

  // ── Step 1 → registra lead no CRM e avança ──────────────────────────────
  async function avancarParaOperacao() {
    if (!form.nomeCompleto || !form.celular || !form.email) {
      return setErro("Preencha todos os campos obrigatórios.")
    }
    setLoading(true)
    setErro("")
    try {
      fetch("/api/diagnostico/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          celular: form.celular,
          nomeCompleto: form.nomeCompleto,
          email: form.email,
          cpfCnpj: form.cpfCnpj,
        }),
      }).catch(() => {})
      setStep("operacao")
    } finally {
      setLoading(false)
    }
  }

  function avancarParaFinanceiro() {
    if (
      form.temSiloArmazem === null ||
      form.percentualArrendado === null ||
      form.operacoesTerceirizadas.length === 0 ||
      !form.custosInsumosDiretos ||
      form.hectaresPorTrabalhador === null ||
      form.travaAntecipada === null ||
      form.boaLeituraComercializacao === null
    ) {
      return setErro("Responda todas as perguntas antes de continuar.")
    }
    setErro("")
    setStep("financeiro")
  }

  function avancarParaGestao() {
    if (
      form.frustracaoSafraIdx === null ||
      !form.percentualCusteio ||
      !form.captouMaisQuePageu
    ) {
      return setErro("Responda todas as perguntas antes de continuar.")
    }
    setErro("")
    setStep("gestao")
  }

  // ── Envio final ──────────────────────────────────────────────────────────
  async function enviarDiagnostico() {
    if (
      !form.usaSoftwareGestao ||
      form.sabeCustoPorSaca === null ||
      form.clarezaCustos === null ||
      !form.baseDecisoes ||
      form.reuniaoFechamento === null
    ) {
      return setErro("Responda todas as perguntas antes de enviar.")
    }
    setStep("enviando")
    try {
      const payload = {
        nome: form.nomeCompleto,
        email: form.email,
        telefone: form.celular,
        cpfCnpj: form.cpfCnpj || undefined,
        // Bloco 1
        temSiloArmazem: form.temSiloArmazem,
        percentualArrendado: form.percentualArrendado,
        operacoesTerceirizadas: form.operacoesTerceirizadas,
        // Bloco 2
        custosInsumosDiretos: form.custosInsumosDiretos,
        hectaresPorTrabalhador: form.hectaresPorTrabalhador,
        travaAntecipada: form.travaAntecipada,
        boaLeituraComercializacao: form.boaLeituraComercializacao,
        // Bloco 3
        frustracaoSafra: form.frustracaoSafra,
        percentualCusteio: form.percentualCusteio,
        captouMaisQuePageu: form.captouMaisQuePageu,
        // Bloco 4
        usaSoftwareGestao: form.usaSoftwareGestao,
        sabeCustoPorSaca: form.sabeCustoPorSaca,
        clarezaCustos: form.clarezaCustos,
        baseDecisoes: form.baseDecisoes,
        reuniaoFechamento: form.reuniaoFechamento,
      }

      const res = await fetch("/api/diagnostico/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        setStep("gestao")
        return setErro("Erro ao enviar. Tente novamente.")
      }

      router.push("/diagnostico/obrigado")
    } catch {
      setStep("gestao")
      setErro("Erro de conexão. Tente novamente.")
    }
  }

  // ── Estilos ──────────────────────────────────────────────────────────────
  const labelCls = "block text-xs font-heading font-semibold text-navy/60 uppercase tracking-wide mb-2"
  const inputCls = "w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"

  function BoolBtn({ valor, atual, onChange }: { valor: boolean; atual: boolean | null; onChange: (v: boolean) => void }) {
    const active = atual === valor
    return (
      <button
        type="button"
        onClick={() => onChange(valor)}
        className={`flex-1 py-3 rounded-xl border text-sm font-heading font-bold transition-colors ${active ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy/60 hover:border-navy/40"}`}
      >
        {valor ? "Sim" : "Não"}
      </button>
    )
  }

  function RadioGroup<T extends string | number>({
    name, opcoes, valor, onChange,
  }: { name: string; opcoes: { valor: T; label: string }[]; valor: T | null; onChange: (v: T) => void }) {
    return (
      <div className="flex flex-col gap-2">
        {opcoes.map(op => (
          <button
            key={String(op.valor)}
            type="button"
            onClick={() => onChange(op.valor)}
            className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${valor === op.valor ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}
          >
            {op.label}
          </button>
        ))}
      </div>
    )
  }

  const stepIdx = STEPS.indexOf(step as Step)

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Barra de progresso */}
      {step !== "enviando" && (
        <div className="flex items-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-black shrink-0 transition-colors ${i < stepIdx ? "bg-green-mid text-white" : i === stepIdx ? "bg-gold text-navy" : "bg-navy/10 text-navy/30"}`}>
                {i < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-heading font-semibold hidden sm:block ${i === stepIdx ? "text-navy" : "text-navy/30"}`}>{label}</span>
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
            <input className={inputCls} placeholder="(00) 00000-0000" value={form.celular} onChange={e => set("celular", e.target.value)} type="tel" />
          </div>
          <div>
            <label className={labelCls}>E-mail — onde receberá o diagnóstico *</label>
            <input className={inputCls} placeholder="seu@email.com.br" value={form.email} onChange={e => set("email", e.target.value)} type="email" />
          </div>
          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaOperacao} disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continuar <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      )}

      {/* ── STEP 2: Operação & Custos ── */}
      {step === "operacao" && (
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 1 — Operação</p>
            <p className="text-navy/50 text-xs mb-5">Estrutura física e dependência operacional da fazenda.</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>A fazenda possui silo ou armazém próprio?</label>
                <div className="flex gap-3">
                  <BoolBtn valor={true} atual={form.temSiloArmazem} onChange={v => set("temSiloArmazem", v)} />
                  <BoolBtn valor={false} atual={form.temSiloArmazem} onChange={v => set("temSiloArmazem", v)} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Qual o percentual de área arrendada?</label>
                <RadioGroup name="arrendado" opcoes={ARRENDADO_OPCOES} valor={form.percentualArrendado} onChange={v => set("percentualArrendado", v)} />
              </div>

              <div>
                <label className={labelCls}>Quais operações são terceirizadas? (selecione todas)</label>
                <div className="flex flex-col gap-2">
                  {OPERACOES_TERCEIRIZADAS.map(op => {
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
            </div>
          </div>

          <div className="border-t border-navy/10 pt-7">
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 2 — Custos & Comercialização</p>
            <p className="text-navy/50 text-xs mb-5">Relação entre receitas, custos e decisões comerciais.</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Como estão os custos de insumos diretos?</label>
                <RadioGroup name="custos" opcoes={CUSTOS_INSUMOS_OPCOES} valor={form.custosInsumosDiretos} onChange={v => set("custosInsumosDiretos", v)} />
              </div>

              <div>
                <label className={labelCls}>Produtividade de mão de obra (hectares por colaborador)</label>
                <RadioGroup name="ha_trab" opcoes={HA_TRABALHADOR_OPCOES} valor={form.hectaresPorTrabalhador} onChange={v => set("hectaresPorTrabalhador", v)} />
              </div>

              <div>
                <label className={labelCls}>Faz trava antecipada de insumos ou produção?</label>
                <div className="flex gap-3">
                  <BoolBtn valor={true} atual={form.travaAntecipada} onChange={v => set("travaAntecipada", v)} />
                  <BoolBtn valor={false} atual={form.travaAntecipada} onChange={v => set("travaAntecipada", v)} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Tem boa leitura do mercado de comercialização?</label>
                <div className="flex gap-3">
                  <BoolBtn valor={true} atual={form.boaLeituraComercializacao} onChange={v => set("boaLeituraComercializacao", v)} />
                  <BoolBtn valor={false} atual={form.boaLeituraComercializacao} onChange={v => set("boaLeituraComercializacao", v)} />
                </div>
              </div>
            </div>
          </div>

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaFinanceiro} className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors">
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 3: Financeiro ── */}
      {step === "financeiro" && (
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 3 — Financeiro</p>
            <p className="text-navy/50 text-xs mb-5">Saúde financeira, crédito e histórico de safras.</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Houve frustração de safra nos últimos 3 anos?</label>
                <div className="flex flex-col gap-2">
                  {FRUSTRACAO_OPCOES.map((op, i) => (
                    <button key={i} type="button"
                      onClick={() => { set("frustracaoSafra", op.safras as Record<string, null>); set("frustracaoSafraIdx", i) }}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${form.frustracaoSafraIdx === i ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}>
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Qual o percentual do custo de produção financiado por custeio bancário?</label>
                <RadioGroup name="custeio" opcoes={CUSTEIO_OPCOES} valor={form.percentualCusteio} onChange={v => set("percentualCusteio", v)} />
              </div>

              <div>
                <label className={labelCls}>Nos últimos 3 anos, captou mais crédito do que conseguiu pagar na safra?</label>
                <div className="flex flex-col gap-2">
                  {[
                    { valor: "nao_precisei", label: "Não precisei de custeio — opera com capital próprio" },
                    { valor: "nao", label: "Não — sempre quitou dentro do prazo" },
                    { valor: "sim", label: "Sim — houve necessidade de rolar ou renegociar" },
                  ].map(op => (
                    <button key={op.valor} type="button" onClick={() => set("captouMaisQuePageu", op.valor)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${form.captouMaisQuePageu === op.valor ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy hover:border-navy/40"}`}>
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={avancarParaGestao} className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors">
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 4: Gestão ── */}
      {step === "gestao" && (
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-base font-heading font-black text-navy mb-1">Bloco 4 — Gestão</p>
            <p className="text-navy/50 text-xs mb-5">Maturidade gerencial, uso de dados e rotinas de fechamento.</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Como é o uso de software de gestão na fazenda?</label>
                <RadioGroup name="software" opcoes={SOFTWARE_GESTAO_OPCOES} valor={form.usaSoftwareGestao} onChange={v => set("usaSoftwareGestao", v)} />
              </div>

              <div>
                <label className={labelCls}>Sabe o custo de produção por saca?</label>
                <div className="flex gap-3">
                  <BoolBtn valor={true} atual={form.sabeCustoPorSaca} onChange={v => set("sabeCustoPorSaca", v)} />
                  <BoolBtn valor={false} atual={form.sabeCustoPorSaca} onChange={v => set("sabeCustoPorSaca", v)} />
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
                <RadioGroup name="base_decisoes" opcoes={BASE_DECISOES_OPCOES} valor={form.baseDecisoes} onChange={v => set("baseDecisoes", v)} />
              </div>

              <div>
                <label className={labelCls}>Realiza reunião de fechamento de safra com análise dos resultados?</label>
                <div className="flex gap-3">
                  <BoolBtn valor={true} atual={form.reuniaoFechamento} onChange={v => set("reuniaoFechamento", v)} />
                  <BoolBtn valor={false} atual={form.reuniaoFechamento} onChange={v => set("reuniaoFechamento", v)} />
                </div>
              </div>
            </div>
          </div>

          {erro && <p className="text-red-600 text-xs text-center">{erro}</p>}
          <button onClick={enviarDiagnostico} className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors">
            Receber meu diagnóstico <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-navy/40 text-xs">O diagnóstico será enviado para <strong>{form.email}</strong></p>
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
