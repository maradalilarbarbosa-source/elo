import db from "@/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const doacaoId = Number(id);

    if (!doacaoId) {
      return Response.json(
        { message: "ID da doação inválido" },
        { status: 400 }
      );
    }

    const { status, motivo_rejeicao } = await req.json();

    if (!["aprovado", "rejeitado"].includes(status)) {
      return Response.json(
        { message: "Status inválido" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM doacoes
      WHERE id = ?
      `,
      [doacaoId]
    );

    const doacao = rows[0];

    if (!doacao) {
      return Response.json(
        { message: "Doação não encontrada" },
        { status: 404 }
      );
    }

    if (doacao.status !== "pendente") {
      return Response.json(
        { message: "Essa doação já foi validada" },
        { status: 400 }
      );
    }

    if (status === "aprovado") {
      await db.query(
        `
        UPDATE doacoes
        SET status = 'aprovado',
            data_validacao = NOW(),
            motivo_rejeicao = NULL
        WHERE id = ?
        `,
        [doacaoId]
      );

      await db.query(
        `
        UPDATE campanhas
        SET valor_arrecadado = valor_arrecadado + ?
        WHERE id = ?
        `,
        [Number(doacao.valor || 0), doacao.campanha_id]
      );

      return Response.json({
        message: "Doação aprovada com sucesso"
      });
    }

    if (!motivo_rejeicao || !motivo_rejeicao.trim()) {
      return Response.json(
        { message: "Informe o motivo da rejeição" },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE doacoes
      SET status = 'rejeitado',
          data_validacao = NOW(),
          motivo_rejeicao = ?
      WHERE id = ?
      `,
      [motivo_rejeicao.trim(), doacaoId]
    );

    return Response.json({
      message: "Doação rejeitada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao validar doação:", error);
    return Response.json(
      { message: "Erro ao validar doação" },
      { status: 500 }
    );
  }
}