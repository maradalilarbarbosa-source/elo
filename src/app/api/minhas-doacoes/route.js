import db from "@/lib/db";

export async function GET(req) {
  try {
    const userId = req.headers.get("user-id");

    if (!userId) {
      return Response.json(
        { message: "Usuário não informado" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT
        d.id,
        d.campanha_id,
        d.valor,
        d.data_doacao,
        d.status,
        d.motivo_rejeicao,
        c.titulo AS campanha_titulo,
        c.descricao AS campanha_descricao,
        c.meta,
        c.valor_arrecadado,
        i.nome AS instituicao_nome
      FROM doacoes d
      INNER JOIN campanhas c ON d.campanha_id = c.id
      LEFT JOIN instituicoes i ON c.instituicao_id = i.id
      WHERE d.usuario_id = ?
      ORDER BY d.data_doacao DESC
      `,
      [userId]
    );

    return Response.json(rows);
  } catch (error) {
    console.error("Erro ao buscar minhas doações:", error);
    return Response.json(
      { message: "Erro ao buscar minhas doações" },
      { status: 500 }
    );
  }
}