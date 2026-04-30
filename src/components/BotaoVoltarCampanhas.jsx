"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BotaoVoltarCampanhas() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      setUsuario(JSON.parse(user));
    }
  }, []);

  if (!usuario) return null;

  return (
    <button
      onClick={() => {
        router.push("/");
      }}
      style={{
        background: "#fff",
        color: "#2f8f87",
        border: "1px solid #2f8f87",
        padding: "10px 16px",
        borderRadius: "999px",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: "20px",
      }}
    >
      ← Voltar para início
    </button>
  );
}