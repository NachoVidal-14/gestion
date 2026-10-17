"use client";

import { ProfileView } from "./profile-view";
import { SettingsView } from "./settings-view";
import { ReportsView } from "./reports-view";
import { SummaryView } from "./summary-view";
import { useState } from "react";
import { Download, Plus, CheckCircle2, X } from "lucide-react";
import { useDemo } from "@/hooks/demo-context";
import { visibleTasks, exportCsv } from "@/services/tasks";
import { TaskTable } from "@/components/dashboard/task-table";
import { TechnicianTable } from "@/components/dashboard/technician-table";
import { Stats } from "@/components/dashboard/overview";
import { TaskForm } from "@/components/forms/task-form";
import type { Task } from "@/types";
export function Dashboard({
  section,
  navigate,
}: {
  section: string;
  navigate: (value: string) => void;
}) {
  const { tasks, user } = useDemo();
  const [editing, setEditing] = useState<Task | "new" | null>(null);
  const [notice, setNotice] = useState("");
  if (!user) return null;
  const admin = user.role === "ADMIN";
  const mine = visibleTasks(tasks, user);
  const summary = section === "Resumen general" || section === "Mi resumen";
  function download() {
    exportCsv(mine);
    setNotice("Archivo CSV de demostración descargado.");
  }
  const subtitles: Record<string, string> = {
    "Resumen general":
      "Todo lo que necesitas saber sobre tu operación, en un solo lugar.",
    "Mi resumen": "Organiza tu jornada y avanza en lo que importa.",
    "Gestión de técnicos": "Conoce a tu equipo y consulta su carga de trabajo.",
    Registros: "Organiza, consulta y actualiza los registros de tu operación.",
    "Mis tareas": "Tu trabajo diario, organizado y siempre a mano.",
    Historial: "Consulta las tareas que ya completaste.",
    Reportes: "Convierte la actividad de tu equipo en información útil.",
    Configuración: "Información de la plataforma y próximos pasos.",
    "Mi perfil": "Tu información dentro del equipo.",
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {admin ? "CENTRO DE OPERACIONES" : "MI ESPACIO DE TRABAJO"}
          </span>
          <h1>{section}</h1>
          <p>{subtitles[section]}</p>
        </div>
        <div className="heading-actions">
          {admin && (
            <>
              <button className="button secondary" onClick={download}>
                <Download size={16} />
                Exportar CSV
              </button>
              <button
                className="button primary"
                onClick={() => setEditing("new")}
              >
                <Plus size={18} />
                Crear registro
              </button>
            </>
          )}
        </div>
      </div>
      {notice && (
        <div className="notice" role="status">
          <CheckCircle2 size={18} />
          {notice}
          <button
            aria-label="Cerrar aviso"
            className="icon-button"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {summary && (
        <SummaryView
          user={user}
          admin={admin}
          mine={mine}
          navigate={navigate}
          onSelect={setEditing}
        />
      )}
      {(section === "Registros" ||
        section === "Mis tareas" ||
        section === "Historial") && (
        <section className="panel">
          <div className="panel-title">
            <div>
              <h3>
                {section === "Historial"
                  ? "Trabajo completado"
                  : "Listado de trabajo"}
              </h3>
              <p>
                {section === "Historial"
                  ? "Solo tus tareas completadas"
                  : `${mine.length} registros en tu espacio`}
              </p>
            </div>
          </div>
          <TaskTable
            tasks={
              section === "Historial"
                ? mine.filter((t) => t.status === "Completada")
                : mine
            }
            admin={admin}
            onSelect={setEditing}
          />
        </section>
      )}
      {section === "Gestión de técnicos" && (
        <>
          <Stats tasks={mine} admin />
          <section className="panel">
            <div className="panel-title">
              <div>
                <h3>Directorio de técnicos</h3>
                <p>Un equipo de 5 profesionales</p>
              </div>
            </div>
            <TechnicianTable tasks={mine} />
          </section>
        </>
      )}
      {section === "Reportes" && (
        <ReportsView mine={mine} download={download} />
      )}
      {section === "Configuración" && <SettingsView />}
      {section === "Mi perfil" && <ProfileView user={user} />}
      {editing && (
        <TaskForm
          task={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={() =>
            setNotice("Cambios guardados en esta sesión de demostración.")
          }
        />
      )}
    </>
  );
}
