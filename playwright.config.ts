import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas E2E contra la versión de producción (npm run build && npm start).
 * Requiere la base con datos: npx prisma migrate dev && npm run seed.
 * CHROMIUM_PATH permite usar un Chromium ya instalado (en la nube: /opt/pw-browsers/...).
 */
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    launchOptions: { executablePath, args: ["--no-proxy-server"] },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "movil", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: "npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
