"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { technicians } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { Task, Technician } from "@/types";
export function TechnicianTable({ tasks }: { tasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [selected, setSelected] = useState<Technician | null>(null);
  const filtered = technicians.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) &&
      (status === "Todos" || t.status === status),
  );
  return (
    <>
      <div className="table-tools">
        <div className="search">
          <Search size={18} />
          <input
            aria-label="Buscar técnicos por nombre"
            placeholder="Buscar técnico por nombre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Estado del técnico"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["Todos", "Activo", "Inactivo"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {[
                "ID",
                "NOMBRE",
                "CORREO ELECTRÓNICO",
                "ESTADO",
                "TAREAS",
                "ACCIONES",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  <strong>{t.name}</strong>
                </td>
                <td>{t.email}</td>
                <td>
                  <Badge value={t.status} />
                </td>
                <td>
                  {tasks.filter((task) => task.technicianId === t.id).length}
                </td>
                <td>
                  <button
                    className="text-button"
                    onClick={() => setSelected(t)}
                  >
                    Ver ficha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="empty-state">
            No hay técnicos que coincidan con la búsqueda.
          </div>
        )}
      </div>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className="profile-details">
            <p>{selected.email}</p>
            <p>Rol: Técnico</p>
            <Badge value={selected.status} />
            <p>
              Tareas asignadas:{" "}
              {tasks.filter((t) => t.technicianId === selected.id).length}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
