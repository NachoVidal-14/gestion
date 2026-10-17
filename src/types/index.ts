export type Role = "ADMIN" | "TECNICO";
export type TaskStatus = "Pendiente" | "En progreso" | "Completada";
export type Priority = "Alta" | "Media" | "Baja";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface Technician extends User {
  status: "Activo" | "Inactivo";
}
export interface ActivityLog {
  id: string;
  date: string;
  message: string;
  userId: string;
}
export interface Task {
  id: string;
  date: string;
  technicianId: string;
  category: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  updatedAt: string;
  observations: string;
  activity: ActivityLog[];
}
