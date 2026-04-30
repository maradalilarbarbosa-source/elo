"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TopIconsCampanhas() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (user) {
      setUsuarioLogado(JSON.parse(user));
    }
  }, []);

  if (usuarioLogado) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        gap: "14px",
      }}
    >
      <Link href="/">
        <img src="/icon-home.png" alt="Home" style={iconStyle} />
      </Link>

      <Link href="/login">
        <img src="/icon-user.png" alt="Login" style={iconStyle} />
      </Link>
    </div>
  );
}

const iconStyle = {
  width: "40px",
  height: "40px",
  cursor: "pointer",
  opacity: 0.85,
};