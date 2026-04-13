import db from "@/lib/db";

export async function GET(req) {
  const userId = req.headers.get("user-id"); // ou via token depois

  const [rows] = await db.query(
    "SELECT * FROM instituicoes WHERE usuario_id = ?",
    [userId]
  );

  return Response.json(rows[0] || null);
}