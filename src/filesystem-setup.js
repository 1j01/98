/*
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
}, function (error) {
	if (error) {
		// TODO: message box
		// return console.error(error);
		throw error;
	}
	var fs = BrowserFS.BFSRequire('fs');
	fs.readdir('/', function (e, contents) {
		// etc.
	});
});
*/
