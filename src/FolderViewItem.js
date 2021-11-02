
function FolderViewItem(options) {
	// TODO: rename CSS class to folder-view-item, or find a better name
	var $container = $("<div class='desktop-icon' draggable='true'/>");
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container);
	var $icon = options.icon;
	var $selection_effect = $("<div class='selection-effect'/>");

	var $title = $("<div class='title'/>").text(options.title);
	$container.append($icon_wrapper, $title);
	$icon_wrapper.append($icon, $selection_effect);

	var src = $icon.attr("src");
	if (src) {
		$selection_effect[0].style.setProperty("--icon-image", `url("${src}")`);
	}
	$icon.on("load", function () {
		if ($icon.attr("src") !== src) {
			src = $icon.attr("src");
			$selection_effect[0].style.setProperty("--icon-image", `url("${src}")`);
		}
	});
	// TODO: handle the loading state display in some intentional way

	// TODO: or if set to "web" mode, single click
	// also Enter is currently implemented by triggering dblclick which is awkward
	$container.on("dblclick", function () {
		options.open();
	});
	// TODO: allow dragging files out from this folder view to the system file browser, with dataTransfer.setData("DownloadURL", ...)
	// sadly will only work for a single file (unless it secretly supports text/uri-list (either as a separate type or for DownloadURL))
	// also it won't work if I want to do custom drag-and-drop (e.g. repositioning icons)
	// so I have to choose one feature or the other (right?), probably custom drag-and-drop

	if (options.shortcut) {
		$container.addClass("shortcut");
	}
	$container.css({
		position: "absolute",
		width: grid_size_x,
		height: grid_size_y,
	});
	$container[0].dataset.filePath = options.file_path;
	return { element: $container[0] };
}
