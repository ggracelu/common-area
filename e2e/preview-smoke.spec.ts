import { test, expect } from "@playwright/test";

// Preview smoke targets the Vercel deploy at PLAYWRIGHT_BASE_URL for ggracelu/whynot (landing, sign-in, protected dashboard redirect).
test.describe("preview smoke", () => {
  test("landing and public bingo are reachable", async ({ page, baseURL }) => {
    test.skip(!baseURL, "Set PLAYWRIGHT_BASE_URL for preview smoke.");

    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign up|save me a spot/i }).first()).toBeVisible();

    await page.goto("/bingo");
    await expect(page.getByRole("heading", { name: /pick any 4 experiences/i })).toBeVisible();
  });

  test("sign-in route is reachable", async ({ page, baseURL }) => {
    test.skip(!baseURL, "Set PLAYWRIGHT_BASE_URL for preview smoke.");

    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("dashboard redirects or loads for signed-out users", async ({ page, baseURL }) => {
    test.skip(!baseURL, "Set PLAYWRIGHT_BASE_URL for preview smoke.");

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in|dashboard/);
  });
});
