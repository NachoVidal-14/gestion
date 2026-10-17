"use client";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Layers3,
  ShieldCheck,
  Workflow,
  ChartNoAxesCombined,
} from "lucide-react";
import { authenticateDemo } from "@/lib/auth/demo";
import { useDemo } from "@/hooks/demo-context";
const subscribe = () => () => {};

export function LoginForm() {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const router = useRouter();
  const { login } = useDemo();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const user = authenticateDemo(
      String(data.get("email")),
      String(data.get("password")),
    );
    if (user) {
      login(user);
      router.push(user.role === "ADMIN" ? "/admin" : "/tecnico");
    } else
      setError(
        "Correo o contraseña incorrectos. Utiliza una de las cuentas de demostración.",
      );
    setBusy(false);
  }
  return (
    <main className="login-layout">
      <section className="login-story">
        <div className="brand">
          <span className="brand-icon">
            <Layers3 size={24} />
          </span>
          <span>
            Plataforma de Gestión<small>OPERACIONES CONECTADAS</small>
          </span>
        </div>
        <div>
          <span className="eyebrow light">TU EQUIPO. UNA SOLA PLATAFORMA.</span>
          <h1>
            Más claridad.
            <br />
            Mejores operaciones.
          </h1>
          <p>
            Conecta a tu equipo, organiza el trabajo y transforma cada tarea en
            un resultado.
          </p>
          <div className="story-features">
            <div>
              <Workflow /> Un flujo de trabajo compartido
            </div>
            <div>
              <ChartNoAxesCombined /> Visibilidad en cada etapa
            </div>
            <div>
              <ShieldCheck /> Una experiencia para cada rol
            </div>
          </div>
        </div>
        <small>Diseñada para que tu equipo avance.</small>
        <div className="story-orbit" />
      </section>
      <section className="login-form-area">
        <div className="login-card">
          <span className="demo-pill">● Modo demostración</span>
          <h2>Bienvenido de nuevo</h2>
          <p className="muted">Ingresa para acceder a tu espacio de trabajo.</p>
          <form onSubmit={submit} method="post">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@empresa.cl"
              autoComplete="username"
              required
            />
            <label htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="icon-button"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button primary wide" disabled={busy || !ready}>
              {busy ? "Ingresando…" : "Ingresar a la plataforma"}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="demo-accounts">
            <strong>Cuentas de demostración</strong>
            <p>
              Administrador
              <br />
              <code>admin@demo.local / DemoAdmin123!</code>
            </p>
            <p>
              Técnico
              <br />
              <code>tecnico@demo.local / DemoTecnico123!</code>
            </p>
            <small>
              Datos ficticios. La sesión vive en memoria y no ofrece seguridad
              de producción.
            </small>
          </div>
          <p className="login-footer">Plataforma de Gestión · MVP 1.0</p>
        </div>
      </section>
    </main>
  );
}
