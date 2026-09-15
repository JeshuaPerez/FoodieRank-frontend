function crearTarjetaRestaurante(restaurante) {
    const articulo = document.createElement('article');
    articulo.className = 'tarjeta-restaurante';

    const insignia = document.createElement('span');
    insignia.className = 'insignia-ranking';
    insignia.textContent = restaurante.totalResenas > 0 ? restaurante.rankingPonderado.toFixed(1) : 'Nuevo';
    articulo.appendChild(insignia);

    const imagen = document.createElement('img');
    imagen.src = restaurante.imagen || 'assets/img/sin-imagen.svg';
    imagen.alt = restaurante.nombre;
    articulo.appendChild(imagen);

    const contenido = document.createElement('div');
    contenido.className = 'tarjeta-restaurante__contenido';

    const nombre = document.createElement('h3');
    nombre.className = 'tarjeta-restaurante__nombre';
    nombre.textContent = restaurante.nombre;
    contenido.appendChild(nombre);

    const categoria = document.createElement('p');
    categoria.className = 'tarjeta-restaurante__categoria';
    categoria.textContent = restaurante.categoria || 'Sin categoría';
    contenido.appendChild(categoria);

    const ubicacion = document.createElement('p');
    ubicacion.className = 'tarjeta-restaurante__ubicacion';
    ubicacion.textContent = restaurante.ubicacion;
    contenido.appendChild(ubicacion);

    articulo.appendChild(contenido);
    return articulo;
}

async function cargarRestaurantesDestacados() {
    const grid = document.getElementById('grid-restaurantes');
    const mensaje = document.getElementById('mensaje-restaurantes');

    const resultado = await listarRestaurantes({ orden: 'ranking', limite: 6 });

    if (!resultado.ok || !resultado.cuerpo) {
        mensaje.textContent = 'No se pudieron cargar los restaurantes. Verifica tu conexión con el servidor.';
        mensaje.hidden = false;
        return;
    }

    const restaurantes = resultado.cuerpo.datos.datos;

    if (restaurantes.length === 0) {
        mensaje.textContent = 'Todavía no hay restaurantes destacados.';
        mensaje.hidden = false;
        return;
    }

    restaurantes.forEach((restaurante) => {
        grid.appendChild(crearTarjetaRestaurante(restaurante));
    });
}

cargarRestaurantesDestacados();