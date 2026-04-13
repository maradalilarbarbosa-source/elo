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
          Criar nova campanha
        </h1>

        <p
          style={{
            marginBottom: "30px",
            color: "#666",
            fontSize: "15px",
          }}
        >
          Preencha os dados abaixo para publicar uma nova campanha.
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

        {carregandoInstituicao ? (
          <div
            style={{
              background: "#eef3f8",
              color: "#335",
              padding: "14px",
              borderRadius: "10px",
              fontSize: "15px",
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
                {salvando ? "Criando..." : "Criar campanha"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}