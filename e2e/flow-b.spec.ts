import { test, expect } from '@playwright/test';

test('Flow B: create by UI, preview, export PDF', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Create via UI (reuse fields)
  await page.fill('input[placeholder="Enter a title for your video"]', 'Flow B - PDF Path');
  await page.fill('textarea[placeholder="Describe what you want to create..."]', 'End-to-end flow B');
  await page.click('button:has-text("Generate Video")');

  // Ensure Video Preview is visible
  await expect(page.locator('text=Video Preview')).toBeVisible({ timeout: 10000 });

  // Export PDF
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Export PDF')
  ]);
  const path = await download.path();
  expect(path).not.toBeNull();
});
