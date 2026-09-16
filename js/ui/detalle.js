function crearTarjetaPlato(plato) {
    const articulo = document.createElement('article');
    articulo.className = 'tarjeta-plato';

    const imagen = document.createElement('img');
    imagen.src = plato.imagen || '../assets/img/sin-imagen.svg';
    imagen.alt = plato.nombre;
    articulo.appendChild(imagen);

    const contenido = document.createElement('div');
    contenido.className = 'tarjeta-plato__contenido';

    const nombre = document.createElement('h3');
    nombre.className = 'tarjeta-plato__nombre';
    nombre.textContent = plato.nombre;
    contenido.appendChild(nombre);

    if (plato.descripcion) {
        const descripcion = document.createElement('p');
        descripcion.className = 'tarjeta-plato__descripcion';
        descripcion.textContent = plato.descripcion;
        contenido.appendChild(descripcion);
    }

    const precio = document.createElement('p');
    precio.className = 'tarjeta-plato__precio';
    precio.textContent = `$${plato.precio.toFixed(2)}`;
    contenido.appendChild(precio);

    articulo.appendChild(contenido);
    return articulo;
}

function crearReacciones(resena, usuarioActual) {
    const contenedor = document.createElement('div');
    contenedor.className = 'tarjeta-resena__reacciones';

    const esPropia = Boolean(usuarioActual) && resena.usuarioId === usuarioActual.id;
    const deshabilitado = !usuarioActual || esPropia;

    const botonLike = document.createElement('button');
    botonLike.type = 'button';
    botonLike.className = 'boton-reaccion';
    if (resena.miReaccion === 'like') botonLike.classList.add('boton-reaccion--activo');
    botonLike.textContent = `👍 ${resena.likes}`;
    botonLike.disabled = deshabilitado;
    botonLike.addEventListener('click', () => manejarReaccion(resena.id, 'like'));
    contenedor.appendChild(botonLike);

    const botonDislike = document.createElement('button');
    botonDislike.type = 'button';
    botonDislike.className = 'boton-reaccion';
    if (resena.miReaccion === 'dislike') botonDislike.classList.add('boton-reaccion--activo');
    botonDislike.textContent = `👎 ${resena.dislikes}`;
    botonDislike.disabled = deshabilitado;
    botonDislike.addEventListener('click', () => manejarReaccion(resena.id, 'dislike'));
    contenedor.appendChild(botonDislike);

    return contenedor;
}

function crearTarjetaResena(resena, usuarioActual) {
    const articulo = document.createElement('article');
    articulo.className = 'tarjeta-resena';

    const cabecera = document.createElement('div');
    cabecera.className = 'tarjeta-resena__cabecera';

    const autor = document.createElement('span');
    autor.className = 'tarjeta-resena__autor';
    autor.textContent = resena.autor || 'Usuario eliminado';
    cabecera.appendChild(autor);

    const calificacion = document.createElement('span');
    calificacion.className = 'tarjeta-resena__calificacion';
    calificacion.textContent = `★ ${resena.calificacion}`;
    cabecera.appendChild(calificacion);

    articulo.appendChild(cabecera);

    const comentario = document.createElement('p');
    comentario.className = 'tarjeta-resena__comentario';
    comentario.textContent = resena.comentario;
    articulo.appendChild(comentario);

    const fecha = document.createElement('span');
    fecha.className = 'tarjeta-resena__fecha';
    fecha.textContent = new Date(resena.creadoEn).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    articulo.appendChild(fecha);

    articulo.appendChild(crearReacciones(resena, usuarioActual));

    if (usuarioActual?.rol === 'admin') {
        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn btn-secundario boton-eliminar-resena';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => manejarEliminarResena(resena.id));
        articulo.appendChild(botonEliminar);
    }

    return articulo;
}

