"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CampanhaDetalheClient({ campanha }) {
  const router = useRouter();

  const [mostrarDoacao, setMostrarDoacao] = useState(false);
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [instituicaoUsuario, setInstituicaoUsuario] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const valorArrecadado = Number(campanha.valor_arrecadado || 0);
  const meta = Number(campanha.meta || 0);
  const progresso =
    meta > 0 ? Math.min((valorArrecadado / meta) * 100, 100) : 0;

  const usuarioAtual = useMemo(() => {
    if (typeof window === "undefined") return null;

    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) return null;

    try {
      return JSON.parse(usuarioSalvo);
    } catch (error) {
      console.error("Erro ao ler usuário do localStorage:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    async function verificarInstituicao() {
      if (!usuarioAtual) {
        setInstituicaoUsuario(null);
        setCarregandoPerfil(false);
        return;
      }

      if (usuarioAtual.tipo === "ADM") {
        setInstituicaoUsuario(null);
        setCarregandoPerfil(false);
        return;
      }

      try {
        const response = await fetch("/api/minha-instituicao", {
          headers: {
            "user-id": String(usuarioAtual.id),
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setInstituicaoUsuario(null);
          setCarregandoPerfil(false);
          return;
        }

        if (data?.id) {
          setInstituicaoUsuario(data);
        } else {
          setInstituicaoUsuario(null);
        }
      } catch (error) {
        console.error("Erro ao verificar instituição do usuário:", error);
        setInstituicaoUsuario(null);
      } finally {
        setCarregandoPerfil(false);
      }
    }

    verificarInstituicao();
  }, [usuarioAtual]);

  const ehVisitante = !usuarioAtual;
  const ehAdmin = usuarioAtual?.tipo === "ADM";
  const ehInstituicao = !!instituicaoUsuario;
  const podeDoar = !!usuarioAtual && !ehAdmin && !ehInstituicao;

  async function registrarDoacao() {
    try {
      const usuarioSalvo = localStorage.getItem("usuario");

      if (!usuarioSalvo) {
        toast.error("Você precisa estar logado para doar.");
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (usuario?.tipo === "ADM") {
        toast.error("Administradores não podem realizar doações.");
        return;
      }

      const responseInstituicao = await fetch("/api/minha-instituicao", {
        headers: {
          "user-id": String(usuario.id),
        },
      });

      const dataInstituicao = await responseInstituicao.json();

      if (responseInstituicao.ok && dataInstituicao?.id) {
        toast.error("Instituições não podem realizar doações.");
        return;
      }

      if (!valor || Number(valor) <= 0) {
        toast.error("Informe um valor válido.");
        return;
      }

      setEnviando(true);

      const res = await fetch("/api/doacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          campanha_id: campanha.id,
          valor: Number(valor),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao registrar doação.");
        return;
      }

      toast.success("Doação registrada e aguardando validação.");
      setValor("");
      setMostrarDoacao(false);

      setTimeout(() => {
        router.push("/minhas-doacoes");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar doação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => router.push("/campanhas")}
          style={{
            background: "#fff",
            color: "#1976d2",
            border: "1px solid #1976d2",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          ← Voltar para campanhas
        </button>

        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              height: "280px",
              background: campanha.imagem_url
                ? `url(${campanha.imagem_url}) center/cover no-repeat`
                : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              display: "flex",
              alignItems: "end",
              padding: "30px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                padding: "10px 14px",
                borderRadius: "999px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Campanha solidária
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "30px",
              padding: "32px",
            }}
          >
            <div>
              <h1
                style={{
                  marginTop: 0,
                  marginBottom: "12px",
                  fontSize: "34px",
                  color: "#1f2937",
                }}
              >
                {campanha.titulo}
              </h1>

              <p
                style={{
                  color: "#666",
                  marginBottom: "18px",
                  fontSize: "15px",
                }}
              >
                <strong>Instituição:</strong>{" "}
                {campanha.instituicao_nome || "Não informada"}
              </p>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: "1.8",
                  fontSize: "16px",
                  marginBottom: "24px",
                }}
              >
                {campanha.descricao}
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                    color: "#111827",
                  }}
                >
                  Meta: R$ {meta.toFixed(2)}
                </p>

                <p
                  style={{
                    margin: "0 0 12px 0",
                    color: "#475569",
                  }}
                >
                  Arrecadado: R$ {valorArrecadado.toFixed(2)}
                </p>

                <div
                  style={{
                    height: "12px",
                    background: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progresso}%`,
                      height: "100%",
                      background: "#22c55e",
                    }}
                  />
                </div>

                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  {progresso.toFixed(0)}% da meta alcançada
                </p>
              </div>
            </div>

            <div>
              {carregandoPerfil ? (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "22px",
                      color: "#1f2937",
                    }}
                  >
                    Verificando acesso
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      lineHeight: "1.7",
                      fontSize: "15px",
                    }}
                  >
                    Aguarde enquanto validamos o perfil do usuário para esta campanha.
                  </p>
                </div>
              ) : podeDoar ? (
                <div
                  style={{
                    background: "#f9fbfd",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "24px",
                      color: "#1f2937",
                    }}
                  >
                    Fazer doação
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: "1.6",
                      fontSize: "15px",
                      marginBottom: "18px",
                    }}
                  >
                    Sua contribuição será enviada para análise da instituição
                    antes de ser confirmada.
                  </p>

                  {!mostrarDoacao ? (
                    <button
                      onClick={() => setMostrarDoacao(true)}
                      style={{
                        width: "100%",
                        background: "#28a745",
                        color: "#fff",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      💰 Quero doar
                    </button>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <input
                        type="number"
                        placeholder="Digite o valor da doação"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: "1px solid #d0d7de",
                          fontSize: "16px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />

                      <div
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          padding: "12px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          lineHeight: "1.5",
                        }}
                      >
                        Após o envio, a doação ficará com status <strong>em análise</strong>
                        até ser validada pela instituição.
                      </div>

                      <button
                        onClick={registrarDoacao}
                        disabled={enviando}
                        style={{
                          width: "100%",
                          background: "#1976d2",
                          color: "#fff",
                          padding: "14px",
                          borderRadius: "10px",
                          border: "none",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: enviando ? "not-allowed" : "pointer",
                          opacity: enviando ? 0.7 : 1,
                        }}
                      >
                        {enviando ? "Enviando doação..." : "Confirmar doação"}
                      </button>

                      <button
                        onClick={() => {
                          setMostrarDoacao(false);
                          setValor("");
                        }}
                        style={{
                          width: "100%",
                          background: "#fff",
                          color: "#475569",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "15px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ) : ehVisitante ? (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "22px",
                      color: "#1d4ed8",
                    }}
                  >
                    Entre para fazer uma doação
                  </h2>

                  <p
                    style={{
                      margin: "0 0 18px 0",
                      color: "#1e3a8a",
                      lineHeight: "1.7",
                      fontSize: "15px",
                    }}
                  >
                    Para contribuir com esta campanha, você precisa estar logado no sistema
                    com uma conta de doador.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button
                      onClick={() => router.push("/login")}
                      style={{
                        width: "100%",
                        background: "#1976d2",
                        color: "#fff",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Entrar no sistema
                    </button>

                    <button
                      onClick={() => router.push("/cadastro/doador")}
                      style={{
                        width: "100%",
                        background: "#fff",
                        color: "#1976d2",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #93c5fd",
                        fontSize: "15px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Criar cadastro de doador
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "22px",
                      color: "#9a3412",
                    }}
                  >
                    Visualização da campanha
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#7c2d12",
                      lineHeight: "1.7",
                      fontSize: "15px",
                    }}
                  >
                    Apenas usuários do tipo doador podem realizar doações.
                    Administradores e instituições podem visualizar esta campanha,
                    mas não têm acesso ao fluxo de doação.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}