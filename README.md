# Vue 3 + Pinia + Vite Dev Container

Este proyecto está listo para desarrollo colaborativo usando Dev Containers en VS Code. Incluye configuración estándar de ESLint y Prettier para Vue 3, y scripts para lint, test y build.

## Requisitos
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Primeros pasos
1. Abre el proyecto en VS Code.
2. Si es la primera vez, selecciona `Reopen in Container` cuando VS Code lo sugiera.
3. Espera a que el contenedor termine de instalar dependencias.
4. ¡Listo para desarrollar!

## Scripts útiles

- `npm run dev` — Levanta el servidor de desarrollo Vite en http://localhost:5173
- `npm run build` — Compila el proyecto para producción
- `npm run test` — Ejecuta los tests con Vitest
- `npm run lint` — Linting de todo el código fuente (ESLint + Vue 3)
- `npm run format` — Formatea el código fuente con Prettier

## Lint y formato
- ESLint y Prettier están preconfigurados para Vue 3.
- El contenedor fuerza la misma configuración para todo el equipo.
- Puedes ejecutar los scripts desde la terminal del contenedor:

```sh
npm run lint
npm run format
```

## Acceso a la API backend
El frontend puede consumir la API en `http://0.0.0.0:8000/docs/openapi.yaml` directamente, sin necesidad de proxy.

## Notas
- Si agregas nuevas dependencias, recuerda ejecutar `npm install` dentro del contenedor.
- Si tienes problemas con extensiones, revisa `.devcontainer/devcontainer.json`.

---

¡Feliz desarrollo!