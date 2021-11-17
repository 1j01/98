
// @TODO: generalize to all windows (not just iframe windows)
// I might need an `os-gui-window-opened` event.
var $window_switcher = $("<div class='window-switcher outset-deep'>");
var $window_switcher_list = $("<ul class='window-switcher-list'>").appendTo($window_switcher);
var $window_switcher_window_name = $("<div class='window-switcher-window-name inset-deep'>").appendTo($window_switcher);
function show_window_switcher(cycle_backwards) {
	if ($window_switcher.is(":visible")) {
		cycle_window_switcher(cycle_backwards);
		return;
	}
	$window_switcher_list.empty();
	const window_els = $(".os-window").toArray(); // @TODO: support webamp, but only one entry; maybe should be based on tasks, not windows
	if (window_els.length < 2) { // @TODO: or if there's only one window, but it's not focused
		return;
	}
	window_els.sort((a, b) =>
		// using z-index, as it's similar to last-used order
		b.style.zIndex - a.style.zIndex
	);
	for (const window_el of window_els) {
		var $window = window_el.$window;
		var $item = $("<li>").addClass("window-switcher-item");
		$item.append($("<img>").attr({
			src: $window.icons[32] || "/images/icons/task-32x32.png",
			width: 32,
			height: 32,
			alt: $window.getTitle()
		}));
		$item.data("$window", $window);
		$item.on("click", function () {
			$window.unminimize();
			$window.focus();
		});
		$window_switcher_list.append($item);
		if ($window.hasClass("focused")) {
			$item.addClass("active");
		}
	}
	cycle_window_switcher(cycle_backwards);
	$window_switcher.appendTo("body");
	// console.log("Showing window switcher", $window_switcher[0]);
}
function cycle_window_switcher(cycle_backwards) {
	const items = $window_switcher.find(".window-switcher-item").toArray();
	const $active = $window_switcher.find(".active");
	const old_index = items.indexOf($active[0]);
	const new_index = ((old_index + (cycle_backwards ? -1 : 1)) + items.length) % items.length;
	$active.removeClass("active");
	const new_item = items[new_index];
	$(new_item).addClass("active");
	$window_switcher_window_name.text($(new_item).data("$window").getTitle());
}
function window_switcher_close_and_select() {
	if (!$window_switcher.is(":visible")) {
		return;
	}
	const $active = $window_switcher.find(".active");
	if ($active.length === 0) {
		return;
	}
	$active.data("$window").focus();
	$window_switcher.remove(); // must remove only after getting data()
}

