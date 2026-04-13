"use client";

import { useRouter } from "next/navigation";

export default function CampanhaCard({
  campanha,
  onDelete,
  deletando,
  podeGerenciar,
  desabilitarClique = false,
}) {
  const router = useRouter();

  const valorArrecadado = Number(campanha.valor_arrecadado || 0);
  const meta = Number(campanha.meta || 0);

  const progresso =
    meta > 0 ? Math.min((valorArrecadado / meta) * 100, 100) : 0;

  const descricaoCurta =
    campanha.descricao?.length > 120
      ? `${campanha.descricao.slice(0, 120)}...`
      : campanha.descricao || "Sem descrição informada.";

  function handleCardClick() {
    if (desabilitarClique) return;

    if (podeGerenciar) {
      router.push(`/campanhas/${campanha.id}/gerenciar`);
    } else {
      router.push(`/campanhas/${campanha.id}`);
    }
  }

  function handleEdit(e) {
    e.stopPropagation();
    router.push(`/campanhas/${campanha.id}/editar`);
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (onDelete) {
      onDelete(campanha);
    }
  }

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "16px",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: desabilitarClique ? "default" : "pointer",
        border: "1px solid #eaeef4",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (desabilitarClique) return;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 36px rgba(15, 23, 42, 0.12)";
      }}
      onMouseLeave={(e) => {
        if (desabilitarClique) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(15, 23, 42, 0.08)";
      }}
    >
      <div
        style={{
          height: "180px",
          borderRadius: "14px",
          marginBottom: "18px",
          background: campanha.imagem_url
            ? `url(${campanha.imagem_url}) center/cover no-repeat`
            : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 35%, #93c5fd 100%)",
          position: "relative",
        }}
      >
        {!campanha.imagem_url && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(255,255,255,0.92)",
            color: "#1d4ed8",
            padding: "6px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          {progresso.toFixed(0)}% da meta
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "26px",
              lineHeight: "1.3",
              color: "#111827",
            }}
          >
            {campanha.titulo}
          </h3>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
              fontSize: "15px",
              lineHeight: "1.7",
            }}
          >
            {descricaoCurta}
          </p>
        </div>

        {campanha.instituicao_nome && (
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "10px 12px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Instituição
            </p>

            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: "#1f2937",
                fontWeight: "600",
              }}
            >
              {campanha.instituicao_nome}
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid #eef2f7",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                color: "#6b7280",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.4px",
              }}
            >
              Meta
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#111827",
                fontWeight: "700",
              }}
            >
              R$ {meta.toFixed(2)}
            </p>
          </div>

          <div
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid #eef2f7",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                color: "#6b7280",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.4px",
              }}
            >
              Arrecadado
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#111827",
                fontWeight: "700",
              }}
            >
              R$ {valorArrecadado.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#4b5563",
                fontWeight: "600",
              }}
            >
              Progresso da campanha
            </span>

            <span
              style={{
                fontSize: "13px",
                color: "#16a34a",
                fontWeight: "700",
              }}
            >
              {progresso.toFixed(0)}%
            </span>
          </div>

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
                background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                height: "100%",
                transition: "width 0.3s ease",
                borderRadius: "999px",
              }}
            />
          </div>
        </div>

        {podeGerenciar && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "6px",
            }}
          >
            <button
              onClick={handleEdit}
              style={{
                flex: 1,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              Editar
            </button>

            <button
              onClick={handleDelete}
              disabled={deletando}
              style={{
                flex: 1,
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "10px",
                cursor: deletando ? "not-allowed" : "pointer",
                opacity: deletando ? 0.7 : 1,
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              {deletando ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}