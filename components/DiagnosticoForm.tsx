"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Loader2, ArrowRight as Next } from "lucide-react"

type Step = "identificacao" | "diagnostico" | "enviando"

const PRODUCOES = ["Soja", "Milho", "Pecuária", "Misto (grãos + pecuária)", "Cana-de-açúcar", "Café", "Horticultura", "Outro"]
const ESTADOS = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"]
const DESAFIOS = ["Gestão financeira", "Mercado e comercialização", "Produção e agronomia", "Sucessão familiar", "Tecnologia e inovação", "Bolsa e derivativos", "Jurídico e ambiental", "Outro"]
const FATURAMENTOS = ["Até R$ 500 mil/ano", "R$ 500 mil a R$ 2 mi/ano", "R$ 2 mi a R$ 10 mi/ano", "Acima de R$ 10 mi/ano"]

export function DiagnosticoForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("identificacao")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const [form, setForm] = useState({
    nomeCompleto: "", cpfCnpj: "", celular: "", email: "",
    propriedadeHa: "", tipoProdução: "", estado: "", desafio: "", temGestão: "", faturamento: "",
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErro("")
  }

  // ── Step 1: registrar lead e avançar ──────────────────────────────────────
  async function avancarParaDiagnostico() {
    if (!form.nomeCompleto || !form.celular || !form.email) {
      return setErro("Preencha todos os campos obrigatórios.")
    }
    setLoading(true)
    setErro("")
    try {
      const webhookSecret = process.env.NEXT_PUBLIC_MENTORASYS_WEBHOOK_SECRET
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (webhookSecret) headers["x-conselho-agro-secret"] = webhookSecret

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

      setStep("diagnostico")
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: enviar diagnóstico ─────────────────────────────────────────────
  async function enviarDiagnostico() {
    if (!form.tipoProdução || !form.estado || !form.desafio) {
      return setErro("Preencha todos os campos do diagnóstico.")
    }
    setStep("enviando")
    try {
      const res = await fetch("/api/diagnostico/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setStep("diagnostico")
        return setErro("Erro ao enviar. Tente novamente.")
      }
      router.push("/diagnostico/obrigado")
    } catch {
      setStep("diagnostico")
      setErro("Erro de conexão. Tente novamente.")
    }
  }

  const labelCls = "block text-xs font-heading font-semibold text-navy/60 uppercase tracking-wide mb-1"
  const inputCls = "w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"

  const steps = ["Identificação", "Diagnóstico"]
  const stepIdx = step === "identificacao" ? 0 : 1

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      {step !== "enviando" && (
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-black shrink-0 transition-colors ${i < stepIdx ? "bg-green-mid text-white" : i === stepIdx ? "bg-gold text-navy" : "bg-navy/10 text-navy/30"}`}>
                {i < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-heading font-semibold hidden sm:block ${i === stepIdx ? "text-navy" : "text-navy/30"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < stepIdx ? "bg-green-mid/40" : "bg-navy/10"}`} />}
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

          <button onClick={avancarParaDiagnostico} disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-navy font-heading font-black text-sm tracking-wide uppercase hover:bg-gold-light transition-colors disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continuar <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      )}

      {/* ── STEP 2: Diagnóstico ── */}
      {step === "diagnostico" && (
        <div className="flex flex-col gap-5">
          <div>
            <label className={labelCls}>Tamanho da propriedade (ha)</label>
            <input className={inputCls} placeholder="Ex: 500" type="number" value={form.propriedadeHa} onChange={e => set("propriedadeHa", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Principal tipo de produção *</label>
            <select className={inputCls} value={form.tipoProdução} onChange={e => set("tipoProdução", e.target.value)}>
              <option value="">Selecione...</option>
              {PRODUCOES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Estado da propriedade *</label>
            <select className={inputCls} value={form.estado} onChange={e => set("estado", e.target.value)}>
              <option value="">Selecione...</option>
              {ESTADOS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Maior desafio hoje *</label>
            <select className={inputCls} value={form.desafio} onChange={e => set("desafio", e.target.value)}>
              <option value="">Selecione...</option>
              {DESAFIOS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Tem controle de gestão da fazenda?</label>
            <div className="flex gap-3">
              {["Sim", "Não", "Parcialmente"].map(v => (
                <button key={v} onClick={() => set("temGestão", v)} className={`flex-1 py-3 rounded-xl border text-sm font-heading font-bold transition-colors ${form.temGestão === v ? "bg-navy text-gold border-navy" : "border-navy/15 text-navy/60 hover:border-navy/40"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Faturamento anual estimado</label>
            <select className={inputCls} value={form.faturamento} onChange={e => set("faturamento", e.target.value)}>
              <option value="">Prefiro não informar</option>
              {FATURAMENTOS.map(f => <option key={f}>{f}</option>)}
            </select>
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
            <p className="font-heading font-black text-xl text-navy">Registrando seu diagnóstico...</p>
            <p className="text-navy/50 text-sm mt-1">Aguarde um instante.</p>
          </div>
        </div>
      )}
    </div>
  )
}
