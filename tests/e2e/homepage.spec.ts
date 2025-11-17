/**
 * E2E Tests for Homepage
 */
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dark Echology/i);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');

    // Check for navigation links
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /blog/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');

    // Click on About link
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/#about/);

    // Click on Services link
    await page.getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/#services/);

    // Click on Blog link
    await page.getByRole('link', { name: /blog/i }).click();
    await expect(page).toHaveURL(/#blog/);

    // Click on Contact link
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/#contact/);
  });

  test('should have responsive design', async ({ page, viewport }) => {
    await page.goto('/');

    if (viewport && viewport.width < 768) {
      // Mobile: hamburger menu should be visible
      await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    } else {
      // Desktop: navigation links should be visible
      await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    }
  });
});
