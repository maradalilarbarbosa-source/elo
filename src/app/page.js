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
  const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
      const usuarioSalvo = localStorage.getItem("usuario");

      if (usuarioSalvo) {
        setUsuarioLogado(JSON.parse(usuarioSalvo));
      }
    }, []);
    
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
    <div
        style={{
            position: "relative",
            minHeight: "100vh",
            overflowX: "visible", // ✅ libera lateral
          }}
      >
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

        {!usuarioLogado && (
      <>
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
    </>
)}
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
          opacity: 0.75,
          filter: "drop-shadow(0 5px 5px rgba(0, 0, 0, 0.11))"
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
        bottom: -60,
        left: -360, // 👈 fixa na esquerda
        width: "200vw", // 👈 cresce pra direita
        minWidth: "2300px", // opcional
        height: "1000px", // 👈 altura
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
    
  </div>
)}

      
      {estaLogado && (
  <div
    style={{
      position: "relative",
      padding: "40px",
      maxWidth: "1120px",
      margin: "0 auto",
      overflow: "visible",
    }}
  >
    <img
      src="/elos-verticais-esquerda.png"
      alt=""
      style={{
        position: "absolute",
        left: "-650px",
        top: "20px",
        height: "650px",
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <img
      src="/elos-verticais.png"
      alt=""
      style={{
        position: "absolute",
        right: "-650px",
        top: "20px",
        height: "650px",
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <div style={{ position: "relative", zIndex: 1 }}>
  {ehAdmin && (
    <div style={{ textAlign: "center", marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #e5e7eb" }}>
      <p style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#2f8f87", fontWeight: "bold", textTransform: "uppercase" }}>
        Área administrativa
      </p>

      <p style={{ color: "#666", margin: "0 auto", maxWidth: "680px", lineHeight: "1.6", fontSize: "12px" }}>
        Acompanhe as instituições cadastradas, acesse a área de aprovação e visualize as campanhas ativas.
      </p>
    </div>
  )}

  {ehInstituicao && (
    <div
    style={{
      marginBottom: "30px",
      paddingBottom: "20px",
      borderBottom: "1px solid #e5e7eb",
    }}
>
      

      <h2 style={{  margin: "0 0 8px 0", color: "#2f8f87", fontSize: "40px", textAlign: "center",fontWeight: "bold", }}>
        Olá, {usuario?.nome}
      </h2>

      <p style={{background: "#2f8f872f", borderRadius: "50px", margin: "0 0 8px 0", fontSize: "30px", color: "#545555ec", textAlign: "center" }}>
        Minhas Campanhas
      </p>

      <p style={{ color: "#666", margin: "0 auto 18px auto", maxWidth: "680px", lineHeight: "1.6", fontSize: "14px", textAlign: "center" }}>
        Gerencie As Campanhas Da Sua Instituição
      </p>

      {instituicaoAprovada ? (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
    }}
  >
  </div>
) : (
  <div
    style={{
      background: "#fff1f2",
      border: "1px solid #fecdd3",
      color: "#9f1239",
      padding: "14px 16px",
      borderRadius: "10px",
      maxWidth: "520px",
      margin: "0 auto",
      fontSize: "14px",
    }}
  >
    <strong>Sua instituição ainda não foi aprovada</strong>
  </div>
)}
</div>
  )}

</div>


        {loading && (ehInstituicao || ehAdmin) && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #ccc",
                borderTop: "4px solid #2f8f87",
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

        {!loading && !ehAdmin && ehInstituicao && campanhas.length === 0 && (
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
                  background: "#2f8f87",
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

    {!loading && !ehAdmin && ehInstituicao && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
            {instituicaoAprovada && (
  <div
    onClick={() => router.push("/nova-campanha")}
    style={{
      background: "#fff",
      border: "1px dashed #b8d2cd",
      borderRadius: "18px",
      padding: "16px",
      minHeight: "210px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.10)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.05)";
    }}
  >
    <img
      src="/logo-pequena.png"
      alt="Nova campanha"
      style={{
        width: "200px",
        height: "200px",
        objectFit: "contain",
      }}
    />

    <span
      style={{
        fontSize: "20px",
        fontWeight: "700",
        color: "#2f8f87",
      }}
    >
      Nova Campanha
    </span>
  </div>
)}
            {campanhas.map((campanha) => {
              const valorArrecadado = Number(campanha.valor_arrecadado || 0);
              const meta = Number(campanha.meta || 0);
              const progresso =
                meta > 0 ? Math.min((valorArrecadado / meta) * 100, 100) : 0;

              return (
                <div
                  key={campanha.id}
                  onClick={() => router.push(`/campanhas/${campanha.id}/gerenciar`)}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "16px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      height: "70px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #72d5c5, #3aa6cf)",
                      marginBottom: "14px",
                    }}
                  />

                  <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                    {campanha.titulo}
                  </h4>

                  <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "13px" }}>
                    {campanha.descricao}
                  </p>

                  <div
                    style={{
                      height: "8px",
                      background: "#e5e7eb",
                      borderRadius: "999px",
                      overflow: "hidden",
                      marginBottom: "8px",
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

                  <p style={{ margin: "0 0 14px 0", fontSize: "12px", color: "#555" }}>
                    R$ {valorArrecadado.toFixed(2)} de R$ {meta.toFixed(2)}
                  </p>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/campanhas/${campanha.id}/editar`);
                      }}
                      style={{
                        flex: 1,
                        background: "#2f8f87",
                        color: "#fff",
                        border: "none",
                        padding: "10px",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModal(campanha);
                      }}
                      style={{
                        flex: 1,
                        background: "#d32f2f",
                        color: "#fff",
                        border: "none",
                        padding: "10px",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
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
                  display: "flex",
                  //justifyContent: "flex-start",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    background: "#ffffff",
                    border: "2px solid #b8d2cd",
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: "10px",
                      color: "#667085",
                      textAlign: "center",
                    }}
                  >
                    Campanhas Ativas
                  </p>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "26px",
                      fontWeight: "700",
                      color: "#2f8f87",
                      textAlign: "center",
                    }}
                  >
                    {campanhas.length}
                  </h4>

                  
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
                      background: "#2f8f87",
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
                  </div>

                  <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  }}
>
  {campanhas.map((campanha) => {
    const valorArrecadado = Number(campanha.valor_arrecadado || 0);
    const meta = Number(campanha.meta || 0);
    const progresso =
      meta > 0 ? Math.min((valorArrecadado / meta) * 100, 100) : 0;

    return (
      <div
        key={campanha.id}
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          padding: "16px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            height: "54px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #72d5c5, #3aa6cf)",
            marginBottom: "14px",
          }}
        />

        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: "16px",
            color: "#1f2937",
          }}
        >
          {campanha.titulo}
        </h4>

        <p
          style={{
            margin: "0 0 10px 0",
            fontSize: "13px",
            color: "#666",
          }}
        >
          {campanha.instituicao_nome || "Instituição não informada"}
        </p>

        <div
          style={{
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "8px",
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
            margin: 0,
            fontSize: "12px",
            color: "#555",
          }}
        >
          R$ {valorArrecadado.toFixed(2)} de R$ {meta.toFixed(2)}
        </p>
      </div>
    );
  })}
</div>
                </div>
              )}
            </div>
          )}


        {!loading && ehDoador && (
  <div>
    <div
      style={{
        textAlign: "center",
        marginBottom: "34px",
      }}
    >
      <h2
        style={{
          margin: "0 0 12px 0",
          fontSize: "46px",
          color: "#2f8f87",
          fontWeight: "700",
        }}
      >
        Olá, {usuario?.nome}
      </h2>

      <div
        style={{
          background: "rgba(184, 210, 205, 0.45)",
          padding: "8px 20px",
          borderRadius: "999px",
          margin: "0 auto 14px auto",
          maxWidth: "720px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "30px",
            color: "#555",
            fontWeight: "500",
          }}
        >
          Causas Apoiadas
        </h3>
      </div>
    </div>

    {campanhasDoadas.length === 0 ? (
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "24px",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          color: "#555",
        }}
      >
        Você ainda não apoiou nenhuma coisa, doe agora!
      </div>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {campanhasDoadas.map((campanha) => {
          const valorArrecadado = Number(campanha.valor_arrecadado || 0);
          const meta = Number(campanha.meta || 0);
          const progresso =
            meta > 0 ? Math.min((valorArrecadado / meta) * 100, 100) : 0;

          return (
            <div
              key={campanha.id}
              onClick={() => router.push(`/campanhas/${campanha.id}`)}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "16px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "70px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #72d5c5, #3aa6cf)",
                  marginBottom: "14px",
                }}
              />

              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "16px",
                  color: "#1f2937",
                }}
              >
                {campanha.titulo}
              </h4>

              <p
                style={{
                  margin: "0 0 12px 0",
                  color: "#666",
                  fontSize: "13px",
                }}
              >
                {campanha.descricao}
              </p>

              <div
                style={{
                  height: "8px",
                  background: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "8px",
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
                  margin: 0,
                  fontSize: "12px",
                  color: "#555",
                }}
              >
                R$ {valorArrecadado.toFixed(2)} de R$ {meta.toFixed(2)}
              </p>
            </div>
          );
        })}
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