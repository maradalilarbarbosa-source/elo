import db from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const campanhaId = Number(id);

    if (!campanhaId) {
      return Response.json(
        { message: "ID da campanha inválido" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT
        d.*,
        u.nome AS doador_nome,
        u.email AS doador_email
      FROM doacoes d
      LEFT JOIN usuarios u ON d.usuario_id = u.id
      WHERE d.campanha_id = ?
      ORDER BY d.data_doacao DESC
      `,
      [campanhaId]
    );

    return Response.json(rows);
  } catch (error) {
    console.error("Erro ao buscar doações da campanha:", error);
    return Response.json(
      { message: "Erro ao buscar doações da campanha" },
      { status: 500 }
    );
  }
}