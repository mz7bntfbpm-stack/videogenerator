import { test, expect } from '@playwright/test';

test('Flow E: End-to-end with many scenes and all exports (Pack, CSV, PDF)', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Add multiple scenes to stress timeline
  for (let i = 0; i < 8; i++) {
    const addBtn = page.locator('text=Add Scene').first();
    await addBtn.click();
  }

  // Optional: Auto-generate to fill prompts/durations if available
  const autoBtn = page.locator('text=Auto-Generate').first();
  if (await autoBtn.count()) {
    await autoBtn.click();
  }

  // Generate video
  await page.click('text=Generate Video');
  await expect(page.locator('text=Video Preview')).toBeVisible({ timeout: 15000 });

  // Play and scrub to ~50%
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
      await page.mouse.move(box.x + box.width * 0.8, y);
      await page.mouse.up();
    }
  }

  // Exports: Pack, CSV, PDF
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
