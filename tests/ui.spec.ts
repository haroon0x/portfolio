import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('core routes', () => {
  test('home renders and has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /building intelligent/i })).toBeVisible();
    await page.waitForTimeout(1400);
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `,
    });
    await page.waitForTimeout(200);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = accessibilityScanResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? '')
    );
    expect(seriousOrCritical).toEqual([]);
  });

  test('pull requests page renders key section', async ({ page }) => {
    await page.goto('/pull-requests');
    await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
  });

  test('unknown route shows custom 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { level: 1, name: /page not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /go back home/i })).toBeVisible();
  });
});
