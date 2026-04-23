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
    campanha.descricao?.length > 45
      ? `${campanha.descricao.slice(0, 45)}...`
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
        background: "#f8f8f8",
        borderRadius: "28px",
        padding: "18px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        cursor: desabilitarClique ? "default" : "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
        minHeight: podeGerenciar ? "auto" : "160px",
        aspectRatio: podeGerenciar ? "auto" : "4 / 3",
      }}
      onMouseEnter={(e) => {
        if (desabilitarClique) return;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 14px 26px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        if (desabilitarClique) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.14)";
      }}
    >
      {/* IMAGEM */}
      <div
        style={{
          height: podeGerenciar ? "90px" : "70px",
          borderRadius: "16px",
          marginBottom: "10px",
          background: campanha.imagem_url
            ? `url(${campanha.imagem_url}) center/cover no-repeat`
            : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 35%, #93c5fd 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!campanha.imagem_url && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #6fd3b4, #3fa7d6)",
              boxShadow: "inset 0 2px 6px rgba(255,255,255,0.2)",
              opacity: 0.9,
              borderRadius: "16px",
            }}
          />
        )}
      </div>

      {/* TEXTO */}
      <div style={{ padding: "0 4px" }}>
        <h3
          style={{
            margin: "0 0 6px 0",
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#404040",
            fontWeight: "700",
            minHeight: "29px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {campanha.titulo}
        </h3>

        <p
          style={{
            margin: "0 0 4px 0",
            fontSize: "12px",
            color: "#5c5c5c",
            lineHeight: "1.2",
          }}
        >
          {descricaoCurta}
        </p>

        {/* PROGRESSO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            marginTop: "2px",
            marginBottom: "6px",
          }}
        >
          <div style={{ flex: 1 }}>
  
            {/* BARRA */}
            <div
              style={{
                height: "4px",
                background: "#d9d9d9",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: `${progresso}%`,
                  height: "100%",
                  background: "#38a89d",
                  borderRadius: "999px",
                }}
              />
            </div>

            {/* TEXTO ABAIXO */}
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#5c5c5c",
                fontWeight: "500",
              }}
            >
              R$ { valorArrecadado.toFixed(2)} de R$ { meta.toFixed(2)}
            </p>
          </div>

          <div
          style={{
            width: "39px",
            height: "39px",
            borderRadius: "50%",
            background: `conic-gradient(
              #4bb8ad 0% ${progresso}%,
              #6fd3b4 ${progresso}%,
              #e6eeee ${progresso}% 100%
            )`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
            //flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: "600",
              color: "#2fa4a0",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {progresso.toFixed(0)}%
          </div>
        </div>
        </div>

        {/* BOTÕES DE GERENCIAMENTO */}
        {podeGerenciar && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "14px",
            }}
          >
            <button
              onClick={handleEdit}
              style={{
                flex: 1,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
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
                padding: "10px",
                borderRadius: "10px",
                cursor: deletando ? "not-allowed" : "pointer",
                opacity: deletando ? 0.7 : 1,
                fontWeight: "700",
                fontSize: "13px",
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