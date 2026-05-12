import { test, expect } from "@playwright/test";

function previewDeployConfigured(baseURL: string | undefined) {
  if (!baseURL?.trim()) {
    return false;
  }

  try {
    const host = new URL(baseURL).hostname;
    return host !== "localhost" && host !== "127.0.0.1";
  } catch {
    return false;
  }
}

async function assertPreviewDeployReachable(baseURL: string) {
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  const response = await fetch(baseURL, {
    redirect: "manual",
    headers: bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : undefined,
  });
  if (response.status === 401 && response.headers.get("server") === "Vercel") {
    throw new Error(
      "Vercel Deployment Protection returned 401. Set VERCEL_AUTOMATION_BYPASS_SECRET for preview smoke or disable protection on the preview deployment.",
    );
  }
}

// Preview smoke targets the Vercel deploy at PLAYWRIGHT_BASE_URL for ggracelu/whynot (landing, sign-in, protected dashboard redirect).
test.describe("preview smoke", () => {
  test.beforeAll(async ({ baseURL }) => {
    if (!previewDeployConfigured(baseURL)) {
      return;
    }

    await assertPreviewDeployReachable(baseURL!);
  });

  test("landing and public bingo are reachable", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/whynot.");

    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign up|save me a spot/i }).first()).toBeVisible();

    await page.goto("/bingo");
    await expect(page.getByRole("heading", { name: /pick any 4 of 6 experiences/i })).toBeVisible();
  });

  test("sign-in route is reachable", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/whynot.");

    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("dashboard redirects or loads for signed-out users", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/whynot.");

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in|dashboard/);
  });
});
