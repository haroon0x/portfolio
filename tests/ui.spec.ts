import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('core routes', () => {
  test('home renders and has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /building ambitious systems, end to end/i })).toBeVisible();
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

  test('pull requests direct route survives refresh', async ({ page }) => {
    await page.goto('/pull-requests');
    await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/\/pull-requests$/);
    await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
  });

  test('unknown route shows custom 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { level: 1, name: /page not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /go back home/i })).toBeVisible();
  });

  test('mobile menu opens and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only interaction');
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    const navigation = page.getByRole('navigation', { name: /mobile navigation/i });
    await expect(navigation).toBeVisible();
    await navigation.getByRole('link', { name: /pull requests/i }).click();
    await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
  });

  test('PR status filter narrows the list', async ({ page }) => {
    await page.goto('/pull-requests');
    await page.getByRole('button', { name: /show merged pull requests/i }).click();
    await expect(page.getByRole('button', { name: /show merged pull requests/i })).toBeVisible();
    const results = page.getByRole('region', { name: /pull requests/i });
    await expect(results.getByText('Merged', { exact: true }).first()).toBeVisible();
    await expect(results.getByText(/^(Open|Closed)$/, { exact: true })).toHaveCount(0);
  });

  test('favicon and og image are served', async ({ page }) => {
    const fav = await page.request.get('/favicon.svg');
    expect(fav.ok()).toBeTruthy();
    const og = await page.request.get('/og-card.png');
    expect(og.ok()).toBeTruthy();
  });

  test('pull requests page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/pull-requests');
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
});
