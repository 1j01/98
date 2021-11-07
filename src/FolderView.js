
const grid_size_x_for_large_icons = 75;
const grid_size_y_for_large_icons = 75;
// @TODO: this is supposed to be dynamic based on length of names
const grid_size_x_for_small_icons = 150;
const grid_size_y_for_small_icons = 17;

window.resetAllFolderCustomizations = () => {
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("folder-config:")) {
			localStorage.removeItem(localStorage.key(i));
		}
	}
};

const icon_size_by_view_mode = {
	LARGE_ICONS: 32,
	SMALL_ICONS: 16,
	DETAILS: 16,
	LIST: 16,
	DESKTOP: 32,
};

FolderView.VIEW_MODES = {
	LARGE_ICONS: "LARGE_ICONS",
	SMALL_ICONS: "SMALL_ICONS",
	DETAILS: "DETAILS",
	LIST: "LIST",
	DESKTOP: "DESKTOP",
};

FolderView.SORT_MODES = {
	NAME: "NAME",
	TYPE: "TYPE",
	SIZE: "SIZE",
	DATE: "DATE",
	// there are many other attributes, some for specific types of files/objects
};

// TODO: what's the "right" way to do file type / program associations for icons?

// TODO: get more icons; can extract from shell32.dll, moricons.dll, and other files from a VM
// also get more file extensions; can find a mime types listing data dump
// https://github.com/1j01/retrores
var file_extension_icons = {
	txt: "notepad-file",
	md: "notepad-file",
	json: "notepad-file",
	js: "notepad-file",
	css: "notepad-file",
	html: "notepad-file",
	gitattributes: "notepad-file",
	gitignore: "notepad-file",
	png: "image-gif", // "image-png"? nope... (but should it be image-gif or image-wmf?)
	jpg: "image-jpeg",
	jpeg: "image-jpeg",
	gif: "image-gif",
	webp: "image-other",
	bmp: "paint-file",
	tif: "kodak-imaging-file",
	tiff: "kodak-imaging-file",
	// wmf: "image-wmf"? nope (https://en.wikipedia.org/wiki/Windows_Metafile)
	// emf: "image-wmf"? nope
	// wmz: "image-wmf"? nope
	// emz: "image-wmf"? nope
	wav: "sound",
	mp3: "sound", // TODO: show blue video icon, as it's a container format that can contain video
	ogg: "sound", // TODO: probably ditto
	wma: "sound",
	// "doc": "doc"?
	"exe": "task",
	htm: "html",
	html: "html",
	url: "html",
	theme: "themes",
	themepack: "themes",
};

// @TODO: maintain less fake naming abstraction
// base it more on the actual filesystem
// @TODO: bring system folders, icons, and file associations into one place
const system_folder_to_name = {
	"/": "(C:)", //"My Computer",
	"/my-pictures/": "My Pictures",
	"/my-documents/": "My Documents",
	"/network-neighborhood/": "Network Neighborhood",
	"/desktop/": "Desktop",
	"/programs/": "Program Files",
	"/recycle-bin/": "Recycle Bin",
};


const set_dragging_file_paths = (dragging_file_paths) => {
	window.dragging_file_paths = dragging_file_paths;
	let frame = window;
	while (frame !== frame.parent) {
		frame = frame.parent;
		frame.dragging_file_paths = dragging_file_paths;
	}
};

