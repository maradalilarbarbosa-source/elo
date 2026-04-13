"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function CadastroInstituicao() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeInstituicao, setNomeInstituicao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [telefone, setTelefone] = useState("");
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cidade,
          estado,
          telefone,
          tipo_pessoa: "PJ",
          documento,
          criarInstituicao: true,
          nomeInstituicao,
          descricao
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || data.message || "Erro ao cadastrar instituição");
        return;
      }

      setNome("");
      setEmail("");
      setSenha("");
      setNomeInstituicao("");
      setDescricao("");
      setCidade("");
      setEstado("");
      setTelefone("");
      setDocumento("");

      setSucesso(true);
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar instituição");
    } finally {
      setLoading(false);
    }
  }

  function formatarCNPJ(valor) {
    valor = valor.replace(/\D/g, "").slice(0, 14);
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
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
    <>
      <Navbar />

      <div style={container}>
        <div style={leftSide}>
          <div style={overlay} />
          <div style={leftContent}>
            <p style={badge}>Cadastro de instituição</p>

            <h1 style={title}>
              Dê visibilidade à sua causa e arrecade com mais confiança.
            </h1>

            <p style={subtitle}>
              Cadastre sua instituição para divulgar campanhas, alcançar novos
              doadores e fortalecer a transparência no processo de doação.
            </p>
          </div>
        </div>

        <div style={rightSide}>
          <div style={card}>
            <h2 style={cardTitle}>Cadastrar instituição</h2>

            <p style={cardText}>
              Preencha os dados abaixo. Seu cadastro passará por análise antes
              da liberação para criar campanhas.
            </p>

            {erro && <div style={erroBox}>{erro}</div>}

            {sucesso && (
              <div style={sucessoBox}>
                <strong>Instituição enviada para aprovação com sucesso!</strong>
                <p style={{ margin: "8px 0 0 0" }}>
                  Após a análise do administrador, sua instituição poderá criar
                  campanhas na plataforma.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  style={{ ...button, marginTop: "14px" }}
                >
                  Ir para o login
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={form}>
              <input
                placeholder="Nome do responsável"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={input}
                required
              />

              <input
                type="email"
                placeholder="E-mail de acesso"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
                required
              />

              <div style={senhaWrapper}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Crie uma senha"
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

              <input
                placeholder="Nome da instituição"
                value={nomeInstituicao}
                onChange={(e) => setNomeInstituicao(e.target.value)}
                style={input}
                required
              />

              <textarea
                placeholder="Descreva brevemente a instituição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                style={textarea}
                rows={4}
              />

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

              <input
                type="text"
                placeholder="CNPJ (opcional)"
                value={documento}
                maxLength={18}
                onChange={(e) => setDocumento(formatarCNPJ(e.target.value))}
                style={input}
              />
              
              <div style={infoBox}>
                O cadastro passará por análise do administrador. Informações adicionais
                poderão ser solicitadas para validação da instituição.
              </div>

              <button
                type="submit"
                style={{
                  ...button,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Cadastrar instituição"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const container = {
  display: "flex",
  minHeight: "calc(100vh - 73px)"
};

const leftSide = {
  flex: 1,
  position: "relative",
  backgroundImage:
    "url('https://plus.unsplash.com/premium_photo-1680012589479-606257d1e7e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px"
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(25, 118, 210, 0.55)"
};

const leftContent = {
  position: "relative",
  zIndex: 1,
  maxWidth: "520px",
  color: "#fff"
};

const badge = {
  display: "inline-block",
  background: "rgba(255,255,255,0.18)",
  padding: "8px 14px",
  borderRadius: "999px",
  marginBottom: "20px",
  fontWeight: "bold"
};

const title = {
  fontSize: "40px",
  lineHeight: "1.2",
  marginBottom: "18px"
};

const subtitle = {
  fontSize: "18px",
  lineHeight: "1.6"
};

const rightSide = {
  flex: 1,
  background: "#f9fbfd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px"
};

const card = {
  background: "#fff",
  padding: "40px",
  borderRadius: "18px",
  width: "100%",
  maxWidth: "640px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  boxShadow: "0 10px 28px rgba(0,0,0,0.10)"
};

const cardTitle = {
  margin: 0,
  fontSize: "34px",
  color: "#1f2937"
};

const cardText = {
  marginTop: "-4px",
  marginBottom: "10px",
  color: "#666",
  fontSize: "16px"
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const erroBox = {
  background: "#fdecea",
  color: "#b3261e",
  border: "1px solid #f5c2c0",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px"
};

const sucessoBox = {
  background: "#e8f5e9",
  color: "#1b5e20",
  border: "1px solid #c8e6c9",
  padding: "16px",
  borderRadius: "10px",
  fontSize: "14px"
};

const duasColunas = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px"
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #d0d7de",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box"
};

const textarea = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #d0d7de",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  resize: "vertical",
  fontFamily: "inherit"
};

const senhaWrapper = {
  display: "flex",
  gap: "8px"
};

const inputSenha = {
  flex: 1,
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #d0d7de",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box"
};

const botaoOlho = {
  background: "#fff",
  color: "#1976d2",
  border: "1px solid #1976d2",
  padding: "0 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const button = {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "bold"
};

const infoBox = {
  background: "#f1f5f9",
  color: "#334155",
  border: "1px solid #e2e8f0",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "14px",
  lineHeight: "1.5"
};