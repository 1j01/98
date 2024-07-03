// TODO: include jquery and stuff; maybe even update script tags in html, with CDN URLs, integrity checksums, and fallbacks

const { readFileSync, writeFileSync, mkdirSync, copyFileSync } = require("fs");
// TODO: probably don't need fs-extra these days, could use fs.cp/copyFile[Sync] instead
const { copySync } = require("fs-extra");
const { dirname, basename, join } = require("path");

const copy = (from, toDir) => {
	const to = join(toDir, basename(from));
	console.log(`Copying ${from} => ${to}`);
	copySync(from, to);
};
const copyFile = (fromFile, toFile) => {
	console.log(`Copying ${fromFile} => ${toFile}`);
	mkdirSync(dirname(toFile), { recursive: true });
	copyFileSync(fromFile, toFile);
}
const reSourceMapComment = /\/\/# sourceMappingURL=(.*)/;
const copyJS = (fromFile, toFile, monkeyPatch) => {
	// If monkey patching, remove the source map comment and don't copy the source map file.
	// Otherwise, copy the source map file and update the source map comment with the new file name.
	
	let js = readFileSync(fromFile, "utf8");

	// const sourceMapCommentMatch = js.match(reSourceMapComment); // might match the wrong sourceMappingURL comment
	// `lastIndexOf` + `slice` matches the correct line if there are multiple sourceMappingURL comments, and is more efficient
	const sourceMapCommentIndex = js.lastIndexOf("//# sourceMappingURL=");
	const sourceMapCommentMatch = sourceMapCommentIndex !== -1 ? js.slice(sourceMapCommentIndex).match(reSourceMapComment) : null;

	mkdirSync(dirname(toFile), { recursive: true });

	if (monkeyPatch) {
		console.log(`Monkey patching and copying ${fromFile} => ${toFile}`);
		// Order matters. Must not apply monkey patch in between getting index and slicing on it.
		if (sourceMapCommentMatch) {
			// js = js.replace(reSourceMapComment, ""); // might match the wrong sourceMappingURL comment
			js = js.slice(0, sourceMapCommentIndex) + js.slice(sourceMapCommentIndex + sourceMapCommentMatch[0].length);
		}
		js = monkeyPatch(js);
	} else {
		const originalSourceMapFileName = sourceMapCommentMatch[1];
		const newSourceMapFileName = basename(toFile) + ".map";
		let newSourceMapComment = `//# sourceMappingURL=${newSourceMapFileName}`;
		if (sourceMapCommentMatch) {
			try {
				copyFile(
					join(dirname(fromFile), originalSourceMapFileName),
					join(dirname(toFile), newSourceMapFileName)
				);
			} catch (error) {
				if (error.code === "ENOENT") {
					console.warn(`⚠️ WARNING: Source map file not found: ${join(dirname(fromFile), originalSourceMapFileName)}`);
					newSourceMapComment = "";
				} else {
					throw error;
				}
			}
		}
		if (sourceMapCommentMatch && originalSourceMapFileName !== newSourceMapFileName) {
			if (newSourceMapComment) {
				console.log(`Updating sourceMappingURL and copying ${fromFile} => ${toFile}`);
			} else {
				console.log(`Removing sourceMappingURL and copying ${fromFile} => ${toFile}`);
			}
			// js = js.replace(reSourceMapComment, newSourceMapComment); // might match the wrong sourceMappingURL comment
			js = js.slice(0, sourceMapCommentIndex) + newSourceMapComment + js.slice(sourceMapCommentIndex + sourceMapCommentMatch[0].length);
		} else {
			console.log(`Copying ${fromFile} => ${toFile}`);
		}
	}
	writeFileSync(toFile, js, "utf8");
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

copyJS("node_modules/@zenfs/core/dist/browser.min.js", "lib/zenfs/zenfs-core-browser.min.js");
copyJS("node_modules/@zenfs/dom/dist/browser.min.js", "lib/zenfs/zenfs-dom-browser.min.js");

// copy("node_modules/webamp/built/webamp.bundle.js", "programs/winamp/lib/");
// copy("node_modules/webamp/built/webamp.bundle.min.js", "programs/winamp/lib/");
// copy("node_modules/webamp/built/webamp.bundle.min.js.map", "programs/winamp/lib/");
copy("node_modules/butterchurn/lib/butterchurn.min.js", "programs/winamp/lib/");
copy("node_modules/butterchurn-presets/lib/butterchurnPresets.min.js", "programs/winamp/lib/");

for (const file_name of ["webamp.bundle.js", "webamp.bundle.min.js"]) {
	// Monkey patch Webamp for a fun visual effect.
	copyJS(`node_modules/webamp/built/${file_name}`, `programs/winamp/lib/${file_name}`, (js) =>
		js.replace(/((\w|\.)+)\.render\(\)/g, "(monkey_patch_render($1))")
	);
}


console.log(`Done.

Note: This script doesn't handle updating npm dependencies, it just copies scripts into the repo.`);