function FolderView(folder_path, { asDesktop = false } = {}) {
	const self = this;
	// TODO: ensure a trailing slash / use path.join where appropriate

	var $folder_view = $(`<div class="folder-view" tabindex="0">`);

	this.element = $folder_view[0];

	this.items = [];

	this.add_item = (folder_view_item) => {
		$folder_view.append(folder_view_item.element);
		this.items.push(folder_view_item);
		// if (this.items.length === 1) {
		// 	// this.items[0].element.focus();
		// 	this.items[0].element.classList.add("focused");
		// }
	};

	// config:
	// - [x] view_mode
	// - [x] sort_mode
	// - [ ] auto_arrange
	// - [ ] icon_positions
	// - [ ] view_as_web_page

	this.config = {};
	var storage_key = `folder-config:${asDesktop ? "desktop" : folder_path}`;
	try {
		const config_json = localStorage.getItem(storage_key);
		const config = JSON.parse(config_json);
		if (config) {
			Object.assign(this.config, config);
		}
	} catch (e) {
		console.error("Failed to read folder config:", e);
	}
	// Handling defaults and invalid values at the same time
	if (!FolderView.VIEW_MODES[this.config.view_mode]) {
		this.config.view_mode = asDesktop ?
			FolderView.VIEW_MODES.DESKTOP :
			FolderView.VIEW_MODES.LARGE_ICONS;
	}
	if (!FolderView.SORT_MODES[this.config.sort_mode]) {
		this.config.sort_mode = FolderView.SORT_MODES.NAME;
	}

	this.element.dataset.viewMode = this.config.view_mode;
	this.configure = (config_props) => {
		Object.assign(this.config, config_props);
		if (config_props.view_mode) {
			this.element.dataset.viewMode = config_props.view_mode;
		}
		this.arrange_icons();
		try {
			localStorage.setItem(storage_key, JSON.stringify(this.config));
		} catch (e) {
			console.error("Can't write to localStorage:", e);
		}
	};

	// Note: debounce is NEEDED to avoid infinite recursion
	// in the case that stats are loading
	this.arrange_icons = debounce(() => {
		let any_pending = false;
		for (const item of this.items) {
			if (item.pendingStatPromise) {
				item.pendingStatPromise.then(() => {
					self.arrange_icons();
				});
				any_pending = true;
			}
			// console.log(
			// 	"item.element", item.element,
			// 	"item.pendStatPromise", item.pendingStatPromise,
			// 	"item.resolvedStats?.isDirectory()", item.resolvedStats ? item.resolvedStats.isDirectory() : "no resolvedStats");
		}
		const horizontal_first =
			this.config.view_mode === FolderView.VIEW_MODES.LARGE_ICONS ||
			this.config.view_mode === FolderView.VIEW_MODES.SMALL_ICONS;
		const large_icons =
			this.config.view_mode === FolderView.VIEW_MODES.LARGE_ICONS ||
			this.config.view_mode === FolderView.VIEW_MODES.DESKTOP;
		const icon_size = icon_size_by_view_mode[this.config.view_mode] || 32;

		const grid_size_x = large_icons ? grid_size_x_for_large_icons : grid_size_x_for_small_icons;
		const grid_size_y = large_icons ? grid_size_y_for_large_icons : grid_size_y_for_small_icons;
		var x = 0;
		var y = 0;
		const dir_ness = (item) =>
			// system folders always go first
			// not all system folder shortcuts on the desktop have real paths (currently)
			// so we can't check system_folder_to_name, need a separate attribute.
			// system_folder_to_name[item.file_path] ? 2 :
			item.is_system_folder ? 2 :
				// then folders, then everything else
				item.resolvedStats?.isDirectory() ? 1 : 0;
		const get_ext = (item) => (item.file_path ?? "").split(".").pop();
		if (this.config.sort_mode === FolderView.SORT_MODES.NAME) {
			this.items.sort((a, b) =>
				dir_ness(b) - dir_ness(a) ||
				(a.title ?? "").localeCompare(b.title ?? "")
			);
		} else if (this.config.sort_mode === FolderView.SORT_MODES.TYPE) {
			this.items.sort((a, b) =>
				dir_ness(b) - dir_ness(a) ||
				(get_ext(a) ?? "").localeCompare(get_ext(b) ?? "")
			);
		} else if (this.config.sort_mode === FolderView.SORT_MODES.SIZE) {
			this.items.sort((a, b) =>
				dir_ness(b) - dir_ness(a) ||
				(a.resolvedStats?.size ?? 0) - (b.resolvedStats?.size ?? 0)
			);
		} else if (this.config.sort_mode === FolderView.SORT_MODES.DATE) {
			this.items.sort((a, b) =>
				dir_ness(b) - dir_ness(a) ||
				(a.resolvedStats?.mtime ?? 0) - (b.resolvedStats?.mtime ?? 0)
			);
		}
		for (const item of this.items) {
			$(item.element).css({
				left: x,
				top: y,
			});
			if (horizontal_first) {
				x += grid_size_x;
				// @TODO: handle scrollbar width/height
				if (x + grid_size_x > $folder_view.width()) {
					y += grid_size_y;
					x = 0;
				}
			} else {
				y += grid_size_y;
				if (y + grid_size_y > $folder_view.height()) {
					x += grid_size_x;
					y = 0;
				}
			}

			item.setIconSize(icon_size);

			// apply sort
			this.element.appendChild(item.element);
		}

		if (!any_pending) {
			// this.items[0].element.classList.add("focused");
			this.items.forEach((item, index) => {
				item.element.classList.toggle("focused", index === 0);
			});
		}
	}, 100);

	function deleteRecursiveSync(fs, itemPath) {
		if (fs.statSync(itemPath).isDirectory()) {
			for (const childItemName of fs.readdirSync(itemPath)) {
				deleteRecursiveSync(itemPath + "/" + childItemName);
			}
			fs.rmdirSync(itemPath);
		} else {
			fs.unlinkSync(itemPath);
		}
	}

	self.focus = function () {
		$folder_view.focus();
		// This doesn't do much if it's yet to be populated:
		if ($folder_view.find(".desktop-icon.focused").length === 0) {
			$folder_view.find(".desktop-icon").first().focus();
		}
		// Initial focus is handled in arrange_icons currently.
	};

	self.select_all = function () {
		$folder_view.find(".desktop-icon").addClass("selected");
	};

	self.select_inverse = function () {
		$folder_view.find(".desktop-icon").each(function () {
			$(this).toggleClass("selected");
		});
	};

	self.delete_selected = function () {
		const selected_file_paths = $folder_view.find(".desktop-icon.selected")
			.toArray().map((icon_el) => icon_el.dataset.filePath)
			.filter((file_path) => system_folder_to_name[file_path] === undefined);

		if (selected_file_paths.length === 0) {
			return;
		}
		// @NOTE: if system setting for displaying file extensions was implemented, this should be changed...
		const name_of_first = $folder_view.find(".desktop-icon.selected .title").text().replace(/\.([^.]+)$/, "");
		showMessageBox({
			title: selected_file_paths.length === 1 ? "Confirm File Delete" : "Confirm Multiple File Delete",
			message: selected_file_paths.length === 1 ?
				`Are you sure you want to delete '${name_of_first}'?` :
				`Are you sure you want to delete these ${selected_file_paths.length} items?`,
			buttons: [
				{
					label: "Yes",
					value: "yes",
					default: true,
				},
				{
					label: "No",
					value: "no",
				},
			],
			iconID: "nuke",
		}).then((result) => {
			if (result !== "yes") {
				return;
			}
			withFilesystem(function () {
				const fs = BrowserFS.BFSRequire('fs');
				let num_deleted = 0;
				for (const file_path of selected_file_paths) {
					let single_delete_success = false;
					try {
						deleteRecursiveSync(fs, file_path);
						single_delete_success = true;
						num_deleted += 1;
					} catch (error) {
						console.log("failed to delete", file_path, error);
					}
					if (single_delete_success) {
						$folder_view.find(".desktop-icon").toArray().forEach((icon_el) => {
							if (icon_el.dataset.filePath === file_path) {
								icon_el.remove();
							}
						});
					}
				}
				// TODO: pluralization, and be more specific about folders vs files vs selected items, and total
				if (num_deleted < selected_file_paths.length) {
					alert(`Failed to delete ${selected_file_paths.length - num_deleted} items.`);
				}
				// self.refresh();
			});
		});
	};

	// Read the folder and create icon items
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire('fs');
		fs.readdir(folder_path, function (error, contents) {
			if (error) {
				alert("Failed to read contents of the directory " + folder_path);
				throw error;
			}

			for (var i = 0; i < contents.length; i++) {
				var fname = contents[i];
				add_fs_item(fname, -1000, -1000);
			}
			self.arrange_icons();
		});
	});

	// NOTE: in Windows, icons normally only get moved if they go offscreen (by maybe half the grid size)
	// we're essentially handling it as if Auto Arrange is on
	$(window).on("resize", self.arrange_icons);

	// Handle selecting icons
	(function () {
		var $marquee = $("<div class='marquee'/>").appendTo($folder_view).hide();
		var start = { x: 0, y: 0 };
		var current = { x: 0, y: 0 };
		var dragging = false;
		var drag_update = function () {
			var min_x = Math.min(start.x, current.x);
			var min_y = Math.min(start.y, current.y);
			var max_x = Math.max(start.x, current.x);
			var max_y = Math.max(start.y, current.y);
			$marquee.show().css({
				position: "absolute",
				left: min_x,
				top: min_y,
				width: max_x - min_x,
				height: max_y - min_y,
			});
			$folder_view.find(".desktop-icon").each(function (i, folder_view_icon) {
				// Note: this is apparently considerably more complex in Windows 98
				// like things are not considered the same heights and/or positions based on the size of their names
				var icon_offset = $(folder_view_icon).offset();
				var icon_left = parseFloat($(folder_view_icon).css("left"));
				var icon_top = parseFloat($(folder_view_icon).css("top"));
				var icon_width = $(folder_view_icon).width();
				var icon_height = $(folder_view_icon).height();
				folder_view_icon.classList.toggle("selected",
					icon_left < max_x &&
					icon_top < max_y &&
					icon_left + icon_width > min_x &&
					icon_top + icon_height > min_y
				);
			});
		};
		$folder_view.on("pointerdown", ".desktop-icon", function (e) {
			$folder_view.find(".desktop-icon").each(function (i, folder_view_icon) {
				folder_view_icon.classList.toggle("selected", folder_view_icon === e.currentTarget);
				folder_view_icon.classList.toggle("focused", folder_view_icon === e.currentTarget);
			});
		});
		$folder_view.on("pointerdown", function (e) {
			// TODO: allow a margin of mouse movement before starting selecting
			var view_was_focused = $folder_view.is(":focus-within");
			self.focus();
			var $icon = $(e.target).closest(".desktop-icon");
			$marquee.hide();
			var folder_view_offset = $folder_view.offset();
			start = { x: e.pageX - folder_view_offset.left + $folder_view[0].scrollLeft, y: e.pageY - folder_view_offset.top + $folder_view[0].scrollTop };
			current = { x: e.pageX - folder_view_offset.left + $folder_view[0].scrollLeft, y: e.pageY - folder_view_offset.top + $folder_view[0].scrollTop };
			if ($icon.length > 0) {
				$marquee.hide();
				set_dragging_file_paths($(".desktop-icon.selected").get().map((icon) =>
					icon.dataset.filePath
				).filter((file_path) => file_path));
			} else {
				set_dragging_file_paths([]);
				dragging = true;
				// don't deselect right away unless the 
				// TODO: deselect on pointerUP, if the desktop was focused
				// or when starting selecting (re: TODO: allow a margin of movement before starting selecting)
				if (view_was_focused) {
					drag_update();
				}
			}
		});
		$(window).on("pointermove", function (e) {
			var folder_view_offset = $folder_view.offset();
			current = { x: e.pageX - folder_view_offset.left + $folder_view[0].scrollLeft, y: e.pageY - folder_view_offset.top + $folder_view[0].scrollTop };
			// clamp coordinates to within folder view
			// This accomplishes three things:
			// 1. it improves the visual coherence of the marquee as an object
			// 2. it makes the marquee not cause a scrollbar
			// 3. it prevents selecting things you can't see
			const scrollbar_width = $folder_view.width() - $folder_view[0].clientWidth;
			const scrollbar_height = $folder_view.height() - $folder_view[0].clientHeight;
			const clamp_left = $folder_view[0].scrollLeft;
			const clamp_top = $folder_view[0].scrollTop;
			const clamp_right = $folder_view.width() + $folder_view[0].scrollLeft - scrollbar_width;
			const clamp_bottom = $folder_view.height() + $folder_view[0].scrollTop - scrollbar_height;
			current.x = Math.max(clamp_left, Math.min(clamp_right, current.x));
			current.y = Math.max(clamp_top, Math.min(clamp_bottom, current.y));
			if (dragging) {
				drag_update();
				// scroll the view by dragging the mouse at/past the edge
				const scroll_speed = 10;
				if (current.x === clamp_left) {
					$folder_view[0].scrollLeft -= scroll_speed;
				} else if (current.x === clamp_right) {
					$folder_view[0].scrollLeft += scroll_speed;
				}
				if (current.y === clamp_top) {
					$folder_view[0].scrollTop -= scroll_speed;
				} else if (current.y === clamp_bottom) {
					$folder_view[0].scrollTop += scroll_speed;
				}
			}
		});
		$(window).on("pointerup blur", function () {
			$marquee.hide();
			dragging = false;
			set_dragging_file_paths([]);
		});
	})();

	$folder_view.on("keydown", function (e) {
		if (e.key == "Enter") {
			$folder_view.find(".desktop-icon.selected").trigger("dblclick");
		} else if (e.ctrlKey && e.key == "a") {
			folder_view.select_all();
			e.preventDefault();
		} else if (e.key == "Delete") {
			self.delete_selected();
			e.preventDefault();
		} else if (
			e.key == "ArrowLeft" ||
			e.key == "ArrowRight" ||
			e.key == "ArrowUp" ||
			e.key == "ArrowDown"
		) {
			e.preventDefault();
			const move_x = e.key == "ArrowLeft" ? -1 : e.key == "ArrowRight" ? 1 : 0;
			const move_y = e.key == "ArrowUp" ? -1 : e.key == "ArrowDown" ? 1 : 0;
			navigate_grid(move_x, move_y);
			// @TODO: wrap around columns in list view
		} else if (
			e.key == "PageUp" ||
			e.key == "PageDown"
		) {
			e.preventDefault();
			if (self.config.view_mode === FolderView.VIEW_MODES.LIST) {
				const x_dir = e.key == "PageUp" ? -1 : 1;
				const full_page_size = $folder_view.width();
				const item_width = $folder_view.find(".desktop-icon").outerWidth();
				const page_increment = full_page_size - item_width;
				for (let increment = page_increment; increment > 0; increment -= item_width) {
					if (navigate_grid(x_dir * increment / item_width, 0)) { // grid units
						break;
					}
				}
			} else {
				const y_dir = e.key == "PageUp" ? -1 : 1;
				const full_page_size = $folder_view.height();
				const item_height = $folder_view.find(".desktop-icon").outerHeight();
				const page_increment = full_page_size - item_height;
				for (let increment = page_increment; increment > 0; increment -= item_height) {
					if (navigate_grid(0, y_dir * increment / item_height)) { // grid units
						break;
					}
				}
			}
		} else if (e.key == "Home") {
			e.preventDefault();
			$folder_view.find(".desktop-icon").first()
				.trigger("pointerdown")
				[0].scrollIntoView({ block: "nearest" });
		} else if (e.key == "End") {
			e.preventDefault();
			$folder_view.find(".desktop-icon").last()
				.trigger("pointerdown")
				[0].scrollIntoView({ block: "nearest" });
		}
	});

	function navigate_grid(move_x, move_y) {
		// @TODO: how this is supposed to work for icons not aligned to the grid?
		// I can imagine a few ways of doing it, like scanning for the nearest icon with a sweeping line or perhaps a "cone" (triangle) (changing width line)
		// but it'd be nice to know for sure

		let $starting_icon = $folder_view.find(".desktop-icon.focused");
		// ideally we'd keep a focused icon always,
		// use the nearest icon upwards after a delete etc.
		// but I can't guarantee that
		if ($starting_icon.length == 0) {
			$starting_icon = $folder_view.find(".desktop-icon");
		}
		if ($starting_icon.length == 0) {
			return false;
		}
		// @TODO: use the actual grid size, not a calculated item size
		// or make it more grid-agnostic (Windows 98 allowed freely moving icons around)
		const item_width = $starting_icon.outerWidth();
		const item_height = $starting_icon.outerHeight();
		const item_pos = $starting_icon.position();
		let x = item_pos.left;// + item_width / 2;
		let y = item_pos.top;// + item_height / 2;
		x += move_x * item_width;
		y += move_y * item_height;
		const candidates = $folder_view.find(".desktop-icon").toArray().sort(function (a, b) {
			const a_pos = $(a).position();
			const b_pos = $(b).position();
			const a_dist = Math.abs(a_pos.left - x) + Math.abs(a_pos.top - y);
			const b_dist = Math.abs(b_pos.left - x) + Math.abs(b_pos.top - y);
			return a_dist - b_dist;
		});
		const $icon = $(candidates[0]);
		if ($icon.length > 0) {
			$folder_view.find(".desktop-icon").each(function (i, icon) {
				icon.classList.toggle("selected", icon === $icon[0]);
				icon.classList.toggle("focused", icon === $icon[0]);
			});
			$icon[0].scrollIntoView({ block: "nearest" });
			return true;
		}
		return false;
	}

	var stat = function (file_path) {
		// fs should be guaranteed available at this point
		// as this function is currently used
		var fs = BrowserFS.BFSRequire('fs');
		return new Promise(function (resolve, reject) {
			fs.stat(file_path, function (err, stats) {
				if (err) {
					return reject(err);
				}
				resolve(stats);
			});
		});
	};
	var icon_id_from_stats_and_path = function (stats, file_path) {
		if (stats.isDirectory()) {
			// if extending this to different folder icons,
			// note that "folder" is relied on (for sorting)
			return "folder";
		}
		var file_extension = file_extension_from_path(file_path);
		// TODO: look inside exe for icons
		var icon_name = file_extension_icons[file_extension];
		return icon_name || "document";
	};

	// var add_fs_item = function(file_path, x, y){
	var add_fs_item = function (file_name, x, y) {
		var file_path = folder_path + file_name;
		var item = new FolderViewItem({
			title: file_name,
			open: function () { executeFile(file_path); },
			shortcut: file_path.match(/\.url$/),
			file_path,
			iconSize: icon_size_by_view_mode[self.config.view_mode],
		});
		item.pendingStatPromise = stat(file_path);
		item.pendingStatPromise.then((stats) => {
			item.pendingStatPromise = null;
			item.resolvedStats = stats; // trying to indicate in the name the async nature
			// @TODO: know which sizes are available
			const icon_id = icon_id_from_stats_and_path(stats, file_path);
			item.setIcons({
				16: getIconPath(icon_id, 16),
				32: getIconPath(icon_id, 32),
				48: getIconPath(icon_id, 48),
			});
		});
		self.add_item(item);
		$(item.element).css({
			left: x,
			top: y,
		});
	};
	var drop_file = function (file, x, y) {

		var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
		var fs = BrowserFS.BFSRequire('fs');

		var file_path = folder_path + file.name;

		var reader = new FileReader;
		reader.onerror = function (error) {
			throw error;
		};
		reader.onload = function (e) {
			var buffer = Buffer.from(reader.result);
			fs.writeFile(file_path, buffer, { flag: "wx" }, function (error) {
				if (error) {
					if (error.code === "EEXIST") {
						// TODO: options to replace or keep both files with numbers like "file (1).txt"
						alert("File already exists!");
					}
					throw error;
				}
				// TODO: could do utimes as well with file.lastModified or file.lastModifiedDate

				add_fs_item(file.name, x, y);
			});
		};
		reader.readAsArrayBuffer(file);
	};

	var dragover_pageX = 0;
	var dragover_pageY = 0;
	$folder_view.on("dragover", function (e) {
		e.preventDefault();
		dragover_pageX = e.originalEvent.pageX;
		dragover_pageY = e.originalEvent.pageY;
	});
	$folder_view.on("drop", function (e) {
		e.preventDefault();
		var x = e.originalEvent.pageX || dragover_pageX;
		var y = e.originalEvent.pageY || e.dragover_pageY
		// TODO: handle dragging icons onto other icons
		withFilesystem(function () {
			var files = e.originalEvent.dataTransfer.files;
			$.map(files, function (file) {
				// TODO: stagger positions, don't just put everything on top of each other
				// also center on the mouse position; currently it's placed via the top left
				drop_file(file, x, y);
			});
		});
	});

	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
}
