# Requisitos del MVP v1.0

## Funcionales

- `/` redirige a `/login`; cuentas demostrativas ADMIN y TECNICO con destinos separados.
- Login exige correo válido y contraseña, permite mostrar/ocultar, simula carga y explica errores.
- ADMIN navega entre resumen, técnicos, registros, reportes y configuración; TECNICO entre resumen, tareas, historial y perfil.
- Técnicos: búsqueda por nombre, filtro activo/inactivo, número de tareas y ficha.
- Registros: ID único, fecha, técnico, categoría, descripción, estado, prioridad y actualización; búsqueda, filtros de estado/prioridad, orden ascendente/descendente por fecha, detalles y creación/edición en diálogo.
- Las tareas de técnicos muestran únicamente las asignadas a su ID ficticio. Pueden iniciarse, completarse desde progreso y guardar observaciones. Las completadas aparecen en su historial.
- Indicadores y gráfico reflejan el estado compartido inmediatamente tras guardar. Incidencias abiertas: categoría Incidencia y estado no completada.
- CSV válido con todos los datos visibles para el rol, codificación UTF-8 BOM y escapado de celdas.
- Dataset central: 1 administrador, 5 técnicos, 20 tareas con estados, prioridades, fechas y actividad ficticia.
- Cierre de sesión y recarga reinician los datos; no hay persistencia entre usuarios.

## No funcionales

Next.js App Router, React, TypeScript estricto, Tailwind, Lucide, ESLint, `src/` y alias `@/*`. Node.js 24 LTS. Componentes reutilizables y lógica de demo separada. Sin dependencias de base de datos, Excel o librerías gráficas pesadas.

Interfaz en español, adaptable a móvil/escritorio, contraste legible, foco visible, inputs etiquetados, estados vacíos, mensajes de confirmación, diálogos con Escape y navegación de teclado. Tablas anchas con desplazamiento horizontal en móvil.

No hay secretos, información sensible ni garantías de seguridad productiva. No usar datos reales. Archivos de entorno, logs, compilaciones y dependencias excluidos de Git. Las credenciales de demo son intencionalmente públicas.

## Validación

Obligatorios: `npm run lint`, `npm run typecheck`, `npm run build` y arranque mediante `npm run dev`. Validar en navegador login de ambos roles, rechazo de credenciales incorrectas, navegación, filtros, creación/edición, cambios de indicadores, transiciones del técnico, historial, CSV y diseño móvil. Los resultados ejecutados se documentan en `docs/VALIDATION.md`.

## Fuera de alcance

Autenticación y RBAC seguros en servidor, PostgreSQL/Prisma, APIs reales, importación XLSX, persistencia compartida, edición de perfil, auditoría inmutable y despliegue productivo. Se describen en arquitectura y roadmap.
