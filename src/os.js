
var ICON_SIZES = [16, 32, 48];

var DESKTOP_ICON_SIZE = 32;
var TASKBAR_ICON_SIZE = 16;

function ICONRES(name, size){
	return "images/" + name + "-" + size + "x" + size + ".png";
}

function Task($win){
	var $task = this.$task = $("<button class='task'/>").appendTo($tasks);
	$task.addClass("jspaint-button"); // @TODO: remove jspaintisms
	var $icon = $("<img class='task-icon'/>").attr("src", ICONRES("program", TASKBAR_ICON_SIZE));
	var $title = $("<span class='task-title'/>").text($win.title());
	$task.append($icon, $title);
	$task.on("click", function(){
		$task.toggleClass("selected");
		if($task.hasClass("selected")){
			$win.show();
			$win.triggerHandler("focus");
		}else{
			$win.hide();
			$win.triggerHandler("blur");
		}
	});
	if($win.is(":visible")){
		$task.addClass("selected");
		$win.triggerHandler("focus");
	}
	$win.on("mousedown", function(e){
		$task.addClass("selected");
		$win.triggerHandler("focus");
	});
	$win.on("close", function(){
		$task.remove();
	});
}

function $DesktopIcon(title, icon, exe, is_shortcut){
	var $container = $("<div class='desktop-icon' draggable='true'/>").appendTo($desktop);
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	var $icon = $("<img draggable='false'/>").attr("src", ICONRES(icon || "program", DESKTOP_ICON_SIZE));
	var $title = $("<div class='title'/>").text(title);
	$container.append($icon_wrapper, $title);
	$icon_wrapper.append($icon);
	$container.on("dblclick", function(){
		new exe
	});
	$container.on("mousedown", function(){
		$desktop.find(".desktop-icon").removeClass("selected");
		$container.addClass("selected");
	});
	if(is_shortcut){
		$container.addClass("shortcut");
	}
	
	return $container;
}

function $SeamlessIframe(){
	
	var $iframe = $win.$content.find("iframe");
	var iframe = $iframe[0];
}

function Paint(){
	var $win = new $Window();
	$win.title("untitled - Paint");
	$win.$content.html("<iframe allowfullscreen>");
	var $iframe = $win.$content.find("iframe");
	var iframe = $iframe[0];
	
	var focus_window_contents = function(){
		if(!iframe.contentWindow){return}
		
		iframe.contentWindow.focus();
		setTimeout(function(){
			iframe.contentWindow.focus();
		});
	};
	
	$win.on("focus", focus_window_contents);
	var delegate_mouseup = function(){
		if(!iframe.contentWindow){return}
		if(!iframe.contentWindow.$){return}
		iframe.contentWindow.$("body").trigger("mouseup");
	};
	$G.on("mouseup blur", delegate_mouseup);
	$win.on("close", function(){
		$G.off("mouseup blur", delegate_mouseup);
	});
	// @TODO: delegate mousemove events too?
	
	$iframe
		.on("load", function(){
			iframe.contentWindow.focus();
			//$win.triggerHandler("focus");
			var $body = $(iframe.contentDocument).find("body");
			$body.on("mousedown click", function(e){
				focus_window_contents();
			});
			iframe.contentWindow.close = function(){
				$win.close();
			};
		})
		.attr({
			src: "jspaint/index.html"
		})
		.width(640)
		.height(380)
		.css({
			border: 0,
			//width: "100%",
			//height: "100%",
			verticalAlign: "bottom", // hack to avoid space on the bottom
		});
	
	$win.center();
	
	return new Task($win);
	
}

function Minesweeper(){
	
	return new Task($win);
}


// be creepy
var username_match = location.href.match(/\/Users\/(\w+)\//);
var username = username_match && username_match[1];
// or if we can't...
username = username || "User" || "Admin" || "Win98";


var $desktop = $("<div class='desktop'/>").appendTo("body");
var $start_bar = $("<div class='start-bar'/>").appendTo("body");
var $start_button = $("<button class='start-button'/>").appendTo($start_bar);
//$start_button.html("<img src='"+ICONRES("start", TASKBAR_ICON_SIZE)+"'/><b>Start</b>");
$start_button.html("<img src='images/start.png'/><b>Start</b>");
$start_button.attr("title", "Click here to begin.");

var $tasks = $("<div class='tasks'/>").appendTo($start_bar);

$desktop.on("mousedown", function(){
	$desktop.addClass("selected"); // yes, even the desktop can be selected (given focus)
}); // @TODO: relinquish focus

// Handle selecting icons on the desktop
(function(){
	var $selection = $("<div class='selection'/>").appendTo($desktop).hide();
	var start = {x: 0, y: 0};
	var current = {x: 0, y: 0};
	var dragging = false;
	var update = function(){
		var min_x = Math.min(start.x, current.x);
		var min_y = Math.min(start.y, current.y);
		var max_x = Math.max(start.x, current.x);
		var max_y = Math.max(start.y, current.y);
		$selection.show().css({
			position: "absolute",
			left: min_x,
			top: min_y,
			width: max_x - min_x,
			height: max_y - min_y,
		});
		$desktop.find(".desktop-icon").removeClass("selected").each(function(i, container){
			var rect = container.getBoundingClientRect();
			if(
				rect.left < max_x &&
				rect.top < max_y &&
				rect.right > min_x &&
				rect.bottom > min_y
			){
				$(container).addClass("selected");
			}
		});
	};
	$desktop.on("mousedown", function(e){
		var $icon = $(e.target).closest(".desktop-icon");
		$selection.hide();
		start = {x: e.clientX, y: e.clientY};
		current = {x: e.clientX, y: e.clientY};
		if($icon.length > 0){
			$selection.hide();
		}else{
			dragging = true;
			update();
		}
	});
	$desktop.on("mousemove", function(e){
		current = {x: e.clientX, y: e.clientY};
		if(dragging){
			update();
		}
	});
	$G.on("mouseup blur", function(){
		$selection.hide();
		dragging = false;
	});
})();

// Fix dragging things (like windows) over iframes
$(window).on("mousedown", function(e){
	//console.log(e.type);
	$("body").addClass("drag");
});
$(window).on("mouseup dragend blur", function(e){
	//console.log(e.type);
	$("body").removeClass("drag");
});


new $DesktopIcon("Paint", ("paint"), Paint, "shortcut");
new $DesktopIcon("My Documents", ("my-documents-folder"), function(){});
new $DesktopIcon("Minesweeper", ("minesweeper"), Minesweeper, "shortcut");
new $DesktopIcon("Recycle Bin", ("recycle-bin"), function(){window.open("http://www.dmaresponsibility.org/recycle/")});
new $DesktopIcon("My Computer", ("my-computer"), function(){window.open("http://lmgtfy.com/?q=My+Computer")});
new $DesktopIcon("Network Neighborhood", ("network"), function(){window.open("http://lmgtfy.com/?q=Network+Neighborhood")});
new $DesktopIcon("Internet Explorer", ("internet-explorer"), function(){window.open("http://modern.ie/")});
new $DesktopIcon("My Pictures", ("folder"), function(){window.open("http://images.google.com/")});



