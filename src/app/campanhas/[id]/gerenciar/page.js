"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function GerenciarCampanha() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [campanha, setCampanha] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);
  const [motivos, setMotivos] = useState({});

  useEffect(() => {
    if (!id) return;
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setLoading(true);

      const [resCampanha, resDoacoes] = await Promise.all([
        fetch(`/api/campanhas/${id}`),
        fetch(`/api/campanhas/${id}/doacoes`)
      ]);

      const dataCampanha = await resCampanha.json();
      const dataDoacoes = await resDoacoes.json();

      if (!resCampanha.ok) {
        alert(dataCampanha.message || "Erro ao carregar campanha");
        return;
      }

      if (!resDoacoes.ok) {
        alert(dataDoacoes.message || "Erro ao carregar doações");
        return;
      }

      setCampanha(dataCampanha);
      setDoacoes(dataDoacoes);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados da campanha");
    } finally {
      setLoading(false);
    }
  }

  async function validarDoacao(doacaoId, novoStatus) {
    try {
      if (novoStatus === "rejeitado" && !motivos[doacaoId]?.trim()) {
        alert("Informe o motivo da rejeição");
        return;
      }

      setProcessandoId(doacaoId);

      const res = await fetch(`/api/doacoes/${doacaoId}/validar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus,
          motivo_rejeicao:
            novoStatus === "rejeitado" ? motivos[doacaoId] : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro ao validar doação");
        setProcessandoId(null);
        return;
      }

      alert(data.message);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao validar doação:", error);
      alert("Erro ao validar doação");
    } finally {
      setProcessandoId(null);
    }
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#444",
        }}
      >
        Carregando campanha...
      </div>
    );
  }

  if (!campanha) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Campanha não encontrada</h2>
      </div>
    );
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
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>Gerenciar campanha</h1>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Aqui você pode visualizar e gerenciar sua campanha.
        </p>

        <h2>{campanha.titulo}</h2>

        <p style={{ marginTop: "10px", color: "#555" }}>
          {campanha.descricao}
        </p>

        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Meta: R$ {Number(campanha.meta).toFixed(2)}
        </p>

        <p style={{ marginTop: "5px", color: "#666" }}>
          Arrecadado: R$ {Number(campanha.valor_arrecadado || 0).toFixed(2)}
        </p>

        <div
          style={{
            height: "10px",
            background: "#eee",
            borderRadius: "6px",
            marginTop: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${
                campanha.meta > 0
                  ? Math.min(
                      (Number(campanha.valor_arrecadado || 0) /
                        Number(campanha.meta)) *
                        100,
                      100
                    )
                  : 0
              }%`,
              background: "#28a745",
              height: "100%",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
          <button
            onClick={() => router.push(`/campanhas/${campanha.id}/editar`)}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Editar campanha
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              background: "#ccc",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Voltar
          </button>
        </div>

        <hr style={{ margin: "30px 0" }} />

        <h2 style={{ marginBottom: "20px" }}>Doações recebidas</h2>

        {doacoes.length === 0 ? (
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              color: "#555",
            }}
          >
            Ainda não há doações para esta campanha.
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
                background: "#fafafa",
              }}
            >
              <p style={{ marginBottom: "8px" }}>
                <strong>Doador:</strong>{" "}
                {doacao.doador_nome || `Usuário #${doacao.usuario_id}`}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>E-mail:</strong> {doacao.doador_email || "-"}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Valor:</strong> R$ {Number(doacao.valor || 0).toFixed(2)}
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
                    fontWeight: "bold",
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
                <div style={{ marginTop: "16px" }}>
                  <textarea
                    placeholder="Motivo da rejeição (obrigatório se rejeitar)"
                    value={motivos[doacao.id] || ""}
                    onChange={(e) =>
                      setMotivos((prev) => ({
                        ...prev,
                        [doacao.id]: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      marginBottom: "12px",
                      boxSizing: "border-box",
                      resize: "vertical",
                    }}
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => validarDoacao(doacao.id, "aprovado")}
                      disabled={processandoId === doacao.id}
                      style={{
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        cursor:
                          processandoId === doacao.id ? "not-allowed" : "pointer",
                        opacity: processandoId === doacao.id ? 0.7 : 1,
                      }}
                    >
                      {processandoId === doacao.id ? "Processando..." : "Aprovar"}
                    </button>

                    <button
                      onClick={() => validarDoacao(doacao.id, "rejeitado")}
                      disabled={processandoId === doacao.id}
                      style={{
                        background: "#d32f2f",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        cursor:
                          processandoId === doacao.id ? "not-allowed" : "pointer",
                        opacity: processandoId === doacao.id ? 0.7 : 1,
                      }}
                    >
                      {processandoId === doacao.id ? "Processando..." : "Rejeitar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}