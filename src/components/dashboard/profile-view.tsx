import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";

export function ProfileView({ user }: { user: User }) {
  return (
    <section className="panel settings-panel">
      <div className="profile-avatar">
        {user.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <h2>{user.name}</h2>
      <dl className="profile-grid">
        <div>
          <dt>Correo electrónico</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>Técnico</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>
            <Badge value="Activo" />
          </dd>
        </div>
        <div>
          <dt>Identificador</dt>
          <dd>{user.id}</dd>
        </div>
      </dl>
      <p className="info-note">
        Perfil ficticio de demostración. La edición de datos personales estará
        disponible próximamente.
      </p>
    </section>
  );
}
