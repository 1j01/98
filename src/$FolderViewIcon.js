
function $FolderViewIcon(options){
	// TODO: rename element class to folder-view-icon, or find a better name (maybe desktop-icon and $DesktopIcon are still okay?)
	var $container = $("<div class='desktop-icon' draggable='true'/>");
	var $icon_wrapper = $("<div class='icon-wrapper'>");
	var $svg = $(`
		<svg class='icon-wrapper-svg'>
			<filter id="blueify">
				<feFlood
					in="SourceGraphic"
					result="blue"
					flood-color="#000080"
					flood-opacity="0.5"/>
				<feComposite in="blue" in2="SourceGraphic" operator="in" result="blue-silhouette"/>
				<feComposite in="blue-silhouette" in2="SourceGraphic" operator="over"/>
			</filter>
			
			<g class='not-root-svg-or-foreignObject'>
				<foreignObject
					width="${DESKTOP_ICON_SIZE}"
					height="${DESKTOP_ICON_SIZE}"
					class='icon-wrapper-foreignObject'
				/>
			</g>
		</svg>
	`)
	// <feColorMatrix
	// 	type="matrix"
	// 	in="SourceGraphic"
	// 	values="0.6 0 0.8 -0.2 0
	// 			0 0.6 0 -0.2 0
	// 			0 0 1 0.5 0
	// 			0 0 0 1 0 "/>
	.appendTo($container).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	var $icon = options.icon; //$Icon(options.icon || "task", DESKTOP_ICON_SIZE).width(DESKTOP_ICON_SIZE).height(DESKTOP_ICON_SIZE);
	// var $selection_effect = $icon.clone().addClass("selection-effect");
	// var $selection_effect = $("<div class='selection-effect'>");

	var $title = $("<div class='title'/>").text(options.title);
	$container.append($icon_wrapper, $title);
	$svg.find(".icon-wrapper-foreignObject").append($icon);//, $selection_effect);
	// $icon_wrapper.append($icon, $selection_effect);
	$icon_wrapper.append($svg);

	// var src = $icon.attr("src");
	// $icon.on("load", function(){
	// 	if($icon.attr("src") !== src){
	// 		src = $icon.attr("src");
	// 		$selection_effect.attr("src", src);
	// 	}
	// });
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
	return $container;
}
