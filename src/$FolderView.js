
var grid_size_x = 75;
var grid_size_y = 75;

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

const set_dragging_file_paths = (dragging_file_paths)=> {
	window.dragging_file_paths = dragging_file_paths;
	let frame = window;
	while (frame !== frame.parent) {
		frame = frame.parent;
		frame.dragging_file_paths = dragging_file_paths;
	}
};

function $FolderView(folder_path) {
	// TODO: ensure a trailing slash / use path.join where appropriate

	// TODO: different view options, e.g. list view, details view, large icons view (arranged towards the top primarily instead of the left), desktop view
	
	var $folder_view = $("<div class='folder-view'>");
	
	// TODO: sort (by name I guess)
	$folder_view.arrange_icons = function(){
		var x = 0;
		var y = 0;
		// $folder_view.find(".desktop-icon")
		// .toArray()
		// .sort(function(a, b){
		// 	return (
		// 		$(a).find(".title").text().toLowerCase() >
		// 		$(b).find(".title").text().toLowerCase()
		// 	);
		// })
		// .forEach(function(el){
		// 	$(el).css({
		$folder_view.find(".desktop-icon").each(function(){
			$(this).css({
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

	$folder_view.delete_selected = function(){
		const selected_file_paths = $folder_view.find(".desktop-icon.selected")
			.toArray().map((icon_el)=> icon_el.dataset.filePath);
		if (selected_file_paths.length === 0) {
			return;
		}
		// TODO: pluralization, and be more specific about folders vs files vs selected items
		if (confirm(`Permanently delete ${selected_file_paths.length} items?`)) {
			withFilesystem(function(){
				const fs = BrowserFS.BFSRequire('fs');
				let num_deleted = 0;
				for (const file_path of selected_file_paths) {
					let single_delete_success = false;
					try {
						deleteRecursiveSync(fs, file_path);
						single_delete_success = true;
						num_deleted += 1;
					} catch(error) {
						console.log("failed to delete", file_path, error);
					}
					if (single_delete_success) {
						$folder_view.find(".desktop-icon").toArray().forEach((icon_el)=> {
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
				// $folder_view.refresh();
			});
		}
	};

	// // Refresh or initially render the icons
	// function renderContents() {
	// 	// TODO: preserve selection if applicable
	// 	$folder_view.find(".desktop-icon").remove();

	// 	// ...
	// }
	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire('fs');
		fs.readdir(folder_path, function (error, contents) {
			if(error){
				alert("Failed to read contents of the directory "+folder_path);
				throw error;
			}
			
			for(var i = 0; i < contents.length; i++){
				var fname = contents[i];
				var path = folder_path + fname;
				var x = Math.random() * innerWidth;
				var y = Math.random() * innerHeight;
				// add_icon_for_bfs_file(path, x, y);
				add_icon_for_bfs_file(fname, x, y);
			}
			$folder_view.arrange_icons();
		});
	});

	// NOTE: in Windows, icons normally only get moved if they go offscreen (by maybe half the grid size)
	// we're essentially handling it as if Auto Arrange is on
	$(window).on("resize", $folder_view.arrange_icons);

	// Handle selecting icons
	(function(){
		var $marquee = $("<div class='marquee'/>").appendTo($folder_view).hide();
		var start = {x: 0, y: 0};
		var current = {x: 0, y: 0};
		var dragging = false;
		var drag_update = function(){
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
			$folder_view.find(".desktop-icon").removeClass("selected").each(function(i, folder_view_icon){
				// Note: this is apparently considerably more complex in Windows 98
				// like things are not considered the same heights and/or positions based on the size of their names
				var icon_offset = $(folder_view_icon).offset();
				var icon_left = parseFloat($(folder_view_icon).css("left"));
				var icon_top = parseFloat($(folder_view_icon).css("top"));
				var icon_width = $(folder_view_icon).width();
				var icon_height = $(folder_view_icon).height();
				if(
					icon_left < max_x &&
					icon_top < max_y &&
					icon_left + icon_width > min_x &&
					icon_top + icon_height > min_y
				){
					$(folder_view_icon).addClass("selected");
				}
			});
		};
		$folder_view.on("pointerdown", ".desktop-icon", function(e){
			$folder_view.find(".desktop-icon").removeClass("focused");
			$(this).addClass("focused");
			if (!$(this).hasClass("selected")) {
				$folder_view.find(".desktop-icon").removeClass("selected");
				$(this).addClass("selected");
			}
		});
		$folder_view.on("pointerdown", function(e){
			// TODO: allow a margin of mouse movement before starting selecting
			var view_was_focused = $folder_view.hasClass("focused");
			$folder_view.addClass("focused");
			var $icon = $(e.target).closest(".desktop-icon");
			$marquee.hide();
			var folder_view_offset = $folder_view.offset();
			start = {x: e.pageX - folder_view_offset.left, y: e.pageY - folder_view_offset.top};
			current = {x: e.pageX - folder_view_offset.left, y: e.pageY - folder_view_offset.top};
			if($icon.length > 0){
				$marquee.hide();
				set_dragging_file_paths($(".desktop-icon.selected").get().map((icon)=>
					icon.dataset.filePath
				).filter((file_path)=> file_path));
			}else{
				set_dragging_file_paths([]);
				dragging = true;
				// don't deselect right away unless the 
				// TODO: deselect on pointerUP, if the desktop was focused
				// or when starting selecting (re: TODO: allow a margin of movement before starting selecting)
				if(view_was_focused){
					drag_update();
				}
			}
		});
		const unfocus = ()=> {
			$folder_view.removeClass("focused");
		};
		$(window).on("pointerdown", function(e){
			if(!$(e.target).closest(".folder-view").is($folder_view)){
				unfocus();
			}
		});
		$(window).on("focusout", function(e){
			if(e.target === window) {
				// focus may have gone to an iframe, or outside the browser window
				unfocus();
			}
		});
		$(window).on("pointermove", function(e){
			var folder_view_offset = $folder_view.offset();
			current = {x: e.pageX - folder_view_offset.left, y: e.pageY - folder_view_offset.top};
			// TODO: bind/clamp coordinates to within folder view
			// (The marquee border should always show up, against the edge of the screen,
			// it shouldn't overlap the address bar,
			// and it shouldn't cause a scrollbar)
			// also scroll the view by dragging
			if(dragging){
				drag_update();
			}
		});
		$(window).on("pointerup blur", function(){
			$marquee.hide();
			dragging = false;
		});
	})();

	// TODO: select icons with the keyboard
	// I wonder how this works, since it allows navigating icons not aligned to the grid.
	// I can imagine a few ways of doing it, like scanning for the nearest icon with a sweeping line or perhaps a "cone" (triangle) (changing width line)
	// but it'd be nice to know for sure

	$(window).on("keydown", function(e){
		if($folder_view.is(".focused")){
			if(e.key == "Enter"){
				$folder_view.find(".desktop-icon.selected").trigger("dblclick");
			}else if(e.ctrlKey && e.key == "a"){
				$folder_view.find(".desktop-icon").addClass("selected");
				e.preventDefault();
			}else if(e.key == "Delete"){
				$folder_view.delete_selected();
				e.preventDefault();
			}
		}
	});

	var get_icon_for_file_path = function (file_path){
		// fs should be guaranteed available at this point
		// as this function is currently used
		var fs = BrowserFS.BFSRequire('fs');
		return new Promise(function(resolve, reject){
			fs.stat(file_path, function(err, stats){
				if(err){
					return reject(err);
				}
				if(stats.isDirectory()){
					return resolve("folder");
				}
				var file_extension = file_extension_from_path(file_path);
				// TODO: look inside exe for icons
				var icon_name = file_extension_icons[file_extension];
				resolve(icon_name || "file");
			});
		});
	};
	// var add_icon_for_bfs_file = function(file_path, x, y){
	var add_icon_for_bfs_file = function(file_name, x, y){
		var file_path = folder_path + file_name;
		return $FolderViewIcon({
			title: file_name,
			// icon: $IconByPathPromise(get_icon_for_file_path(file_path), DESKTOP_ICON_SIZE),
			icon: $IconByIDPromise(get_icon_for_file_path(file_path), DESKTOP_ICON_SIZE),
			open: function(){ executeFile(file_path); },
			shortcut: file_path.match(/\.url$/),
			file_path,
		}).appendTo($folder_view).css({
			left: x,
			top: y,
		});
	};
	var drop_file = function(file, x, y){

		var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
		var fs = BrowserFS.BFSRequire('fs');

		var file_path = folder_path + file.name;
		
		var reader = new FileReader;
		reader.onerror = function(error){
			throw error;
		};
		reader.onload = function(e){
			var buffer = Buffer.from(reader.result);
			fs.writeFile(file_path, buffer, {flag: "wx"}, function(error){
				if(error){
					if(error.code === "EEXIST"){
						// TODO: options to replace or keep both files with numbers like "file (1).txt"
						alert("File already exists!");
					}
					throw error;
				}
				// TODO: could do utimes as well with file.lastModified or file.lastModifiedDate
				
				add_icon_for_bfs_file(file.name, x, y);
			});
		};
		reader.readAsArrayBuffer(file);
	};

	var dragover_pageX = 0;
	var dragover_pageY = 0;
	$folder_view.on("dragover", function(e){
		e.preventDefault();
		dragover_pageX = e.originalEvent.pageX;
		dragover_pageY = e.originalEvent.pageY;
	});
	$folder_view.on("drop", function(e){
		e.preventDefault();
		var x = e.originalEvent.pageX || dragover_pageX;
		var y = e.originalEvent.pageY || e.dragover_pageY
		// TODO: handle dragging icons onto other icons
		withFilesystem(function(){
			var files = e.originalEvent.dataTransfer.files;
			$.map(files, function(file){
				// TODO: stagger positions, don't just put everything on top of each other
				// also center on the mouse position; currently it's placed via the top left
				drop_file(file, x, y);
			});
		});
	});

	return $folder_view;
}
