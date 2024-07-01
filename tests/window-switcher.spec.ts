import { test, expect, Page, Browser } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:1998/');
});

async function simulateAltTabLosingFocus(page: Page, browser: Browser) {
	// If you Alt+Tab, the operating system will switch windows,
	// un-focusing the browser window.
	await page.keyboard.down('Alt');
	// await page.dispatchEvent('html', 'focusout', { bubbles: true });
	// await page.dispatchEvent('html', 'blur');
	// await page.locator('html').blur();
	// await page.evaluate(() => { blur(); });
	// const newPage = await browser.newPage();
	// await newPage.goto('about:blank');
	// await newPage.focus('html');
	// await newPage.waitForTimeout(1000); // time for interval to detect focus loss
	// await newPage.close();
	// None of the above work; maybe Playwright forces the page to be considered focused?
	// But I can mock the API used to detect focus loss.
	await page.evaluate(() => {
		document.hasFocus = () => false;
	});
}

test.describe('keyboard shortcut hint', () => {
	test('Clippy tells you how to Alt+Tab if you try to Alt+Tab', async ({ page, browser }) => {
		// Open two windows to switch between
		await page.getByText("Minesweeper").dblclick();
		await page.getByText("Notepad").dblclick();
		await expect(page.locator('.window')).toHaveCount(2);
		await expect(page.locator('.window').nth(0)).toBeVisible();
		await expect(page.locator('.window').nth(1)).toBeVisible();

		await simulateAltTabLosingFocus(page, browser);
		await expect(page.locator('.clippy')).toBeVisible();
		await expect(page.locator('.clippy-balloon')).toHaveText(/It looks like you're trying to switch windows/);
		// TODO: test followup where Clippy commends you for successfully using the shortcut
	});

	test('Clippy doesn\'t show if you Alt+Tab with less than two windows', async ({ page, browser }) => {
		// Open only one window
		await page.getByText("Minesweeper").dblclick();
		await expect(page.locator('.window')).toHaveCount(1);
		await expect(page.locator('.window')).toBeVisible();

		await simulateAltTabLosingFocus(page, browser);
		await expect(page.locator('.clippy')).toHaveCount(0);
		await expect(page.locator('.clippy-balloon')).toHaveCount(0);
		await page.waitForTimeout(1000);
		await expect(page.locator('.clippy')).toHaveCount(0);
		await expect(page.locator('.clippy-balloon')).toHaveCount(0);
	});
});

test('Clippy doesn\'t show if you Alt+Tab with less than two windows', async ({ page, browser }) => {
	// Open only one window
	await page.getByText("Minesweeper").dblclick();
	await expect(page.locator('.window')).toHaveCount(1);
	await expect(page.locator('.window')).toBeVisible();

	await simulateAltTabLosingFocus(page, browser);
	await expect(page.locator('.clippy')).toHaveCount(0);
	await expect(page.locator('.clippy-balloon')).toHaveCount(0);
	await page.waitForTimeout(1000);
	await expect(page.locator('.clippy')).toHaveCount(0);
	await expect(page.locator('.clippy-balloon')).toHaveCount(0);
});
