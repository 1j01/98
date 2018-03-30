BrowserFS.configure({
	fs: "OverlayFS",
	options: {
		writable: {
			fs: "IndexedDB",
			options: {
				storeName: "C:"
			}
		},
		readable: {
			fs: "XmlHttpRequest",
			options: {
				index: "filesystem-index.json"
			}
		}
	}
	// TODO: mount the repo contents at something like C:\98\
	// but other OS stuff from a subfolder of the repo as root (C? HD? hard-drive? disk? OS?)
	// the desktop at something like.. well I guess C:\98\desktop
	// and I could have the default desktop setup in source control there
}, function (error) {
	if (error) {
		// TODO: message box
		// return console.error(error);
		throw error;
	}
	// var fs = BrowserFS.BFSRequire('fs');
	// window.fs = fs;
	// fs.readdir('/', function (e, contents) {
	// 	// etc.
	// 	console.log(contents);
	// });
});

// TODO: maybe have a withFilesystem function that shows a message if it's not loaded
// have it wait within a global period of time while should be configuring (and not show a message box)
// if it hasn't errored yet or loaded
