import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:1998/');
	await page.getByText('Pipes').dblclick();
});

test('covers the screen', async ({ page }) => {
	const screensaver = page.locator('iframe');
	await expect(await screensaver.boundingBox()).toStrictEqual(await page.locator('body').boundingBox());
});

test('closes when moving the mouse', async ({ page }) => {
	const screensaver = await page.locator('iframe');
	await expect(screensaver).toBeVisible();
	await page.mouse.move(0, 0);
	await page.mouse.move(100, 100);
	await expect(screensaver).not.toBeVisible();
});

test('closes when clicking', async ({ page }) => {
	const screensaver = await page.locator('iframe');
	await expect(screensaver).toBeVisible();
	await page.mouse.click(0, 0);
	await expect(screensaver).not.toBeVisible();
});

test('closes when pressing a key', async ({ page }) => {
	const screensaver = await page.locator('iframe');
	await expect(screensaver).toBeVisible();
	await page.keyboard.press('a');
	await expect(screensaver).not.toBeVisible();
});

test('has an animated canvas', async ({ page }) => {
	const canvas = page.frameLocator('iframe').locator('#canvas-webgl');
	await expect(canvas).toBeVisible();
	const firstFrame = await canvas.screenshot();
	await page.waitForTimeout(200);
	const secondFrame = await canvas.screenshot();
	await page.waitForTimeout(200);
	const thirdFrame = await canvas.screenshot();
	expect(secondFrame).not.toEqual(firstFrame);
	expect(thirdFrame).not.toEqual(secondFrame);
});
