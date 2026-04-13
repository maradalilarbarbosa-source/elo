import { NextResponse } from "next/server";
import connection from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha obrigatórios" },
        { status: 400 }
      );
    }

    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login realizado com sucesso",
      usuario: rows[0],
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro no servidor" },
      { status: 500 }
    );
  }
}