function renderizarResenas(resenas, usuarioActual) {
    const lista = document.getElementById('lista-resenas');
    const mensaje = document.getElementById('mensaje-resenas');
    lista.innerHTML = '';

    if (resenas.length === 0) {
        mensaje.textContent = 'Este restaurante todavía no tiene reseñas.';
        mensaje.hidden = false;
        return;
    }

    mensaje.hidden = true;
    resenas.forEach((resena) => {
        lista.appendChild(crearTarjetaResena(resena, usuarioActual));
    });
}

function renderizarGraficoCalificaciones(resenas) {
    const contenedor = document.getElementById('grafico-barras');
    const mensaje = document.getElementById('mensaje-grafico');
    contenedor.innerHTML = '';

    const total = resenas.length;

    if (total === 0) {
        mensaje.textContent = 'Todavía no hay calificaciones para mostrar.';
        mensaje.hidden = false;
        return;
    }

    mensaje.hidden = true;

    const conteo = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    resenas.forEach((resena) => {
        conteo[resena.calificacion] = (conteo[resena.calificacion] || 0) + 1;
    });

    [5, 4, 3, 2, 1].forEach((estrellas) => {
        const cantidad = conteo[estrellas];
        const porcentaje = (cantidad / total) * 100;

        const fila = document.createElement('div');
        fila.className = 'grafico-barras__fila';

        const etiqueta = document.createElement('span');
        etiqueta.className = 'grafico-barras__etiqueta';
        etiqueta.textContent = `${estrellas} ★`;
        fila.appendChild(etiqueta);

        const pista = document.createElement('div');
        pista.className = 'grafico-barras__pista';

        const barra = document.createElement('div');
        barra.className = 'grafico-barras__barra';
        barra.style.width = `${porcentaje}%`;
        pista.appendChild(barra);

        fila.appendChild(pista);

        const valor = document.createElement('span');
        valor.className = 'grafico-barras__valor';
        valor.textContent = cantidad;
        fila.appendChild(valor);

        contenedor.appendChild(fila);
    });
}

async function manejarReaccion(resenaId, tipo) {
    const mensaje = document.getElementById('mensaje-reacciones');
    mensaje.hidden = true;

    const resultado = await reaccionarResena(resenaId, tipo);

    if (resultado.ok) {
        await cargarDetalleRestaurante();
        return;
    }

    mensaje.textContent = resultado.cuerpo?.mensaje || 'No se pudo registrar tu reacción. Intenta de nuevo.';
    mensaje.hidden = false;
}

async function manejarEliminarResena(id) {
    const confirmado = await confirmarAccion('¿Eliminar esta reseña? Esta acción no se puede deshacer.');
    if (!confirmado) return;

    const mensaje = document.getElementById('mensaje-resenas');
    const resultado = await eliminarResena(id);

    if (resultado.ok) {
        await cargarDetalleRestaurante();
        return;
    }

    mensaje.textContent = resultado.cuerpo?.mensaje || 'No se pudo eliminar la reseña.';
    mensaje.hidden = false;
}

function configurarFormularioResena(restaurante) {
    const usuario = obtenerUsuarioActual();
    const aviso = document.getElementById('aviso-resena');
    const formulario = document.getElementById('form-resena');

    aviso.hidden = true;
    formulario.hidden = true;

    if (!usuario) {
        aviso.textContent = 'Inicia sesión para dejar una reseña.';
        aviso.hidden = false;
        return;
    }

    const yaReseno = restaurante.resenas.some((resena) => resena.usuarioId === usuario.id);

    if (yaReseno) {
        aviso.textContent = 'Ya has dejado una reseña para este restaurante.';
        aviso.hidden = false;
        return;
    }

    formulario.dataset.restauranteId = restaurante.id;
    formulario.hidden = false;
}

function limpiarErroresResena() {
    const errorCalificacion = document.getElementById('error-calificacion');
    errorCalificacion.textContent = '';
    errorCalificacion.hidden = true;

    const errorComentario = document.getElementById('error-comentario');
    errorComentario.textContent = '';
    errorComentario.hidden = true;

    const mensajeGeneral = document.getElementById('mensaje-general-resena');
    mensajeGeneral.textContent = '';
    mensajeGeneral.className = '';
    mensajeGeneral.hidden = true;
}

