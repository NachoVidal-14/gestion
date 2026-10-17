"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers3,
  LayoutDashboard,
  Users,
  Table2,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  ClipboardList,
  History,
  UserRound,
} from "lucide-react";
import { useDemo } from "@/hooks/demo-context";
import { Dashboard } from "@/components/dashboard/dashboard";
import type { Role } from "@/types";
export function Workspace({ role }: { role: Role }) {
  const { user, logout } = useDemo();
  const router = useRouter();
  const [section, setSection] = useState(
    role === "ADMIN" ? "Resumen general" : "Mi resumen",
  );
  const [mobile, setMobile] = useState(false);
  const admin = role === "ADMIN";
  const navigation = admin
    ? [
        { label: "Resumen general", icon: LayoutDashboard },
        { label: "Gestión de técnicos", icon: Users },
        { label: "Registros", icon: Table2 },
        { label: "Reportes", icon: ChartNoAxesCombined },
        { label: "Configuración", icon: Settings },
      ]
    : [
        { label: "Mi resumen", icon: LayoutDashboard },
        { label: "Mis tareas", icon: ClipboardList },
        { label: "Historial", icon: History },
        { label: "Mi perfil", icon: UserRound },
      ];
  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== role)
      router.replace(user.role === "ADMIN" ? "/admin" : "/tecnico");
  }, [user, role, router]);
  if (!user || user.role !== role)
    return (
      <main className="loading" role="status">
        Preparando tu espacio de demostración…
      </main>
    );
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-icon">
            <Layers3 size={23} />
          </span>
          <span>
            Plataforma<small>DE GESTIÓN</small>
          </span>
        </div>
        <span className="sidebar-label">ESPACIO DE TRABAJO</span>
        <nav aria-label="Navegación principal">
          {navigation.map((item) => (
            <button
              key={item.label}
              className={section === item.label ? "active" : ""}
              aria-current={section === item.label ? "page" : undefined}
              onClick={() => {
                setSection(item.label);
                setMobile(false);
              }}
            >
              <item.icon size={19} />
              {item.label}
              {section === item.label && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <strong>Todo bajo control</strong>
            <p>Un espacio para conectar a tu equipo y su trabajo.</p>
            <span>Demostración · 1.0</span>
          </div>
          <button
            className="logout"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      {mobile && (
        <button
          className="mobile-overlay"
          aria-label="Cerrar navegación"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir navegación"
              onClick={() => setMobile(!mobile)}
            >
              <Menu />
            </button>
            <span>Espacio de trabajo</span>
            <ChevronRight size={15} />
            <strong>{admin ? "Administración" : "Portal técnico"}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-pill">● Modo demostración</span>
            <div className="avatar">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="user-info">
              <strong>{user.name}</strong>
              <small>{admin ? "Administradora" : "Técnico"}</small>
            </div>
          </div>
        </header>
        <main className="main-content">
          <Dashboard section={section} navigate={setSection} />
        </main>
        <footer className="workspace-footer">
          Plataforma de Gestión{" "}
          <span>
            Datos ficticios · Los cambios se reinician al salir o recargar
          </span>
        </footer>
      </div>
    </div>
  );
}
