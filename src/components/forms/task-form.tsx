"use client";
import { useState } from "react";
import { technicians } from "@/data/mock";
import { useDemo } from "@/hooks/demo-context";
import { formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import type { Priority, Task, TaskStatus } from "@/types";
export function TaskForm({
  task,
  onClose,
  onSaved,
}: {
  task?: Task;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user, saveTask } = useDemo();
  const admin = user?.role === "ADMIN";
  const [status, setStatus] = useState<TaskStatus>(task?.status || "Pendiente");
  const [error, setError] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    const description = String(
      data.get("description") || task?.description || "",
    ).trim();
    if (!description) {
      setError("Escribe una descripción para el registro.");
      return;
    }
    const now = new Date().toISOString();
    const next: Task = {
      id: task?.id || `REG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date: task?.date || now.slice(0, 10),
      technicianId: admin ? String(data.get("technician")) : user.id,
      category: admin ? String(data.get("category")) : task!.category,
      description,
      status,
      priority: (admin
        ? String(data.get("priority"))
        : task!.priority) as Priority,
      updatedAt: now,
      observations: String(data.get("observations")).trim(),
      activity: [
        ...(task?.activity || []),
        {
          id: crypto.randomUUID(),
          date: now,
          message: task
            ? `Cambios guardados. Estado: ${status}.`
            : "Registro creado y asignado.",
          userId: user.id,
        },
      ],
    };
    if (saveTask(next)) {
      onSaved();
      onClose();
    } else setError("No se pudo guardar este registro en la demostración.");
  }
  return (
    <Modal title={task ? task.id : "Crear registro"} onClose={onClose}>
      <form onSubmit={submit} className="task-form">
        {admin ? (
          <>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              defaultValue={task?.description}
              required
              maxLength={500}
            />
            <div className="form-grid">
              <div>
                <label htmlFor="technician">Técnico asignado</label>
                <select
                  id="technician"
                  name="technician"
                  defaultValue={task?.technicianId || technicians[0].id}
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  name="category"
                  defaultValue={task?.category}
                >
                  {[
                    "Mantenimiento",
                    "Instalación",
                    "Incidencia",
                    "Inspección",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="detail-description">{task?.description}</p>
            <p className="muted">
              {task?.category} · Prioridad {task?.priority.toLowerCase()} ·{" "}
              {task && formatDate(task.date)}
            </p>
          </>
        )}
        <div className="form-grid">
          <div>
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {(admin
                ? ["Pendiente", "En progreso", "Completada"]
                : task?.status === "Pendiente"
                  ? ["Pendiente", "En progreso"]
                  : task?.status === "En progreso"
                    ? ["En progreso", "Completada"]
                    : ["Completada"]
              ).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {admin && (
            <div>
              <label htmlFor="priority">Prioridad</label>
              <select
                id="priority"
                name="priority"
                defaultValue={task?.priority || "Media"}
              >
                {["Alta", "Media", "Baja"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <label htmlFor="observations">Observaciones del técnico</label>
        <textarea
          id="observations"
          name="observations"
          defaultValue={task?.observations}
          placeholder="Agrega información sobre el trabajo realizado…"
          maxLength={2000}
        />
        {task && (
          <div className="activity">
            <h3>Historial de actividad</h3>
            {task.activity.map((log) => (
              <p key={log.id}>
                <span className="activity-dot" />
                {log.message}
                <small>{formatDate(log.date)}</small>
              </p>
            ))}
          </div>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <footer>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="button primary">
            {task ? "Guardar cambios" : "Crear registro"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
