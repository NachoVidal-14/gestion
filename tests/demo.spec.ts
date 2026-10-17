import { test, expect, type Page } from "@playwright/test";

let runtimeErrors: string[] = [];
test.beforeEach(async ({ page }) => {
  runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
});
test.afterEach(() => {
  expect(runtimeErrors).toEqual([]);
});
async function login(page: Page, role: "admin" | "tecnico") {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(`${role}@demo.local`);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill(role === "admin" ? "DemoAdmin123!" : "DemoTecnico123!");
  await page.getByRole("button", { name: "Ingresar a la plataforma" }).click();
  await expect(page).toHaveURL(role === "admin" ? "/admin" : "/tecnico");
  await expect(
    page.getByRole("heading", {
      name: role === "admin" ? "Resumen general" : "Mi resumen",
      exact: true,
    }),
  ).toBeVisible();
}

test("login valida, permite mostrar contraseña y explica credenciales incorrectas", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
  await page.getByRole("button", { name: "Ingresar a la plataforma" }).click();
  await expect(page.getByLabel("Correo electrónico")).toBeFocused();
  await page.getByLabel("Correo electrónico").fill("nadie@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Mostrar contraseña" }).click();
  await expect(page.getByLabel("Contraseña", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Ingresar a la plataforma" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Correo o contraseña incorrectos",
  );
});

test("administración crea, filtra, ordena y edita registros con indicadores coherentes", async ({
  page,
}) => {
  await login(page, "admin");
  await expect(
    page
      .locator(".stat-card")
      .filter({ hasText: "Tareas pendientes" })
      .locator(":scope > strong"),
  ).toHaveText("07");
  await page
    .getByRole("button", { name: "Crear registro", exact: true })
    .click();
  await page
    .getByLabel("Descripción", { exact: true })
    .fill('Registro de validación con "comillas", y coma');
  await page.getByLabel("Prioridad", { exact: true }).selectOption("Alta");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Crear registro" })
    .click();
  await expect(page.getByRole("status")).toContainText("Cambios guardados");
  await expect(
    page
      .locator(".stat-card")
      .filter({ hasText: "Tareas pendientes" })
      .locator(":scope > strong"),
  ).toHaveText("08");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Registros", exact: true })
    .click();
  const firstDate = await page
    .locator("tbody tr")
    .first()
    .locator("td")
    .nth(1)
    .innerText();
  await page.getByRole("button", { name: "FECHA" }).click();
  await expect(
    page.locator("tbody tr").first().locator("td").nth(1),
  ).not.toHaveText(firstDate);
  await page.getByLabel("Buscar registros").fill("Registro de validación");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Filtrar por estado").selectOption("Completada");
  await expect(page.getByText("No encontramos registros")).toBeVisible();
  await page.getByLabel("Filtrar por estado").selectOption("Pendiente");
  await page.getByLabel("Filtrar por prioridad").selectOption("Alta");
  await page.getByRole("button", { name: "FECHA" }).click();
  await page.getByRole("button", { name: /Ver detalle REG-/ }).click();
  await page.getByLabel("Estado", { exact: true }).selectOption("En progreso");
  await page
    .getByLabel("Observaciones del técnico")
    .fill("Verificado por el administrador.");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByText("No encontramos registros")).toBeVisible();
  await page.getByLabel("Filtrar por estado").selectOption("En progreso");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: /Ver detalle REG-/ }).click();
  await expect(page.getByLabel("Observaciones del técnico")).toHaveValue(
    "Verificado por el administrador.",
  );
  await expect(
    page.getByText("Cambios guardados. Estado: En progreso."),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("técnicos, reportes, CSV escapado y configuración funcionan", async ({
  page,
}) => {
  await login(page, "admin");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Gestión de técnicos" })
    .click();
  await page.getByLabel("Buscar técnicos por nombre").fill("Andrés");
  await page.getByLabel("Estado del técnico").selectOption("Activo");
  await expect(page.getByText("No hay técnicos que coincidan")).toBeVisible();
  await page.getByLabel("Estado del técnico").selectOption("Inactivo");
  await page.getByRole("button", { name: "Ver ficha" }).click();
  await expect(page.getByRole("dialog")).toContainText("andres@demo.local");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Crear registro", exact: true })
    .click();
  await page
    .getByLabel("Descripción", { exact: true })
    .fill('=FÓRMULA, "texto"');
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Crear registro" })
    .click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Reportes", exact: true })
    .click();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar CSV" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("registros-demostracion.csv");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString("utf8");
  expect(csv).toContain('"ID","Fecha"');
  expect(csv).toContain('"\'=FÓRMULA, ""texto"""');
  expect(csv.split("\r\n")).toHaveLength(22);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Configuración" })
    .click();
  await expect(page.getByText("Próximamente", { exact: true })).toHaveCount(3);
});

test("técnico inicia, completa y observa sus tareas; historial y perfil están aislados", async ({
  page,
}) => {
  await login(page, "tecnico");
  await expect(
    page
      .getByRole("navigation")
      .getByRole("button", { name: "Registros", exact: true }),
  ).toHaveCount(0);
  await expect(
    page
      .locator(".stat-card")
      .filter({ hasText: "Tareas asignadas" })
      .locator(":scope > strong"),
  ).toHaveText("04");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Mis tareas", exact: true })
    .click();
  await expect(page.locator("tbody tr")).toHaveCount(4);
  await page.getByLabel("Buscar registros").fill("REG-0001");
  await page.getByRole("button", { name: "Ver detalle REG-0001" }).click();
  await expect(
    page.getByLabel("Estado", { exact: true }).locator("option"),
  ).toHaveCount(2);
  await page.getByLabel("Estado", { exact: true }).selectOption("En progreso");
  await page
    .getByLabel("Observaciones del técnico")
    .fill("Diagnóstico realizado.");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.locator("tbody tr")).toContainText("En progreso");
  await page.getByRole("button", { name: "Ver detalle REG-0001" }).click();
  await expect(page.getByLabel("Observaciones del técnico")).toHaveValue(
    "Diagnóstico realizado.",
  );
  await page.getByLabel("Estado", { exact: true }).selectOption("Completada");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Historial", exact: true })
    .click();
  await page.getByLabel("Buscar registros").fill("");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  for (const row of await page.locator("tbody tr").all())
    await expect(row).toContainText("Completada");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Mi resumen", exact: true })
    .click();
  await expect(
    page
      .locator(".stat-card")
      .filter({ hasText: "Completadas" })
      .locator(":scope > strong"),
  ).toHaveText("02");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Mi perfil", exact: true })
    .click();
  await expect(page.getByRole("main")).toContainText("tecnico@demo.local");
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL("/login");
  await login(page, "tecnico");
  await expect(
    page
      .locator(".stat-card")
      .filter({ hasText: "Completadas" })
      .locator(":scope > strong"),
  ).toHaveText("01");
});

test("rutas de demo redirigen sin sesión y la recarga reinicia la sesión", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL("/login");
  await login(page, "tecnico");
  await page.reload();
  await expect(page).toHaveURL("/login");
});

test("móvil: login y navegación utilizables sin desbordamiento de página", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page, "admin");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Abrir navegación" }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Registros", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Registros", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect
    .poll(async () => {
      const bounds = await page.locator(".sidebar").boundingBox();
      return bounds ? bounds.x + bounds.width : 0;
    })
    .toBeLessThanOrEqual(0);
  await page.screenshot({
    path: "/tmp/gestion-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
});
