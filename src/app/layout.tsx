import type { Metadata } from "next";
import { DemoProvider } from "@/hooks/demo-context";
import "./globals.css";
export const metadata: Metadata = {
  title: "Plataforma de Gestión | Operaciones",
  description: "Demostración de gestión operativa para equipos técnicos.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
