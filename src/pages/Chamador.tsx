import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Play, Square, SkipForward, Volume2, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type StatusAtual = "SEM_SENHA" | "CHAMANDO" | "ATENDENDO";

interface Senha {
  codigo: string;
  tipo: "NORMAL" | "PRIORIDADE";
  horarioInicio?: string;
  horarioFim?: string;
}

interface HistoricoItem extends Senha {
  status: "ATENDIDA" | "PULADA";
}

const Chamador = () => {
  const navigate = useNavigate();
  const [sala, setSala] = useState("");
  const [senhaAtual, setSenhaAtual] = useState<Senha | null>(null);
  const [statusAtual, setStatusAtual] = useState<StatusAtual>("SEM_SENHA");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [contadorNormal, setContadorNormal] = useState(1);
  const [contadorPrioridade, setContadorPrioridade] = useState(1);
  const [loading, setLoading] = useState(false);

  const formatTime = () => {
    return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const addToHistorico = (senha: Senha, status: "ATENDIDA" | "PULADA") => {
    const item: HistoricoItem = { ...senha, status };
    setHistorico((prev) => [item, ...prev].slice(0, 10));
  };

  const handleChamarProxima = async () => {
    if (senhaAtual !== null || !sala.trim()) return;
    setLoading(true);

    // TODO: Supabase — buscar próxima senha da fila
    await new Promise((r) => setTimeout(r, 500));

    const isNormal = Math.random() > 0.3;
    let codigo: string;
    let tipo: "NORMAL" | "PRIORIDADE";

    if (isNormal) {
      codigo = `N${String(contadorNormal).padStart(3, "0")}`;
      tipo = "NORMAL";
      setContadorNormal((c) => c + 1);
    } else {
      codigo = `P${String(contadorPrioridade).padStart(3, "0")}`;
      tipo = "PRIORIDADE";
      setContadorPrioridade((c) => c + 1);
    }

    setSenhaAtual({ codigo, tipo });
    setStatusAtual("CHAMANDO");
    setLoading(false);
    toast.success(`Senha ${codigo} chamada para sala ${sala}`);
  };

  const handleIniciar = () => {
    if (statusAtual !== "CHAMANDO" || !senhaAtual) return;
    // TODO: Supabase — registrar início do atendimento
    setSenhaAtual((prev) => prev ? { ...prev, horarioInicio: formatTime() } : prev);
    setStatusAtual("ATENDENDO");
    toast.success("Atendimento iniciado");
  };

  const handleFinalizar = () => {
    if (statusAtual !== "ATENDENDO" || !senhaAtual) return;
    // TODO: Supabase — registrar fim do atendimento
    const finalizada = { ...senhaAtual, horarioFim: formatTime() };
    addToHistorico(finalizada, "ATENDIDA");
    setSenhaAtual(null);
    setStatusAtual("SEM_SENHA");
    toast.success("Atendimento finalizado");
  };

  const handlePular = () => {
    if (statusAtual === "SEM_SENHA" || !senhaAtual) return;
    // TODO: Supabase — registrar senha pulada
    addToHistorico({ ...senhaAtual, horarioFim: formatTime() }, "PULADA");
    setSenhaAtual(null);
    setStatusAtual("SEM_SENHA");
    toast.info("Senha pulada");
  };

  const handleRechamar = () => {
    if (statusAtual !== "CHAMANDO" || !senhaAtual) return;
    // TODO: Supabase — rechamar senha no painel
    toast.success(`Senha ${senhaAtual.codigo} rechamada para sala ${sala}`);
  };

  const statusLabel: Record<StatusAtual, string> = {
    SEM_SENHA: "AGUARDANDO",
    CHAMANDO: "CHAMANDO",
    ATENDENDO: "EM ATENDIMENTO",
  };

  const statusColor: Record<StatusAtual, string> = {
    SEM_SENHA: "text-muted-foreground",
    CHAMANDO: "text-amber-600",
    ATENDENDO: "text-green-600",
  };

  return (
    <div className="min-h-screen bg-muted px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-primary tracking-wide">
              Chamador de Senhas
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda — Senha Atual + Botões */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sala */}
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="sala" className="text-sm font-medium text-foreground">
                    Sala de Atendimento
                  </Label>
                  <Input
                    id="sala"
                    placeholder="Ex: Sala 01"
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                    className="mt-1 transition-all duration-300 focus-visible:ring-primary"
                  />
                </div>
                {!sala.trim() && (
                  <p className="text-xs text-destructive pb-2">Informe a sala</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Senha Atual */}
          <Card className="shadow-md border-0">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">SENHA ATUAL</p>
              <p className="text-6xl font-bold text-primary tracking-wider mb-3">
                {senhaAtual ? senhaAtual.codigo : "---"}
              </p>
              {senhaAtual && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    senhaAtual.tipo === "PRIORIDADE"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {senhaAtual.tipo}
                </span>
              )}
              <p className={`mt-4 text-sm font-semibold ${statusColor[statusAtual]}`}>
                {statusLabel[statusAtual]}
              </p>
              {senhaAtual?.horarioInicio && (
                <p className="text-xs text-muted-foreground mt-1">
                  Início: {senhaAtual.horarioInicio}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Button
              onClick={handleChamarProxima}
              disabled={senhaAtual !== null || !sala.trim() || loading}
              className="min-h-[48px] flex flex-col gap-1 text-xs font-semibold"
            >
              <Volume2 className="w-5 h-5" />
              CHAMAR PRÓXIMA
            </Button>
            <Button
              onClick={handleIniciar}
              disabled={statusAtual !== "CHAMANDO" || loading}
              className="min-h-[48px] flex flex-col gap-1 text-xs font-semibold bg-green-600 hover:bg-green-700"
            >
              <Play className="w-5 h-5" />
              INICIAR
            </Button>
            <Button
              onClick={handleFinalizar}
              disabled={statusAtual !== "ATENDENDO" || loading}
              className="min-h-[48px] flex flex-col gap-1 text-xs font-semibold bg-green-700 hover:bg-green-800"
            >
              <CheckCircle className="w-5 h-5" />
              FINALIZAR
            </Button>
            <Button
              onClick={handlePular}
              disabled={statusAtual === "SEM_SENHA" || loading}
              variant="secondary"
              className="min-h-[48px] flex flex-col gap-1 text-xs font-semibold"
            >
              <SkipForward className="w-5 h-5" />
              PULAR
            </Button>
            <Button
              onClick={handleRechamar}
              disabled={statusAtual !== "CHAMANDO" || loading}
              variant="outline"
              className="min-h-[48px] flex flex-col gap-1 text-xs font-semibold"
            >
              <Volume2 className="w-5 h-5" />
              RECHAMAR
            </Button>
          </div>
        </div>

        {/* Coluna Direita — Histórico */}
        <div>
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary tracking-wide">
                SENHAS ATENDIDAS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {historico.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma senha atendida ainda
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Senha</th>
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Início</th>
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Fim</th>
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historico.map((item, i) => (
                        <tr
                          key={`${item.codigo}-${i}`}
                          className={i % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <td className="py-2 px-2 font-medium">{item.codigo}</td>
                          <td className="py-2 px-2">{item.horarioInicio || "-"}</td>
                          <td className="py-2 px-2">{item.horarioFim || "-"}</td>
                          <td className="py-2 px-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                item.status === "ATENDIDA"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chamador;
