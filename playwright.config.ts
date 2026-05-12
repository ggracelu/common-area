import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { loadEnvLocal } from "./lib/load-env-local";

loadEnvLocal(process.cwd(), { override: true });

const previewBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim() || undefined;
// Preview project asserts the public Vercel deploy for ggracelu/whynot (see docs/GRADER_WALKTHROUGH.md).
const graderStorageState = path.join(__dirname, "e2e/fixtures/grader-storage.json");
const graderCredentialsConfigured = Boolean(
  process.env.GRADER_CLERK_EMAIL?.trim() && process.env.GRADER_CLERK_PASSWORD,
);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: path.join(__dirname, "e2e/global-setup.ts"),
  webServer: {
    command: "npm run dev -- --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      STRIPE_SECRET_KEY: "",
      STRIPE_WEBHOOK_SECRET: "",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "",
    },
  },
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "local",
      testIgnore: ["**/grader-journey.spec.ts", "**/preview-smoke.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PLAYWRIGHT_LOCAL_BASE_URL ?? "http://localhost:3000",
      },
    },
    {
      name: "grader",
      testMatch: "**/grader-journey.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PLAYWRIGHT_LOCAL_BASE_URL ?? "http://localhost:3000",
        ...(graderCredentialsConfigured ? { storageState: graderStorageState } : {}),
      },
    },
    {
      name: "preview",
      testMatch: "**/preview-smoke.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: previewBaseUrl ?? "http://localhost:3000",
      },
    },
  ],
});
