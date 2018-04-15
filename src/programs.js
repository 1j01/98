
function Notepad(file_path){
	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in $IframeWindow)
	var document_title = file_path ? file_name_from_path(file_path) : "Untitled";
	var win_title = document_title + " - Notepad";
	// TODO: focus existing window if file is currently open?

	var $win = new $IframeWindow({
		src: "programs/notepad/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icon: "notepad",
		title: win_title
	});
	return new Task($win);
}
Notepad.acceptsFilePaths = true;

function Paint(){
	var $win = new $IframeWindow({
		src: "programs/jspaint/index.html",
		icon: "paint",
		// NOTE: in Windows 98, "untitled" is lowercase, but TODO: we should just make it consistent
		title: "untitled - Paint"
	});

	var contentWindow = $win.$iframe[0].contentWindow;

	var waitUntil = function(test, interval, callback){
		if(test()){
			callback();
		}else{
			setTimeout(waitUntil, interval, test, interval, callback);
		}
	};

	// it seems like I should be able to use onload here, but when it works (overrides the function),
	// it for some reason *breaks the scrollbar styling* in jspaint
	// I don't know what's going on there

	// contentWindow.addEventListener("load", function(){
	// $(contentWindow).on("load", function(){
	// $win.$iframe.load(function(){
	// $win.$iframe[0].addEventListener("load", function(){
	waitUntil(function(){
		return contentWindow.set_as_wallpaper_centered;
	}, 500, function(){
		// TODO: maybe save the wallpaper in localStorage
		// TODO: maybe use blob URL (if only to not take up so much space in the inspector)
		contentWindow.systemSetAsWallpaperCentered = function(canvas){
			$desktop.css({
				backgroundImage: "url(" + canvas.toDataURL() + ")",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
			});
		};
		contentWindow.systemSetAsWallpaperTiled = function(canvas){
			$desktop.css({
				backgroundImage: "url(" + canvas.toDataURL() + ")",
				backgroundRepeat: "repeat",
			});
		};
	});
	
	return new Task($win);
}

function Minesweeper(){
	var $win = new $IframeWindow({
		src: "programs/minesweeper/index.html",
		icon: "minesweeper",
		title: "Minesweeper",
		innerWidth: 280,
		innerHeight: 320
	});
	return new Task($win);
}

function SoundRecorder(file_path){
	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in $IframeWindow)
	var document_title = file_path ? file_name_from_path(file_path) : "Sound";
	var win_title = document_title + " - Sound Recorder";
	// TODO: focus existing window if file is currently open?
	var $win = new $IframeWindow({
		src: "programs/sound-recorder/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icon: "speaker",
		title: win_title,
		innerWidth: 252+10,
		innerHeight: 102
	});
	return new Task($win);
}
SoundRecorder.acceptsFilePaths = true;

function Explorer(address){
	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in $IframeWindow)
	var document_title = address;
	var win_title = document_title;
	// TODO: focus existing window if folder is currently open
	var $win = new $IframeWindow({
		src: "programs/explorer/index.html" + (address ? ("?address=" + address) : ""),
		icon: "folder-open",
		title: win_title,
		innerWidth: 500,
		innerHeight: 500,
	});
	return new Task($win);
}
Explorer.acceptsFilePaths = true;

var webamp_bundle_loaded = false;
var load_winamp_bundle_if_not_loaded = function(callback){
	// FIXME: webamp_bundle_loaded not actually set to true when loaded
	// TODO: also maybe handle already-loading-but-not-done
	if(webamp_bundle_loaded){
		callback();
	}else{
		// $.getScript("winamp/lib/webamp.bundle.js", callback);
		$.getScript("programs/winamp/lib/webamp.bundle.min.js", callback);
	}
}
function openWinamp(){
	load_winamp_bundle_if_not_loaded(function(){
		const webamp = new Webamp({
			initialTracks: [{
				metaData: {
					artist: "DJ Mike Llama",
					title: "Llama Whippin' Intro",
				},
				url: "programs/winamp/mp3/llama-2.91.mp3"
			}],
			initialSkin: {
				url: "programs/winamp/skins/base-2.91.wsz"
			},
			enableHotkeys: true
		});
		
		var container = document.createElement("div");
		container.classList.add("webamp-container");
		document.body.appendChild(container);
		// Render after the skin has loaded.
		var renderPromise = webamp.renderWhenReady(container);

		// TODO: handle blurring (currently one of the winamp windows is always selected)
		// (but I don't really handle blurring for regular windows yet, so maybe I should do that first!)
		
		// TODO: refactor for less hackiness
		var $win_for_Task = $(container);
		$win_for_Task.title = function(title){
			if(title !== undefined){
				// this probably shouldn't ever happen
			}else{
				return "Winamp";
			}
		};
		$win_for_Task.icon_name = "winamp2";
		var task = new Task($win_for_Task);
		webamp.onClose(function(){
			// simulating $Window.close() except not allowing canceling close event (generally used *by* an application (for "Save changes?"), not outside of it)
			$win_for_Task.triggerHandler("close");
			$win_for_Task.triggerHandler("closed");
			$(container).remove();
		});
		webamp.onMinimize(function(){
			// TODO: refactor
			task.$task.trigger("click");
		});
		
		// Bring window to front, initially and when clicked
		// copied from $Window.js, with `left: 0, top: 0` added
		// (because it's a container rather than a window,
		// and needs the left top origin for positioning the window)
		$win_for_Task.css({
			position: "absolute",
			left: 0,
			top: 0,
			zIndex: $Window.Z_INDEX++
		});
		$win_for_Task.bringToFront = function(){
			$win_for_Task.css({
				zIndex: $Window.Z_INDEX++
			});
		};
		$win_for_Task.on("pointerdown", function(){
			$win_for_Task.bringToFront();
		});

	});
}

