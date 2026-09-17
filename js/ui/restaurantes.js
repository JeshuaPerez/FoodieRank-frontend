const LIMITE_POR_PAGINA = 9;
const estado = { pagina: 1, totalPaginas: 1 };

function construirParametros(pagina) {
    const parametros = { orden: document.getElementById('orden').value, pagina, limite: LIMITE_POR_PAGINA };
    const busqueda = document.getElementById('busqueda').value.trim();
    const categoria = document.getElementById('categoria').value;
    if (busqueda) parametros.busqueda = busqueda;
    if (categoria) parametros.categoria = categoria;
    return parametros;
}

function actualizarPaginacion() {
    const paginacion = document.getElementById('paginacion');
    const texto = document.getElementById('texto-pagina');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');

    texto.textContent = `Página ${estado.pagina} de ${estado.totalPaginas}`;
    btnAnterior.disabled = estado.pagina <= 1;
    btnSiguiente.disabled = estado.pagina >= estado.totalPaginas;
    paginacion.hidden = false;
}

async function poblarCategorias() {
    const resultado = await listarCategorias();
    if (!resultado.ok || !resultado.cuerpo) return;

    const select = document.getElementById('categoria');
    resultado.cuerpo.datos.forEach((categoria) => {
        const opcion = document.createElement('option');
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
}

async function buscarRestaurantes(pagina = 1) {
    const grid = document.getElementById('grid-restaurantes');
    const mensaje = document.getElementById('mensaje-restaurantes');
    const paginacion = document.getElementById('paginacion');

    grid.innerHTML = '';
    mensaje.hidden = true;
    paginacion.hidden = true;

    const resultado = await listarRestaurantes(construirParametros(pagina));

    if (!resultado.ok || !resultado.cuerpo) {
        mensaje.textContent = 'No se pudieron cargar los restaurantes. Verifica tu conexión con el servidor.';
        mensaje.hidden = false;
        return;
    }

    const { datos: restaurantes, pagina: paginaActual, totalPaginas } = resultado.cuerpo.datos;

    if (restaurantes.length === 0) {
        mensaje.textContent = 'No se encontraron restaurantes con esos filtros.';
        mensaje.hidden = false;
        return;
    }

    restaurantes.forEach((restaurante) => {
        grid.appendChild(crearTarjetaRestaurante(restaurante, 'assets/img/sin-imagen.svg', 'pages/detalle.html'));
    });

    estado.pagina = paginaActual;
    estado.totalPaginas = totalPaginas;
    actualizarPaginacion();
}

document.getElementById('form-filtros').addEventListener('submit', (evento) => {
    evento.preventDefault();
    buscarRestaurantes(1);
});

document.getElementById('btn-anterior').addEventListener('click', () => {
    if (estado.pagina > 1) buscarRestaurantes(estado.pagina - 1);
});

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (estado.pagina < estado.totalPaginas) buscarRestaurantes(estado.pagina + 1);
});

poblarCategorias();
buscarRestaurantes(1);