export async function getCampanhas() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const response = await fetch(`/api/campanhas?usuario_id=${usuario.id}`);

  return response.json();
}

export async function deleteCampanha(id) {
  const res = await fetch(`/api/campanhas/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro ao deletar campanha");
  }

  return data;
}
export async function createCampanha(campanha) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const response = await fetch("/api/campanhas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...campanha,
      usuario_id: usuario.id
    })
  });

  const data = await response.json();

  // ESSA É A PARTE IMPORTANTE QUE FAZ A LIBERAÇÃO PARA CRIAR A CAMPANHA
  if (!response.ok) {
    throw new Error(data.message || "Erro ao criar campanha");
  }

  return data;
}
export async function updateCampanha(campanha) {
  const res = await fetch("/api/campanhas", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campanha),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar campanha");
  }

  return res.json();
}
