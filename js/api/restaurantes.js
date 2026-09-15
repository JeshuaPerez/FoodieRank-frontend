async function listarRestaurantes(parametros = {}) {
    try {
        const token = localStorage.getItem('token');
        const cabeceras = token ? { Authorization: `Bearer ${token}` } : {};
        const query = new URLSearchParams(parametros).toString();
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes${query ? `?${query}` : ''}`, { headers: cabeceras });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function obtenerRestaurante(id) {
    try {
        const token = localStorage.getItem('token');
        const cabeceras = token ? { Authorization: `Bearer ${token}` } : {};
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${id}`, { headers: cabeceras });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function aprobarRestaurante(id, aprobado) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${id}/aprobar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ aprobado })
        });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function crearRestaurante(datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes`, {
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

async function actualizarRestaurante(id, datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${id}`, {
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

async function eliminarRestaurante(id) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${id}`, {
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