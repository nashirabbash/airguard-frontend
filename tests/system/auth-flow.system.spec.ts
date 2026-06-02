import { expect, test } from '@playwright/test';

test('auth form enforces required fields and supports mode switch', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'MASUK' }).click();
  await expect(page.getByText('ERR: USERNAME & PASSWORD WAJIB DIISI')).toBeVisible();

  await page.getByRole('button', { name: 'BELUM ADA AKUN? DAFTAR' }).click();
  await expect(page.getByRole('button', { name: 'DAFTAR' })).toBeVisible();
});
