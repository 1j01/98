// TODO: include jquery and stuff; maybe even update script tags in html, with CDN URLs, integrity checksums, and fallbacks

const { copyFileSync, mkdirSync } = require("fs");
// TODO: probably don't need fs-extra these days, could use fs.cp/copyFile instead
const { copySync, readFileSync, writeFileSync } = require("fs-extra");
const { basename, join } = require("path");

const copy = (from, toDir) => {
	const to = join(toDir, basename(from));
	console.log(`Copying ${from} => ${to}`);
	copySync(from, to);
};
const copyFile = (fromFile, toFile) => {
	console.log(`Copying ${fromFile} => ${toFile}`);
	mkdirSync(join(toFile, ".."), { recursive: true });
	copyFileSync(fromFile, toFile);
};

copy("node_modules/os-gui/build/windows-98.css", "lib/os-gui/");
copy("node_modules/os-gui/build/windows-98.css.map", "lib/os-gui/");
copy("node_modules/os-gui/build/layout.css", "lib/os-gui/");
copy("node_modules/os-gui/build/layout.css.map", "lib/os-gui/");
copy("node_modules/os-gui/build/windows-default.css", "lib/os-gui/");
copy("node_modules/os-gui/build/windows-default.css.map", "lib/os-gui/");
copy("node_modules/os-gui/build/peggys-pastels.css", "lib/os-gui/");
copy("node_modules/os-gui/build/peggys-pastels.css.map", "lib/os-gui/");
copy("node_modules/os-gui/parse-theme.js", "lib/os-gui/");
copy("node_modules/os-gui/$MenuBar.js", "lib/os-gui/");
copy("node_modules/os-gui/MenuBar.js", "lib/os-gui/");
copy("node_modules/os-gui/$Window.js", "lib/os-gui/");

// For ZenFS, I had to build it manually with `target: 'es2022'` in `scripts/build.js`
// since it's using `using`, a bleeding edge keyword for resource management.
// While I was at it, I changed the name to `zenfs-browser.js` and disabled minification.
// copyFile("node_modules/@zenfs/core/dist/browser.min.js", "lib/zenfs/zenfs-browser.min.js");
// // I renamed the JS file, but it will still point to the original map file
// // unless I patch it like I did with Webamp
// copyFile("node_modules/@zenfs/core/dist/browser.min.js.map", "lib/zenfs/browser.min.js.map");

// copyFile("node_modules/@zenfs/dom/dist/browser.min.js", "lib/zenfs/zenfs-dom-browser.min.js");
console.log(`Copying ZenFS DOM, updating sourceMappingURL...`);
writeFileSync("lib/zenfs/zenfs-dom-browser.min.js", readFileSync("node_modules/@zenfs/dom/dist/browser.min.js", "utf8").replace("//# sourceMappingURL=browser.min.js.map", "//# sourceMappingURL=zenfs-dom-browser.min.js.map"), "utf8");
copyFile("node_modules/@zenfs/dom/dist/browser.min.js.map", "lib/zenfs/zenfs-dom-browser.min.js.map");

// copy("node_modules/webamp/built/webamp.bundle.js", "programs/winamp/lib/");
// copy("node_modules/webamp/built/webamp.bundle.min.js", "programs/winamp/lib/");
// copy("node_modules/webamp/built/webamp.bundle.min.js.map", "programs/winamp/lib/");
copy("node_modules/butterchurn/lib/butterchurn.min.js", "programs/winamp/lib/");
copy("node_modules/butterchurn-presets/lib/butterchurnPresets.min.js", "programs/winamp/lib/");

const copy_and_monkey_patch_webamp = (file_name) => {
	const from = `node_modules/webamp/built/${file_name}`;
	const to = `programs/winamp/lib/${file_name}`;
	console.log(`Monkey patching and copying ${from} => ${to}`);
	let js = readFileSync(from, "utf8");
	js = js.replace(/((\w|\.)+)\.render\(\)/g, "(monkey_patch_render($1))");
	js = js.replace("//# sourceMappingURL=webamp.bundle.min.js.map", ""); // lastIndexOf + slice would be way more efficient but WHERE WE'RE GOING, WE DON'T NEED SPEED
	writeFileSync(to, js, "utf8");
};
copy_and_monkey_patch_webamp("webamp.bundle.js");
copy_and_monkey_patch_webamp("webamp.bundle.min.js");

console.log(`Done.

Note: This script doesn't handle updating npm dependencies, it just copies scripts into the repo.`);
