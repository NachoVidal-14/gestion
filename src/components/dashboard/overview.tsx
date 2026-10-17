import {
  ArrowUpRight,
  CheckCheck,
  CircleAlert,
  Clock3,
  LoaderCircle,
  Users,
  ClipboardList,
} from "lucide-react";
import { technicians } from "@/data/mock";
import type { Task } from "@/types";
export function Stats({ tasks, admin }: { tasks: Task[]; admin: boolean }) {
  const stats = [
    {
      label: admin ? "Total de técnicos" : "Tareas asignadas",
      value: admin ? technicians.length : tasks.length,
      icon: admin ? Users : ClipboardList,
      tone: "blue",
      note: admin ? "4 activos en el equipo" : "Tu carga de trabajo actual",
    },
    {
      label: "Tareas pendientes",
      value: tasks.filter((t) => t.status === "Pendiente").length,
      icon: Clock3,
      tone: "amber",
      note: "Por comenzar",
    },
    {
      label: "En progreso",
      value: tasks.filter((t) => t.status === "En progreso").length,
      icon: LoaderCircle,
      tone: "purple",
      note: "En manos del equipo",
    },
    {
      label: "Completadas",
      value: tasks.filter((t) => t.status === "Completada").length,
      icon: CheckCheck,
      tone: "green",
      note: "Trabajo realizado",
    },
    ...(admin
      ? [
          {
            label: "Incidencias abiertas",
            value: tasks.filter(
              (t) => t.category === "Incidencia" && t.status !== "Completada",
            ).length,
            icon: CircleAlert,
            tone: "red",
            note: "Requieren seguimiento",
          },
        ]
      : []),
  ];
  return (
    <div className={`stats-grid ${admin ? "" : "four"}`}>
      {stats.map((s) => (
        <article className="stat-card" key={s.label}>
          <div>
            <span>{s.label}</span>
            <span className={`stat-icon ${s.tone}`}>
              <s.icon size={19} />
            </span>
          </div>
          <strong>{s.value.toString().padStart(2, "0")}</strong>
          <small>{s.note}</small>
        </article>
      ))}
    </div>
  );
}
export function Distribution({ tasks }: { tasks: Task[] }) {
  const counts = ["Pendiente", "En progreso", "Completada"].map(
    (status) => tasks.filter((t) => t.status === status).length,
  );
  const total = tasks.length || 1;
  const complete = (counts[2] / total) * 100;
  const progress = (counts[1] / total) * 100;
  return (
    <section className="panel distribution">
      <div className="panel-title">
        <div>
          <h3>Distribución de tareas</h3>
          <p>Una mirada al estado de las operaciones</p>
        </div>
        <ArrowUpRight size={18} />
      </div>
      <div className="distribution-content">
        <div
          className="donut"
          role="img"
          aria-label={`Pendientes: ${counts[0]}, en progreso: ${counts[1]}, completadas: ${counts[2]}`}
          style={{
            background: `conic-gradient(#16a675 0% ${complete}%, #4f76ee ${complete}% ${complete + progress}%, #f3b548 ${complete + progress}% 100%)`,
          }}
        >
          <div>
            <strong>{tasks.length}</strong>
            <span>tareas totales</span>
          </div>
        </div>
        <div className="legend">
          {["Pendiente", "En progreso", "Completada"].map((s, i) => (
            <div key={s}>
              <span className={`legend-dot color-${i}`} />
              <span>{s}</span>
              <strong>{counts[i]}</strong>
              <small>{Math.round((counts[i] / total) * 100)}%</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
