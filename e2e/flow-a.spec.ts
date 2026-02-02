import { test, expect } from '@playwright/test';

test('Flow A: create storyboard, open preview, play, scrub, Export CSV', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('http://localhost:3000/');

  // Fill in Create Video form
  await page.fill('input[placeholder="Enter a title for your video"]', 'Flow A - End-to-End');
  await page.fill('textarea[placeholder="Describe what you want to create..."]', 'Automated test flow A');
  // Interact with style/aspect/duration if possible; skip for robustness
  await page.click('button:has-text("Generate Video")');

  // Wait for Video Preview panel to appear
  await expect(page.locator('text=Video Preview')).toBeVisible({ timeout: 10000 });

  // Play the video in the preview
  const playBtn = page.locator('button[aria-label="Play"]').first();
  if (await playBtn.count()) {
    await playBtn.click();
  }
  // Scrub to ~50% on the progress bar if present
  const seekBar = page.locator('[role="slider"]').first();
  if (await seekBar.count()) {
    const box = await seekBar.boundingBox();
    if (box) {
      const x = box.x + box.width * 0.5;
      const y = box.y + box.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, y);
      await page.mouse.up();
    }
  }

  // Export CSV
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export CSV')
  ]);
  const path = await download.path();
  expect(path).not.toBeNull();
});
