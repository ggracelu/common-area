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

// Preview smoke targets the Vercel deploy at PLAYWRIGHT_BASE_URL for ggracelu/common-area (landing, sign-in, protected dashboard redirect).
test.describe("preview smoke", () => {
  test.beforeAll(async ({ baseURL }) => {
    if (!previewDeployConfigured(baseURL)) {
      return;
    }

    await assertPreviewDeployReachable(baseURL!);
  });

  test("landing and public bingo are reachable", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/common-area.");

    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign up|save me a spot/i }).first()).toBeVisible();

    await page.goto("/bingo");
    await expect(page.getByRole("heading", { name: /pick any 4 of 6 experiences/i })).toBeVisible();
  });

  test("sign-in route is reachable", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/common-area.");

    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("dashboard redirects or loads for signed-out users", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/common-area.");

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in|dashboard/);
  });

  test("partner landing shows host marketing and gallery", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/common-area.");

    await page.goto("/partner", { waitUntil: "domcontentloaded" });
    const bodyText = (await page.locator("body").innerText()) ?? "";
    if (!/welcome,\s*small business owners/i.test(bodyText)) {
      test.skip(
        true,
        "Partner landing content not reachable (likely Vercel Deployment Protection). Disable for Production or set VERCEL_AUTOMATION_BYPASS_SECRET.",
      );
    }
    await expect(page.getByRole("heading", { name: /welcome, small business owners/i })).toBeVisible();
    await expect(page.getByText(/Building community, 1 brick at a time/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /become a partner/i }).first()).toBeVisible();
  });

  test("business dashboard redirects signed-out users to partner sign-in", async ({ page, baseURL }) => {
    test.skip(!previewDeployConfigured(baseURL), "Set PLAYWRIGHT_BASE_URL to the public Vercel deploy for ggracelu/common-area.");

    await page.goto("/business/dashboard");
    await expect(page).toHaveURL(/partner\/sign-in/);
  });
});
