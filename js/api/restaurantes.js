async function listarRestaurantes(parametros = {}) {
    try {
        const query = new URLSearchParams(parametros).toString();
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes${query ? `?${query}` : ''}`);
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function obtenerRestaurante(id) {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${id}`);
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}