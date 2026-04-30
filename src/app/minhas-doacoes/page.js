"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function MinhasDoacoesPage() {
  const [usuario, setUsuario] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (!user) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(user);
    setUsuario(parsed);

    buscarDoacoes(parsed.id);
  }, [router]);

  async function buscarDoacoes(userId) {
    try {
      setLoading(true);

      const res = await fetch("/api/minhas-doacoes", {
        headers: {
          "user-id": userId
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro ao carregar doações");
        return;
      }

      setDoacoes(data);
    } catch (error) {
      console.error("Erro ao buscar doações:", error);
      alert("Erro ao carregar doações");
    } finally {
      setLoading(false);
    }
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  }
return (
  <>
    <Navbar />

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "55px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img src="/elos-verticais-esquerda.png" alt="" style={eloEsquerda} />
      <img src="/elos-verticais.png" alt="" style={eloDireita} />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#2f8f87",
            }}
          >
            Minhas Doações
          </h1>

          <p
            style={{
              margin: 0,
              color: "#5f6b7a",
              fontSize: "16px",
            }}
          >
            Acompanhe o status das doações que você já realizou.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            Carregando suas doações...
          </div>
        ) : doacoes.length === 0 ? (
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: "18px",
              padding: "24px",
              textAlign: "center",
              color: "#555",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#333" }}>
              Você ainda não realizou nenhuma doação
            </h3>

            <p style={{ marginBottom: "18px" }}>
              Explore as campanhas ativas e faça sua primeira contribuição.
            </p>

            <button
              onClick={() => router.push("/campanhas")}
              style={{
                background: "#2f8f87",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "999px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Ver campanhas ativas
            </button>
          </div>
        ) : (
          doacoes.map((doacao) => (
            <div
              key={doacao.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "22px",
                marginBottom: "16px",
                background: "#fafafa",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "20px",
                  fontWeight: "700",
                  textAlign: "center",
                  color: "#1f2937",
                }}
              >
                {doacao.campanha_titulo || "Campanha"}
              </h3>

              <p style={{ marginBottom: "8px", color: "#555" }}>
                {doacao.campanha_descricao || ""}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Instituição:</strong>{" "}
                {doacao.instituicao_nome || "Não informada"}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Valor doado:</strong> R${" "}
                {Number(doacao.valor || 0).toFixed(2)}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Data da doação:</strong>{" "}
                {formatarData(doacao.data_doacao)}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      doacao.status === "aprovado"
                        ? "#2f8f87"
                        : doacao.status === "rejeitado"
                        ? "#d32f2f"
                        : "#f57c00",
                    fontWeight: "bold",
                  }}
                >
                  {doacao.status}
                </span>
              </p>

              {doacao.status === "rejeitado" && doacao.motivo_rejeicao && (
                <p style={{ marginBottom: "8px", color: "#d32f2f" }}>
                  <strong>Motivo da rejeição:</strong>{" "}
                  {doacao.motivo_rejeicao}
                </p>
              )}

              {doacao.status === "pendente" && (
                <p style={{ color: "#f57c00", marginTop: "10px" }}>
                  Sua doação ainda está aguardando validação da instituição.
                </p>
              )}

              {doacao.status === "aprovado" && (
                <p style={{ color: "#2f8f87", marginTop: "10px" }}>
                  Sua doação foi validada com sucesso pela instituição.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </>
 );
}
const eloEsquerda = {
  position: "absolute",
  left: "-400px",
  top: "80px",
  height: "650px",
  opacity: 0.25,
  zIndex: 0,
  pointerEvents: "none",
};

const eloDireita = {
  position: "absolute",
  right: "-400px",
  top: "80px",
  height: "650px",
  opacity: 0.25,
  zIndex: 0,
  pointerEvents: "none",
};