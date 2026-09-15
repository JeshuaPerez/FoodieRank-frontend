function limpiarErrores() {
    document.querySelectorAll('.mensaje-error-campo').forEach((elemento) => {
        elemento.textContent = '';
        elemento.hidden = true;
    });
    const mensajeGeneral = document.getElementById('mensaje-general');
    mensajeGeneral.textContent = '';
    mensajeGeneral.hidden = true;
    mensajeGeneral.classList.remove('mensaje-error-general', 'mensaje-exito-general');
}

function mostrarErrorCampo(campo, mensaje) {
    const elemento = document.getElementById(`error-${campo}`);
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.hidden = false;
}

function mostrarMensajeGeneral(mensaje, tipo) {
    const elemento = document.getElementById('mensaje-general');
    elemento.textContent = mensaje;
    elemento.classList.add(tipo === 'exito' ? 'mensaje-exito-general' : 'mensaje-error-general');
    elemento.hidden = false;
}

function mostrarErrores(cuerpo) {
    if (cuerpo && Array.isArray(cuerpo.datos)) {
        cuerpo.datos.forEach((error) => mostrarErrorCampo(error.campo, error.mensaje));
        return;
    }
    if (cuerpo && cuerpo.mensaje) {
        mostrarMensajeGeneral(cuerpo.mensaje, 'error');
        return;
    }
    mostrarMensajeGeneral('No se pudo conectar con el servidor. Intenta de nuevo.', 'error');
}

function guardarSesion(datos) {
    localStorage.setItem('token', datos.token);
    localStorage.setItem('usuario', JSON.stringify(datos.usuario));
}

function redirigirAlInicio() {
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 900);
}

const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    formRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        limpiarErrores();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const resultado = await registrarUsuario({ nombre, email, password });

        if (resultado.ok) {
            guardarSesion(resultado.cuerpo.datos);
            mostrarMensajeGeneral('Cuenta creada con éxito. Redirigiendo...', 'exito');
            redirigirAlInicio();
            return;
        }

        mostrarErrores(resultado.cuerpo);
    });
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        limpiarErrores();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const resultado = await iniciarSesion({ email, password });

        if (resultado.ok) {
            guardarSesion(resultado.cuerpo.datos);
            mostrarMensajeGeneral('Bienvenido a FoodieRank. Redirigiendo...', 'exito');
            redirigirAlInicio();
            return;
        }

        mostrarErrores(resultado.cuerpo);
    });
}