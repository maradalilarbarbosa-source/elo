"use client";

import { useEffect, useState } from "react";

export default function InstituicoesPage() {
  const [instituicoes, setInstituicoes] = useState([]);

  useEffect(() => {
    carregarInstituicoes();
  }, []);

  async function carregarInstituicoes() {
    const response = await fetch(
      "/api/usuarios?tipo=PJ&aprovacao=aprovado"
    );

    const data = await response.json();
    setInstituicoes(data);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Instituições</h1>

      {instituicoes.length === 0 && (
        <p>Nenhuma instituição disponível</p>
      )}

      {instituicoes.map((inst) => (
        <div
          key={inst.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <p><strong>{inst.nome}</strong></p>
          <p>{inst.email}</p>
        </div>
      ))}
    </div>
  );
}