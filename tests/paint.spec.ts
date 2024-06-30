import { test, expect } from '@playwright/test';

test('can set wallpaper tiled (and use pencil, fill, and magnifier tools)', async ({ page }) => {
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