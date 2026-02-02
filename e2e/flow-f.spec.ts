import { test, expect } from '@playwright/test';

test('Flow F: Health check minimal storyboard with all exports', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Ensure at least one scene exists
  const addBtn = page.locator('text=Add Scene').first();
  if (await addBtn.count()) {
    await addBtn.click();
  }
  // Try auto-generate if available
  const auto = page.locator('text=Auto-Generate').first();
  if (await auto.count()) {
    await auto.click();
  }

  // Generate video and ensure preview loads
  await page.click('text=Generate Video');
  await expect(page.locator('text=Video Preview')).toBeVisible({ timeout: 15000 });

  // Play and scrub roughly
  const playBtn = page.locator('button[aria-label="Play"]').first();
  if (await playBtn.count()) await playBtn.click();
  const seekBar = page.locator('[role="slider"]').first();
  if (await seekBar.count()) {
    const box = await seekBar.boundingBox();
    if (box) {
      const x = box.x + box.width * 0.5;
      const y = box.y + box.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, y);
      await page.mouse.up();
    }
  }

  // Exports in sequence
  const [pack] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export Pack')
  ]);
  const [csv] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export CSV')
  ]);
  const [pdf] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export PDF')
  ]);

  expect(await pack.path()).toBeTruthy();
  expect(await csv.path()).toBeTruthy();
  expect(await pdf.path()).toBeTruthy();
});
