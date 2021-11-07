
function FolderViewItem(options) {
	// TODO: rename options to be consistent,
	// like is_folder, is_shortcut, etc.
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
	$container[0].dataset.filePath = options.file_path;

	this.element = $container[0];

	this.icons = options.icons;
	this.iconSize = options.iconSize || DESKTOP_ICON_SIZE;

	this.file_path = options.file_path;
	this.is_system_folder = options.is_system_folder;

	this._update_icon = () => {
		if (this.icons) {
			const $old_icon = $icon;
			const src = this.icons[this.iconSize];
			$icon = $("<img class='icon'/>");
			$icon.attr({
				draggable: false,
				src,
				width: this.iconSize,
				height: this.iconSize,
			});
			$selection_effect[0].style.setProperty("--icon-image", `url("${src}")`);
			if ($old_icon) {
				$old_icon.replaceWith($icon);
			} else {
				$icon_wrapper.prepend($icon);
			}
		} else {
			$icon?.remove();
			$icon = null;
			$selection_effect[0].style.setProperty("--icon-image", "none");
		}
		$icon_wrapper[0].style.setProperty("--icon-size", this.iconSize + "px");
		$icon_wrapper[0].style.setProperty("--shortcut-icon", `url("${getIconPath("shortcut", this.iconSize)}")`);
	};
	this.setIcons = (new_icons) => {
		this.icons = new_icons;
		this._update_icon();
	};
	this.setIconSize = (new_size) => {
		this.iconSize = new_size;
		this._update_icon();
	};
	this._update_icon();
}
