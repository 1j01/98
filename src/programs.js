
function Notepad(){
	var $win = new $IframeWindow("notepad/index.html", "notepad");
	$win.title("untitled - Notepad");
	return new Task($win);
}

function Paint(){
	var $win = new $IframeWindow("jspaint/index.html", "paint");
	$win.title("untitled - Paint");
	return new Task($win);
}

function Minesweeper(){
	var $win = new $IframeWindow("embed-minesweeper.html", "minesweeper");
	$win.title("Minesweeper");
	$win.$iframe.width(280).height(320);
	$win.center();
	return new Task($win);
}

function SoundRecorder(){
	var $win = new $IframeWindow("sound-recorder/index.html", "speaker");
	$win.title("Sound - Sound Recorder");
	$win.$iframe.width(252+10).height(102);
	$win.center();
	return new Task($win);
}

// TODO: use named arguments
// the syntax is currently $DesktopIcon(title, icon_name, exe, is_shortcut)
new $DesktopIcon("My Computer", ("my-computer"), function(){ window.open("https://copy.sh/v86/?profile=windows98"); });
new $DesktopIcon("My Documents", ("my-documents-folder"), function(){ window.open("https://docs.google.com/"); });
new $DesktopIcon("Network Neighborhood", ("network"), function(){ window.open("https://nextdoor.com/"); });
new $DesktopIcon("Recycle Bin", ("recycle-bin"), function(){ window.open("https://www.epa.gov/recycle"); });
new $DesktopIcon("My Pictures", ("folder"), function(){ window.open("http://photos.google.com/"); });
new $DesktopIcon("Internet Explorer", ("internet-explorer"), function(){ window.open("http://modern.ie/"); });
new $DesktopIcon("Paint", ("paint"), Paint, "shortcut");
new $DesktopIcon("Minesweeper", ("minesweeper"), Minesweeper, "shortcut");
new $DesktopIcon("Sound Recorder", ("speaker"), SoundRecorder, "shortcut");
new $DesktopIcon("Notepad", ("notepad"), Notepad, "shortcut");
