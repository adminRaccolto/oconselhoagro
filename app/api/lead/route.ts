import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const { nome, email, telefone, estado, tipo_propriedade, mensagem } = body;

  if (!nome || !email || !telefone || !estado || !tipo_propriedade) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes." },
      { status: 422 }
    );
  }

  const webhookUrl = process.env.MENTORASYS_WEBHOOK_URL;
  const webhookSecret = process.env.MENTORASYS_WEBHOOK_SECRET;

  if (!webhookUrl) {
    console.error("[lead] MENTORASYS_WEBHOOK_URL não configurado");
    return NextResponse.json(
      { error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  const payload = {
    nome,
    email,
    telefone,
    whatsapp: telefone,
    origem: "oconselhoagro.com.br",
    observacoes: [
      `Estado: ${estado}`,
      `Atividade: ${tipo_propriedade}`,
      mensagem ? `Mensagem: ${mensagem}` : null,
    ]
      .filter(Boolean)
      .join(" | "),
    tags: ["conselho-agro", "site-landing"],
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (webhookSecret) {
      headers["X-Conselho-Agro-Secret"] = webhookSecret;
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[lead] MentoraSys webhook retornou ${res.status}: ${text}`);
      return NextResponse.json(
        { error: "Erro ao registrar lead." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[lead] Erro ao chamar MentoraSys webhook:", err);
    return NextResponse.json(
      { error: "Erro de conexão com o servidor." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
