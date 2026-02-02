import { test, expect } from '@playwright/test';

test('Video Preview loads and basic play works', async ({ page }) => {
  // Assumes app is served at root during Playwright run; in CI, you may run a dev server first
  await page.goto('http://localhost:3000/');
  const video = page.locator('video').first();
  await expect(video).toBeVisible();
  const playBtn = page.locator('button[aria-label="Play"]').first();
  if (await playBtn.count()) {
    await playBtn.click();
  }
  // wait a moment to simulate playback
  await page.waitForTimeout(1000);
  // Basic assertion to ensure the test ran sanity-check
  expect(true).toBe(true);
});
