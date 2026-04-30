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
              textAlign: "center",
              color: "#2f8f87",
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
      padding: "55px 20px",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      src="/elos-verticais-esquerda.png"
      alt=""
      style={{
        position: "absolute",
        left: "-400px",
        top: "10px",
        height: "650px",
        opacity: 0.25,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <img
      src="/elos-verticais.png"
      alt=""
      style={{
        position: "absolute",
        right: "-400px",
        top: "10px",
        height: "650px",
        opacity: 0.25,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        maxWidth: "760px",
        width: "100%",
        background: "#fff",
        borderRadius: "28px",
        padding: "36px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h1
        style={{
          margin: "0 0 10px 0",
          fontSize: "30px",
          textAlign: "center",
          color: "#2f8f87",
        }}
      >
        Editar Campanha
      </h1>

      <p
        style={{
          margin: "0 0 30px 0",
          color: "#666",
          fontSize: "15px",
          textAlign: "center",
        }}
      >
        Atualize os dados da campanha.
      </p>

      {erro && (
        <div
          style={{
            background: "#fff1f2",
            color: "#9f1239",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #fecdd3",
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
          <label style={labelStyle}>Título</label>

          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Descrição</label>

          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: "140px",
              resize: "vertical",
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>Meta em reais</label>

          <input
            type="number"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            style={inputStyle}
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
            onClick={() => router.back()}
            style={{
              flex: 1,
              background: "#f3f4f6",
              color: "#333",
              border: "none",
              padding: "14px",
              borderRadius: "999px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            style={{
              flex: 1,
              background: "#2f8f87",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "999px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "700",
  color: "#2f8f87",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #d0d7de",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};