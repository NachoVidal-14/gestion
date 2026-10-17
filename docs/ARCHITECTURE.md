# Arquitectura actual y migración

## MVP

Next.js App Router, React, TypeScript estricto, Tailwind CSS 4 e iconos Lucide. Las rutas y el layout son Server Components; la interacción se concentra en componentes cliente. No se usan React Compiler ni Cache Components.

`DemoProvider` envuelve las rutas y conserva usuario y tareas en memoria. `lib/auth/demo.ts` es el único adaptador de credenciales ficticias. `data/mock` contiene usuarios, relaciones y 20 tareas; `services/tasks.ts` aplica la visibilidad demostrativa y construye CSV. Los componentes consumen esta fuente común. Las fechas se presentan en español con zona UTC explícita para estabilidad entre entornos. La categoría «Incidencia» con estado diferente de «Completada» define una incidencia abierta.

La sesión se pierde al recargar. No se utiliza localStorage, cookies ni criptografía ficticia. Las comprobaciones de rol y propietario del cliente demuestran la navegación, pero no garantizan autorización. Todo el contenido puede inspeccionarse en el navegador y es público/ficticio.

## Límites y responsabilidades

- Presentación: componentes de tablas, indicadores, diálogos y formularios.
- Estado de demostración: contexto React. Centraliza cambios y actualiza las vistas derivadas.
- Servicios: selección de tareas visibles y exportación. Sustituibles por consultas de servidor.
- Dominio: User, Role, Technician, Task, TaskStatus, Priority y ActivityLog en `src/types`.
- Autenticación: adaptador separado; reemplazar completamente antes de usar datos reales.

No se crean APIs durante esta fase. Las transiciones del técnico son pendiente → en progreso → completada. El administrador puede reasignar, crear y cambiar estados. El historial muestra solamente completadas del propietario técnico. El CSV exporta todos los registros autorizados por la demostración; se escapan comillas y campos de posible fórmula.

## PostgreSQL y Prisma

La base de datos será la fuente principal. Tablas propuestas: User, TechnicianProfile (relación uno a uno), Task (FK technicianId), ActivityLog (FK taskId y actorId) y Session según el proveedor elegido. Role, TaskStatus y Priority se traducirán a enums estables independientes de las etiquetas españolas. Índices en technicianId/status, createdAt y categoría; identificadores UUID, timestamps con zona y campo version para concurrencia optimista. Las tareas actuales se migrarán mediante un seed exclusivamente de desarrollo.

Introducir un repositorio de tareas de servidor y DTOs tipados. Reemplazar las mutaciones del contexto por Server Actions o Route Handlers y validación de esquemas en servidor. Encapsular Prisma en módulos exclusivos de servidor. No importar clientes de base de datos ni secretos en componentes cliente. Utilizar migraciones versionadas y pools compatibles con despliegue serverless.

## Autenticación y RBAC real

Elegir un proveedor de autenticación mantenido. Usar sesiones seguras con cookies HttpOnly, Secure y SameSite, expiración y revocación; no convertir las cuentas ficticias en cuentas productivas. Autorizar en cada consulta y mutación: ADMIN ve y gestiona todo; TECNICO consulta su propio recurso y actualiza únicamente campos permitidos de tareas cuyo propietario sea su identidad de sesión. El servidor debe obtener actor y rol desde la sesión, nunca del body enviado por el navegador.

Validar pertenencia, campos, límites y transiciones; responder errores seguros. Incorporar rate limits, protección CSRF según el mecanismo elegido, registro de accesos y pruebas negativas de autorización por recurso. El renderizado y los filtros del cliente no sustituyen estos controles.

## Excel, APIs y auditoría

XLSX será un formato de intercambio, no almacenamiento principal. Importar con límites de tamaño y filas, validación de tipos, previsualización, errores por fila, aprobación e idempotencia. Exportar desde consultas autorizadas, neutralizando fórmulas. Las integraciones externas serán endpoints de servidor autenticados con scopes, gestión de secretos, reintentos acotados, límites e idempotencia.

Cada mutación persistente debe registrar actor, recurso, operación, timestamp y cambios en una transacción con la tarea. El historial del MVP no satisface este requisito. Usar concurrencia optimista (version/updatedAt) y respuesta de conflicto en lugar de sobrescribir cambios simultáneos. Añadir paginación y filtros de servidor al crecer los datos.

## Producción y datos

Antes de producción: backups automáticos y pruebas de restauración, migraciones revisadas, observabilidad sin secretos, políticas de retención y borrado, mínimos privilegios, HTTPS, validación de entradas, controles contra abuso, dependencias actualizadas y pruebas de integración y seguridad. Vercel alojará Next.js; PostgreSQL será un servicio administrado separado. Revisar obligaciones de protección de datos y acceso a registros de auditoría.
