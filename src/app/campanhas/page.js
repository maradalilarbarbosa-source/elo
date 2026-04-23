export const dynamic = "force-dynamic";

import db from "@/lib/db";
import Link from "next/link";
import CampanhaCard from "@/components/CampanhaCard";




export default async function PaginaCampanhas() {
  const [rows] = await db.query(`
    SELECT
      c.*,
      i.nome AS instituicao_nome
    FROM campanhas c
    LEFT JOIN instituicoes i ON c.instituicao_id = i.id
    WHERE c.status = 'ativa' OR c.status IS NULL
    ORDER BY c.id DESC
  `);

  return (
  <>

    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "40px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        
        {/* TOPO LIVRE (SEM CAIXA) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            {/* LOGO */}
            <div
              style={{
                width: "130%",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                top: "-430px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <img
                src="/logoHero.png"
                alt="Topo Campanhas"
                style={{
                  width: "115%",
                  maxWidth: "none",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* TÍTULO */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                paddingTop: "-0px",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "36px",
                  color: "#2fa4a0",
                  fontWeight: "400",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textShadow: `
                    -1px -1px 0 #ffffff,
                    1px -1px 0 #ffffff,
                    -1px  1px 0 #ffffff,
                    1px  1px 0 #ffffff,
                    0px  2px 6px rgba(0,0,0,0.15)
                  `,
                }}
              >
                Campanhas Disponíveis
              </h1>

              {/* ÍCONES */}
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
                    <img
                      src="/icon-home.png"
                      alt="Home"
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        opacity: 0.85,
                        transition: "all 0.2s ease",
                      }}
                    />
                  </Link>

                  <Link href="/login">
                    <img
                      src="/icon-user.png"
                      alt="Login"
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        opacity: 0.85,
                        transition: "all 0.2s ease",
                      }}
                    />
                  </Link>
              </div>
            </div>
          </div>

        {/* CONTEÚDO */}
        {rows.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "30px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              Nenhuma campanha ativa encontrada
            </h3>

            <p style={{ color: "#666" }}>
              No momento, não existem campanhas disponíveis.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 280px))",
              justifyContent: "center",
              gap: "18px",
              marginTop: "90px",
            }}
          >
            {rows.map((campanha) => (
              <CampanhaCard
                key={campanha.id}
                campanha={campanha}
                podeGerenciar={false}
                deletando={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
}