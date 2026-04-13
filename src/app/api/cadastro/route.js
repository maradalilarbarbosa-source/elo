import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      nome,
      email,
      senha,
      cidade,
      estado,
      telefone,
      tipo_pessoa,
      documento,
      criarInstituicao,
      nomeInstituicao,
      descricao
    } = body;

    const [result] = await db.query(
      `
      INSERT INTO usuarios 
      (nome, email, senha, cidade, estado, telefone, tipo, tipo_pessoa, documento) 
      VALUES (?, ?, ?, ?, ?, ?, 'COMUM', ?, ?)
      `,
      [nome, email, senha, cidade, estado, telefone, tipo_pessoa, documento]
    );

    const usuarioId = result.insertId;

    if (criarInstituicao) {
      await db.query(
        `
        INSERT INTO instituicoes
        (nome, descricao, email, cidade, estado, telefone, cnpj, aprovacao, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente', ?)
        `,
        [
          nomeInstituicao,
          descricao,
          email,
          cidade,
          estado,
          telefone,
          documento || null,
          usuarioId
        ]
      );
    }

    return Response.json({ ok: true });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}