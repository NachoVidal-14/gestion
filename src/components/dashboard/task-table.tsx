"use client";
import { useState } from "react";
import {
  ArrowDownUp,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { technicians } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types";
export function TaskTable({
  tasks,
  admin,
  onSelect,
  compact = false,
}: {
  tasks: Task[];
  admin: boolean;
  onSelect: (task: Task) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [priority, setPriority] = useState("Todas");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const filtered = tasks
    .filter(
      (t) =>
        `${t.id} ${t.description} ${t.category} ${technicians.find((u) => u.id === t.technicianId)?.name}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (status === "Todos" || t.status === status) &&
        (priority === "Todas" || t.priority === priority),
    )
    .sort((a, b) =>
      sort === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  const displayed = compact ? filtered.slice(0, 5) : filtered;
  return (
    <>
      {!compact && (
        <div className="table-tools">
          <div className="search">
            <Search size={18} />
            <input
              aria-label="Buscar registros"
              placeholder="Buscar por ID, descripción o técnico…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <SlidersHorizontal size={16} />
            <select
              aria-label="Filtrar por estado"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["Todos", "Pendiente", "En progreso", "Completada"].map((s) => (
                <option key={s} value={s}>
                  {s === "Todos" ? "Todos los estados" : s}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrar por prioridad"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {["Todas", "Alta", "Media", "Baja"].map((p) => (
                <option key={p} value={p}>
                  {p === "Todas" ? "Todas las prioridades" : p}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>REGISTRO</th>
              <th>
                <button
                  className="sort-button"
                  onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
                >
                  FECHA <ArrowDownUp size={12} />
                </button>
              </th>
              {admin && <th>TÉCNICO</th>}
              <th>DESCRIPCIÓN</th>
              <th>ESTADO</th>
              <th>PRIORIDAD</th>
              {!compact && <th>ACTUALIZACIÓN</th>}
              <th>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong className="record-id">{task.id}</strong>
                </td>
                <td className="nowrap muted">{formatDate(task.date)}</td>
                {admin && (
                  <td>
                    <div className="technician-cell">
                      <span className="mini-avatar">
                        {technicians
                          .find((t) => t.id === task.technicianId)
                          ?.name.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <span>
                        {
                          technicians.find((t) => t.id === task.technicianId)
                            ?.name
                        }
                      </span>
                    </div>
                  </td>
                )}
                <td className="description-cell">
                  <span>{task.description}</span>
                  <small>{task.category}</small>
                </td>
                <td>
                  <Badge value={task.status} />
                </td>
                <td>
                  <Badge value={task.priority} />
                </td>
                {!compact && (
                  <td className="muted nowrap">{formatDate(task.updatedAt)}</td>
                )}
                <td>
                  <button
                    className="icon-button"
                    aria-label={`Ver detalle ${task.id}`}
                    onClick={() => onSelect(task)}
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <div className="empty-state">
            <Search />
            <h3>No encontramos registros</h3>
            <p>Prueba con otros filtros.</p>
          </div>
        )}
      </div>
      <div className="table-footer">
        {compact
          ? `Mostrando ${displayed.length} de ${tasks.length} registros`
          : `${filtered.length} registros encontrados`}
        <span>Datos de demostración</span>
      </div>
    </>
  );
}
