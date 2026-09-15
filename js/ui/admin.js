function verificarAccesoAdmin() {
    const usuario = obtenerUsuarioActual();
    const mensajeAcceso = document.getElementById('mensaje-acceso');
    const panel = document.getElementById('panel-admin');

    if (!usuario || usuario.rol !== 'admin') {
        mensajeAcceso.textContent = 'No tienes permisos para acceder a esta página.';
        mensajeAcceso.hidden = false;
        panel.hidden = true;
        return false;
    }

    mensajeAcceso.hidden = true;
    panel.hidden = false;
    return true;
}

function crearFilaCategoria(categoria) {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = categoria.nombre;
    fila.appendChild(celdaNombre);

    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = categoria.descripcion || '—';
    fila.appendChild(celdaDescripcion);

    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'tabla-admin__acciones';

    const botonEditar = document.createElement('button');
    botonEditar.type = 'button';
    botonEditar.className = 'btn btn-secundario';
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', () => abrirFormularioCategoria(categoria));
    celdaAcciones.appendChild(botonEditar);

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'btn btn-secundario';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', () => manejarEliminarCategoria(categoria));
    celdaAcciones.appendChild(botonEliminar);

    fila.appendChild(celdaAcciones);
    return fila;
}

async function cargarCategorias() {
    const mensaje = document.getElementById('mensaje-categorias');
    const tabla = document.getElementById('tabla-categorias');
    const cuerpo = document.getElementById('cuerpo-categorias');

    const resultado = await listarCategorias();

    if (!resultado.ok || !resultado.cuerpo) {
        mensaje.textContent = 'No se pudieron cargar las categorías. Verifica tu conexión con el servidor.';
        mensaje.hidden = false;
        tabla.hidden = true;
        return;
    }

    const categorias = resultado.cuerpo.datos;
    cuerpo.innerHTML = '';

    if (categorias.length === 0) {
        mensaje.textContent = 'Todavía no hay categorías registradas.';
        mensaje.hidden = false;
        tabla.hidden = true;
        return;
    }

    mensaje.hidden = true;
    tabla.hidden = false;
    categorias.forEach((categoria) => {
        cuerpo.appendChild(crearFilaCategoria(categoria));
    });
}

function limpiarErroresCategoria() {
    const errorNombre = document.getElementById('error-nombre-categoria');
    errorNombre.hidden = true;
    errorNombre.textContent = '';

    const errorDescripcion = document.getElementById('error-descripcion-categoria');
    errorDescripcion.hidden = true;
    errorDescripcion.textContent = '';

    const mensajeGeneral = document.getElementById('mensaje-general-categoria');
    mensajeGeneral.hidden = true;
    mensajeGeneral.textContent = '';
    mensajeGeneral.className = '';
}

function mostrarErroresCategoria(cuerpo) {
    if (cuerpo && Array.isArray(cuerpo.datos)) {
        cuerpo.datos.forEach((error) => {
            const campo = document.getElementById(`error-${error.campo}-categoria`);
            if (campo) {
                campo.textContent = error.mensaje;
                campo.hidden = false;
            }
        });
        return;
    }

    const mensajeGeneral = document.getElementById('mensaje-general-categoria');
    mensajeGeneral.textContent = cuerpo?.mensaje || 'No se pudo guardar la categoría. Intenta de nuevo.';
    mensajeGeneral.className = 'mensaje-error-general';
    mensajeGeneral.hidden = false;
}

function abrirFormularioCategoria(categoria = null) {
    const formulario = document.getElementById('form-categoria');
    const titulo = document.getElementById('titulo-form-categoria');

    limpiarErroresCategoria();
    formulario.reset();

    if (categoria) {
        formulario.dataset.editId = categoria.id;
        titulo.textContent = 'Editar categoría';
        document.getElementById('nombre-categoria').value = categoria.nombre;
        document.getElementById('descripcion-categoria').value = categoria.descripcion || '';
    } else {
        delete formulario.dataset.editId;
        titulo.textContent = 'Nueva categoría';
    }

    formulario.hidden = false;
}

function cerrarFormularioCategoria() {
    const formulario = document.getElementById('form-categoria');
    formulario.hidden = true;
    formulario.reset();
    limpiarErroresCategoria();
    delete formulario.dataset.editId;
}

async function manejarEnvioCategoria(evento) {
    evento.preventDefault();
    limpiarErroresCategoria();

    const formulario = evento.target;
    const nombre = document.getElementById('nombre-categoria').value.trim();
    const descripcion = document.getElementById('descripcion-categoria').value.trim();
    const idEdicion = formulario.dataset.editId;

    const resultado = idEdicion
        ? await actualizarCategoria(idEdicion, { nombre, descripcion })
        : await crearCategoria({ nombre, descripcion });

    if (resultado.ok) {
        cerrarFormularioCategoria();
        await cargarCategorias();
        return;
    }

    mostrarErroresCategoria(resultado.cuerpo);
}

