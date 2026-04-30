"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NovaCampanha() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [meta, setMeta] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregandoInstituicao, setCarregandoInstituicao] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [instituicao, setInstituicao] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (!user) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(user);

    const userId =
      parsed.id ??
      parsed.usuario_id ??
      parsed.id_usuario ??
      parsed.userId ??
      null;

    const usuarioNormalizado = {
      ...parsed,
      id: Number(userId),
    };

    setUsuario(usuarioNormalizado);

    if (userId) {
      buscarInstituicao(userId);
    } else {
      console.error("ID do usuário não encontrado no localStorage:", parsed);
      setErro("Não foi possível identificar o usuário logado.");
      setCarregandoInstituicao(false);
    }
  }, [router]);

  async function buscarInstituicao(userId) {
    try {
      setCarregandoInstituicao(true);

      const response = await fetch("/api/minha-instituicao", {
        headers: {
          "user-id": String(userId),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao buscar dados da instituição.");
        setInstituicao(null);
        return;
      }

      setInstituicao(data);
    } catch (error) {
      console.error("Erro ao buscar instituição:", error);
      setErro("Erro ao buscar dados da instituição.");
      setInstituicao(null);
    } finally {
      setCarregandoInstituicao(false);
    }
  }

  async function criarCampanha(e) {
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

    if (!usuario) {
      setErro("Usuário não encontrado.");
      return;
    }

    if (!instituicao || instituicao.aprovacao !== "aprovado") {
      setErro("Apenas instituições aprovadas podem criar campanhas.");
      return;
    }

    setSalvando(true);

    try {
      const res = await fetch("/api/campanhas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          meta: Number(meta),
          usuario_id: Number(usuario.id),
          instituicao_id: Number(instituicao.id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao criar campanha.");
        setSalvando(false);
        return;
      }

      setMensagem("Campanha criada com sucesso!");
      setTitulo("");
      setDescricao("");
      setMeta("");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      setErro("Erro ao criar campanha.");
      setSalvando(false);
    }
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
          color: "#2f8f87",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Criar Nova Campanha
      </h1>

      <p
        style={{
          margin: "0 0 30px 0",
          color: "#666",
          fontSize: "15px",
          textAlign: "center",
        }}
      >
        Preencha os dados abaixo para publicar uma nova campanha.
      </p>

      {mensagem && (
        <div
          style={{
            background: "#daf6f4",
            color: "#2f8f87",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #b8d2cd",
          }}
        >
          {mensagem}
        </div>
      )}

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

      {carregandoInstituicao ? (
        <div
          style={{
            background: "#daf6f4",
            color: "#2f8f87",
            padding: "14px",
            borderRadius: "12px",
            fontSize: "15px",
            border: "1px solid #b8d2cd",
          }}
        >
          Carregando dados da instituição...
        </div>
      ) : (
        <form
          onSubmit={criarCampanha}
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
              placeholder="Digite o título da campanha"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Descrição</label>

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a campanha"
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
              min="1"
              step="0.01"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="Ex: 5000"
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
              onClick={() => router.push("/")}
              disabled={salvando}
              style={{
                flex: 1,
                background: "#f3f4f6",
                color: "#333",
                border: "none",
                padding: "14px",
                borderRadius: "999px",
                cursor: salvando ? "not-allowed" : "pointer",
                fontWeight: "700",
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
                background: "#2f8f87",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "999px",
                cursor: salvando ? "not-allowed" : "pointer",
                fontWeight: "700",
                opacity: salvando ? 0.7 : 1,
              }}
            >
              {salvando ? "Criando..." : "Criar campanha"}
            </button>
          </div>
        </form>
      )}
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