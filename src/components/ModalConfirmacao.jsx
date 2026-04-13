export default function ModalConfirmacao({
  campanha,
  onConfirm,
  onCancel
}) {
  if (!campanha) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999
    }}>
      <div style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        width: "320px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
      }}>
        <h3 style={{ marginBottom: "10px" }}>
          Confirmar exclusão
        </h3>

        <p style={{ color: "#555" }}>
          Deseja excluir a campanha:
        </p>

        <strong>{campanha.titulo}</strong>

        <div style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "center",
          gap: "10px"
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              background: "#dc3545",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}