import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:1998/');
	await page.getByText('Calculator').dblclick();
});

test('can do some math', async ({ page, browserName }) => {
	// TODO: test error handling in case WebAssembly isn't supported
	test.skip(browserName === 'webkit', 'WebAssembly not supported in WebKit');
	await page.frameLocator('iframe').getByRole('button', { name: '1' }).click();
	await page.frameLocator('iframe').getByLabel('add').click();
	await page.frameLocator('iframe').getByRole('button', { name: '2' }).click();
	await page.frameLocator('iframe').getByLabel('equals').click();
	await expect(page.frameLocator('iframe').getByRole('textbox')).toHaveValue('3');
});