function mostrarErroresResena(errores) {
    errores.forEach((error) => {
        const campo = document.getElementById(`error-${error.campo}`);
        if (campo) {
            campo.textContent = error.mensaje;
            campo.hidden = false;
        }
    });
}

function mostrarMensajeGeneralResena(texto, tipo) {
    const mensajeGeneral = document.getElementById('mensaje-general-resena');
    mensajeGeneral.textContent = texto;
    mensajeGeneral.className = tipo === 'exito' ? 'mensaje-exito-general' : 'mensaje-error-general';
    mensajeGeneral.hidden = false;
}

async function manejarEnvioResena(evento) {
    evento.preventDefault();
    limpiarErroresResena();

    const formulario = evento.target;
    const restauranteId = formulario.dataset.restauranteId;
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value.trim();

    const resultado = await crearResena({
        restauranteId,
        comentario,
        calificacion: Number(calificacion)
    });

    if (resultado.ok) {
        formulario.reset();
        await cargarDetalleRestaurante();
        return;
    }

    if (Array.isArray(resultado.cuerpo?.datos)) {
        mostrarErroresResena(resultado.cuerpo.datos);
        return;
    }

    mostrarMensajeGeneralResena(
        resultado.cuerpo?.mensaje || 'No se pudo publicar la reseña. Verifica tu conexión con el servidor.',
        'error'
    );
}

async function cargarDetalleRestaurante() {
    const mensaje = document.getElementById('mensaje-detalle');
    const contenedor = document.getElementById('info-restaurante');

    const id = new URLSearchParams(window.location.search).get('id');

    if (!id) {
        mensaje.textContent = 'No se especificó ningún restaurante.';
        mensaje.hidden = false;
        return;
    }

    const resultado = await obtenerRestaurante(id);

    if (!resultado.ok || !resultado.cuerpo) {
        mensaje.textContent = resultado.cuerpo?.mensaje || 'No se pudo cargar el restaurante. Verifica tu conexión con el servidor.';
        mensaje.hidden = false;
        return;
    }

    const restaurante = resultado.cuerpo.datos;

    document.getElementById('imagen-restaurante').src = restaurante.imagen || '../assets/img/sin-imagen.svg';
    document.getElementById('imagen-restaurante').alt = restaurante.nombre;
    document.getElementById('nombre-restaurante').textContent = restaurante.nombre;
    document.getElementById('categoria-restaurante').textContent = restaurante.categoria || 'Sin categoría';
    document.getElementById('ubicacion-restaurante').textContent = restaurante.ubicacion;
    document.getElementById('descripcion-restaurante').textContent = restaurante.descripcion;

    const insignia = document.getElementById('insignia-restaurante');
    insignia.textContent = restaurante.totalResenas > 0
        ? `★ ${restaurante.rankingPonderado.toFixed(1)} (${restaurante.totalResenas} reseñas)`
        : 'Todavía sin reseñas';

    document.title = `${restaurante.nombre} - FoodieRank`;

    const gridPlatos = document.getElementById('grid-platos');
    const mensajePlatos = document.getElementById('mensaje-platos');
    gridPlatos.innerHTML = '';

    if (restaurante.platos.length === 0) {
        mensajePlatos.textContent = 'Este restaurante todavía no tiene platos registrados.';
        mensajePlatos.hidden = false;
    } else {
        mensajePlatos.hidden = true;
        restaurante.platos.forEach((plato) => {
            gridPlatos.appendChild(crearTarjetaPlato(plato));
        });
    }

    const usuarioActual = obtenerUsuarioActual();
    renderizarGraficoCalificaciones(restaurante.resenas);
    renderizarResenas(restaurante.resenas, usuarioActual);
    configurarFormularioResena(restaurante);

    contenedor.hidden = false;
}

document.getElementById('form-resena').addEventListener('submit', manejarEnvioResena);
cargarDetalleRestaurante();