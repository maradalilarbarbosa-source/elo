"use client";

import { useState, useEffect } from "react";

export default function ModalCriarCampanha({ aberto, onClose, onSalvar, campanha }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [meta, setMeta] = useState("");
  useEffect(() => {
      if (campanha) {
        setTitulo(campanha.titulo || "");
        setDescricao(campanha.descricao || "");
        setMeta(campanha.meta || "");
      }
    }, [campanha]);

  if (!aberto) return null;

  async function handleSalvar() {
    if (!titulo || !descricao || !meta) {
      alert("Preencha todos os campos");
      return;
    }

    await onSalvar({
      id: campanha?.id,
      titulo,
      descricao,
      meta
    });

    setTitulo("");
    setDescricao("");
    setMeta("");
    onClose();
  }
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Criar nova campanha</h2>

        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={input}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={input}
        />

        <input
          placeholder="Meta (R$)"
          value={meta}
          onChange={(e) => {
          const valor = e.target.value.replace(/\D/g, "");
          setMeta(valor);
           }}
          style={input}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={btnCancelar} onClick={onClose}>
            Cancelar
          </button>

          <button style={btnSalvar} onClick={handleSalvar}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  display: "flex",
  flexDirection: "column"
};

const input = {
  marginTop: "10px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btnSalvar = {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  flex: 1
};

const btnCancelar = {
  background: "#ccc",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  flex: 1
};