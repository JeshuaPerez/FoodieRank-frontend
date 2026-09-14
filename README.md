# FoodieRank — Frontend

## Descripción del proyecto

Frontend de FoodieRank en HTML, CSS y JavaScript puro (sin frameworks). El JavaScript se limita exclusivamente a consumir los endpoints de la API del backend mediante `fetch`.

## Estructura del proyecto

```
pages/     # inicio.html, login.html, registro.html, listado.html, detalle.html, admin.html
css/       # estilos compartidos y por página
js/
├── api/   # un módulo por recurso que consume la API vía fetch (auth.js, restaurantes.js, resenas.js, categorias.js)
└── ui/    # renderizado de tarjetas, formularios y validaciones visuales (sin lógica de negocio)
assets/    # imágenes e íconos
```

## Pantallas mínimas

Inicio, Registro/Login, Listado de restaurantes (con filtro por categoría y ranking), Detalle de restaurante (platos + reseñas), Panel de administración.

## Convenciones de ramas y commits

Flujo GitFlow: `main` (versión estable/entregable) y `develop` (integración). Cada historia o tarea sale de una rama `feature/nombre-corto` creada desde `develop`, y se integra de vuelta por Pull Request. Commits siguiendo Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.).

## Cómo correrlo

Este frontend no requiere build ni dependencias: se sirve como archivos estáticos (por ejemplo con la extensión Live Server de VS Code) apuntando al backend corriendo localmente. La URL base de la API se configura en `js/api/`.

## Repositorio del backend

https://github.com/JeshuaPerez/FoodieRank-back

## Créditos

Jeshua Perez (Frontend) y Juan Lema (Backend) — proyecto académico FoodieRank, metodología SCRUM.
