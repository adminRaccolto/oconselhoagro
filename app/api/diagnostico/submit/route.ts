import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const webhookUrl = process.env.MENTORASYS_WEBHOOK_URL
  const webhookSecret = process.env.MENTORASYS_WEBHOOK_SECRET

  if (!webhookUrl) {
    console.error("[diagnostico/submit] MENTORASYS_WEBHOOK_URL não configurado")
    return NextResponse.json({ error: "Configuração ausente" }, { status: 500 })
  }

  const observacoes = formatarDiagnostico(body)

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (webhookSecret) headers["x-conselho-agro-secret"] = webhookSecret

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      nome: body.nomeCompleto,
      email: body.email,
      telefone: body.celular,
      whatsapp: body.celular,
      origem: "oconselhoagro.com.br",
      observacoes,
      tags: ["conselho-agro"],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("[diagnostico/submit] Erro no MentoraSys:", err)
    return NextResponse.json({ error: "Erro ao registrar lead" }, { status: 502 })
  }

  const data = await res.json()
  return NextResponse.json({ ok: true, lead_id: data.lead_id }, { status: 201 })
}

function formatarDiagnostico(body: Record<string, string>): string {
  const partes: string[] = []

  if (body.cpfCnpj)       partes.push(`CPF/CNPJ: ${body.cpfCnpj}`)
  if (body.propriedadeHa) partes.push(`Propriedade: ${body.propriedadeHa} ha`)
  if (body.tipoProdução)  partes.push(`Produção: ${body.tipoProdução}`)
  if (body.estado)        partes.push(`Estado: ${body.estado}`)
  if (body.desafio)       partes.push(`Maior desafio: ${body.desafio}`)
  if (body.temGestão)     partes.push(`Controle de gestão: ${body.temGestão}`)
  if (body.faturamento)   partes.push(`Faturamento: ${body.faturamento}`)

  return partes.join("\n")
}
