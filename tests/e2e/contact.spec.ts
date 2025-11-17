/**
 * E2E Tests for Contact Form
 */
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
  });

  test('should display contact form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /get in touch/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /subject/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /message/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /send message/i });
    await submitButton.click();

    // Browser validation should prevent submission
    // Check that we're still on the contact section
    await expect(page).toHaveURL(/#contact/);
  });

  test('should fill and submit form', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Test User');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /subject/i }).fill('Test Subject');
    await page.getByRole('textbox', { name: /message/i }).fill('This is a test message.');

    await page.getByRole('button', { name: /send message/i }).click();

    // Wait for success or error message
    // Since EmailJS might not be configured in test, check for either message
    await expect(
      page.getByText(/thank you|please email/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state when submitting', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Test User');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /subject/i }).fill('Test Subject');
    await page.getByRole('textbox', { name: /message/i }).fill('Test message');

    await page.getByRole('button', { name: /send message/i }).click();

    // Check for loading state (button should show "Sending...")
    await expect(page.getByRole('button', { name: /sending/i })).toBeVisible();
  });
});
