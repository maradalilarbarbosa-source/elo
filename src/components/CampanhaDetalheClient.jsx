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

  const [carregouCliente, setCarregouCliente] = useState(false);

    useEffect(() => {
      setCarregouCliente(true);
    }, []);

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
      toast.error("Você precisa estar logado");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    const valorNumerico = parseFloat(valor);

    if (!valorNumerico || valorNumerico <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    setEnviando(true);

    const response = await fetch("/api/doacoes", {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id: usuario.id,
        campanha_id: campanha.id,
        valor: valorNumerico
      }),
    });

    const data = await response.json();
    console.log("Resposta da API:", data);

    if (!response.ok) {
  console.log("ERRO COMPLETO DA API:", data);
  throw new Error(data.detalhe || data.error || data.message || "Erro ao registrar doação");
}
    
    

    toast.success("Doação enviada com sucesso!");
    setValor("");

  } catch (error) {
    toast.error(error.message);
  } finally {
    setEnviando(false);
  }
}

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "55px 20px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  {/* FUNDO DECORATIVO ESQUERDO */}
<img
  src="/elos-verticais-esquerda.png"
  alt="Elementos decorativos esquerda"
  style={{
    position: "absolute",
    left: "-400px",
    top: "10px",
    height: "650px",
    opacity: 0.25,
    zIndex: 0,
    pointerEvents: "none",
  }}
/>

<img
  src="/elos-verticais.png"
  alt="Elementos decorativos direita"
  style={{
    position: "absolute",
    right: "-400px",
    top: "10px",
    height: "650px",
    opacity: 0.25,
    zIndex: 0,
    pointerEvents: "none",
  }}
/>


      <div
        style={{
          maxWidth: "1120px",  
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {carregouCliente && (
  <button
    onClick={() => {
      if (podeDoar) {
        router.push("/");
        return;
      }

      router.push("/campanhas");
    }}
    style={{
      background: "#fff",
      color: "#2f8f87",
      border: "1px solid #2f8f87",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
    {podeDoar ? "← Voltar para minhas doações" : "← Voltar para campanhas"}
  </button>
)}

        <div
          style={{
            background: "#fff",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >

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
                  color: "#2f8f87",
                  textAlign:"center",
                  fontWeight:"bold",
                }}
              >
                {campanha.titulo}
              </h1>

              <p
                style={{
                  background:"#2f8f874e",
                  borderRadius:"90px",
                  color: "#666",
                  marginBottom: "18px",
                  fontSize: "18px",
                  textAlign:"center",
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
                <strong>Descrição: </strong>{" "}
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
                      background: "#2f8f87",
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
                      color: "#2f8f87",
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
                        step="0.01"
                        min="0"
                        placeholder="Digite o valor da doação"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #ccc"
                        }}
                      />

                      <div
                        style={{
                          background: "#eff6ff",
                          color: "#2f8f87",
                          border: "1px solid #bfdbfe",
                          padding: "12px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          lineHeight: "1.5",
                        }}
                      >
                        Após o envio, a doação ficará com status <strong>em análise </strong>
                        até ser validada pela instituição.
                      </div>

                      <button
                        onClick={registrarDoacao}
                        disabled={enviando}
                        style={{
                          width: "100%",
                          background: "#2f8f87",
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
                    background: "#daf6f4",
                    border: "1px solid #b7e0dd",
                    borderRadius: "16px",
                    padding: "24px",
                    
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "22px",
                      color: "#2f8f87",
                    }}
                  >
                    Entre para fazer uma doação
                  </h2>

                  <p
                    style={{
                      margin: "0 0 18px 0",
                      color: "#555",
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
                        background: "#2f8f87",
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
                        color: "#2f8f87",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #b8d2cd",
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