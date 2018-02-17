
function Notepad(){
	var $win = new $IframeWindow({
		src: "notepad/index.html",
		icon: "notepad",
		title: "Untitled - Notepad"
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

arrange_icons();
