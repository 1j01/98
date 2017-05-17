
var $desktop = $(".desktop");
$desktop.attr("touch-action", "none");

$desktop.on("pointerdown", function(){
	$desktop.addClass("selected"); // yes, even the desktop can be selected (given focus)
}); // @TODO: relinquish focus

// TODO: take options object instead
function $DesktopIcon(title, icon_name, exe, is_shortcut){
	var $container = $("<div class='desktop-icon' draggable='true'/>").appendTo($desktop);
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	var $icon = $Icon(icon_name || "task", DESKTOP_ICON_SIZE).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	var $title = $("<div class='title'/>").text(title);
	$container.append($icon_wrapper, $title);
	$icon_wrapper.append($icon);
	$container.on("dblclick", function(){
		new exe
	});
	$container.on("pointerdown", function(){
		$desktop.find(".desktop-icon").removeClass("selected");
		$container.addClass("selected");
	});
	if(is_shortcut){
		$container.addClass("shortcut");
	}
	
	return $container;
}

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
