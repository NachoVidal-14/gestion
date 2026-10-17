# Roadmap

1. **MVP visual con mock data:** login ficticio, dos roles, navegación, datos tipados, CRUD simulado de registros (creación y actualización), reportes CSV, diseño adaptable y documentación. Sin eliminación de registros en esta fase.
2. **Autenticación y autorización real:** proveedor mantenido, sesiones seguras, RBAC y autorización por recurso en servidor, flujos de acceso y revocación.
3. **PostgreSQL y persistencia:** esquema Prisma opcional, migraciones, repositorios de servidor, validación, transacciones y concurrencia optimista.
4. **Gestión avanzada de tablas:** paginación de servidor, filtros compuestos, selección de columnas y acciones por lote con permisos.
5. **Importaciones y exportaciones Excel:** XLSX validado, previsualización, errores por fila y descargas autorizadas. PostgreSQL sigue siendo la fuente principal.
6. **Integraciones API:** endpoints seguros, scopes, idempotencia, reintentos y límites.
7. **Auditoría, pruebas y endurecimiento de seguridad:** logs transaccionales, pruebas de permisos, abuso, accesibilidad y carga; backups y restauración. La seguridad básica y las pruebas se incorporan desde cada fase previa.
8. **Despliegue productivo y dominio propio:** revisión de seguridad, preview, aprobación explícita de producción, Vercel, DNS, HTTPS y monitoreo.
