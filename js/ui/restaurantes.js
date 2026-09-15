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
        grid.appendChild(crearTarjetaRestaurante(restaurante, 'assets/img/sin-imagen.svg', 'pages/detalle.html'));
    });
}

cargarRestaurantesDestacados();