"use client";
import { createContext, useContext, useState } from "react";
import { initialTasks } from "@/data/mock";
import type { Task, User } from "@/types";
interface DemoContext {
  user: User | null;
  tasks: Task[];
  login: (user: User) => void;
  logout: () => void;
  saveTask: (task: Task) => boolean;
}
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  function saveTask(task: Task) {
    if (
      !user ||
      (user.role !== "ADMIN" &&
        (task.technicianId !== user.id ||
          !tasks.some((t) => t.id === task.id && t.technicianId === user.id)))
    )
      return false;
    setTasks((previous) =>
      previous.some((t) => t.id === task.id)
        ? previous.map((t) => (t.id === task.id ? task : t))
        : [task, ...previous],
    );
    return true;
  }
  return (
    <Context.Provider
      value={{
        user,
        tasks,
        login: setUser,
        logout: () => {
          setUser(null);
          setTasks(initialTasks);
        },
        saveTask,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("Falta DemoProvider");
  return context;
}
