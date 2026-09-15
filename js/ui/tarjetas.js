function crearTarjetaRestaurante(restaurante, rutaImagenPorDefecto, rutaDetalle) {
    const enlace = document.createElement('a');
    enlace.className = 'tarjeta-restaurante';
    enlace.href = `${rutaDetalle}?id=${restaurante.id}`;

    const insignia = document.createElement('span');
    insignia.className = 'insignia-ranking';
    insignia.textContent = restaurante.totalResenas > 0 ? `★ ${restaurante.rankingPonderado.toFixed(1)}` : 'Nuevo';
    enlace.appendChild(insignia);

    const imagen = document.createElement('img');
    imagen.src = restaurante.imagen || rutaImagenPorDefecto;
    imagen.alt = restaurante.nombre;
    enlace.appendChild(imagen);

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

    enlace.appendChild(contenido);
    return enlace;
}