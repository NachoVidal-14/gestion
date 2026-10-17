# Instrucciones para agentes

## Proyecto

MVP Next.js App Router con TypeScript estricto, React y Tailwind CSS 4. Código en `src/`, alias `@/*`. Node.js 24 LTS y npm. Mantener todos los textos de producto en español.

Usar el checkout existente: las tareas cloud ya están aisladas; no crear worktrees salvo petición explícita. No habilitar React Compiler ni Cache Components sin un cambio de alcance. No se configura Agent Feedback.

## Organización

Rutas y layout como Server Components; marcar cliente solo cuando requiere interacción. Centralizar mocks en `src/data/mock`, modelos en `src/types`, sesión en `src/lib/auth` y estado en `src/hooks/demo-context.tsx`. Reutilizar componentes pequeños; no duplicar datasets por rol. Mantener documentación y accesibilidad al cambiar flujos.

## Seguridad y límites

La autenticación de demo es deliberadamente pública y reemplazable. No tratar el filtrado de cliente como seguridad, no añadir datos privados, secretos, cookies de autenticación ficticia ni claves en NEXT_PUBLIC_*. No introducir persistencia real sin autorización de alcance. CSV debe escapar celdas y neutralizar fórmulas.

## Verificación

Ejecutar `npm ci`, `npm run lint`, `npm run typecheck` y `npm run build`. Para tareas de interfaz validar también interacciones en navegador y móvil. `npm run dev` arranca en el puerto 3000. No subir `.next`, `node_modules`, logs ni archivos `.env`. No crear repositorios remotos, hacer push ni desplegar sin aprobación explícita.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
