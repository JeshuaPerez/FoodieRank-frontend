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

    if (restaurante.platos.length === 0) {
        mensajePlatos.textContent = 'Este restaurante todavía no tiene platos registrados.';
        mensajePlatos.hidden = false;
    } else {
        restaurante.platos.forEach((plato) => {
            gridPlatos.appendChild(crearTarjetaPlato(plato));
        });
    }

    contenedor.hidden = false;
}

cargarDetalleRestaurante();