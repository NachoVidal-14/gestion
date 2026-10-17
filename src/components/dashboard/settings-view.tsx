import { ShieldCheck, Database, FileSpreadsheet, Plug } from "lucide-react";

export function SettingsView() {
  return (
    <>
      <section className="panel settings-panel">
        <h3>Plataforma de Gestión</h3>
        <p className="muted">
          MVP v1.0 · Entorno demostrativo · Datos ficticios en memoria
        </p>
        <h4>Roles del espacio de trabajo</h4>
        <div className="role-grid">
          <div>
            <ShieldCheck />
            <strong>ADMIN</strong>
            <p>Gestión general, técnicos, registros y reportes.</p>
          </div>
          <div>
            <ShieldCheck />
            <strong>TECNICO</strong>
            <p>Consulta y actualización de tareas propias.</p>
          </div>
        </div>
        <p className="info-note">
          Las restricciones del cliente son demostrativas. No constituyen
          autorización de producción.
        </p>
      </section>
      <div className="future-grid">
        {[
          { icon: Database, title: "PostgreSQL y Prisma" },
          {
            icon: FileSpreadsheet,
            title: "Importación y exportación Excel",
          },
          { icon: Plug, title: "Integraciones API" },
        ].map((item) => (
          <article className="panel future-card" key={item.title}>
            <item.icon />
            <h3>{item.title}</h3>
            <span className="badge slate">Próximamente</span>
          </article>
        ))}
      </div>
    </>
  );
}
