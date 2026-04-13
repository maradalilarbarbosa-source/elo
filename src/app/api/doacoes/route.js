import db from "@/lib/db";

//  CRIAR DOAÇÃO
export async function POST(req) {
  try {
    const body = await req.json();

    const { usuario_id, campanha_id, valor } = body;

    // validações básicas
    if (!usuario_id || !campanha_id || !valor) {
      return Response.json(
        { error: "Campos obrigatórios não enviados" },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO doacoes (usuario_id, campanha_id, valor, status)
      VALUES (?, ?, ?, 'pendente')
      `,
      [usuario_id, campanha_id, valor]
    );

    return Response.json({
      ok: true,
      message: "Doação registrada com sucesso e aguardando validação da instituição."
    });
  } catch (error) {
    console.error("Erro ao registrar doação:", error);

    return Response.json(
      { error: "Erro ao registrar doação" },
      { status: 500 }
    );
  }
}