import { administrator, technicians } from "@/data/mock";
import type { User } from "@/types";
// Exclusivamente demostrativo: estas comprobaciones NO son autenticación ni autorización real.
export function authenticateDemo(email: string, password: string): User | null {
  if (
    email.trim().toLowerCase() === administrator.email &&
    password === "DemoAdmin123!"
  )
    return administrator;
  if (
    email.trim().toLowerCase() === technicians[0].email &&
    password === "DemoTecnico123!"
  )
    return technicians[0];
  return null;
}
