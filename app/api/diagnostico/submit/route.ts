import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const baseUrl = process.env.MENTORASYS_BASE_URL ?? "https://app.raccolto.com.br"
  const webhookSecret = process.env.MENTORASYS_WEBHOOK_SECRET

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (webhookSecret) headers["x-conselho-agro-secret"] = webhookSecret

  // Normalize nome/telefone and pass all other fields through unchanged
  const { nomeCompleto, celular, nome: nomeOrig, telefone: telefoneOrig, ...rest } = body
  const payload = {
    ...rest,
    nome: nomeOrig ?? nomeCompleto,
    telefone: telefoneOrig ?? celular,
  }

  try {
    const res = await fetch(`${baseUrl}/api/diagnostico-lead`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("[diagnostico/submit] Erro MentoraSys:", res.status, err)
      return NextResponse.json({ error: "Erro ao registrar diagnóstico" }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ ok: true, lead_id: data.lead_id }, { status: 201 })
  } catch (err) {
    console.error("[diagnostico/submit] Erro de conexão:", err)
    return NextResponse.json({ error: "Erro de conexão" }, { status: 502 })
  }
}
