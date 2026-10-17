import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Stats, Distribution } from "./overview";
import { TaskTable } from "./task-table";
import { technicians } from "@/data/mock";
import type { User, Task } from "@/types";

export function SummaryView({
  user,
  admin,
  mine,
  navigate,
  onSelect,
}: {
  user: User;
  admin: boolean;
  mine: Task[];
  navigate: (section: string) => void;
  onSelect: (task: Task) => void;
}) {
  return (
    <>
      <div className="welcome-banner">
        <div>
          <span className="welcome-label">
            ¡Hola, {user.name.split(" ")[0]}!
          </span>
          <h2>
            {admin
              ? "Una visión clara para tomar mejores decisiones."
              : "Cada tarea cuenta. Hagamos que suceda."}
          </h2>
          <p>
            {admin ? "Tu equipo tiene" : "Tienes"}{" "}
            <strong>
              {mine.filter((t) => t.status !== "Completada").length} tareas
              activas
            </strong>{" "}
            esperando el siguiente paso.
          </p>
        </div>
        <div className="banner-art">
          <span />
          <span />
          <span />
          <CheckCircle2 size={46} />
        </div>
      </div>
      <Stats tasks={mine} admin={admin} />
      <div className="overview-grid">
        <Distribution tasks={mine} />
        <section className="panel team-panel">
          <div className="panel-title">
            <div>
              <h3>{admin ? "Tu equipo, conectado" : "Tu progreso"}</h3>
              <p>
                {admin
                  ? "Personas que hacen que todo funcione"
                  : "Pequeños pasos, grandes resultados"}
              </p>
            </div>
          </div>
          {admin ? (
            <>
              <div className="team-avatars">
                {technicians.map((t, i) => (
                  <span key={t.id} className={`team-avatar avatar-${i}`}>
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                ))}
              </div>
              <strong>5 técnicos · 1 equipo</strong>
              <p className="muted">4 técnicos activos y listos para avanzar.</p>
              <button
                className="text-button"
                onClick={() => navigate("Gestión de técnicos")}
              >
                Ver equipo <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <div className="progress-number">
                {Math.round(
                  (mine.filter((t) => t.status === "Completada").length /
                    Math.max(mine.length, 1)) *
                    100,
                )}
                <span>%</span>
              </div>
              <p className="muted">de tus tareas completadas</p>
              <button
                className="text-button"
                onClick={() => navigate("Mis tareas")}
              >
                Continuar con mis tareas <ArrowRight size={15} />
              </button>
            </>
          )}
        </section>
      </div>
      <section className="panel">
        <div className="panel-title">
          <div>
            <h3>{admin ? "Registros recientes" : "Mis tareas recientes"}</h3>
            <p>Los últimos movimientos de tu espacio de trabajo</p>
          </div>
          <button
            className="text-button"
            onClick={() => navigate(admin ? "Registros" : "Mis tareas")}
          >
            Ver todos <ArrowRight size={15} />
          </button>
        </div>
        <TaskTable tasks={mine} admin={admin} onSelect={onSelect} compact />
      </section>
    </>
  );
}
