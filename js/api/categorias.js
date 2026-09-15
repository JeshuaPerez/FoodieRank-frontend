async function listarCategorias() {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/categorias`);
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}