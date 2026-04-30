"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aprovandoId, setAprovandoId] = useState(null);
  const [reprovandoId, setReprovandoId] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [motivo, setMotivo] = useState({});

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (!user) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(user);

    if (parsed.tipo !== "ADM") {
      router.push("/");
      return;
    }

    setUsuarioLogado(parsed);
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    setLoading(true);

    const res = await fetch("/api/admin/instituicoes");
    const data = await res.json();

    setUsuarios(data);
    setLoading(false);
  }

  async function aprovarUsuario(id) {
    setAprovandoId(id);

    await fetch("/api/admin/instituicoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aprovacao: "aprovado" })
    });

    setMensagem("Instituição aprovada com sucesso!");
    setAprovandoId(null);
    carregarUsuarios();
  }

  async function reprovarUsuario(id) {
    if (!motivo[id]) {
      alert("Digite o motivo da reprovação");
      return;
    }

    setReprovandoId(id);

    await fetch("/api/admin/instituicoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, motivo: motivo[id] })
    });

    setMotivo({ ...motivo, [id]: "" });
    setMensagem("Instituição reprovada");
    setReprovandoId(null);
    carregarUsuarios();
  }

  const pendentes = usuarios.filter((u) => u.aprovacao === "pendente");
  const aprovadas = usuarios.filter((u) => u.aprovacao === "aprovado");
  const reprovadas = usuarios.filter((u) => u.aprovacao === "reprovado");

  return (
    <>
      <Navbar usuario={usuarioLogado} />

      <div style={container}>
  {/* FUNDO ESQUERDA */}
  <img
    src="/elos-verticais-esquerda.png"
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

  {/* FUNDO DIREITA */}
  <img
    src="/elos-verticais.png"
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
    maxWidth: "1120px",
    width: "100%",
    background: "#fff",
    borderRadius: "28px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 1,
  }}
>
          <div style={header}>
  <h1
    style={{
      margin: "0 0 10px 0",
      fontSize: "36px",
      fontWeight: "700",
      color: "#2f8f87", // verde padrão
      textAlign: "center",
    }}
  >
    Gerenciar Instituições
  </h1>

  <p
    style={{
      margin: 0,
      fontSize: "16px",
      color: "#5f6b7a",
      textAlign: "center",
    }}
  >
    Gerencie as instituições cadastradas na plataforma.
  </p>
</div>

          {mensagem && <div style={sucessoBox}>{mensagem}</div>}

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <>
              <Section
                titulo="Pendentes"
                cor="#fddc05"
                background="rgba(242, 242, 16, 0.19)"
                lista={pendentes}
                vazio="Nenhuma instituição pendente"
              >
                {(u) => (
                  <Card key={u.id}>
                    <Info u={u} />

                    <textarea
                      placeholder="Motivo da rejeição"
                      value={motivo[u.id] || ""}
                      onChange={(e) =>
                        setMotivo({
                          ...motivo,
                          [u.id]: e.target.value
                        })
                      }
                      style={textarea}
                    />

                    <div style={actions}>
                      <button
                        onClick={() => aprovarUsuario(u.id)}
                        disabled={aprovandoId === u.id}
                        style={btnSuccess}
                      >
                        {aprovandoId === u.id ? "Aprovando..." : "Aprovar"}
                      </button>

                      <button
                        onClick={() => reprovarUsuario(u.id)}
                        disabled={reprovandoId === u.id}
                        style={btnDanger}
                      >
                        {reprovandoId === u.id ? "Reprovando..." : "Reprovar"}
                      </button>
                    </div>
                  </Card>
                )}
              </Section>

              <Section
                titulo="Aprovadas"
                cor="#2f8f87"
                lista={aprovadas}
                vazio="Nenhuma instituição aprovada"
                background="rgba(47, 143, 135, 0.12)"
              >
                {(u) => (
                  <Card key={u.id}>
                    <Info u={u} />
                    <p style={statusOk}>✔ Aprovada</p>
                  </Card>
                )}
              </Section>

              <Section
                titulo="Reprovadas"
                cor="#d32f2f"
                lista={reprovadas}
                vazio="Nenhuma instituição reprovada"
                background="rgba(143, 47, 47, 0.24)"
              >
                {(u) => (
                  <Card key={u.id}>
                    <Info u={u} />
                    <p style={statusErro}>✖ Reprovada</p>
                    <p style={motivoText}>
                      Motivo: {u.motivo_reprovacao}
                    </p>
                  </Card>
                )}
              </Section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Section({ titulo, cor, background, lista, vazio, children }) {
  return (
    <div
      style={{
        marginBottom: "10px",
        background: background || "transparent",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <h2
        style={{
          color: cor,
          margin: "0 0 16px 0",
          fontSize: "20px",
          fontWeight: "650",
          textAlign: "center",
        }}
      >
        {titulo}
      </h2>

      {lista.length === 0 ? (
        <p style={{ color: "#666", margin: 0 }}>{vazio}</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {lista.map(children)}
        </div>
      )}
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={card}>
      {children}
    </div>
  );
}

function Info({ u }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p><strong>{u.nome}</strong></p>
      <p style={{ color: "#555" }}>{u.email}</p>
    </div>
  );
}

/* 🎨 ESTILOS */

const container = {
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: "55px 20px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const content = {
  maxWidth: "900px",
  margin: "0 auto"
};

const header = {
  marginBottom: "30px"
};

const title = {
  margin: 0,
  fontSize: "32px",
  color: "#1f2937",
};

const subtitle = {
  color: "#666",
  marginTop: "8px"
};

const card = {
  background: "#f9fbfd",
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
};

const textarea = {
  width: "100%",
  minHeight: "80px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px"
};

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "12px"
};

const btnSuccess = {
  flex: 1,
  background: "#2f8f87",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer"
};

const btnDanger = {
  flex: 1,
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer"
};

const statusOk = {
  color: "#16a34a",
  fontWeight: "bold"
};

const statusErro = {
  color: "#dc2626",
  fontWeight: "bold"
};

const motivoText = {
  color: "#444",
  marginTop: "8px"
};

const sucessoBox = {
  background: "#e8f5e9",
  color: "#1b5e20",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px"
};