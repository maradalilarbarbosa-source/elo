import db from "@/lib/db";

// 🔍 LISTAR TODAS (pendentes + histórico)
export async function GET() {
  const [rows] = await db.query(`
    SELECT 
      i.id,
      i.nome,
      COALESCE(i.email, u.email) as email,
      i.aprovacao,
      i.motivo_reprovacao,
      i.data_aprovacao,
      i.data_reprovacao
    FROM instituicoes i
    JOIN usuarios u ON i.usuario_id = u.id
    ORDER BY i.id DESC
  `);

  return Response.json(rows);
}

// ✅ APROVAR
export async function PUT(req) {
  const { id } = await req.json();

  await db.query(
    `UPDATE instituicoes 
     SET aprovacao = 'aprovado',
         data_aprovacao = NOW(),
         motivo_reprovacao = NULL
     WHERE id = ?`,
    [id]
  );

  return Response.json({ success: true });
}

// ❌ REPROVAR
export async function POST(req) {
  const { id, motivo } = await req.json();

  await db.query(
    `UPDATE instituicoes 
     SET aprovacao = 'reprovado',
         motivo_reprovacao = ?,
         data_reprovacao = NOW()
     WHERE id = ?`,
    [motivo, id]
  );

  return Response.json({ success: true });
}