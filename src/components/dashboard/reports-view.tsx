import { Download, FileSpreadsheet } from "lucide-react";
import { Stats, Distribution } from "./overview";
import { technicians } from "@/data/mock";
import type { Task } from "@/types";

export function ReportsView({
  mine,
  download,
}: {
  mine: Task[];
  download: () => void;
}) {
  return (
    <>
      <Stats tasks={mine} admin />
      <div className="overview-grid">
        <Distribution tasks={mine} />
        <section className="panel report-panel">
          <FileSpreadsheet size={30} />
          <h3>Tu operación, lista para analizar</h3>
          <p className="muted">
            Descarga los {mine.length} registros ficticios en un archivo CSV
            compatible con hojas de cálculo.
          </p>
          <button className="button primary" onClick={download}>
            <Download size={16} />
            Descargar CSV
          </button>
        </section>
      </div>
      <section className="panel">
        <div className="panel-title">
          <h3>Resumen por técnico</h3>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>TÉCNICO</th>
                <th>ASIGNADAS</th>
                <th>COMPLETADAS</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>
                    {mine.filter((task) => task.technicianId === t.id).length}
                  </td>
                  <td>
                    {
                      mine.filter(
                        (task) =>
                          task.technicianId === t.id &&
                          task.status === "Completada",
                      ).length
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
