import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:1998/');
});

test('can open My Computer and select a file in it and start to rename it', async ({ page }) => {
	// open file explorer
	await page.getByText('My Computer').dblclick();
	// wait for the folder contents to load
	const appFrameLocator = page.frameLocator('iframe');
	await expect(appFrameLocator.getByText(/^\d+ object\(s\)$/)).toBeVisible();
	// try to select the file
	const folderFrameLocator = appFrameLocator.frameLocator('iframe');
	await folderFrameLocator.getByText('index.html').click();
	// "index.html" should be shown in the sidebar now
	await expect(folderFrameLocator.getByText('index.html')).toHaveCount(2);
	const iconLocator = folderFrameLocator.locator('.desktop-icon').filter({ hasText: 'index.html' });
	await expect(iconLocator).toHaveClass(/(^|\s)selected(\s|$)/);
	// avoid double click
	await page.waitForTimeout(1000);
	// single click selected item to start renaming
	await iconLocator.click();
	await expect(folderFrameLocator.getByRole('textbox')).toBeFocused();
	await expect(folderFrameLocator.getByRole('textbox')).toHaveValue('index.html');
});
