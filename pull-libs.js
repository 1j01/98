// TODO: include jquery and stuff; maybe even update script tags in html, with CDN URLs, integrity checksums, and fallbacks

const {copySync} = require("fs-extra");

const copySyncAndLog = (from, to)=> {
	console.log(`Copying ${from} => ${to}`);
	copySync(from, to);
};

copySyncAndLog("node_modules/webamp/built/webamp.bundle.js", "programs/winamp/lib/webamp.bundle.js");
copySyncAndLog("node_modules/webamp/built/webamp.bundle.min.js", "programs/winamp/lib/webamp.bundle.min.js");
copySyncAndLog("node_modules/browserfs/dist/browserfs.js", "lib/browserfs.js");
copySyncAndLog("node_modules/browserfs/dist/browserfs.min.js", "lib/browserfs.min.js");
copySyncAndLog("node_modules/butterchurn/lib/butterchurn.min.js", "programs/winamp/lib/butterchurn.min.js");
copySyncAndLog("node_modules/butterchurn-presets/lib/butterchurnPresets.min.js", "programs/winamp/lib/butterchurnPresets.min.js");
console.log(`Done.

Note: This script doesn't handle updating npm dependencies, just copying scripts into the repo.`);
