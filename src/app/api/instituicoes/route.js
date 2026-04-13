import db from "@/lib/db";

// 🔍 LISTAR instituições pendentes
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM instituicoes WHERE aprovacao = 'pendente'"
    );

    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ APROVAR instituição
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id } = body;

    await db.query(
      "UPDATE instituicoes SET aprovacao = 'aprovado' WHERE id = ?",
      [id]
    );

    return Response.json({ message: "Instituição aprovada com sucesso!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}