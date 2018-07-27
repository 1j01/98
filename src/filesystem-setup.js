
var __fs_initialized;
var __fs_errored;
var __fs_timed_out;
var __fs_waiting_callbacks = [];

const desktop_folder_path = "/desktop/";

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
				index: "/filesystem-index.json",
				baseUrl: "/"
			}
		}
	}
	// TODO: mount the repo contents at something like C:\98\
	// but other OS stuff from a subfolder of the repo as root (C? HD? hard-drive? disk? OS?)
	// the desktop at something like.. well I guess C:\98\desktop
	// and I could have the default desktop setup in source control there
}, function (error) {
	if (error) {
		__fs_errored = true;
		if(__fs_waiting_callbacks.length){
			// TODO: DRY (can probably simplify this logic significantly)
			alert("The filesystem is not available. It failed to initialize.");
		}
		__fs_waiting_callbacks = [];
		// TODO: message box; offer to reset the filesystem
		throw error;
	}
	__fs_initialized = true;
	for(var i=0; i<__fs_waiting_callbacks.length; i++){
		__fs_waiting_callbacks[i]();
	}
	__fs_waiting_callbacks = [];
});

setTimeout(function(){
	__fs_timed_out = true;
	if(__fs_waiting_callbacks.length){
		// TODO: DRY (can probably simplify this logic significantly)
		alert("The filesystem is not working.");
	}
	__fs_waiting_callbacks = [];
}, 5000);

function withFilesystem(callback){
	if(__fs_initialized){
		callback();
	}else if(__fs_errored){
		alert("The filesystem is not available. It failed to initialize.");
	}else if(__fs_timed_out){
		alert("The filesystem is not working.");
	}else{
		// wait within a global period of time while it should be configuring (and not show a message box)
		// TODO: hm, maybe a global timeout isn't what we want
		// The desktop should load, regardless of how long it takes.
		// Other operations could fail in a second or more. Depending on the operation.
		__fs_waiting_callbacks.push(callback);
	}
}
// TODO: never use alert(); use thematic, non-blocking dialog windows, preferably with warning and error icons
// I have a show_error_message in jspaint, but with no warning or error icons - as of writing; see https://github.com/1j01/jspaint/issues/84

function file_name_from_path(file_path){
	return file_path.split("\\").pop().split("/").pop();
}

function file_extension_from_path(file_path){
	return (file_path.match(/\.(\w+)$/) || [, ""])[1];
}
