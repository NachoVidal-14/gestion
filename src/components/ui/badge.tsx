export function Badge({ value }: { value: string }) {
  const tone =
    (
      {
        Completada: "green",
        Activo: "green",
        Pendiente: "amber",
        "En progreso": "blue",
        Alta: "red",
        Media: "amber",
        Baja: "slate",
        Inactivo: "slate",
      } as Record<string, string>
    )[value] || "slate";
  return (
    <span className={`badge ${tone}`}>
      <span /> {value}
    </span>
  );
}
