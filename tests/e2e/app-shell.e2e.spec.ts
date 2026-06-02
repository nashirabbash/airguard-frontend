import { expect, test } from '@playwright/test';

test('shows app shell and auth screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('AIR MONITOR')).toBeVisible();
  await expect(page.getByText('OTENTIKASI SISTEM')).toBeVisible();
});
