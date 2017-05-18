
var $desktop = $(".desktop");
$desktop.attr("touch-action", "none");

$desktop.on("pointerdown", function(){
	$desktop.addClass("selected"); // yes, even the desktop can be selected (given focus)
}); // @TODO: relinquish focus

var grid_size_x = 80;
var grid_size_y = 80;

function $DesktopIcon(options){
	var $container = $("<div class='desktop-icon' draggable='true'/>").appendTo($desktop);
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	var $icon = $Icon(options.icon || "task", DESKTOP_ICON_SIZE).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	var $title = $("<div class='title'/>").text(options.title);
	$container.append($icon_wrapper, $title);
	$icon_wrapper.append($icon);
	$container.on("dblclick", function(){
		options.open();
	});
	$container.on("pointerdown", function(){
		$desktop.find(".desktop-icon").removeClass("selected");
		$container.addClass("selected");
	});
	if(options.shortcut){
		$container.addClass("shortcut");
	}
	return $container;
}

var arrange_icons = function(){
	var x = 0;
	var y = 0;
	$(".desktop-icon").each(function(){
		$(this).css({
			position: "absolute",
			width: grid_size_x,
			height: grid_size_y,
			left: x,
			top: y,
		});
		y += grid_size_y;
		if(y + grid_size_y > innerHeight){
			x += grid_size_x;
			y = 0;
		}
	});
};

// NOTE: in Windows, icons only get moved if they go offscreen (by maybe half the grid size)
$(window).on("resize", arrange_icons);

// Handle selecting icons on the desktop
// TODO: keyboard support
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
	$desktop.on("pointerdown", function(e){
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
	$desktop.on("pointermove", function(e){
		current = {x: e.clientX, y: e.clientY};
		if(dragging){
			update();
		}
	});
	$G.on("pointerup blur", function(){
		$selection.hide();
		dragging = false;
	});
})();
