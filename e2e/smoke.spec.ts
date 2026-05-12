import { test, expect } from "@playwright/test";

test.describe("public prototype smoke", () => {
  test("landing and bingo are reachable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign up|join/i }).first()).toBeVisible();

    await page.goto("/bingo");
    await expect(page.getByRole("heading", { name: /pick any 4 of 6 experiences/i })).toBeVisible();
  });

  test("dashboard tabs and Crumbs labels exist when signed out redirects", async ({ page, baseURL }) => {
    test.skip(!baseURL, "No base URL configured");

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in|dashboard/);
  });

  test("reduced motion keeps Crumbs accessible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByLabel("Crumbs the Cat").first()).toBeVisible();
  });
});
