import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:1998/');
});

test('can open CREDITS.txt from desktop', async ({ page }) => {
	const responsePromise = page.waitForResponse('**/CREDITS.txt');
	await page.getByText('CREDITS.txt').dblclick();
	// should have taskbar button and application window
	await expect(page.getByRole("button", { name: 'CREDITS.txt - Notepad' })).toBeVisible();
	// await expect(page.getByRole("application", { name: 'CREDITS.txt - Notepad' })).toBeVisible();
	await expect(page.locator('.window-title', { hasText: 'CREDITS.txt - Notepad' })).toBeVisible();
	// should load the file content
	await responsePromise;
	// Ctrl+A or Alt+E, A isn't working to select all text in the test.
	// It works in real life, as far as I see.
	// await page.keyboard.press('Control+A');
	// await page.keyboard.press('Alt+E');
	// await page.keyboard.press('A');
	const rootFolder = require('path').resolve(__dirname, '..');
	const expectedText = require('fs').readFileSync(rootFolder + '/desktop/CREDITS.txt', 'utf8');
	// const actualText = await page.evaluate(() => getSelection()?.toString());
	// const actualText = await page.locator(':focus').textContent();
	// const actualText = await page.frameLocator('iframe').locator(':focus').textContent();
	const actualText = await page.frameLocator('iframe').locator(':focus').evaluate((el: HTMLTextAreaElement) => el.value);
	// expect(actualText).toBe(expectedText);
	// Have to ignore the line endings
	expect(actualText.replace(/\r\n/g, '\n')).toBe(expectedText.replace(/\r\n/g, '\n'));
});
