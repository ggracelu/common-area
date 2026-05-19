import { test, expect, type Page } from "@playwright/test";
import { graderCredentialsConfigured, graderStorageReady } from "./fixtures/auth";

async function pickActivityTile(page: Page, index: number) {
  const tile = page.locator("button").filter({ hasText: "Activity" }).nth(index);
  await tile.click();
  const select = page.getByRole("button", { name: /Select \(counts toward 4\)/ });
  if (await select.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await select.click();
  }
  const close = page.getByTestId("bingo-tile-close");
  await expect(close).toBeVisible({ timeout: 10_000 });
  await close.click();
  await expect(close).toBeHidden({ timeout: 10_000 });
}

test.describe("grader onboarding journey", () => {
  test.beforeEach(({ page }) => {
    test.skip(!graderCredentialsConfigured(), "Set GRADER_CLERK_EMAIL and GRADER_CLERK_PASSWORD in .env.local.");
    test.skip(!graderStorageReady(), "Grader auth storage missing; global setup should create e2e/fixtures/grader-storage.json.");
    page.on("dialog", (dialog) => dialog.accept());
  });

  test("deposit, picks, matching, reveal, cohort, chat, bingo, and undo regression", async ({ page }) => {
    test.setTimeout(180_000);
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/dashboard");
    await expect(page.getByTestId("grader-onboarding-checklist")).toBeVisible();
    await expect(page.getByText("Saved to your account")).toBeVisible();
    await page.getByTestId("grader-reset-journey").click();
    await expect(page.getByTestId("grader-checklist-deposit")).toContainText("Pending", { timeout: 30_000 });
    await expect(page.getByTestId("grader-checklist-picks")).toContainText("Pending", { timeout: 30_000 });

    await page.goto("/bingo", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Draft signup card")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("bingo-board")).toBeVisible();

    const activityTiles = page.locator("button").filter({ hasText: "Activity" });
    await expect(activityTiles).toHaveCount(6, { timeout: 15_000 });
    for (let i = 0; i < 4; i += 1) {
      await pickActivityTile(page, i);
    }

    await expect(page.getByTestId("bingo-board").getByText(/Saved to your account/i)).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Ready to submit" }).click();
    await expect(page.getByTestId("join-season-deposit")).toBeVisible({ timeout: 20_000 });
    await page.getByTestId("join-season-deposit").click();
    const checkoutResponse = await page.waitForResponse(
      (response) => response.url().includes("/api/checkout") && response.request().method() === "POST",
    );
    expect([200, 501]).toContain(checkoutResponse.status());
    await expect(
      page.getByTestId("bingo-deposit-handoff").locator("p.text-lg.font-semibold").filter({ hasText: /^Paid/ }),
    ).toBeVisible({ timeout: 20_000 });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("grader-checklist-deposit")).toContainText("Done", { timeout: 30_000 });
    await expect(page.getByTestId("grader-checklist-picks")).toContainText("Done", { timeout: 30_000 });
    await expect(page.getByTestId("grader-checklist-matching")).toContainText("Done", { timeout: 45_000 });

    await page.getByTestId("dashboard-tab-future").click();
    await expect(page.getByTestId("cohort-reveal-letter")).toBeVisible();
    await page.getByRole("button", { name: "Enter your common room" }).click();
    await page.reload();
    await expect(page.getByTestId("grader-checklist-letter")).toContainText("Done", { timeout: 30_000 });

    await page.goto("/cohort");
    await expect(page.getByTestId("cohort-roster")).toBeVisible({ timeout: 15_000 });

    await page.goto("/chat");
    const icebreaker = page.getByTestId("chat-icebreaker-onboarding");
    if (await icebreaker.isVisible().catch(() => false)) {
      await page.getByTestId("chat-icebreaker-option-snack").click();
      await page.getByTestId("chat-icebreaker-answer").fill("Frozen grapes with Tajín — grader snack canon.");
      await page.getByTestId("chat-icebreaker-submit").click();
    }
    await expect(page.getByTestId("chatroom-experience")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("cohort-chat-demo-label")).toBeVisible();
    await expect(page.getByTestId("cohort-chat-demo-label")).toContainText(
      /Postgres-backed cohort thread|Chat persistence unavailable|Demo chat thread/i,
    );

    await page.goto("/bingo");
    await expect(page.getByTestId("bingo-bonus-save-status")).toBeVisible({ timeout: 15_000 });
    const bonusTile = page.locator("button").filter({ hasText: "Bonus" }).first();
    await bonusTile.click();
    await page.getByRole("button", { name: /stamp this square/i }).click();
    await expect(page.getByTestId("bingo-bonus-save-status")).toContainText(/saved to your account/i, {
      timeout: 20_000,
    });
    await page.reload();
    await bonusTile.click();
    await expect(page.getByRole("button", { name: /unstamp/i })).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByTestId("grader-undo-matching")).toBeVisible();
    await page.getByTestId("grader-undo-matching").click();
    await page.goto("/cohort");
    await expect(page.getByText(/matching is in progress|not assigned yet/i)).toBeVisible();

    await page.goto("/dashboard");
    await page.getByTestId("grader-undo-reveal").click();
    await expect(page.getByTestId("grader-checklist-letter")).toContainText("Pending", { timeout: 30_000 });

    await page.goto("/dashboard");
    await page.getByTestId("grader-reset-journey").click();
    await expect(page.getByTestId("grader-checklist-deposit")).toContainText("Pending", { timeout: 30_000 });
  });
});
