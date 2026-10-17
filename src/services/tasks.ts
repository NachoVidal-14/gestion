import type { Task, User } from "@/types";
export function visibleTasks(tasks: Task[], user: User) {
  return user.role === "ADMIN"
    ? tasks
    : tasks.filter((task) => task.technicianId === user.id);
}
export function csvText(tasks: Task[]) {
  const cell = (value: string) =>
    `"${(/^[=+@\-\t\r]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
  return (
    "\uFEFF" +
    [
      [
        "ID",
        "Fecha",
        "Técnico",
        "Categoría",
        "Descripción",
        "Estado",
        "Prioridad",
        "Última actualización",
      ],
      ...tasks.map((t) => [
        t.id,
        t.date,
        t.technicianId,
        t.category,
        t.description,
        t.status,
        t.priority,
        t.updatedAt,
      ]),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n")
  );
}
export function exportCsv(tasks: Task[]) {
  const url = URL.createObjectURL(
    new Blob([csvText(tasks)], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "registros-demostracion.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
