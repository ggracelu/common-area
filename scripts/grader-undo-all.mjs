#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { chromium } from "@playwright/test";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i <= 0) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function assertPending(page, testId) {
  await page.getByTestId(testId).filter({ hasText: "Pending" }).waitFor({ timeout: 30_000 });
}

async function main() {
  loadEnvLocal();
  const baseURL = process.env.PLAYWRIGHT_LOCAL_BASE_URL ?? "http://localhost:3000";
  const storage = path.join(process.cwd(), "e2e/fixtures/grader-storage.json");
  if (!fs.existsSync(storage)) {
    throw new Error("Missing grader storage state.");
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: storage });
  const page = await context.newPage();
  page.on("dialog", (dialog) => dialog.accept());
  await page.emulateMedia({ reducedMotion: "reduce" });

  const stages = [
  { id: "grader-undo-bingo", checklist: null },
  { id: "grader-undo-reveal", checklist: "grader-checklist-letter" },
  { id: "grader-undo-matching", checklist: "grader-checklist-matching" },
  { id: "grader-undo-picks", checklist: "grader-checklist-picks" },
  { id: "grader-undo-deposit", checklist: "grader-checklist-deposit" },
  ];

  const timings = [];

  await page.goto(`${baseURL}/dashboard`);
  await page.getByTestId("grader-onboarding-checklist").waitFor({ timeout: 30_000 });

  for (const stage of stages) {
    const started = Date.now();
    await page.goto(`${baseURL}/dashboard`);
    await page.getByTestId(stage.id).click();
    if (stage.checklist) {
      await assertPending(page, stage.checklist);
    }
    timings.push({ undo: stage.id, ms: Date.now() - started });
  }

  const resetStarted = Date.now();
  await page.goto(`${baseURL}/dashboard`);
  await page.getByTestId("grader-reset-journey").click();
  await assertPending(page, "grader-checklist-deposit");
  timings.push({ undo: "grader-reset-journey", ms: Date.now() - resetStarted });

  const maxMs = Math.max(...timings.map((entry) => entry.ms));
  console.log(JSON.stringify({ ok: maxMs <= 30_000, timings }, null, 2));
  await browser.close();
  process.exit(maxMs <= 30_000 ? 0 : 1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
