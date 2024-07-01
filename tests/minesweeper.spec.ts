import { test, expect } from '@playwright/test';

test.describe('Minesweeper', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:1998/');
		await page.getByText('Minesweeper').dblclick();
	});

	test.skip('timer is initially paused', async ({ page }) => {
		// The timer is rendered with a table and CSS sprites, so it's hard to test.
		// Would be cool to use OCR, but probably impractical.
		// But who knows, maybe there's a good lightweight OCR library that could
		// hook right up to Playwright's screenshot API.
		const appFrame = await page.frameLocator('.window iframe');
		await expect(appFrame.locator('.timer').first()).toHaveText('000');
		await page.waitForTimeout(1000);
		await expect(appFrame.locator('.timer').first()).toHaveText('000');
	});

	test.skip('timer starts when clicking a square', async ({ page }) => {
		// The timer is rendered with a table and CSS sprites, so it's hard to test.
		const appFrame = await page.frameLocator('.window iframe');
		await expect(appFrame.locator('.timer').first()).toHaveText('000');
		await appFrame.locator('tr:nth-child(13) > td:nth-child(12)').click();
		await expect(appFrame.locator('.timer').first()).not.toHaveText('000');
	});

	test.skip('timer stops at 999', async ({ page }) => {
		// The timer is rendered with a table and CSS sprites, so it's hard to test.
		const appFrame = await page.frameLocator('.window iframe');
		await appFrame.locator('tr:nth-child(13) > td:nth-child(12)').click();
		// <TODO: skip clock ahead by a few minutes here>
		await expect(appFrame.locator('.timer').first()).not.toHaveText('999');
	});

	test('smiley shows worry while clicking a square', async ({ page }) => {
		const appFrame = await page.frameLocator('.window iframe');
		await appFrame.locator('tr:nth-child(13) > td:nth-child(12)').hover();
		await page.mouse.down();
		// could benefit from [data-test-id]
		// also, a screenshot test would be better, to ignore implementation details
		const smiley = appFrame.locator('[style*="center"] [style*="26px"][style*="sprite.png"]');
		await expect(smiley).toHaveCSS('background-position', '-52px -55px');
	});

	// TODO: test...
	// - smiley expression on win (sunglasses) / lose (dead)
	// - flagging a square, flagging as unsure, and unflagging (tri-state) with right-click
	// - uncovering tiles (including cascading)
	// - uncovering 3x3 area by pressing both mouse buttons
	// - smiley button should restart the game
	// - FIXME: smiley button should not show as pressed on hover
	// - FIXME: should not be able to "switch which mine was blown up" after game is lost
	// - count of mines left should decrease when flagging a square
	// - grid sizes: 9x9, 16x16, 16x30, TODO: custom
});
