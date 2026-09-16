function construirModalConfirmacion() {
    if (document.getElementById('modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.hidden = true;

    const caja = document.createElement('div');
    caja.className = 'modal-caja';

    const mensaje = document.createElement('p');
    mensaje.id = 'modal-mensaje';
    caja.appendChild(mensaje);

    const acciones = document.createElement('div');
    acciones.className = 'modal-acciones';

    const botonCancelar = document.createElement('button');
    botonCancelar.type = 'button';
    botonCancelar.className = 'btn btn-secundario';
    botonCancelar.id = 'modal-cancelar';
    botonCancelar.textContent = 'Cancelar';
    acciones.appendChild(botonCancelar);

    const botonAceptar = document.createElement('button');
    botonAceptar.type = 'button';
    botonAceptar.className = 'btn btn-peligro';
    botonAceptar.id = 'modal-aceptar';
    botonAceptar.textContent = 'Eliminar';
    acciones.appendChild(botonAceptar);

    caja.appendChild(acciones);
    overlay.appendChild(caja);
    document.body.appendChild(overlay);
}

function confirmarAccion(mensaje) {
    construirModalConfirmacion();

    const overlay = document.getElementById('modal-overlay');
    const textoMensaje = document.getElementById('modal-mensaje');
    const botonCancelar = document.getElementById('modal-cancelar');
    const botonAceptar = document.getElementById('modal-aceptar');

    textoMensaje.textContent = mensaje;
    overlay.hidden = false;

    return new Promise((resolve) => {
        const cerrar = (resultado) => {
            overlay.hidden = true;
            botonCancelar.removeEventListener('click', manejarCancelar);
            botonAceptar.removeEventListener('click', manejarAceptar);
            overlay.removeEventListener('click', manejarClickFuera);
            resolve(resultado);
        };

        const manejarCancelar = () => cerrar(false);
        const manejarAceptar = () => cerrar(true);
        const manejarClickFuera = (evento) => {
            if (evento.target === overlay) cerrar(false);
        };

        botonCancelar.addEventListener('click', manejarCancelar);
        botonAceptar.addEventListener('click', manejarAceptar);
        overlay.addEventListener('click', manejarClickFuera);
    });
}