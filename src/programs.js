
function Notepad(file_spec){
	var document_title = file_spec ? file_spec.name : "Untitled";
	var win_title = document_title + " - Notepad";

	var $win = new $IframeWindow({
		src: "notepad/index.html" + (file_spec ? ("?" + file_spec.name) : ""),
		icon: "notepad",
		title: win_title
	});
	return new Task($win);
}

function Paint(){
	var $win = new $IframeWindow({
		src: "jspaint/index.html",
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
		src: "embed-minesweeper.html",
		icon: "minesweeper",
		title: "Minesweeper",
		innerWidth: 280,
		innerHeight: 320
	});
	return new Task($win);
}

function SoundRecorder(){
	var $win = new $IframeWindow({
		src: "sound-recorder/index.html",
		icon: "speaker",
		title: "Sound - Sound Recorder",
		innerWidth: 252+10,
		innerHeight: 102
	});
	return new Task($win);
}

var winamp_bundle_loaded = false;
var load_winamp_bundle_if_not_loaded = function(callback){
	if(winamp_bundle_loaded){
		callback();
	}else{
		// $.getScript("winamp/lib/winamp.bundle.js", callback);
		$.getScript("winamp/lib/winamp.bundle.min.js", callback);
	}
}
function openWinamp(){
	load_winamp_bundle_if_not_loaded(function(){
		const winamp = new winamp2js({
			initialTracks: [{
				metaData: {
					artist: "DJ Mike Llama",
					title: "Llama Whippin' Intro",
				},
				url: "winamp/mp3/llama-2.91.mp3"
			}],
			initialSkin: {
				url: "winamp/skins/base-2.91.wsz"
			},
			enableHotkeys: true // Enable hotkeys
		});
		
		var container = document.createElement("div");
		container.classList.add("winamp-container");
		document.body.appendChild(container);
		// Render after the skin has loaded.
		var renderPromise = winamp.renderWhenReady(container);

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
		new Task($win_for_Task);
		// a close event would be nice ;)
		renderPromise.then(function(){
			var iid = setInterval(function(){
				if($win_for_Task.find("[role=application]").length === 0){
					clearInterval(iid);
					$win_for_Task.triggerHandler("close");
				}
			}, 50);
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
function Links(){
	var $win = new $Window({
		icon: "internet-folder",
		title: "Links",
		innerWidth: 640,
		innerHeight: 480
	});
	return new Task($win);
}
*/

withFilesystem(function(){
	var fs = BrowserFS.BFSRequire('fs');
	fs.readdir(desktop_folder_path, function (error, contents) {
		if(error){
			alert("Failed to read desktop directory contents!");
			throw error;
		}
		
		for(var i = 0; i < contents.length; i++){
			var fname = contents[i];
			var path = desktop_folder_path + fname;
			var x = Math.random() * innerWidth;
			var y = Math.random() * innerHeight;
			// add_icon_for_bfs_file(path, x, y);
			add_icon_for_bfs_file(fname, x, y);
		}
		arrange_icons();
	});
});

function executeFile(file_path){
	// execute file with default handler
	// like the START command in CMD.EXE
	// TODO: check if it's a folder
	var file_extension = (file_path.match(/\.(\w+)$/) || ["this feels a bit hacky :(", ""])[1];
	if(file_extension){
		alert("Looks like a "+file_extension+" file");
	}else{
		alert("That sure is a file"); // except that it's not necessesarily (not to mention a/an)
	}		
	// TODO
}

// TODO: base all the desktop icons off of the filesystem
new $DesktopIcon({
	title: "My Computer",
	icon: "my-computer",
	open: function(){ window.open("https://copy.sh/v86/?profile=windows98"); }
});
new $DesktopIcon({
	title: "My Documents",
	icon: "my-documents-folder",
	open: function(){ window.open("https://docs.google.com/"); }
});
new $DesktopIcon({
	title: "Network Neighborhood",
	icon: "network",
	open: function(){ window.open("https://nextdoor.com/"); }
});
new $DesktopIcon({
	title: "Recycle Bin",
	icon: "recycle-bin",
	open: function(){ window.open("https://www.epa.gov/recycle/"); }
});
new $DesktopIcon({
	title: "My Pictures",
	icon: "folder",
	open: function(){ window.open("https://photos.google.com/"); }
});
new $DesktopIcon({
	title: "Internet Explorer",
	icon: "internet-explorer",
	open: function(){ window.open("http://modern.ie/"); }
});
new $DesktopIcon({
	title: "Paint",
	icon: "paint",
	open: Paint,
	shortcut: true
});
new $DesktopIcon({
	title: "Minesweeper",
	icon: "minesweeper",
	open: Minesweeper,
	shortcut: true
});
new $DesktopIcon({
	title: "Sound Recorder",
	icon: "speaker",
	open: SoundRecorder,
	shortcut: true
});
new $DesktopIcon({
	title: "Notepad",
	icon: "notepad",
	open: Notepad,
	shortcut: true
});
new $DesktopIcon({
	title: "Winamp",
	icon: "winamp2",
	open: openWinamp,
	shortcut: true
});
// new $DesktopIcon({
// 	title: "Links",
// 	icon: "internet-folder",
// 	open: Links
// });

var add_icon_for_file_spec = function(file_spec){
	new $DesktopIcon({
		title: file_spec.name,
		icon: "notepad-file",
		open: function(){
			// TODO: base off the filesystem!
			localStorage["notepad:" + file_spec.name] = file_spec.content;
			return Notepad(file_spec);
		}
	});
};
// TODO: use the virtual filesystem!
add_icon_for_file_spec({
	name: "CREDITS.txt",
	content: `Hello! Welcome to 98.
https://github.com/1j01/98

--------------------------------------

Minesweeper by Jon Ziebell
	https://github.com/ziebelje/minesweeper

Winamp2-js by Jordan Eldredge
	https://github.com/captbaritone/winamp2-js

Paint, Sound Recorder, Notepad, and the 98 desktop by Isaiah Odhner
	https://github.com/1j01/98
	https://github.com/1j01/jspaint


Images and other assets from Microsoft.
Microsoft® and other trademarks are respective of their own respective holders, respectively, in the United States and/or other countries, respectively.

--------------------------------------

(This file is not editable.)
`
});
/*

--------------------------------------

Libraries used:
jQuery, Pointer Events Polyfil, ah, so many...
and should I include the licenses of all of them??

--------------------------------------
*/

arrange_icons();
