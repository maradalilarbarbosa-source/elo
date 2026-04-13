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
        <div style={content}>
          <div style={header}>
            <h1 style={title}>Painel do Administrador</h1>
            <p style={subtitle}>
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
                cor="#f59e0b"
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
                cor="#22c55e"
                lista={aprovadas}
                vazio="Nenhuma instituição aprovada"
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
                cor="#ef4444"
                lista={reprovadas}
                vazio="Nenhuma instituição reprovada"
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

function Section({ titulo, cor, lista, vazio, children }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ color: cor, marginBottom: "16px" }}>{titulo}</h2>

      {lista.length === 0 ? (
        <p style={{ color: "#666" }}>{vazio}</p>
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
  padding: "40px 20px"
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
  fontSize: "32px"
};

const subtitle = {
  color: "#666",
  marginTop: "8px"
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
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
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnDanger = {
  flex: 1,
  background: "#ef4444",
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