async function manejarEliminarCategoria(categoria) {
    const confirmado = confirm(`¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    const mensaje = document.getElementById('mensaje-categorias');
    const resultado = await eliminarCategoria(categoria.id);

    if (resultado.ok) {
        await cargarCategorias();
        return;
    }

    mensaje.textContent = resultado.cuerpo?.mensaje || 'No se pudo eliminar la categoría.';
    mensaje.hidden = false;
}

let filtroRestaurantesActual = 'pendientes';

function crearFilaRestaurante(restaurante) {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = restaurante.nombre;
    fila.appendChild(celdaNombre);

    const celdaCategoria = document.createElement('td');
    celdaCategoria.textContent = restaurante.categoria || 'Sin categoría';
    fila.appendChild(celdaCategoria);

    const celdaUbicacion = document.createElement('td');
    celdaUbicacion.textContent = restaurante.ubicacion;
    fila.appendChild(celdaUbicacion);

    const celdaEstado = document.createElement('td');
    const insignia = document.createElement('span');
    insignia.className = restaurante.aprobado
        ? 'insignia-estado insignia-estado--aprobado'
        : 'insignia-estado insignia-estado--pendiente';
    insignia.textContent = restaurante.aprobado ? 'Aprobado' : 'Pendiente';
    celdaEstado.appendChild(insignia);
    fila.appendChild(celdaEstado);

    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'tabla-admin__acciones';

    const botonAprobar = document.createElement('button');
    botonAprobar.type = 'button';
    botonAprobar.className = 'btn btn-secundario';
    botonAprobar.textContent = restaurante.aprobado ? 'Rechazar' : 'Aprobar';
    botonAprobar.addEventListener('click', () => manejarAprobarRestaurante(restaurante, !restaurante.aprobado));
    celdaAcciones.appendChild(botonAprobar);

    const botonEditar = document.createElement('button');
    botonEditar.type = 'button';
    botonEditar.className = 'btn btn-secundario';
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', () => abrirFormularioRestaurante(restaurante));
    celdaAcciones.appendChild(botonEditar);

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'btn btn-secundario';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', () => manejarEliminarRestaurante(restaurante));
    celdaAcciones.appendChild(botonEliminar);

    fila.appendChild(celdaAcciones);
    return fila;
}

async function cargarRestaurantes() {
    const mensaje = document.getElementById('mensaje-restaurantes');
    const tabla = document.getElementById('tabla-restaurantes');
    const cuerpo = document.getElementById('cuerpo-restaurantes');

    const aprobado = filtroRestaurantesActual === 'aprobados' ? 'true' : 'false';
    const resultado = await listarRestaurantes({ aprobado, limite: 50 });

    if (!resultado.ok || !resultado.cuerpo) {
        mensaje.textContent = 'No se pudieron cargar los restaurantes. Verifica tu conexión con el servidor.';
        mensaje.hidden = false;
        tabla.hidden = true;
        return;
    }

    const restaurantes = resultado.cuerpo.datos.datos;
    cuerpo.innerHTML = '';

    if (restaurantes.length === 0) {
        mensaje.textContent = filtroRestaurantesActual === 'pendientes'
            ? 'No hay restaurantes pendientes de aprobación.'
            : 'Todavía no hay restaurantes aprobados.';
        mensaje.hidden = false;
        tabla.hidden = true;
        return;
    }

    mensaje.hidden = true;
    tabla.hidden = false;
    restaurantes.forEach((restaurante) => {
        cuerpo.appendChild(crearFilaRestaurante(restaurante));
    });
}

async function manejarAprobarRestaurante(restaurante, aprobado) {
    const mensaje = document.getElementById('mensaje-restaurantes');
    const resultado = await aprobarRestaurante(restaurante.id, aprobado);

    if (resultado.ok) {
        await cargarRestaurantes();
        return;
    }

    mensaje.textContent = resultado.cuerpo?.mensaje || 'No se pudo actualizar el estado del restaurante.';
    mensaje.hidden = false;
}

function configurarFiltroRestaurantes() {
    const botones = document.querySelectorAll('#filtro-restaurantes .filtro-admin__boton');

    botones.forEach((boton) => {
        boton.addEventListener('click', () => {
            filtroRestaurantesActual = boton.dataset.filtro;
            botones.forEach((b) => b.classList.remove('filtro-admin__boton--activo'));
            boton.classList.add('filtro-admin__boton--activo');
            cargarRestaurantes();
        });
    });
}

async function poblarSelectCategorias(nombreSeleccionado = '') {
    const select = document.getElementById('categoria-restaurante-form');
    select.innerHTML = '';

    const resultado = await listarCategorias();
    const categorias = resultado.ok && resultado.cuerpo ? resultado.cuerpo.datos : [];

    categorias.forEach((categoria) => {
        const opcion = document.createElement('option');
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        if (categoria.nombre === nombreSeleccionado) opcion.selected = true;
        select.appendChild(opcion);
    });
}

function limpiarErroresRestaurante() {
    ['nombre', 'descripcion', 'categoriaId', 'ubicacion', 'imagen'].forEach((campo) => {
        const elemento = document.getElementById(`error-${campo}-restaurante`);
        elemento.hidden = true;
        elemento.textContent = '';
    });

    const mensajeGeneral = document.getElementById('mensaje-general-restaurante');
    mensajeGeneral.hidden = true;
    mensajeGeneral.textContent = '';
    mensajeGeneral.className = '';
}

function mostrarErroresRestaurante(cuerpo) {
    if (cuerpo && Array.isArray(cuerpo.datos)) {
        cuerpo.datos.forEach((error) => {
            const campo = document.getElementById(`error-${error.campo}-restaurante`);
            if (campo) {
                campo.textContent = error.mensaje;
                campo.hidden = false;
            }
        });
        return;
    }

    const mensajeGeneral = document.getElementById('mensaje-general-restaurante');
    mensajeGeneral.textContent = cuerpo?.mensaje || 'No se pudo guardar el restaurante. Intenta de nuevo.';
    mensajeGeneral.className = 'mensaje-error-general';
    mensajeGeneral.hidden = false;
}

async function abrirFormularioRestaurante(restaurante = null) {
    const formulario = document.getElementById('form-restaurante');
    const titulo = document.getElementById('titulo-form-restaurante');

    limpiarErroresRestaurante();
    formulario.reset();
    await poblarSelectCategorias(restaurante?.categoria ?? '');

    if (restaurante) {
        formulario.dataset.editId = restaurante.id;
        titulo.textContent = 'Editar restaurante';
        document.getElementById('nombre-restaurante-form').value = restaurante.nombre;
        document.getElementById('descripcion-restaurante-form').value = restaurante.descripcion;
        document.getElementById('ubicacion-restaurante-form').value = restaurante.ubicacion;
        document.getElementById('imagen-restaurante-form').value = restaurante.imagen || '';
    } else {
        delete formulario.dataset.editId;
        titulo.textContent = 'Nuevo restaurante';
    }

    formulario.hidden = false;
}

function cerrarFormularioRestaurante() {
    const formulario = document.getElementById('form-restaurante');
    formulario.hidden = true;
    formulario.reset();
    limpiarErroresRestaurante();
    delete formulario.dataset.editId;
}

async function manejarEnvioRestaurante(evento) {
    evento.preventDefault();
    limpiarErroresRestaurante();

    const formulario = evento.target;
    const nombre = document.getElementById('nombre-restaurante-form').value.trim();
    const descripcion = document.getElementById('descripcion-restaurante-form').value.trim();
    const categoriaId = document.getElementById('categoria-restaurante-form').value;
    const ubicacion = document.getElementById('ubicacion-restaurante-form').value.trim();
    const imagen = document.getElementById('imagen-restaurante-form').value.trim();
    const idEdicion = formulario.dataset.editId;

    const datos = { nombre, descripcion, categoriaId, ubicacion, imagen };

    const resultado = idEdicion
        ? await actualizarRestaurante(idEdicion, datos)
        : await crearRestaurante(datos);

    if (resultado.ok) {
        cerrarFormularioRestaurante();
        await cargarRestaurantes();
        return;
    }

    mostrarErroresRestaurante(resultado.cuerpo);
}

async function manejarEliminarRestaurante(restaurante) {
    const confirmado = confirm(`¿Eliminar el restaurante "${restaurante.nombre}"? Esta acción también elimina sus platos y reseñas, y no se puede deshacer.`);
    if (!confirmado) return;

    const mensaje = document.getElementById('mensaje-restaurantes');
    const resultado = await eliminarRestaurante(restaurante.id);

    if (resultado.ok) {
        await cargarRestaurantes();
        return;
    }

    mensaje.textContent = resultado.cuerpo?.mensaje || 'No se pudo eliminar el restaurante.';
    mensaje.hidden = false;
}

document.getElementById('btn-nueva-categoria').addEventListener('click', () => abrirFormularioCategoria());
document.getElementById('btn-cancelar-categoria').addEventListener('click', cerrarFormularioCategoria);
document.getElementById('form-categoria').addEventListener('submit', manejarEnvioCategoria);
configurarFiltroRestaurantes();
document.getElementById('btn-nuevo-restaurante').addEventListener('click', () => abrirFormularioRestaurante());
document.getElementById('btn-cancelar-restaurante').addEventListener('click', cerrarFormularioRestaurante);
document.getElementById('form-restaurante').addEventListener('submit', manejarEnvioRestaurante);

if (verificarAccesoAdmin()) {
    cargarCategorias();
    cargarRestaurantes();
}