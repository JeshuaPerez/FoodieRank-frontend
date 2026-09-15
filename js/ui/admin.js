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

document.getElementById('btn-nueva-categoria').addEventListener('click', () => abrirFormularioCategoria());
document.getElementById('btn-cancelar-categoria').addEventListener('click', cerrarFormularioCategoria);
document.getElementById('form-categoria').addEventListener('submit', manejarEnvioCategoria);

if (verificarAccesoAdmin()) {
    cargarCategorias();
}