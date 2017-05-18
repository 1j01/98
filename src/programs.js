
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
		title: "untitled - Paint"
		// Note: in Windows 98, "untitled" is lowercase, but maybe we should just make it consistent
	});
	return new Task($win);
}

function Minesweeper(){
	var $win = new $IframeWindow({
		src: "embed-minesweeper.html",
		icon: "minesweeper",
		title: "Minesweeper"
	});
	$win.$iframe.width(280).height(320);
	$win.center();
	return new Task($win);
}

function SoundRecorder(){
	var $win = new $IframeWindow({
		src: "sound-recorder/index.html",
		icon: "speaker",
		title: "Sound - Sound Recorder"
	});
	$win.$iframe.width(252+10).height(102);
	$win.center();
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
