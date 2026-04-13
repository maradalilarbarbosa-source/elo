import db from "@/lib/db";
import CampanhaDetalheClient from "@/components/CampanhaDetalheClient";

export default async function CampanhaDetalhe({ params }) {
  const { id } = await params;

  const [rows] = await db.query(
    `
    SELECT 
      c.*,
      i.nome as instituicao_nome
    FROM campanhas c
    LEFT JOIN instituicoes i ON c.instituicao_id = i.id
    WHERE c.id = ?
    `,
    [id]
  );

  const campanha = rows[0];

  if (!campanha) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Campanha não encontrada</h2>
      </div>
    );
  }

  return <CampanhaDetalheClient campanha={campanha} />;
}