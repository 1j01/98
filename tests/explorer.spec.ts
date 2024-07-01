import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:1998/');
});

test('can open My Computer and select a file in it and start to rename it', async ({ page }) => {
	// open file explorer
	await page.getByText('My Computer').dblclick();
	// wait for the folder contents to load
	const appFrameLocator = page.frameLocator('iframe');
	await expect(appFrameLocator.getByText(/^\d+ object\(s\)$/)).toBeVisible({ timeout: 15000 });
	// try to select the file
	const folderFrameLocator = appFrameLocator.frameLocator('iframe');
	await folderFrameLocator.getByText('index.html').click();
	// "index.html" should be shown in the sidebar now
	await expect(folderFrameLocator.getByText('index.html')).toHaveCount(2);
	const iconLocator = folderFrameLocator.locator('.desktop-icon').filter({ hasText: 'index.html' });
	await expect(iconLocator).toHaveClass(/(^|\s)selected(\s|$)/);
	// the file name should not be editable yet
	await expect(folderFrameLocator.getByRole('textbox')).not.toBeVisible();
	// avoid double click
	await page.waitForTimeout(1000);
	// single click selected item to start renaming
	await iconLocator.click();
	await expect(folderFrameLocator.getByRole('textbox')).toBeFocused();
	await expect(folderFrameLocator.getByRole('textbox')).toHaveValue('index.html');
});

test('can open My Computer and rename a file with F2', async ({ page }) => {
	// open file explorer (somewhat via keyboard)
	// FIXME: https://github.com/1j01/98/issues/96
	// await page.getByText('My Computer').click();
	// await page.keyboard.press('Enter');
	await page.getByText('My Computer').dblclick();
	// wait for the folder contents to load
	const appFrameLocator = page.frameLocator('iframe');
	await expect(appFrameLocator.getByText(/^\d+ object\(s\)$/)).toBeVisible({ timeout: 15000 });
	// select a file
	const folderFrameLocator = appFrameLocator.frameLocator('iframe');
	await folderFrameLocator.getByText('CONTRIBUTING.md').click();
	// "CONTRIBUTING.md" should be shown in the sidebar now
	await expect(folderFrameLocator.getByText('CONTRIBUTING.md')).toHaveCount(2);
	const iconLocator = folderFrameLocator.locator('.desktop-icon').filter({ hasText: 'CONTRIBUTING.md' });
	await expect(iconLocator).toHaveClass(/(^|\s)selected(\s|$)/);
	// rename the file
	await page.keyboard.press('F2');
	await expect(folderFrameLocator.getByRole('textbox')).toBeFocused();
	await expect(folderFrameLocator.getByRole('textbox')).toHaveValue('CONTRIBUTING.md');
	await folderFrameLocator.getByRole('textbox').fill('I_CONTRIBUTED_haha.md');
	await page.keyboard.press('Enter');
	// the file should be renamed now
	await expect(folderFrameLocator.getByText('I_CONTRIBUTED_haha.md')).toBeVisible();
	// sidebar doesn't update (this matches Windows 98 behavior so it's totally a feature not a bug)
	// await expect(folderFrameLocator.getByText('CONTRIBUTING.md')).not.toBeVisible();
	await expect(folderFrameLocator.getByText('CONTRIBUTING.md')).toHaveCount(1);
	// the file should still be selected
	await expect(folderFrameLocator.locator('.desktop-icon').filter({ hasText: 'I_CONTRIBUTED_haha.md' })).toHaveClass(/(^|\s)selected(\s|$)/);
	// the file name should not be editable anymore
	await expect(folderFrameLocator.getByRole('textbox')).not.toBeVisible();
	// the rename should persist
	await page.reload();
	// open file explorer again
	await page.getByText('My Computer').dblclick();
	// wait for the folder contents to load
	test.fixme(true, 'It gets an error "unlock of a non-locked mutex" when loading the folder contents again.');
	await expect(appFrameLocator.getByText(/^\d+ object\(s\)$/)).toBeVisible({ timeout: 15000 });
	// the file should still be renamed
	await expect(folderFrameLocator.getByText('I_CONTRIBUTED_haha.md')).toBeVisible();
	await expect(folderFrameLocator.getByText('CONTRIBUTING.md')).toHaveCount(0);
});

// TODO: test... (items marked with TODO are not yet implemented)
// - renaming a file/folder
//   - TODO: handle naming constraints (e.g. disallowing slashes)
//   - TODO: handle naming conflicts (disallowing duplicates)
// - TODO: creating a new file/folder
//   - TODO: handle naming constraints (e.g. disallowing slashes)
//   - TODO: handle naming conflicts (disallowing duplicates)
// - deleting a file/folder
//   - confirmation dialog
//     - TODO: with permanent vs. recycle bin variants; permanent with Shift+Delete or when out of space
//   - FIXME: `.deletedFiles.log` should not show up in the root folder (or be requested over HTTP)
//   - TODO: recycle bin
//     - TODO: restoring a file/folder
//     - TODO: emptying the recycle bin
// - TODO: creating and following file/folder shortcuts
//   - TODO: handling broken shortcuts
// opening files (partially tested)
//   - unknown/unsupported file type
// - TODO: copy/cut/paste
//   - TODO: handling conflicts
// - TODO: undo/redo
// - TODO: drag and drop (arrangement, or to move/copy)
//   - between Explorer windows, and between Explorer and the desktop
//   - handle drag onto same folder it's in
//   - handle drag folder inside itself
// - sorting by name, date, size
// - TODO: search (Tools > Find > ...)
// - view modes (list, details, large icons, small icons)
// - TODO: viewing file properties
// - visiting named locations, like "Recycle Bin"
// - TODO: opening a file with a specific application?
// - back/forward/up navigation
// - selecting multiple items
//   - Ctrl for toggle
//   - Shift for range
//   - Select All
//   - Invert Selection
// - keyboard navigation (Home, End, Page Up, Page Down, arrow keys)
// - TODO: context menus
//   - drag and drop with right click opens a context menu with Move Here, Copy Here, Create Shortcut Here | Cancel
// - toggling folder template (View > as Web Page)
// - loading websites (Explorer acts as a web browser and file manager)
// - integration with the real filesystem
//   - drag and drop from real OS to the web desktop
//     (tested in paint.spec.ts)
//   - TODO: drag and drop from the web desktop to the real OS
//     (iirc there's a Chrome-only feature for this?)
//   - TODO: an option to mount a real folder into the virtual filesystem
//     (something like Tools > Map Network Drive)
// - File > Work Offline
// - history shown back button dropdown
// - TODO: show history in File menu too
// - TODO: favorites
// - rearranging toolbars
