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
    campanha.descricao?.length > 55
      ? `${campanha.descricao.slice(0, 55)}...`
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
        padding: "10px",
        boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
        cursor: desabilitarClique ? "default" : "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
        minHeight: podeGerenciar ? "auto" : "250px",
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
          height: "100px",
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
            lineHeight: "1.3",
            color: "#404040",
            fontWeight: "700",
          }}
        >
          {campanha.titulo}
        </h3>

        <p
          style={{
            margin: "0 0 10px 0",
            fontSize: "12px",
            color: "#5c5c5c",
            lineHeight: "1.4",
          }}
        >
          {descricaoCurta}
        </p>

        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "11px",
            color: "#5c5c5c",
          }}
        >
          R${valorArrecadado.toFixed(2)} doados de R${meta.toFixed(2)}
        </p>

        {/* PROGRESSO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "5px",
              background: "#d9d9d9",
              borderRadius: "999px",
              overflow: "hidden",
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

          <div
            style={{
              minWidth: "36px",
              height: "36px",
              borderRadius: "999px",
              background: "#38a89d",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "700",
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            }}
          >
            {progresso.toFixed(0)}%
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