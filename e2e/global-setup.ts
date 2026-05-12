import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { loadEnvLocal } from "../lib/load-env-local";

loadEnvLocal();

const authFile = path.join(__dirname, "fixtures", "grader-storage.json");

async function globalSetup() {
  const email = process.env.GRADER_CLERK_EMAIL?.trim();
  const password = process.env.GRADER_CLERK_PASSWORD;
  if (!email || !password) {
    return;
  }

  await clerkSetup();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  const baseURL = process.env.PLAYWRIGHT_LOCAL_BASE_URL ?? "http://localhost:3000";
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/sign-in`);
  await clerk.signIn({
    page,
    emailAddress: email,
  });
  await page.goto(`${baseURL}/dashboard`);
  await page.waitForURL(/\/dashboard/, { timeout: 60_000 });

  await context.storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;
