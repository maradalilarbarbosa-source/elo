"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagemLogout, setMensagemLogout] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("logout") === "1") {
      setMensagemLogout("Você saiu da sua conta com sucesso.");
    }
  }, [searchParams]);

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
  <div style={pageWrapper}>
    <div style={contentArea}>
      <div style={topBar}>
        <img src="/logo-pequena.png" alt="Logo Elo" style={brandLogo} />

        <div style={topIcons}>
          <img
            src="/icon-home.png"
            alt="Home"
            onClick={() => router.push("/")}
            style={topIcon}
          />
          <img
            src="/icon-user.png"
            alt="Usuário"
            style={topIcon}
          />
        </div>
      </div>

      <img
        src="/elos-verticais.png"
        alt="Elementos decorativos"
        style={rightDecoration}
      />

      <div style={leftColumn}>
        <h1 style={title}>
          Conecte doadores e
          <br />
          instituições em um só lugar
        </h1>

        <p style={subtitle}>
          O projeto ELO foi criado para facilitar a solidariedade com mais
          clareza, confiança e organização. Aqui, causas sérias encontram
          pessoas dispostas a ajudar de forma simples e acessível.
        </p>

        <img
          src="/ilustracao-login.png"
          alt="Ilustração"
          style={illustration}
        />
      </div>

      <div style={rightColumn}>
        <div style={card}>
          <h2 style={cardTitle}>Faça seu Login</h2>

          <img src="/logo-pequena.png" alt="Logo Elo" style={cardLogo} />

          {mensagemLogout && <div style={sucessoBox}>{mensagemLogout}</div>}

          {erro && <div style={erroBox}>{erro}</div>}

          <input
            type="email"
            placeholder="Usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <div style={senhaWrapper}>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={input}
            />

            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={eyeButton}
            >
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button
                style={{
                  ...primaryButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 22px rgba(0,0,0,0.14)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.10)";
                }}
                onClick={handleLogin}
                disabled={loading}
              >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p style={registerText}>Cadastre-se já!</p>

          <div style={registerIcons}>
            <button
              type="button"
              onClick={() => router.push("/cadastro/doador")}
              style={iconButton}
              title="Cadastro de doador"
            >
              <img
                src="/icon-user.png"
                alt="Cadastro de doador"
                style={registerIcon}
              />
            </button>

            <button
              type="button"
              onClick={() => router.push("/cadastro/instituicao")}
              style={iconButton}
              title="Cadastro de instituição"
            >
              <span style={institutionIcon}>🏛️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

const pageWrapper = {
  minHeight: "100vh",
  background: "#ffffff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "32px 40px",
  boxSizing: "border-box",
};

const contentArea = {
  position: "relative",
  overflow: "visible",
  width: "100%",
  maxWidth: "1100px",
  minHeight: "640px",
  padding: "18px 10px 0",
  boxSizing: "border-box",
  display: "flex",
};

const topIcons = {
  display: "flex",
  gap: "16px",
};

const topIcon = {
  width: "40px",
  height: "40px",
  cursor: "pointer",
  objectFit: "contain",
};

const rightDecoration = {
  position: "absolute",
  right: "-210px", // joga pra fora da tela
  top: "-50px",
  height: "700px", // aumenta bastante
  opacity: 0.70,
  zIndex: 0,
  pointerEvents: "none",
};

const leftColumn = {
  width: "58%",
  position: "relative",
  zIndex: 2,
  paddingTop: "90px",
  paddingRight: "30px",
  boxSizing: "border-box",
};

const rightColumn = {
  width: "42%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  zIndex: 2,
  paddingTop: "70px",
};

const brandLogo = {
  width: "110px",
  objectFit: "contain",
};

const title = {
  margin: "0 0 14px 0",
  fontSize: "34px",
  lineHeight: "1.18",
  color: "#555",
  fontWeight: "500",
  maxWidth: "520px",
};

const subtitle = {
  margin: "0 0 24px 0",
  maxWidth: "500px",
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#5e5e5e",
};

const illustration = {
  width: "100%",
  maxWidth: "520px",
  objectFit: "contain",
  display: "block",
};

const card = {
  width: "100%",
  maxWidth: "290px",
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.45)",
  borderRadius: "28px",
  boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
  padding: "28px 24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
};

const cardTitle = {
  margin: 0,
  fontSize: "22px",
  color: "#555",
  fontWeight: "700",
  textAlign: "center",
};

const cardLogo = {
  width: "78px",
  objectFit: "contain",
  marginBottom: "6px",
};

const input = {
  width: "100%",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid #d6d6d6",
  background: "rgba(245,245,245,0.92)",
  padding: "0 16px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  color: "#555",
};

const senhaWrapper = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const eyeButton = {
  alignSelf: "flex-end",
  background: "transparent",
  border: "none",
  color: "#888",
  fontSize: "12px",
  cursor: "pointer",
  padding: 0,
};

const primaryButton = {
  width: "100%",
  height: "42px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #bfd8d2, #a8ccc4)",
  color: "#4f4f4f",
  fontSize: "15px",
  fontWeight: "700",
  boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
  transition: "all 0.25s ease",
};

const registerText = {
  margin: "2px 0 0 0",
  fontSize: "14px",
  color: "#666",
};

const registerIcons = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "2px",
};

const iconButton = {
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const registerIcon = {
  width: "28px",
  height: "28px",
  objectFit: "contain",
  opacity: 0.55,
};

const institutionIcon = {
  fontSize: "28px",
  opacity: 0.55,
};

const erroBox = {
  width: "100%",
  background: "#fdecea",
  color: "#b3261e",
  border: "1px solid #f5c2c0",
  padding: "10px 12px",
  borderRadius: "12px",
  fontSize: "13px",
  boxSizing: "border-box",
};

const sucessoBox = {
  width: "100%",
  background: "#e8f5e9",
  color: "#1b5e20",
  border: "1px solid #c8e6c9",
  padding: "10px 12px",
  borderRadius: "12px",
  fontSize: "13px",
  boxSizing: "border-box",
};
const topBar = {
  position: "absolute",
  top: "0",
  left: "10px",
  right: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 3,
};