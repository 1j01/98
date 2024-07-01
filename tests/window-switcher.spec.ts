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

test.describe('window switching', () => {
	test('Alt+Tab switches between windows (if the keys reach the page)', async ({ page }) => {
		// FIXME: doesn't work with Minesweeper or Paint, I had to substitute Sound Recorder
		await page.getByText("Sound Recorder").dblclick();
		// wait for first window to avoid race condition where either window can have focus
		await expect(page.locator('.window')).toBeVisible();
		await page.getByText("Notepad").dblclick();
		await expect(page.locator('.window')).toHaveCount(2);
		await expect(page.locator('.window').nth(0)).toBeVisible();
		await expect(page.locator('.window').nth(1)).toBeVisible();

		await expect(page.locator('.window', { hasText: "Notepad" })).toHaveClass(/focused/);

		await page.keyboard.down('Alt');
		await page.keyboard.press('Tab');
		await expect(page.locator('.window-switcher')).toBeVisible();
		await page.keyboard.up('Alt');
		await expect(page.locator('.window-switcher')).not.toBeVisible();
		await expect(page.locator('.window', { hasText: "Sound Recorder" })).toHaveClass(/focused/);

		await page.keyboard.down('Alt');
		await page.keyboard.press('Tab');
		await page.keyboard.up('Alt');
		await expect(page.locator('.window', { hasText: "Notepad" })).toHaveClass(/focused/);
	});
	// TODO: test...
	// - Alt+Shift+Tab switches in reverse order
	// - wrapping around the end of the list
	// - releasing Alt before pressing Tab
	// - pressing Tab multiple times
	// - alternative shortcuts for window switching (Alt+1, Alt+`)
	// - switching to a window that's minimized
	// - z-order of windows (bringing to front when switching)
	// - switching between windows with the same title?
	// - window switcher UI's list of icons (with border around selection), preview of window title
	// - behavior when pressing other keys? esc? enter?
});
