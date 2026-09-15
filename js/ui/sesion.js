function obtenerUsuarioActual() {
    const datos = localStorage.getItem('usuario');
    if (!datos) return null;

    try {
        return JSON.parse(datos);
    } catch (error) {
        return null;
    }
}

function obtenerIniciales(nombre) {
    return nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join('');
}

function calcularRutaBase() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.reload();
}

function actualizarNavSesion() {
    const contenedor = document.getElementById('nav-sesion');
    if (!contenedor) return;

    const usuario = obtenerUsuarioActual();
    if (!usuario) return;

    contenedor.innerHTML = '';

    const menu = document.createElement('div');
    menu.className = 'menu-sesion';

    const avatar = document.createElement('button');
    avatar.type = 'button';
    avatar.className = 'avatar-sesion';
    avatar.textContent = obtenerIniciales(usuario.nombre);
    avatar.setAttribute('aria-haspopup', 'true');
    avatar.setAttribute('aria-expanded', 'false');
    menu.appendChild(avatar);

    const panel = document.createElement('div');
    panel.className = 'menu-sesion__panel';
    panel.hidden = true;

    const nombre = document.createElement('p');
    nombre.className = 'menu-sesion__nombre';
    nombre.textContent = usuario.nombre;
    panel.appendChild(nombre);

    const rol = document.createElement('p');
    rol.className = 'menu-sesion__rol';
    rol.textContent = usuario.rol === 'admin' ? 'Administrador' : 'Cliente';
    panel.appendChild(rol);

    if (usuario.rol === 'admin') {
        const enlaceAdmin = document.createElement('a');
        enlaceAdmin.className = 'menu-sesion__enlace';
        enlaceAdmin.textContent = 'Panel de administración';
        enlaceAdmin.href = `${calcularRutaBase()}admin.html`;
        panel.appendChild(enlaceAdmin);
    }

    const botonCerrar = document.createElement('button');
    botonCerrar.type = 'button';
    botonCerrar.className = 'menu-sesion__cerrar';
    botonCerrar.textContent = 'Cerrar sesión';
    botonCerrar.addEventListener('click', cerrarSesion);
    panel.appendChild(botonCerrar);

    menu.appendChild(panel);
    contenedor.appendChild(menu);

    avatar.addEventListener('click', (evento) => {
        evento.stopPropagation();
        const abierto = !panel.hidden;
        panel.hidden = abierto;
        avatar.setAttribute('aria-expanded', String(!abierto));
    });

    document.addEventListener('click', () => {
        panel.hidden = true;
        avatar.setAttribute('aria-expanded', 'false');
    });
}

actualizarNavSesion();