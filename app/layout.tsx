import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "O Conselho Agro | Uma iniciativa da Raccolto",
  description:
    "O Conselho Agro conecta produtores rurais, empresários, especialistas e parceiros em um ambiente exclusivo de desenvolvimento, troca de experiências e geração de oportunidades.",
  keywords: [
    "agro",
    "conselho agro",
    "raccolto",
    "produtores rurais",
    "gestão fazenda",
    "networking agro",
  ],
  openGraph: {
    title: "O Conselho Agro | Uma iniciativa da Raccolto",
    description:
      "Conectamos produtores rurais que desejam crescer de forma estruturada, profissional e lucrativa.",
    url: "https://oconselhoagro.com.br",
    siteName: "O Conselho Agro",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${montserrat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
