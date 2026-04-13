"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCampanhas, deleteCampanha } from "@/services/campanhaService";
import CampanhaCard from "@/components/CampanhaCard";
import { toast } from "react-toastify";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [campanhas, setCampanhas] = useState([]);
  const [campanhasDoadas, setCampanhasDoadas] = useState([]);
  const [deletandoId, setDeletandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campanhaParaExcluir, setCampanhaParaExcluir] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [instituicao, setInstituicao] = useState(null);
  const estaLogado = !!usuario;

  const router = useRouter();

  
    useEffect(() => {
        const user = localStorage.getItem("usuario");

        if (!user) {
          setUsuario(null);
          setInstituicao(null);
          setCampanhas([]);
          setCampanhasDoadas([]);
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(user);
        setUsuario(parsed);

        const ehAdmin = parsed.tipo === "ADM";

        if (ehAdmin) {
          carregarCampanhasAdmin();
          setInstituicao(null);
          setCampanhasDoadas([]);
          return;
        }

        buscarInstituicao(parsed.id);
        buscarCampanhasDoadas(parsed.id);
      }, [router]);




  async function carregarCampanhas(instituicaoId = null) {
    try {
      setLoading(true);

      const data = await getCampanhas();

      if (instituicaoId) {
        const campanhasDaInstituicao = data.filter(
          (campanha) => Number(campanha.instituicao_id) === Number(instituicaoId)
        );

        setCampanhas(campanhasDaInstituicao);
      } else {
        setCampanhas([]);
      }
    } catch (error) {
      toast.error("Erro ao carregar campanhas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function carregarCampanhasAdmin() {
    try {
      setLoading(true);

      const data = await getCampanhas();

      setCampanhas(data || []);
    } catch (error) {
      toast.error("Erro ao carregar campanhas");
      console.error(error);
      setCampanhas([]);
    } finally {
      setLoading(false);
    }
  }

  async function buscarCampanhasDoadas(userId) {
    try {
      const res = await fetch("/api/minhas-doacoes", {
        headers: {
          "user-id": userId,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao buscar campanhas doadas");
        setCampanhasDoadas([]);
        return;
      }

      const campanhasUnicas = [];
      const idsJaAdicionados = new Set();

      data.forEach((doacao) => {
        if (!idsJaAdicionados.has(doacao.campanha_id)) {
          idsJaAdicionados.add(doacao.campanha_id);

          campanhasUnicas.push({
            id: doacao.campanha_id,
            titulo: doacao.campanha_titulo,
            descricao: doacao.campanha_descricao,
            instituicao_nome: doacao.instituicao_nome,
            meta: doacao.meta || 0,
            valor_arrecadado: doacao.valor_arrecadado || 0,
          });
        }
      });

      setCampanhasDoadas(campanhasUnicas);
    } catch (error) {
      console.error("Erro ao buscar campanhas doadas:", error);
      toast.error("Erro ao buscar campanhas doadas");
      setCampanhasDoadas([]);
    }
  }

  async function buscarInstituicao(userId) {
    try {
      const response = await fetch("/api/minha-instituicao", {
        headers: {
          "user-id": userId,
        },
      });

      const data = await response.json();
      setInstituicao(data);
    } catch (error) {
      console.error("Erro ao buscar instituição", error);
    }
  }

  useEffect(() => {
    if (!usuario) return;

    const ehAdmin = usuario.tipo === "ADM";

    if (ehAdmin) return;

    if (instituicao?.id) {
      carregarCampanhas(instituicao.id);
    } else {
      setCampanhas([]);
      setLoading(false);
    }
  }, [instituicao, usuario]);

  function abrirModal(campanha) {
    setCampanhaParaExcluir(campanha);
  }

  async function confirmarExclusao() {
    if (!campanhaParaExcluir) return;

    try {
      setDeletandoId(campanhaParaExcluir.id);

      const data = await deleteCampanha(campanhaParaExcluir.id);

      toast.success(data.message);

      setCampanhaParaExcluir(null);

      if (usuario?.tipo === "ADM") {
        carregarCampanhasAdmin();
      } else {
        carregarCampanhas(instituicao?.id);
      }
    } catch (error) {
      toast.error(error.message || "Erro ao excluir campanha");
      console.error(error);
    } finally {
      setDeletandoId(null);
    }
  }

  const ehAdmin = usuario?.tipo === "ADM";
  const ehInstituicao = !!instituicao && !ehAdmin;
  const instituicaoAprovada =
    ehInstituicao && instituicao.aprovacao === "aprovado";
  const ehDoador = !!usuario && !instituicao && !ehAdmin;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar usuario={usuario} instituicao={instituicao} />

      
      {!estaLogado && (
  <div
    style={{
      background: "linear-gradient(135deg, #eef4ff 0%, #f8fbff 45%, #ffffff 100%)",
      padding: "110px 24px 90px",
      borderBottom: "1px solid #e5e7eb",
    }}
  >
    <div
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <div>
        <p
          style={{
            margin: "0 0 14px 0",
            color: "#1976d2",
            fontWeight: "bold",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          Plataforma solidária digital
        </p>

        <h1
          style={{
            fontSize: "56px",
            lineHeight: "1.1",
            margin: "0 0 20px 0",
            color: "#111827",
            maxWidth: "700px",
          }}
        >
          Conecte doadores e instituições em um só lugar
        </h1>

        <p
          style={{
            fontSize: "19px",
            color: "#4b5563",
            lineHeight: "1.8",
            marginBottom: "30px",
            maxWidth: "680px",
          }}
        >
          O Projeto ELO foi criado para facilitar a solidariedade com mais
          clareza, confiança e organização. Aqui, causas sérias encontram
          pessoas dispostas a ajudar de forma simples e acessível.
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "36px",
          }}
        >
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              padding: "15px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
              boxShadow: "0 10px 24px rgba(25, 118, 210, 0.22)",
            }}
          >
            Entrar na plataforma
          </button>

          <button
            onClick={() => router.push("/campanhas")}
            style={{
              background: "#fff",
              color: "#1976d2",
              border: "1px solid #1976d2",
              padding: "15px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            Explorar campanhas
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "16px 18px",
              minWidth: "180px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{ margin: "0 0 6px 0", color: "#1976d2", fontWeight: "bold" }}>
              Transparência
            </p>
            <p style={{ margin: 0, color: "#555", fontSize: "14px", lineHeight: "1.5" }}>
              Instituições analisadas e campanhas organizadas.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "16px 18px",
              minWidth: "180px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{ margin: "0 0 6px 0", color: "#1976d2", fontWeight: "bold" }}>
              Facilidade
            </p>
            <p style={{ margin: 0, color: "#555", fontSize: "14px", lineHeight: "1.5" }}>
              Um ambiente simples para encontrar e apoiar causas.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "16px 18px",
              minWidth: "180px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{ margin: "0 0 6px 0", color: "#1976d2", fontWeight: "bold" }}>
              Impacto social
            </p>
            <p style={{ margin: 0, color: "#555", fontSize: "14px", lineHeight: "1.5" }}>
              Mais visibilidade para quem realmente precisa de apoio.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              borderRadius: "18px",
              padding: "26px",
              color: "#fff",
              marginBottom: "18px",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.95 }}>
              Projeto ELO
            </p>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "28px", lineHeight: "1.2" }}>
              Tecnologia aproximando solidariedade
            </h3>
            <p style={{ margin: 0, lineHeight: "1.7", fontSize: "15px", opacity: 0.95 }}>
              Uma plataforma pensada para conectar confiança, visibilidade e doação.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "6px", color: "#1f2937" }}>
                Para doadores
              </strong>
              <span style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>
                Encontre campanhas e acompanhe contribuições com mais clareza.
              </span>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "6px", color: "#1f2937" }}>
                Para instituições
              </strong>
              <span style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>
                Divulgue campanhas e aumente a visibilidade da sua causa.
              </span>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "6px", color: "#1f2937" }}>
                Para administração
              </strong>
              <span style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>
                Faça a gestão das instituições e acompanhe a plataforma com segurança.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


          {!estaLogado && (
  <div
    style={{
      padding: "80px 24px 100px",
      background: "#ffffff",
    }}
  >
    <div
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        <p
          style={{
            margin: "0 0 10px 0",
            color: "#1976d2",
            fontWeight: "bold",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          Nosso propósito
        </p>

        <h2
          style={{
            fontSize: "38px",
            color: "#111827",
            margin: "0 0 16px 0",
          }}
        >
          Uma ponte entre quem quer ajudar e quem precisa
        </h2>

        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            color: "#556070",
            fontSize: "18px",
            lineHeight: "1.8",
          }}
        >
          O Projeto ELO nasce com a proposta de usar a tecnologia para ampliar o
          alcance de instituições comprometidas com causas sociais, oferecendo mais
          confiança para o doador e mais visibilidade para quem precisa arrecadar.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbe7ff",
            borderRadius: "18px",
            padding: "26px",
            boxShadow: "0 8px 24px rgba(25, 118, 210, 0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#1f2937" }}>
            Mais confiança
          </h3>
          <p style={{ margin: 0, color: "#555", lineHeight: "1.7" }}>
            O sistema ajuda a organizar o processo de doação e reforça a credibilidade
            das instituições cadastradas.
          </p>
        </div>

        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbe7ff",
            borderRadius: "18px",
            padding: "26px",
            boxShadow: "0 8px 24px rgba(25, 118, 210, 0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#1f2937" }}>
            Mais alcance
          </h3>
          <p style={{ margin: 0, color: "#555", lineHeight: "1.7" }}>
            Instituições podem divulgar campanhas com mais facilidade e alcançar
            pessoas dispostas a contribuir.
          </p>
        </div>

        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #dbe7ff",
            borderRadius: "18px",
            padding: "26px",
            boxShadow: "0 8px 24px rgba(25, 118, 210, 0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#1f2937" }}>
            Mais impacto
          </h3>
          <p style={{ margin: 0, color: "#555", lineHeight: "1.7" }}>
            Cada campanha publicada representa uma oportunidade concreta de gerar
            transformação social por meio da solidariedade.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

      
      {estaLogado && (      
      <div
        style={{
          padding: "40px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
       >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "1px solid #e5e7eb",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          

        <div>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "14px",
              color: "#1976d2",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {ehAdmin ? "Área administrativa" : "Plataforma ELO"}
          </p>

          <h2
            style={{
              margin: "0 0 8px 0",
              color: "#1f2937",
              fontSize: "32px",
            }}
          >
            {ehAdmin ? "Painel administrativo" : `👋 Olá, ${usuario?.nome}`}
          </h2>

          <p
            style={{
              color: "#666",
              margin: 0,
              maxWidth: "680px",
              lineHeight: "1.6",
            }}
          >
            {ehAdmin
              ? "Acompanhe as instituições cadastradas, acesse a área de aprovação e visualize as campanhas ativas publicadas na plataforma."
              : ehInstituicao
              ? "Gerencie as campanhas da sua instituição"
              : "Acompanhe suas doações e explore campanhas ativas"}
          </p>
        </div>


                  <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
          >
            {ehAdmin ? (
              <button
                onClick={() => router.push("/admin")}
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Gerenciar instituições
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/campanhas")}
                  style={{
                    background: "#fff",
                    color: "#1976d2",
                    border: "1px solid #1976d2",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Ver campanhas ativas
                </button>

                {ehInstituicao ? (
                  instituicaoAprovada ? (
                    <button
                      onClick={() => router.push("/nova-campanha")}
                      style={{
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      + Nova Campanha
                    </button>
                  ) : (
                    <div
                      style={{
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        color: "#9f1239",
                        padding: "14px 16px",
                        borderRadius: "10px",
                        maxWidth: "420px",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: "6px" }}>
                        Sua instituição ainda não foi aprovada
                      </strong>

                      <span>
                        O cadastro passa por análise do administrador como medida de segurança
                        para os doadores e para evitar fraudes. Após a aprovação, sua instituição
                        poderá criar campanhas normalmente. Até lá, aguarde a conclusão da análise.
                      </span>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => router.push("/minhas-doacoes")}
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Minhas doações
                  </button>
                )}
              </>
            )}
          </div>
          
        </div>

        {loading && (ehInstituicao || ehAdmin) && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #ccc",
                borderTop: "4px solid #1976d2",
                borderRadius: "50%",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
              }}
            />

            <p style={{ marginTop: "10px", color: "#666" }}>
              Carregando campanhas...
            </p>

            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        {!loading && ehInstituicao && campanhas.length === 0 && (
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              color: "#555",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#333" }}>
              Sua instituição ainda não possui campanhas cadastradas
            </h3>

            <p style={{ marginBottom: "18px" }}>
              Crie sua primeira campanha para começar a arrecadar.
            </p>

            {instituicaoAprovada && (
              <button
                onClick={() => router.push("/nova-campanha")}
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                + Criar minha primeira campanha
              </button>
            )}
          </div>
        )}

        {!loading && ehInstituicao &&
          campanhas.map((campanha) => {
            const podeGerenciar =
              instituicaoAprovada &&
              Number(campanha.instituicao_id) === Number(instituicao.id);

            return (
              <CampanhaCard
                key={campanha.id}
                campanha={campanha}
                onDelete={abrirModal}
                deletando={deletandoId === campanha.id}
                podeGerenciar={podeGerenciar}
              />
            );
          })}

        
        {!loading && ehAdmin && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)",
                  border: "1px solid #dbe7ff",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 6px 18px rgba(25, 118, 210, 0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        color: "#1976d2",
                        fontSize: "13px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Monitoramento da plataforma
                    </p>

                    <h3
                      style={{
                        margin: "0 0 10px 0",
                        color: "#1f2937",
                        fontSize: "26px",
                      }}
                    >
                      Campanhas ativas das instituições aprovadas
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "#5f6b7a",
                        lineHeight: "1.6",
                        maxWidth: "700px",
                      }}
                    >
                      Aqui você acompanha as campanhas que estão publicadas na plataforma.
                      Essa visualização ajuda no controle geral do sistema, sem acessar o fluxo de doação.
                    </p>
                  </div>

                  <div
                    style={{
                      minWidth: "170px",
                      background: "#ffffff",
                      border: "1px solid #dbe7ff",
                      borderRadius: "14px",
                      padding: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "13px",
                        color: "#667085",
                        fontWeight: "600",
                      }}
                    >
                      Total exibido
                    </p>

                    <h4
                      style={{
                        margin: 0,
                        fontSize: "30px",
                        color: "#1976d2",
                      }}
                    >
                      {campanhas.length}
                    </h4>

                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: "13px",
                        color: "#667085",
                      }}
                    >
                      campanhas ativas
                    </p>
                  </div>
                </div>
              </div>

              {campanhas.length === 0 ? (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "24px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 10px 0",
                      color: "#1f2937",
                    }}
                  >
                    Nenhuma campanha ativa encontrada
                  </h4>

                  <p
                    style={{
                      margin: "0 0 18px 0",
                      color: "#666",
                      lineHeight: "1.6",
                    }}
                  >
                    No momento não existem campanhas ativas publicadas por instituições aprovadas.
                    Você pode seguir para a área administrativa para continuar o gerenciamento do sistema.
                  </p>

                  <button
                    onClick={() => router.push("/admin")}
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Ir para área administrativa
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        color: "#1f2937",
                        fontSize: "20px",
                      }}
                    >
                      Lista de campanhas monitoradas
                    </h4>

                    <span
                      style={{
                        background: "#eef2ff",
                        color: "#4338ca",
                        border: "1px solid #c7d2fe",
                        padding: "8px 12px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Visualização administrativa
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: "16px" }}>
                    {campanhas.map((campanha) => (
                      <CampanhaCard
                        key={campanha.id}
                        campanha={campanha}
                        podeGerenciar={false}
                        deletando={false}
                        desabilitarClique={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}


        {!loading && ehDoador && (
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "24px",
              color: "#555",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#333" }}>
              Campanhas que você apoiou
            </h3>

            <p style={{ marginBottom: "18px" }}>
              Aqui estão as campanhas para as quais você já realizou doações.
            </p>

            {campanhasDoadas.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "20px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <p style={{ marginBottom: "16px" }}>
                  Você ainda não realizou nenhuma doação.
                </p>

                <button
                  onClick={() => router.push("/campanhas")}
                  style={{
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Ver campanhas ativas
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {campanhasDoadas.map((campanha) => (
                  <CampanhaCard
                    key={campanha.id}
                    campanha={campanha}
                    podeGerenciar={false}
                    deletando={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <ModalConfirmacao
          campanha={campanhaParaExcluir}
          onConfirm={confirmarExclusao}
          onCancel={() => setCampanhaParaExcluir(null)}
        />
      </div>
    )}
  </div> 
  );
}