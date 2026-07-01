"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
];

const tiposPropriedade = [
  "Agricultura (grãos, cana, algodão, etc.)",
  "Pecuária (corte, leite, suíno, aves)",
  "Agricultura + Pecuária (integrado)",
  "Fruticultura / Horticultura",
  "Café / Cacau / Fumo",
  "Florestal / Madeireiro",
  "Consultor / Especialista em Agro",
  "Empresário do Agronegócio",
  "Outro",
];

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      nome: (form.elements.namedItem("nome") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      telefone: (form.elements.namedItem("telefone") as HTMLInputElement).value,
      estado,
      tipo_propriedade: tipo,
      mensagem: (form.elements.namedItem("mensagem") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao enviar formulário.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Tente novamente em instantes."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle className="h-14 w-14 text-green-mid" />
        <h3 className="font-heading font-bold text-xl text-navy">
          Recebemos seu interesse!
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Nossa equipe entrará em contato em breve para apresentar o Conselho
          Agro e dar os próximos passos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nome" className="font-heading font-semibold text-navy text-sm">
            Nome completo *
          </Label>
          <Input
            id="nome"
            name="nome"
            required
            placeholder="Seu nome"
            className="border-navy/20 focus-visible:ring-navy"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="font-heading font-semibold text-navy text-sm">
            E-mail *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com.br"
            className="border-navy/20 focus-visible:ring-navy"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="telefone" className="font-heading font-semibold text-navy text-sm">
            WhatsApp / Telefone *
          </Label>
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            required
            placeholder="(65) 99999-9999"
            className="border-navy/20 focus-visible:ring-navy"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-heading font-semibold text-navy text-sm">
            Estado (UF) *
          </Label>
          <Select required value={estado} onValueChange={(v) => setEstado(v ?? "")}>
            <SelectTrigger className="border-navy/20 focus:ring-navy">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="font-heading font-semibold text-navy text-sm">
          Tipo de atividade / propriedade *
        </Label>
        <Select required value={tipo} onValueChange={(v) => setTipo(v ?? "")}>
          <SelectTrigger className="border-navy/20 focus:ring-navy">
            <SelectValue placeholder="Selecione sua atividade" />
          </SelectTrigger>
          <SelectContent>
            {tiposPropriedade.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mensagem" className="font-heading font-semibold text-navy text-sm">
          O que você espera do Conselho Agro? (opcional)
        </Label>
        <Textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          placeholder="Conte um pouco sobre seus objetivos..."
          className="border-navy/20 focus-visible:ring-navy resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-navy hover:bg-navy-light text-white font-heading font-bold text-sm tracking-wide uppercase py-6 rounded-full"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Quero Fazer Parte do Conselho Agro"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados são confidenciais. Não fazemos spam.
      </p>
    </form>
  );
}
