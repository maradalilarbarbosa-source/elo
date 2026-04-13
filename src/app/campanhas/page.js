import db from "@/lib/db";
import CampanhaCard from "@/components/CampanhaCard";
import Navbar from "@/components/Navbar";

export default async function PaginaCampanhas() {
  const [rows] = await db.query(`
    SELECT
      c.*,
      i.nome AS instituicao_nome
    FROM campanhas c
    LEFT JOIN instituicoes i ON c.instituicao_id = i.id
    WHERE c.status = 'ativa' OR c.status IS NULL
    ORDER BY c.id DESC
  `);

  return (
  <>
    <Navbar />

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px 0",
                color: "#1976d2",
                fontWeight: "bold",
                fontSize: "13px",
                textTransform: "uppercase",
              }}
            >
              Plataforma ELO
            </p>

            <h1
              style={{
                margin: "0 0 10px 0",
                fontSize: "36px",
                color: "#1f2937",
              }}
            >
              Campanhas disponíveis
            </h1>

            <p style={{ color: "#666", margin: 0 }}>
              Explore campanhas ativas e encontre causas para apoiar.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "18px 22px",
              minWidth: "160px",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              Total de campanhas
            </p>

            <h2 style={{ margin: 0, color: "#1976d2", fontSize: "28px" }}>
              {rows.length}
            </h2>
          </div>
        </div>

        {/* CONTEÚDO */}
        {rows.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "30px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              Nenhuma campanha ativa encontrada
            </h3>

            <p style={{ color: "#666" }}>
              No momento, não existem campanhas disponíveis.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {rows.map((campanha) => (
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
    </div>
  </>
);
}