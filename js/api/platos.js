async function listarPlatosPorRestaurante(restauranteId) {
    try {
        const token = localStorage.getItem('token');
        const cabeceras = token ? { Authorization: `Bearer ${token}` } : {};
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${restauranteId}/platos`, { headers: cabeceras });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function crearPlato(restauranteId, datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/restaurantes/${restauranteId}/platos`, {
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

async function actualizarPlato(id, datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/platos/${id}`, {
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

async function aprobarPlato(id, aprobado) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/platos/${id}/aprobar`, {
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

async function eliminarPlato(id) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/platos/${id}`, {
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