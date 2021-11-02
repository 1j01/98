
function FolderViewItem(options) {
	// TODO: rename CSS class to folder-view-item, or find a better name
	var $container = $("<div class='desktop-icon' draggable='true'/>");
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container);
	var $selection_effect = $("<div class='selection-effect'/>").appendTo($icon_wrapper);
	var $title = $("<div class='title'/>").text(options.title);
	var $icon;
	$container.append($icon_wrapper, $title);

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

	this.element = $container[0];

	this.setIcons = (icons) => {
		if ($icon) {
			$icon.remove();
		}
		const size = DESKTOP_ICON_SIZE;
		const src = icons[size];
		$icon = $("<img class='icon'/>");
		$icon.attr({
			draggable: false,
			src,
			width: size,
			height: size,
		});
		$selection_effect[0].style.setProperty("--icon-image", `url("${src}")`);
		$icon_wrapper.prepend($icon);
	};
	if (options.icons) {
		this.setIcons(options.icons);
	}
}
