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
  const [animarHero, setAnimarHero] = useState(false);
  const estaLogado = !!usuario;

    useEffect(() => {
  if (!estaLogado) {
    const timer = setTimeout(() => {
      setAnimarHero(true);
    }, 100);

    return () => clearTimeout(timer);
  }
}, [estaLogado]);

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
      {estaLogado && (
       <Navbar usuario={usuario} instituicao={instituicao} />
      )}
      
    
{!estaLogado && (
  
  <div
    style={{
      position: "relative",
      minHeight: "100vh",
      background: "#ffffff",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >

    {/* BOTÕES SUPERIORES */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
      {/* HOME */}
      <img
        src="/icon-home.png"
        alt="Home"
        onClick={() => router.push("/")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.1)";
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.opacity = "0.85";
        }}
        style={{
          width: "40px",
          height: "40px",
          cursor: "pointer",
          opacity: "0.85",
          transition: "all 0.2s ease",
        }}
      />

    {/* USUÁRIO */}
    <img
      src="/icon-user.png"
      alt="Login"
      onClick={() => router.push("/login")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px) scale(1.1)";
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.opacity = "0.85";
      }}
      style={{
        width: "40px",
        height: "40px",
        cursor: "pointer",
        opacity: "0.85",
        transition: "all 0.2s ease",
      }}
    />
      </div>

    {/* LOGO SUPERIOR GRANDE */}
    
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 3,
          marginTop: "-395px",
          opacity: animarHero ? 1 : 0,
          transform: animarHero ? "translateY(0)" : "translateY(-40px)",
          transition: "all 0.8s ease",
        }}
      >
      <img
        src="/logoHero.png"
        alt="Logo Projeto ELO"
        style={{
          width: "400vw", // largura logo
          maxWidth: "95%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>

    {/* NOME ELO */}
    <div
      style={{
        position: "relative",
        zIndex: 3,
        marginTop: "-360px",
        textAlign: "center",
        opacity: animarHero ? 1 : 0,
        transform: animarHero ? "translateY(0)" : "translateY(-25px)",
        transition: "all 1s ease",
        transitionDelay: "0.15s",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "60px",
          fontWeight: "700",
          lineHeight: "1",
          color: "#5c5c5c",
        }}
      >
        ELO
      </h1>
    </div>

    {/* FRASE + BOTÕES */}
    <div
      style={{
        position: "relative",
        zIndex: 4,
        marginTop: "50px",
        width: "100%",
        maxWidth: "980px",
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        opacity: animarHero ? 1 : 0,
        transform: animarHero ? "translateY(0)" : "translateY(35px)",
        transition: "all 1s ease",
        transitionDelay: "0.3s",
      }}
    >
      <h2
        style={{
          margin: "0 0 48px 0",
          fontSize: "30px",
          fontWeight: "1000",
          lineHeight: "1.15",
          color: "#4f4f4f",
          textTransform: "uppercase",
          maxWidth: "760px",
          textShadow: "0 4px 10px rgba(0,0,0,0.18)",
        }}
      >
        QUE CONECTA OS CORAÇÕES E
        <br />
        CONSTRÓI O FUTURO
      </h2>

      <div
  style={{
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <button
      onClick={() => router.push("/campanhas")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.26)";
        e.currentTarget.style.background = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.22)";
        e.currentTarget.style.background = "#f3f3f3";
      }}
      style={{
        background: "#f3f3f3",
        border: "none",
        padding: "16px 44px",
        borderRadius: "999px",
        fontSize: "15px",
        fontWeight: "700",
        color: "#4f4f4f",
        cursor: "pointer",
        minWidth: "230px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.22)",
        marginBottom: "18px",
        transition: "all 0.25s ease",
      }}
    >
      DOAR AGORA
    </button>

  <button
      onClick={() => router.push("/login")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.22)";
        e.currentTarget.style.background = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.22)";
        e.currentTarget.style.background = "#f3f3f3";
      }}
      style={{
        background: "transparent",
        border: "2px solid #e0e0e0",
        padding: "12px 28px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "700",
        color: "#4f4f4f",
        cursor: "pointer",
        minWidth: "160px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.22)",
        transition: "all 0.25s ease",
      }}
    >
      FAZER LOGIN
       </button>
     </div>
    </div>

    {/* FUNDO INFERIOR */}
    <img
      src="/fundo_de_baixo_hero.png"
      alt="Fundo decorativo"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100vw",
        maxHeight: "800px", // 👈 controla a altura aqui
        objectFit: "cover", // 👈 corta o excesso
       // transform: "translateY(100px)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
    
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

        {!loading && ehInstituicao && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {campanhas.map((campanha) => {
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
          </div>
        )}

        
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

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", }}>
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