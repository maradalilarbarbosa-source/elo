import db from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");
  const aprovacao = searchParams.get("aprovacao");

  let query = "SELECT * FROM usuarios WHERE 1=1";
  let values = [];

  if (tipo) {
    query += " AND tipo = ?";
    values.push(tipo);
  }

  if (aprovacao) {
    query += " AND aprovacao = ?";
    values.push(aprovacao);
  }

  const [rows] = await db.query(query, values);

  return Response.json(rows);
}