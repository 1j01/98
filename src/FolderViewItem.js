
let pointers_down = 0;
$(window).on("pointerup", (event) => {
	pointers_down--;
});
$(window).on("pointerdown", (event) => {
	pointers_down++;
});

function FolderViewItem(options) {
	// TODO: rename options to be consistent,
	// like is_folder, is_shortcut, etc.
	// TODO: rename CSS class to folder-view-item, or find a better name
	var $container = $("<div class='desktop-icon' draggable='true' tabindex=-1/>");
	var $icon_wrapper = $("<div class='icon-wrapper'/>").appendTo($container);
	var $selection_effect = $("<div class='selection-effect'/>").appendTo($icon_wrapper);
	var $title = $("<div class='title'/>").text(options.title);
	var $icon;
	$container.append($icon_wrapper, $title);

	// TODO: handle the loading state display in some intentional way

	// TODO: or if set to "web" mode, single click
	// also Enter is currently implemented by triggering dblclick which is awkward
	let single_click_timeout;
	// $container.on("dblclick", (event) => {
	// 	if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
	// 		return; // Not true to Windows 98. But in Windows 98 it doesn't do two things, it just does the double click action.
	// 		// At any rate, it feels nice to make Ctrl+click do only one thing (toggling the selection state).
	// 	}
	// 	options.open();
	// 	clearTimeout(single_click_timeout);
	// });
	// dblclick doesn't work on iPad at least, using pointerdown instead
	let last_pointerdown_time = -Infinity;
	const double_click_ms = 500;
	$container.css({
		"touch-action": "none",
	});
	$container.on("touchstart", (event) => {
		event.preventDefault(); // needed to get quick double-tap to work (at least on iPad)
	});
	$container.on("pointerdown", (event) => {
		if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
			return; // Not true to Windows 98. But in Windows 98 it doesn't do two things, it just does the double click action.
			// At any rate, it feels nice to make Ctrl+click do only one thing (toggling the selection state).
		}
		// // showMessageBox({
		// // 	title: "Double click debug",
		// // 	message: `
		// $(".taskbar").text(`
		// 		event.timeStamp: ${event.timeStamp}
		// 		last_pointerdown_time: ${last_pointerdown_time}
		// 		event.timeStamp - last_pointerdown_time: ${event.timeStamp - last_pointerdown_time}
		// 		pointers_down: ${pointers_down}
		// `).css({ fontFamily: "monospace", whiteSpace: "pre", height: "auto", backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)` });
		// // 	`,
		// // 	iconID: "info",
		// // });
		if (pointers_down > 1) {
			last_pointerdown_time = -Infinity; // multi-touch not part of double-click
			return;
		}
		if ((event.timeStamp - last_pointerdown_time) < double_click_ms) {
			options.open();
			clearTimeout(single_click_timeout);
			last_pointerdown_time = -Infinity; // don't open again on third click
			return;
		}
		last_pointerdown_time = event.timeStamp;
	});

	// TODO: allow dragging files out from this folder view to the system file browser, with dataTransfer.setData("DownloadURL", ...)
	// sadly will only work for a single file (unless it secretly supports text/uri-list (either as a separate type or for DownloadURL))
	// also it won't work if I want to do custom drag-and-drop (e.g. repositioning icons)
	// so I have to choose one feature or the other (right?), probably custom drag-and-drop

	$title.on("click", () => {
		if (!$container[0]._was_selected_at_pointerdown) {
			return; // this click is for selecting the item
		}
		// @TODO: if the folder view wasn't focused at pointerdown,
		// don't start rename
		single_click_timeout = setTimeout(() => {
			if ($container.hasClass("selected")) {
				this.start_rename();
			}
		}, 500);
	});

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
		if (this.iconSize === new_size) {
			return;
		}
		this.iconSize = new_size;
		this._update_icon();
	};
	this._update_icon();

	this.start_rename = () => {
		if (!options.rename) {
			return;
		}
		if ($container.hasClass("renaming")) {
			return;
		}
		$container.addClass("renaming");
		$container.attr("draggable", false);
		const old_title = $title.text();
		// @TODO: auto-size the input box,
		// and wrap to multiple lines
		const $input = $("<input type='text'/>");
		$input.val(old_title);
		$input.on("keydown", (e) => {
			// relying on blur event to trigger the rename,
			// or to reset the input to the old title
			if (e.key === "Enter") {
				$container.focus();
				e.preventDefault();
			} else if (e.key === "Escape") {
				$input.val(old_title);
				$container.focus();
				e.preventDefault();
			}
		});
		$input.on("blur", () => {
			const new_title = $input.val();
			if (new_title.trim() === "") {
				showMessageBox({
					title: "Rename",
					message: "You must type a filename.",
					iconID: "error",
				}).then(() => {
					$input.focus(); // @TODO: why is this needed? it's supposed to refocus the last focused element
					// well I guess it doesn't work for the desktop, just windows
				});
				return;
			}
			$input.remove(); // technically not necessary
			$title.text(new_title);
			$container.removeClass("renaming");
			$container.attr("draggable", true);
			if (new_title !== old_title) {
				// console.log("renaming", this.file_path, "to", new_title);
				options.rename(new_title)
					.catch((error) => {
						$title.text(old_title);
						alert("Failed to rename:\n\n" + error);
					});
			}
		});
		$title.empty().append($input);
		$input[0].focus();
		$input[0].select();
	};
}
