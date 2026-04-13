import db from "@/lib/db";

// 📌 BUSCAR UMA CAMPANHA POR ID
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
      SELECT *
      FROM campanhas
      WHERE id = ?
      `,
      [campanhaId]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "Campanha não encontrada" },
        { status: 404 }
      );
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar campanha:", error);
    return Response.json(
      { message: "Erro ao buscar campanha" },
      { status: 500 }
    );
  }
}

// 📌 ATUALIZAR CAMPANHA
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const campanhaId = Number(id);

    if (!campanhaId) {
      return Response.json(
        { message: "ID da campanha inválido" },
        { status: 400 }
      );
    }

    const { titulo, descricao, meta } = await req.json();

    await db.query(
      `
      UPDATE campanhas
      SET titulo = ?, descricao = ?, meta = ?
      WHERE id = ?
      `,
      [titulo, descricao, meta, campanhaId]
    );

    return Response.json({ message: "Campanha atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar campanha:", error);
    return Response.json(
      { message: "Erro ao atualizar campanha" },
      { status: 500 }
    );
  }
}

// 📌 DELETAR CAMPANHA
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const campanhaId = Number(id);

    if (!campanhaId) {
      return Response.json(
        { message: "ID da campanha inválido" },
        { status: 400 }
      );
    }

    // 1. apagar doações vinculadas à campanha
    await db.query(
      `
      DELETE FROM doacoes
      WHERE campanha_id = ?
      `,
      [campanhaId]
    );

    // 2. apagar a campanha
    const [result] = await db.query(
      `
      DELETE FROM campanhas
      WHERE id = ?
      `,
      [campanhaId]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { message: "Campanha não encontrada para exclusão" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Campanha excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar campanha:", error);
    return Response.json(
      { message: error.message || "Erro ao deletar campanha" },
      { status: 500 }
    );
  }
}