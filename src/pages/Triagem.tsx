import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SenhaGerada {
  codigo: string;
  tipo: "NORMAL" | "PRIORIDADE";
}

const handlePrintSenha = (senha: SenhaGerada) => {
  const horario = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const printWindow = window.open("", "_blank", "width=300,height=400");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Senha ${senha.codigo}</title>
        <style>
          @media print {
            @page {
              size: 80mm auto;
              margin: 2mm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            width: 80mm;
            margin: 0 auto;
            padding: 4mm 2mm;
          }
          .titulo { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
          .separador { border: none; border-top: 1px dashed #333; margin: 8px 0; }
          .senha { font-size: 56px; font-weight: 900; letter-spacing: 4px; margin: 12px 0 4px; }
          .tipo { font-size: 14px; font-weight: bold; margin-bottom: 8px; }
          .horario { font-size: 13px; color: #555; margin-bottom: 12px; }
          .rodape { font-size: 11px; color: #777; }
        </style>
      </head>
      <body>
        <div class="titulo">INSS</div>
        <hr class="separador" />
        <div class="senha">${senha.codigo}</div>
        <div class="tipo">${senha.tipo}</div>
        <div class="horario">${horario}</div>
        <hr class="separador" />
        <div class="rodape">Aguarde sua senha ser chamada</div>
      </body>
    </html>
  `);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
    // Fallback: fechar após 3s caso onafterprint não dispare
    setTimeout(() => {
      try { printWindow.close(); } catch {}
    }, 3000);
  }, 300);
};

const Triagem = () => {
  const [ultimaSenha, setUltimaSenha] = useState<SenhaGerada | null>(null);
  const [contadorNormal, setContadorNormal] = useState(0);
  const [contadorPrioridade, setContadorPrioridade] = useState(0);
  const [loading, setLoading] = useState(false);

  // TODO: integrar com Supabase (inserir senha no banco com status AGUARDANDO)
  const handleGerarNormal = async () => {
    if (loading) return;
    setLoading(true);

    const novoContador = contadorNormal + 1;
    const codigo = `N${String(novoContador).padStart(3, "0")}`;
    const novaSenha: SenhaGerada = { codigo, tipo: "NORMAL" };

    setContadorNormal(novoContador);
    setUltimaSenha(novaSenha);
    handlePrintSenha(novaSenha);

    toast({
      title: "Senha gerada",
      description: `Senha ${codigo} (NORMAL) emitida com sucesso.`,
    });

    setTimeout(() => setLoading(false), 400);
  };

  // TODO: integrar com Supabase (inserir senha no banco com status AGUARDANDO)
  const handleGerarPrioridade = async () => {
    if (loading) return;
    setLoading(true);

    const novoContador = contadorPrioridade + 1;
    const codigo = `P${String(novoContador).padStart(3, "0")}`;
    const novaSenha: SenhaGerada = { codigo, tipo: "PRIORIDADE" };

    setContadorPrioridade(novoContador);
    setUltimaSenha(novaSenha);
    handlePrintSenha(novaSenha);

    toast({
      title: "Senha gerada",
      description: `Senha ${codigo} (PRIORIDADE) emitida com sucesso.`,
    });

    setTimeout(() => setLoading(false), 400);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Header */}
      <header
        className="flex items-center justify-center gap-3 px-6 py-4 text-white shadow-md"
        style={{ backgroundColor: "#1a4b8c" }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
          TS
        </div>
        <h1 className="text-xl font-bold tracking-wide md:text-2xl">
          Triagem de Senhas
        </h1>
      </header>

      {/* Conteúdo central */}
      <main className="mx-auto flex max-w-lg flex-col items-center gap-8 px-4 py-12 md:py-20">
        {/* Card da última senha */}
        <div className="w-full rounded-xl bg-white p-8 text-center shadow-lg">
          <p
            className="mb-2 text-sm font-semibold uppercase tracking-widest"
            style={{ color: "#1a4b8c" }}
          >
            Última Senha Gerada
          </p>

          {ultimaSenha ? (
            <div key={ultimaSenha.codigo} className="animate-scale-in">
              <p
                className="text-7xl font-extrabold leading-none md:text-8xl"
                style={{ color: "#1a4b8c" }}
              >
                {ultimaSenha.codigo}
              </p>
              <span
                className="mt-3 inline-block rounded-full px-4 py-1 text-sm font-bold text-white"
                style={{
                  backgroundColor:
                    ultimaSenha.tipo === "PRIORIDADE" ? "#0f3460" : "#1a4b8c",
                }}
              >
                {ultimaSenha.tipo}
              </span>
            </div>
          ) : (
            <p className="py-6 text-2xl font-semibold text-muted-foreground">
              NENHUMA SENHA GERADA
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="flex w-full flex-col gap-4">
          <button
            onClick={handleGerarNormal}
            disabled={loading}
            className="w-full rounded-xl px-6 py-5 text-lg font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 md:text-xl"
            style={{ backgroundColor: "#1a4b8c" }}
          >
            {loading ? "GERANDO..." : "GERAR SENHA NORMAL"}
          </button>

          <button
            onClick={handleGerarPrioridade}
            disabled={loading}
            className="w-full rounded-xl border-2 px-6 py-5 text-lg font-bold shadow-md transition-all hover:scale-[1.02] hover:text-white hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 md:text-xl"
            style={{
              borderColor: "#0f3460",
              backgroundColor: "#0f3460",
              color: "white",
            }}
          >
            {loading ? "GERANDO..." : "GERAR SENHA PRIORIDADE"}
          </button>
        </div>

        {/* Contadores */}
        <div className="flex w-full gap-4">
          <div className="flex-1 rounded-lg bg-white p-4 text-center shadow">
            <p className="text-sm font-medium text-muted-foreground">Normais</p>
            <p
              className="text-3xl font-extrabold"
              style={{ color: "#1a4b8c" }}
            >
              {contadorNormal}
            </p>
          </div>
          <div className="flex-1 rounded-lg bg-white p-4 text-center shadow">
            <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
            <p
              className="text-3xl font-extrabold"
              style={{ color: "#0f3460" }}
            >
              {contadorPrioridade}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Triagem;
