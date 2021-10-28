// TODO: include jquery and stuff; maybe even update script tags in html, with CDN URLs, integrity checksums, and fallbacks

const { copySync, readFileSync, writeFileSync } = require("fs-extra");
const { basename, join } = require("path");

const copy = (from, toDir) => {
	const to = join(toDir, basename(from));
	console.log(`Copying ${from} => ${to}`);
	copySync(from, to);
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
copy("node_modules/browserfs/dist/browserfs.js", "lib/");
copy("node_modules/browserfs/dist/browserfs.js.map", "lib/");
copy("node_modules/browserfs/dist/browserfs.min.js", "lib/");
copy("node_modules/browserfs/dist/browserfs.min.js.map", "lib/");
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
