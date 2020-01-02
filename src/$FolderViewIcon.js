
function $FolderViewIcon(options){
	// TODO: rename element class to folder-view-icon, or find a better name (maybe desktop-icon and $DesktopIcon are still okay?)
	var $container = $("<div class='desktop-icon' draggable='true'/>");
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container);
	var $icon = options.icon;
	var $selection_effect = $icon.clone().addClass("selection-effect");

	var $title = $("<div class='title'/>").text(options.title);
	$container.append($icon_wrapper, $title);
	$icon_wrapper.append($icon, $selection_effect);

	var src = $icon.attr("src");
	$icon.on("load", function(){
		if($icon.attr("src") !== src){
			src = $icon.attr("src");
			$selection_effect.attr("src", src);
		}
	});
	// TODO: simplify selection effect; don't use a clone, maybe use a canvas; make it work in Edge
	// TODO: handle the loading state display consciously (in a deliberate and intentional way)

	// TODO: or if set to "web" mode, single click
	// also Enter is currently implemented by triggering dblclick which is awkward
	$container.on("dblclick", function(){
		options.open();
	});
	// TODO: allow dragging files off FROM the desktop, with dataTransfer.setData("DownloadURL", ...)
	// sadly will only work for a single file (unless it secretly supports text/uri-list (either as a separate type or for DownloadURL))

	if(options.shortcut){
		$container.addClass("shortcut");
	}
	$container.css({
		position: "absolute",
		width: grid_size_x,
		height: grid_size_y,
	});
	$container[0].dataset.filePath = options.file_path;
	return $container;
}
