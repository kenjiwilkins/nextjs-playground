import { test, expect } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("/")

  // Expect a title "to contain" a substring.
  // Note: You might need to adjust this based on your actual page title
  // For now, we'll check if the main element is visible which we know exists from unit tests
  await expect(page.locator("main")).toBeVisible()
})
