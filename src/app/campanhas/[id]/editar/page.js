"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarCampanha() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    async function carregarCampanha() {
      try {
        setLoading(true);
        setErro(null);

        const res = await fetch(`/api/campanhas/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setErro(data.error || "Erro ao carregar campanha.");
          setLoading(false);
          return;
        }

        setTitulo(data.titulo || "");
        setDescricao(data.descricao || "");
        setMeta(data.meta || "");
      } catch (error) {
        console.error("Erro ao carregar campanha:", error);
        setErro("Erro ao carregar campanha.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarCampanha();
    }
  }, [id]);

  async function atualizarCampanha(e) {
    e.preventDefault();

    setErro(null);
    setMensagem(null);

    if (!titulo.trim() || !descricao.trim() || !meta) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (Number(meta) <= 0) {
      setErro("A meta deve ser maior que zero.");
      return;
    }

    setSalvando(true);

    try {
      const res = await fetch(`/api/campanhas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          meta: Number(meta),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao atualizar campanha.");
        setSalvando(false);
        return;
      }

      setMensagem("Campanha atualizada com sucesso!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      setErro("Erro ao atualizar campanha.");
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              marginBottom: "10px",
              fontSize: "28px",
              color: "#222",
            }}
          >
            Editar campanha
          </h1>

          <div
            style={{
              background: "#eef3f8",
              color: "#335",
              padding: "14px",
              borderRadius: "10px",
              fontSize: "15px",
              marginTop: "20px",
            }}
          >
            Carregando dados da campanha...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "28px",
            color: "#222",
          }}
        >
          Editar campanha
        </h1>

        <p
          style={{
            marginBottom: "30px",
            color: "#666",
            fontSize: "15px",
          }}
        >
          Atualize os dados abaixo para manter sua campanha organizada e clara para os doadores.
        </p>

        {mensagem && (
          <div
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #c3e6cb",
            }}
          >
            {mensagem}
          </div>
        )}

        {erro && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
            }}
          >
            {erro}
          </div>
        )}

        <form
          onSubmit={atualizarCampanha}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Título
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título da campanha"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a campanha"
              style={{
                width: "100%",
                minHeight: "140px",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "15px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Meta em reais
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="Ex: 5000"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={salvando}
              style={{
                flex: 1,
                background: "#e0e0e0",
                color: "#333",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                cursor: salvando ? "not-allowed" : "pointer",
                fontWeight: "600",
                opacity: salvando ? 0.7 : 1,
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              style={{
                flex: 1,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                cursor: salvando ? "not-allowed" : "pointer",
                fontWeight: "600",
                opacity: salvando ? 0.7 : 1,
              }}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}