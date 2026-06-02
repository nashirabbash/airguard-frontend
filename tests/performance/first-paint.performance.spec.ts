import { expect, test } from '@playwright/test';

test('home page DOM ready stays under threshold', async ({ page }) => {
  await page.goto('/');

  const domReady = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    return nav ? nav.domContentLoadedEventEnd : Number.NaN;
  });

  expect(Number.isFinite(domReady)).toBe(true);
  expect(domReady).toBeLessThan(3000);
});
