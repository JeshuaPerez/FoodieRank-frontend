const API_BASE_URL = 'http://localhost:3000/api';

async function registrarUsuario(datos) {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}

async function iniciarSesion(datos) {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const cuerpo = await respuesta.json();
        return { ok: respuesta.ok, cuerpo };
    } catch (error) {
        return { ok: false, cuerpo: null };
    }
}