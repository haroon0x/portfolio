import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const disableAnimations = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await page.waitForTimeout(200);
};

test.describe('core routes', () => {
  test('home renders and has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /building intelligent/i })).toBeVisible();
    await page.waitForTimeout(1400);
    await disableAnimations(page);

    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? '')
    );
    expect(seriousOrCritical).toEqual([]);
  });

  test('pull requests page renders key section', async ({ page }) => {
    await page.goto('/pull-requests');
    await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
  });

  test('pull requests page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/pull-requests');
    await page.waitForTimeout(1400);
    await disableAnimations(page);

    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? '')
    );
    expect(seriousOrCritical).toEqual([]);
  });

  test('unknown route shows custom 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { level: 1, name: /page not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /go back home/i })).toBeVisible();
  });

  test('favicon and og image are served', async ({ page }) => {
    expect((await page.request.get('/favicon.svg')).ok()).toBeTruthy();
    expect((await page.request.get('/og-card.png')).ok()).toBeTruthy();
  });

  test('mobile menu opens and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only interaction');
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('dialog').getByRole('link', { name: /pull requests/i }).click();
    await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
  });

  test('PR status filter narrows the list', async ({ page }) => {
    await page.goto('/pull-requests');
    await page.getByRole('button', { name: /show merged pull requests/i }).click();
    const nonMergedChips = page.locator('a:has(h3) >> text=/^(Open|Closed)$/');
    await expect(nonMergedChips).toHaveCount(0);
  });

  test('reduced motion hides petals', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const petal of await page.getByTestId('petal-layer').all()) {
      await expect(petal).toBeHidden();
    }
  });
});