/*
function saveAsDialog(){
	var $win = new $Window();
	$win.title("Save As");
	return $win;
}
function openFileDialog(){
	var $win = new $Window();
	$win.title("Open");
	return $win;
}
*/

function openURLFile(file_path){
	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire("fs");
		fs.readFile(file_path, "utf8", function(err, content){
			if(err){
				return alert(err);
			}
			// it's supposed to be an ini-style file, but lets handle files that are literally just a URL as well, just in case
			var match = content.match(/URL\s*=\s*([^\n\r]+)/i);
			var url = match ? match[1] : content;
			Explorer(url);
		});
	});
}
openURLFile.acceptsFilePaths = true;

var file_extension_associations = {
	"": Notepad,
	txt: Notepad,
	md: Notepad,
	json: Notepad,
	js: Notepad,
	css: Notepad,
	html: Notepad,
	gitattributes: Notepad,
	gitignore: Notepad,
	png: Paint,
	jpg: Paint,
	jpeg: Paint,
	gif: Paint,
	webp: Paint,
	bmp: Paint,
	tif: Paint,
	tiff: Paint,
	wav: SoundRecorder,
	mp3: openWinamp,
	htm: Explorer,
	html: Explorer,
	url: openURLFile,
};

// Note: global executeFile called by explorer
function executeFile(file_path){
	// execute file with default handler
	// like the START command in CMD.EXE
	
	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire("fs");
		fs.stat(file_path, function(err, stats){
			if(err){
				return alert("Failed to get info about " + file_path + "\n\n" + err);
			}
			if(stats.isDirectory()){
				Explorer(file_path);
			}else{
				var file_extension = file_extension_from_path(file_path);
				var program = file_extension_associations[file_extension];
				if(program){
					if(!program.acceptsFilePaths){
						alert(program.name + " does not support opening files via the virtual filesystem yet");
						return;
					}
					program(file_path);
				}else{
					alert("No program is associated with "+file_extension+" files");
				}
			}
		});
	});
}

// TODO: base all the desktop icons off of the filesystem
// Note: `C:\Windows\Desktop` doesn't contain My Computer, My Documents, Network Neighborhood, Recycle Bin, or Internet Explorer,
// or Connect to the Internet, or Setup MSN Internet Access,
// whereas `Desktop` does (that's the full address it shows; it's one of them "special locations")
var add_icon_not_via_filesystem = function(options){
	options.icon = $Icon(options.icon, DESKTOP_ICON_SIZE);
	new $FolderViewIcon(options).appendTo($folder_view);
};
add_icon_not_via_filesystem({
	title: "My Computer",
	icon: "my-computer",
	open: function(){ executeFile("/"); },
});
add_icon_not_via_filesystem({
	title: "My Documents",
	icon: "my-documents-folder",
	open: function(){ executeFile("/my-documents"); },
});
add_icon_not_via_filesystem({
	title: "Network Neighborhood",
	icon: "network",
	open: function(){ executeFile("/network-neighborhood"); },
});
add_icon_not_via_filesystem({
	title: "Recycle Bin",
	icon: "recycle-bin",
	open: function(){ Explorer("https://www.epa.gov/recycle/"); }
});
add_icon_not_via_filesystem({
	title: "My Pictures",
	icon: "folder",
	open: function(){ executeFile("/my-pictures"); },
});
add_icon_not_via_filesystem({
	title: "Internet Explorer",
	icon: "internet-explorer",
	open: function(){ Explorer("https://www.google.com/"); }
});
add_icon_not_via_filesystem({
	title: "Paint",
	icon: "paint",
	open: Paint,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Minesweeper",
	icon: "minesweeper",
	open: Minesweeper,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Sound Recorder",
	icon: "speaker",
	open: SoundRecorder,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Notepad",
	icon: "notepad",
	open: Notepad,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Winamp",
	icon: "winamp2",
	open: openWinamp,
	shortcut: true
});

$folder_view.arrange_icons();
