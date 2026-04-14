"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [mensagemLogout, setMensagemLogout] = useState("");

      useEffect(() => {
        if (searchParams.get("logout") === "1") {
          setMensagemLogout("Você saiu da sua conta com sucesso.");
        }
      }, [searchParams]);

  const router = useRouter();

  async function handleLogin() {
    try {
      setErro("");
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "E-mail ou senha inválidos");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      router.push("/");
    } catch (error) {
      console.error(error);
      setErro("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div style={container}>
        <div style={leftSide}>
          <div style={overlay} />
          <div style={leftContent}>
            <p style={badge}>Projeto ELO</p>

            <h1 style={title}>
              Cada doação pode transformar uma realidade.
            </h1>

            <p style={subtitle}>
              Entre na plataforma para apoiar campanhas, acompanhar suas doações
              e fortalecer instituições que fazem a diferença.
            </p>
          </div>
        </div>

        <div style={rightSide}>
          <div style={card}>
            <h2 style={cardTitle}>Entrar</h2>

            <p style={cardText}>
              Acesse sua conta para continuar.
            </p>

            {mensagemLogout && (
                <div style={sucessoBox}>
                  {mensagemLogout}
                </div>
              )}

            {erro && (
              <div style={erroBox}>
                {erro}
              </div>
            )}

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
            />

            <div style={senhaWrapper}>
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={inputSenha}
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={botaoOlho}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <button
              style={{
                ...button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div style={linksBox}>
              <p style={linksTitle}>Ainda não tem cadastro?</p>

              <div style={linksButtons}>
                <button
                  type="button"
                  onClick={() => router.push("/cadastro/doador")}
                  style={secondaryButton}
                >
                  Cadastro de doador
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/cadastro/instituicao")}
                  style={secondaryButton}
                >
                  Cadastro de instituição
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const container = {
  display: "flex",
  minHeight: "calc(100vh - 73px)",
  //background: "#f4f6f8",
};

const leftSide = {
  flex: 1,
  position: "relative",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1628534200848-0ad346277e14?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(25, 118, 210, 0.55)",
};

const leftContent = {
  position: "relative",
  zIndex: 1,
  maxWidth: "520px",
  color: "#fff",
};

const badge = {
  display: "inline-block",
  background: "rgba(255,255,255,0.18)",
  padding: "8px 14px",
  borderRadius: "999px",
  marginBottom: "20px",
  fontWeight: "bold",
};

const title = {
  fontSize: "42px",
  lineHeight: "1.2",
  marginBottom: "18px",
};

const subtitle = {
  fontSize: "18px",
  lineHeight: "1.6",
};

const rightSide = {
  flex: 1,
  background: "#f9fbfd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
};

const card = {
  background: "#fff",
  padding: "32px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "520px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const cardTitle = {
  margin: 0,
  fontSize: "28px",
  color: "#1f2937",
};

const cardText = {
  marginTop: "-4px",
  marginBottom: "8px",
  color: "#666",
};

const erroBox = {
  background: "#fdecea",
  color: "#b3261e",
  border: "1px solid #f5c2c0",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #d0d7de",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const senhaWrapper = {
  display: "flex",
  gap: "8px",
};

const inputSenha = {
  flex: 1,
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #d0d7de",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const botaoOlho = {
  background: "#fff",
  color: "#1976d2",
  border: "1px solid #1976d2",
  padding: "0 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const button = {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "bold",
};

const linksBox = {
  marginTop: "8px",
  paddingTop: "16px",
  borderTop: "1px solid #eee",
};

const linksTitle = {
  marginTop: 0,
  marginBottom: "10px",
  color: "#555",
  fontSize: "14px",
};

const linksButtons = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "360px",
};

const secondaryButton = {
  background: "#fff",
  color: "#1976d2",
  border: "1px solid #1976d2",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const sucessoBox = {
  background: "#e8f5e9",
  color: "#1b5e20",
  border: "1px solid #c8e6c9",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px",
};