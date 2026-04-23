"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroDoador() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("PF");
  const [documento, setDocumento] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setErro("");
      setSucesso(false);
      setLoading(true);

      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cidade,
          estado,
          telefone,
          tipo_pessoa: tipoPessoa,
          documento,
          criarInstituicao: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || "Erro ao cadastrar doador");
        return;
      }

      setNome("");
      setEmail("");
      setSenha("");
      setCidade("");
      setEstado("");
      setTelefone("");
      setTipoPessoa("PF");
      setDocumento("");

      setSucesso(true);
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar doador");
    } finally {
      setLoading(false);
    }
  }

  function formatarDocumento(valor, tipo) {
    valor = valor.replace(/\D/g, "");

    if (tipo === "PF") {
      valor = valor.slice(0, 11);
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return valor;
    }

    if (tipo === "PJ") {
      valor = valor.slice(0, 14);
      valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
      return valor;
    }

    return valor;
  }

  function formatarTelefone(valor) {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    if (valor.length <= 10) {
      valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
      return valor;
    }

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    return valor;
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
              onClick={() => router.push("/login")}
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
            Cadastre-se como doador e
            <br />
            apoie causas com confiança
          </h1>

          <p style={subtitle}>
            Crie sua conta para encontrar campanhas, apoiar instituições sérias
            e acompanhar o impacto da sua contribuição na plataforma.
          </p>
        </div>

        <div style={rightColumn}>
          <div style={card}>
            <h2 style={cardTitle}>
              Cadastre-se <span style={titleIcon}>👤</span>
            </h2>

            {erro && <div style={erroBox}>{erro}</div>}

            {sucesso && (
              <div style={sucessoBox}>
                <strong>Login criado com sucesso!</strong>
                <p style={{ margin: "8px 0 0 0" }}>
                  Agora você já pode entrar na plataforma com seu e-mail e
                  senha.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  style={{ ...primaryButton, marginTop: "14px" }}
                >
                  Ir para o login
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={form}>
              <input
                placeholder="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={input}
                required
              />

              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
                required
              />

              <div style={senhaLinha}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Crie sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  style={inputSenha}
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={botaoOlho}
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <div style={duasColunas}>
                <input
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  style={input}
                />

                <input
                  placeholder="Estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  style={input}
                />
              </div>

              <input
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                style={input}
              />

              <select
                value={tipoPessoa}
                onChange={(e) => {
                  setTipoPessoa(e.target.value);
                  setDocumento("");
                }}
                style={input}
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>

              <input
                placeholder={tipoPessoa === "PF" ? "CPF" : "CNPJ"}
                value={documento}
                maxLength={tipoPessoa === "PF" ? 14 : 18}
                onChange={(e) =>
                  setDocumento(formatarDocumento(e.target.value, tipoPessoa))
                }
                style={input}
                required
              />

              <button
                type="submit"
                style={{
                  ...primaryButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "CRIAR CONTA"}
              </button>
            </form>
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
  width: "100%",
  maxWidth: "1100px",
  minHeight: "640px",
  padding: "18px 10px 0",
  boxSizing: "border-box",
  display: "flex",
  overflow: "visible",
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

const brandLogo = {
  width: "110px",
  objectFit: "contain",
};

const topIcons = {
  display: "flex",
  gap: "16px",
};

const topIcon = {
  width: "38px",
  height: "38px",
  cursor: "pointer",
  objectFit: "contain",
};

const rightDecoration = {
  position: "absolute",
  right: "-210px",
  top: "-50x",
  height: "700px",
  opacity: 0.70,
  zIndex: 0,
  pointerEvents: "none",
};

const leftColumn = {
  width: "46%",
  position: "relative",
  zIndex: 2,
  paddingTop: "95px",
  paddingRight: "24px",
  boxSizing: "border-box",
};

const rightColumn = {
  width: "54%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  position: "relative",
  zIndex: 2,
  paddingTop: "68px",
};

const title = {
  margin: "0 0 14px 0",
  fontSize: "34px",
  lineHeight: "1.15",
  color: "#555",
  fontWeight: "500",
  maxWidth: "460px",
};

const subtitle = {
  margin: 0,
  maxWidth: "470px",
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#5e5e5e",
};

const card = {
  width: "100%",
  maxWidth: "390px",
  background: "#f3f3f3",
  borderRadius: "28px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  padding: "28px 28px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const cardTitle = {
  margin: 0,
  fontSize: "28px",
  color: "#555",
  fontWeight: "700",
};

const titleIcon = {
  opacity: 0.45,
  fontSize: "24px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const duasColunas = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const input = {
  width: "100%",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid #d2d2d2",
  background: "#ebebeb",
  padding: "0 16px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  color: "#555",
};

const senhaLinha = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const inputSenha = {
  flex: 1,
  height: "40px",
  borderRadius: "999px",
  border: "1px solid #d2d2d2",
  background: "#ebebeb",
  padding: "0 16px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  color: "#555",
};

const botaoOlho = {
  background: "transparent",
  border: "none",
  color: "#999",
  fontSize: "12px",
  cursor: "pointer",
  padding: "0 6px",
  whiteSpace: "nowrap",
};

const primaryButton = {
  width: "170px",
  height: "40px",
  borderRadius: "999px",
  border: "none",
  background: "#b8d2cd",
  color: "#555",
  fontSize: "15px",
  fontWeight: "700",
  alignSelf: "center",
  marginTop: "4px",
};

const erroBox = {
  background: "#fdecea",
  color: "#b3261e",
  border: "1px solid #f5c2c0",
  padding: "12px",
  borderRadius: "12px",
  fontSize: "13px",
};

const sucessoBox = {
  background: "#e8f5e9",
  color: "#1b5e20",
  border: "1px solid #c8e6c9",
  padding: "12px",
  borderRadius: "12px",
  fontSize: "13px",
};