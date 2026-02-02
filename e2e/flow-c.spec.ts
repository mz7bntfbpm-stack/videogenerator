import { test, expect } from '@playwright/test';

test('Flow C: Flow A + Flow B in one go (Pack, CSV, PDF exports)', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Flow A steps
  await page.fill('input[placeholder="Enter a title for your video"]', 'Flow C - Full Export');
  await page.fill('textarea[placeholder="Describe what you want to create..."]', 'End-to-end Flow C');
  await page.click('button:has-text("Generate Video")');
  await expect(page.locator('text=Video Preview')).toBeVisible({ timeout: 10000 });
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

  // Flow A exports: CSV
  const [pack] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export Pack')
  ]);
  const [csv] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export CSV')
  ]);

  // Flow A finishes; Flow B PDF export
  const [pdf] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export PDF')
  ]);

  expect(await pack.path()).toBeTruthy();
  expect(await csv.path()).toBeTruthy();
  expect(await pdf.path()).toBeTruthy();
});
