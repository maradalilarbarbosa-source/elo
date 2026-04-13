import db from "@/lib/db";

// 📌 CRIAR CAMPANHA
export async function POST(req) {
  const { titulo, descricao, meta, instituicao_id, usuario_id, tipo_doacao } = await req.json();

  await db.query(
    `INSERT INTO campanhas 
    (titulo, descricao, meta, instituicao_id, usuario_id, tipo_doacao, status)
    VALUES (?, ?, ?, ?, ?, ?, 'ativa')`,
    [titulo, descricao, meta, instituicao_id, usuario_id, tipo_doacao]
  );

  return Response.json({ success: true });
}

// 📌 LISTAR CAMPANHAS
export async function GET() {
    const [rows] = await db.query(`
    SELECT 
      c.*,
      i.nome as instituicao_nome
    FROM campanhas c
    LEFT JOIN instituicoes i ON c.instituicao_id = i.id
    ORDER BY c.id DESC
  `);

  return Response.json(rows);
}