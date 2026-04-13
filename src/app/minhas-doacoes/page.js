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
        padding: "40px 20px"
      }}
     >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }}
        >
          <div>
            <h1 style={{ marginBottom: "8px" }}>Minhas doações</h1>
            <p style={{ color: "#666" }}>
              Acompanhe o status das doações que você já realizou.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            style={{
              background: "#ccc",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Voltar
          </button>
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
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              color: "#555"
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
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
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
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                background: "#fafafa"
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>
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
                <strong>Data da doação:</strong> {formatarData(doacao.data_doacao)}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      doacao.status === "aprovado"
                        ? "#28a745"
                        : doacao.status === "rejeitado"
                        ? "#d32f2f"
                        : "#f57c00",
                    fontWeight: "bold"
                  }}
                >
                  {doacao.status}
                </span>
              </p>

              {doacao.status === "rejeitado" && doacao.motivo_rejeicao && (
                <p style={{ marginBottom: "8px", color: "#d32f2f" }}>
                  <strong>Motivo da rejeição:</strong> {doacao.motivo_rejeicao}
                </p>
              )}

              {doacao.status === "pendente" && (
                <p style={{ color: "#f57c00", marginTop: "10px" }}>
                  Sua doação ainda está aguardando validação da instituição.
                </p>
              )}

              {doacao.status === "aprovado" && (
                <p style={{ color: "#28a745", marginTop: "10px" }}>
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