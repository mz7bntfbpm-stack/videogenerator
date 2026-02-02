import { test, expect } from '@playwright/test';

test('Flow D: Stress test with many scenes and all exports', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Add 25 scenes to stress timeline
  for (let i = 0; i < 25; i++) {
    await page.click('text=Add Scene');
  }
  // Fill in video metadata minimally
  await page.fill('input[placeholder="Enter a title for your video"]', 'Flow D Stress Test');
  await page.fill('textarea[placeholder="Describe what you want to create..."]', 'End-to-end stress test with many scenes');
  await page.click('button:has-text("Generate Video")');
  await expect(page.locator('text=Video Preview')).toBeVisible({ timeout: 15000 });
  // Export sequence
  const [pack] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export Pack')
  ]);
  const packPath = await pack.path();
  expect(packPath).toBeTruthy();

  const [csv] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export CSV')
  ]);
  const csvPath = await csv.path();
  expect(csvPath).toBeTruthy();

  const [pdf] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export PDF')
  ]);
  const pdfPath = await pdf.path();
  expect(pdfPath).toBeTruthy();
});
