# Validación del MVP

Verificado en el entorno cloud con Node.js 24.19.0, npm 11.9.0 y Chromium del sistema.

## Comprobaciones

- `npm run lint`: sin errores ni advertencias.
- `npm run typecheck`: sin errores.
- `npm run build`: compilación y generación de rutas `/`, `/login`, `/admin`, `/tecnico` correctas.
- `npm run dev`: arranque correcto, formulario e interacciones comprobados mediante navegador real.
- Playwright: seis escenarios, seis aprobados; sin pruebas omitidas.

Los escenarios comprueban validación del login, mostrar contraseña y credenciales incorrectas; login de ambos roles; creación/edición y filtros de registros; indicadores derivados; técnicos y filtros; configuración; descarga CSV con escapado de comillas, comas y prefijos de fórmula; inicio y finalización de tareas, observaciones persistentes durante la sesión, actividad, historial, perfil y reinicio al salir; redirección sin sesión; navegación móvil a 390 × 844 y ausencia de desbordamiento de la página. Las tablas mantienen desplazamiento horizontal interno. Se inspeccionó también el panel administrativo en escritorio a 1440 px.

Se corrigieron durante la validación la configuración ESM del proyecto, el acceso local de desarrollo de Next.js para `127.0.0.1` y la posición de etiquetas accesibles de las tablas para evitar desbordamiento móvil. El login no habilita el envío hasta la hidratación y utiliza POST como método nativo, evitando contraseñas ficticias en parámetros de URL antes de activarse React.

## Alcance

Estas pruebas validan la demo en una instancia local. No acreditan seguridad de producción, concurrencia multiusuario, persistencia, integraciones reales, publicación del entorno ni despliegue en Vercel. No se ejecutaron pruebas de carga ni una auditoría formal de accesibilidad. No se ha hecho push ni creado otro repositorio remoto.
