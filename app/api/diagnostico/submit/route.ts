import { NextRequest, NextResponse } from "next/server"

// Envia o diagnóstico completo ao endpoint /api/diagnostico-lead do MentoraSys
// que calcula o score, cria o lead e envia o email de resultado.
export async function POST(req: NextRequest) {
  const body = await req.json()

  const baseUrl = process.env.MENTORASYS_BASE_URL ?? "https://app.raccolto.com.br"
  const webhookSecret = process.env.MENTORASYS_WEBHOOK_SECRET

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (webhookSecret) headers["x-conselho-agro-secret"] = webhookSecret

  const payload = {
    nome: body.nome ?? body.nomeCompleto,
    email: body.email,
    telefone: body.telefone ?? body.celular,
    cpfCnpj: body.cpfCnpj ?? undefined,
    // Bloco 1 — Operação
    temSiloArmazem: body.temSiloArmazem,
    percentualArrendado: body.percentualArrendado,
    operacoesTerceirizadas: body.operacoesTerceirizadas,
    // Bloco 2 — Custos
    custosInsumosDiretos: body.custosInsumosDiretos,
    hectaresPorTrabalhador: body.hectaresPorTrabalhador,
    travaAntecipada: body.travaAntecipada,
    boaLeituraComercializacao: body.boaLeituraComercializacao,
    // Bloco 3 — Financeiro
    frustracaoSafra: body.frustracaoSafra,
    percentualCusteio: body.percentualCusteio,
    captouMaisQuePageu: body.captouMaisQuePageu,
    // Bloco 4 — Gestão
    usaSoftwareGestao: body.usaSoftwareGestao,
    sabeCustoPorSaca: body.sabeCustoPorSaca,
    clarezaCustos: body.clarezaCustos,
    baseDecisoes: body.baseDecisoes,
    reuniaoFechamento: body.reuniaoFechamento,
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
    console.log("[diagnostico/submit] OK — lead:", data.lead_id, "score:", data.score?.geral?.percentual + "%")
    return NextResponse.json({ ok: true, lead_id: data.lead_id }, { status: 201 })
  } catch (err) {
    console.error("[diagnostico/submit] Erro de conexão:", err)
    return NextResponse.json({ error: "Erro de conexão" }, { status: 502 })
  }
}
