import { NextRequest, NextResponse } from "next/server"

const otpStore = new Map<string, { code: string; expiresAt: number }>()

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function normalizarCelular(cel: string) {
  return cel.replace(/\D/g, "")
}

// POST /api/diagnostico/sms — registra lead no CRM e envia OTP
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { celular, nomeCompleto, email, cpfCnpj } = body

  if (!celular) return NextResponse.json({ error: "Celular obrigatório" }, { status: 400 })
  if (!nomeCompleto) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 })

  const numero = normalizarCelular(celular)
  const code = gerarCodigo()
  otpStore.set(numero, { code, expiresAt: Date.now() + 10 * 60 * 1000 })

  // ── Registrar lead no CRM do MentoraSys ──────────────────────────────────
  const webhookUrl = process.env.MENTORASYS_WEBHOOK_URL
  const webhookSecret = process.env.MENTORASYS_WEBHOOK_SECRET

  if (webhookUrl) {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (webhookSecret) headers["x-conselho-agro-secret"] = webhookSecret

    const observacoes = cpfCnpj ? `CPF/CNPJ: ${cpfCnpj}` : undefined

    try {
      const crmRes = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          nome: nomeCompleto,
          email: email ?? null,
          telefone: celular,
          whatsapp: celular,
          origem: "oconselhoagro.com.br",
          observacoes,
          tags: ["O Conselho Agro"],
        }),
      })
      if (!crmRes.ok) {
        const err = await crmRes.text()
        console.error("[sms] erro CRM:", crmRes.status, err)
      }
    } catch (err) {
      console.error("[sms] erro ao registrar lead no CRM:", err)
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // ── Integração SMS (Twilio) ───────────────────────────────────────────────
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  // await client.messages.create({
  //   body: `Seu código O Conselho Agro: ${code}`,
  //   from: process.env.TWILIO_FROM,
  //   to: `+55${numero}`,
  // })
  // ─────────────────────────────────────────────────────────────────────────

  const isDev = process.env.NODE_ENV !== "production"
  console.log(`[OTP] ${numero} → ${code}`)

  return NextResponse.json({ ok: true, ...(isDev && { _dev_code: code }) })
}

// PUT /api/diagnostico/sms — valida OTP
export async function PUT(req: NextRequest) {
  const { celular, code } = await req.json()
  if (!celular || !code) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })

  const numero = normalizarCelular(celular)
  const entry = otpStore.get(numero)

  if (!entry || Date.now() > entry.expiresAt) {
    return NextResponse.json({ error: "Código expirado. Solicite um novo." }, { status: 410 })
  }

  if (entry.code !== String(code).trim()) {
    return NextResponse.json({ error: "Código incorreto." }, { status: 422 })
  }

  otpStore.delete(numero)
  return NextResponse.json({ ok: true, validado: true })
}
