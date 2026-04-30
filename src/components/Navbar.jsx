"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ usuario, instituicao }) {
  const router = useRouter();

  const [usuarioLocal, setUsuarioLocal] = useState(usuario || null);
  const [instituicaoLocal, setInstituicaoLocal] = useState(instituicao || null);

  useEffect(() => {
    if (usuario) {
      setUsuarioLocal(usuario);
      return;
    }

    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      try {
        const parsed = JSON.parse(usuarioSalvo);
        setUsuarioLocal(parsed);
      } catch (error) {
        console.error("Erro ao ler usuário do localStorage:", error);
        setUsuarioLocal(null);
      }
    } else {
      setUsuarioLocal(null);
    }
  }, [usuario]);

  useEffect(() => {
    if (instituicao !== undefined && instituicao !== null) {
      setInstituicaoLocal(instituicao);
      return;
    }

    async function buscarInstituicao() {
      const usuarioAtual = usuario || usuarioLocal;

      if (!usuarioAtual || usuarioAtual.tipo === "ADM") {
        setInstituicaoLocal(null);
        return;
      }

      try {
        const response = await fetch("/api/minha-instituicao", {
          headers: {
            "user-id": String(usuarioAtual.id),
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setInstituicaoLocal(null);
          return;
        }

        setInstituicaoLocal(data);
      } catch (error) {
        console.error("Erro ao buscar instituição na navbar:", error);
        setInstituicaoLocal(null);
      }
    }

    buscarInstituicao();
  }, [instituicao, usuario, usuarioLocal]);

  const ehAdmin = usuarioLocal?.tipo === "ADM";
  const ehInstituicao = !!instituicaoLocal && !ehAdmin;
  const instituicaoAprovada =
    ehInstituicao && instituicaoLocal?.aprovacao === "aprovado";
  const estaLogado = !!usuarioLocal;
  const ehDoador = estaLogado && !ehAdmin && !ehInstituicao;

  function logout() {
    localStorage.removeItem("usuario");
    setUsuarioLocal(null);
    setInstituicaoLocal(null);
    router.push("/login?logout=1");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 40px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        onClick={() => router.push("/")}
        style={{
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <img src="/logo-pequena.png" style={{ height: "50px" }} />

  <div>
    <strong style={{ color: "#2f8f87", fontSize: "18px" }}>
      Elo
    </strong>

    <div style={{ fontSize: "11px", color: "#777" }}>
      Solidariedade conectada pela tecnologia
    </div>
  </div>
</div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => router.push("/")} style={botaoSecundario}>
          Home
        </button>

        <button
          onClick={() => router.push("/campanhas")}
          style={botaoSecundario}
        >
          Campanhas
        </button>

        {!estaLogado && (
          <button
            onClick={() => router.push("/login")}
            style={botaoPrimario}
          >
            Entrar
          </button>
        )}

        {ehDoador && (
          <button
            onClick={() => router.push("/minhas-doacoes")}
            style={botaoSecundario}
          >
            Minhas doações
          </button>
        )}

        {estaLogado && instituicaoAprovada && (
          <button
            onClick={() => router.push("/nova-campanha")}
            style={botaoPrimario}
          >
            + Nova Campanha
          </button>
        )}

        {ehAdmin && (
          <button
            onClick={() => router.push("/admin")}
            style={botaoSecundario}
          >
            Gerenciar instituições
          </button>
        )}

        {estaLogado && (
          <button onClick={logout} style={botaoSair}>
            Sair
          </button>
        )}
      </div>
    </div>
  );
}

const botaoPrimario = {
  background: "#2f8f87",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "600",
};

const botaoSecundario = {
  background: "#fff",
  color: "#2f8f87",
  border: "1px solid #2f8f87",
  padding: "10px 16px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "600",
};

const botaoSair = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "600",
};