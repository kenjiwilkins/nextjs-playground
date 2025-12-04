import { test, expect } from "@playwright/test"

test("should display main content", async ({ page }) => {
  await page.goto("/")

  // Check that the main heading is visible.
  await expect(page.getByRole("heading", { name: /Developer & Book Lover/i })).toBeVisible()
})
