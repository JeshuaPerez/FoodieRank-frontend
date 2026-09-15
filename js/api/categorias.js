async function listarCategorias() {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/categorias`);
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function crearCategoria(datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function actualizarCategoria(id, datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/categorias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function eliminarCategoria(id) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (respuesta.status === 204) {
            return { ok: true, cuerpo: null };
        }

        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}