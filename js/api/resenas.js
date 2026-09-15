async function crearResena(datos) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/resenas`, {
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

async function reaccionarResena(id, tipo) {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_BASE_URL}/resenas/${id}/reaccion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ tipo })
        });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}