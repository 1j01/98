import { test, expect } from '@playwright/test';

test('can set wallpaper tiled (and use pencil, fill, and magnifier tools)', async ({ page }) => {
	// TODO: make JS Paint work without WebGL, ideally (for tests and for users)
	// [JavaScript Warning: "Failed to create WebGL context: WebGL creation failed:
	// * WebglAllowWindowsNativeGl:false restricts context creation on this system. ()
	// * Exhausted GL driver options. (FEATURE_FAILURE_WEBGL_EXHAUSTED_DRIVERS)" {file: "http://localhost:1998/programs/jspaint/src/image-manipulation.js" line: 1407}]
	test.skip(!!process.env.CI, 'needs WebGL; could maybe run headed or enable software rendering somehow?');

	await page.goto('http://localhost:1998/');
	await page.getByText('Paint').dblclick();
	await page.getByText('Image', { exact: true }).click();
	await page.getByText('Attributes...').click();
	const appFrame = await page.frameLocator('.window iframe');
	await appFrame.getByLabel('Width:').fill('10');
	// FIXME: tab isn't working (an actual bug in the app, not the test)
	// await appFrame.getByLabel('Width:').press('Tab');
	// await page.keyboard.press('Tab');
	// await expect(appFrame.getByLabel('Height:')).toBeFocused();
	await appFrame.getByLabel('Height:').fill('10');
	await appFrame.getByLabel('Height:').press('Enter');
	await appFrame.getByTitle('Magnifier').click();
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 6,
			y: 5
		}
	});
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 5,
			y: 3
		}
	});
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 11,
			y: 7
		}
	});
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 16,
			y: 10
		}
	});
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 26,
			y: 5
		}
	});
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 30,
			y: 3
		}
	});
	await appFrame.getByTitle('Fill With Color').click();
	await appFrame.locator('.swatch:nth-child(18)').click();
	await appFrame.locator('.main-canvas').click({
		position: {
			x: 22,
			y: 32
		}
	});
	await page.getByRole('menuitem', { name: 'File' }).click();
	await page.getByText('Set As Wallpaper (Tiled)').click();
	await expect(page.locator('.desktop')).toHaveCSS('background-image', /url\("blob:http:\/\/localhost:1998\/.+"\)/);
	const backgroundData = await page.locator('.desktop').evaluate((el: HTMLDivElement) => {
		const style = window.getComputedStyle(el);
		const url = style.backgroundImage.slice(5, -2);
		const image = new Image();
		const promise = new Promise((resolve) => {
			image.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(image, 0, 0, image.width, image.height);
				const data = ctx.getImageData(0, 0, image.width, image.height).data;
				resolve(Array.from(data));
			}
		});
		image.src = url;
		return promise;
	});

	// could use toMatchSnapshot here instead of inlining the data
	const expected = [255, 255, 0, 255, 0, 0, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 0, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 0, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 0, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 0, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255];
	await expect(backgroundData).toEqual(expected);
});

test('can open a file dropped onto the desktop', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', 'Webkit does not support DataTransferItemList fully');
	await page.goto('http://localhost:1998/');
	const file = require('path').resolve(__dirname, '..', 'images', 'start.png');

	// Load the file into a Buffer.
	const buffer = require('fs').readFileSync(file);
	// Create the DataTransfer and File
	const dataTransfer = await page.evaluateHandle((hexString) => {
		const dt = new DataTransfer();
		// Convert the hex string to a File
		const array = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
		const file = new File([array], 'start.png', { type: 'image/png' });
		dt.items.add(file);
		return dt;
	}, buffer.toString('hex'));
	// Now dispatch
	// I'm not really testing the dragover unless I check that it's prevented...
	// await page.locator('html').dispatchEvent('dragover', { dataTransfer: { types: ['Files'] } });
	await page.locator('.desktop .folder-view').dispatchEvent('drop', { dataTransfer, clientX: 200, clientY: 200 });
	await page.getByText('start.png').dblclick();
	// FIXME: the window title isn't being set
	// await expect(page.getByRole('button', { name: 'start.png - Paint' })).toBeVisible();
	// await expect(page.locator('.window-title', { hasText: 'start.png - Paint' })).toBeVisible();
	const appFrame = await page.frameLocator('.window iframe');
	await expect(appFrame.locator('.main-canvas')).toHaveAttribute('width', '16');
	await expect(appFrame.locator('.main-canvas')).toHaveAttribute('height', '14');
	// const canvasData = await appFrame.locator('.main-canvas').evaluate((el: HTMLCanvasElement) => {
	// 	const ctx = el.getContext('2d')!;
	// 	const data = ctx.getImageData(0, 0, el.width, el.height).data;
	// 	return Array.from(data);
	// });
});