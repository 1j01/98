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
	// [JavaScript Warning: "Failed to create WebGL context: WebGL creation failed: 
	// * WebglAllowWindowsNativeGl:false restricts context creation on this system. ()
	// * Exhausted GL driver options. (FEATURE_FAILURE_WEBGL_EXHAUSTED_DRIVERS)" {file: "https://cdnjs.cloudflare.com/ajax/libs/three.js/98/three.min.js" line: 178}]
	test.skip(!!process.env.CI, 'needs WebGL; could maybe run headed or enable software rendering somehow?');

	// Not every frame may be different from the last (sometimes pipes are offscreen),
	// so just check that we get enough unique frames to know it's animating.
	// This assumes `toDataURL` is deterministic, otherwise it could pass with a static image.
	// I tested the test by disabling animation in the screensaver and it failed correctly.
	const canvas = page.frameLocator('iframe').locator('#canvas-webgl');
	await expect(canvas).toBeVisible();
	expect(await canvas.evaluate((canvas: HTMLCanvasElement) => {
		const frames = new Set();
		return new Promise((resolve) => {
			function animate() {
				frames.add(canvas.toDataURL());
				const uniqueFrames = frames.size;
				if (uniqueFrames > 10) {
					resolve(uniqueFrames);
				} else {
					requestAnimationFrame(animate);
				}
			}
			animate();
		});
	})).toBeGreaterThan(10);
});
