(() => {
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
		if (window_els.length === 1) {
			window_els[0].$window.unminimize();
			window_els[0].$window.focus(); // unminimize will focus but only if it was minimized
			return;
		}
		if (window_els.length < 2) {
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

	window.addEventListener("keydown", handle_keydown, true);
	window.addEventListener("keyup", handle_keyup, true);

	var iid;
	var alt_held = false; // for detecting likely Alt+Tab
	var notice_shown = false;
	function handle_keydown(e) {
		if (e.altKey && (e.key === "4" || e.key === "F4")) { // we can't actually intercept Alt+F4, but might as well try, right?
			e.preventDefault();
			const $window = e.target.closest(".os-window")?.$window;
			console.log("Alt+4 detected, closing window", $window, e.target);
			$window?.close();
		}
		// console.log(e.key, e.code);
		if (e.altKey && (e.code === "Backquote" || e.code === "Tab")) {
			show_window_switcher(e.shiftKey);
		}
		if (e.key === "Alt") {
			alt_held = true;
			// console.log("Alt held");
			clearInterval(iid);
			iid = setInterval(look_for_focus_loss, 200);
		}
	}
	function handle_keyup(e) {
		// console.log("keyup", e.key, e.code);
		// if (e.key === "Alt") { // on my Ubuntu XFCE, it's giving "Meta" if Shift is held
		if (!e.altKey) {
			alt_held = false;
			clearInterval(iid);
			// console.log("Alt released");
			window_switcher_close_and_select();
		}
	}
	function look_for_focus_loss() {
		// Welcome to Heuristic Hurdles! I'm your host, Hacky Hairy. Today we're going to be detecting Alt+Tab.
		// Alt+Tab is a common shortcut for switching between windows, but we can't actually intercept it.
		// In fact, the browser doesn't even know about it. It's handled by the window manager directly.
		// We'll have to pick another shortcut, but who's going to know about it? Wouldn't it be nice if we could at least detect Alt+Tab,
		// to inform users of the new shortcut? How are we going to do that, in mere JavaScript?
		// Heuristics! *queue Heuristic Hurdles theme song*

		// console.log("alt_held", alt_held, "!top.document.hasFocus()", !top.document.hasFocus(), "top.document.hasFocus()", top.document.hasFocus(), "top.document", top.document, "top.activeElement", top.document.activeElement);
		if (alt_held && !top.document.hasFocus()) {
			// Some things like closing a window with Alt+4 can cause the document to lose focus, without Alt+Tab.
			// But if the window's really lost focus, we shouldn't be able to focus an element in it to focus the document.
			// So we can use that to refine the heuristic.
			if (
				!top.document.activeElement ||
				top.document.activeElement === top.document.body ||
				top.document.activeElement === top.document.documentElement
			) {
				// try focusing the document (or window, rather)
				top.focus();
				if (top.document.hasFocus()) {
					// console.log("Focused document");
					return;
				} else {
					// console.log("Couldn't focus document, so you've probably Alt+Tabbed");
				}
			} else {
				// console.log("Active element is", top.document.activeElement, " despite hasFocus() being false so you've probably Alt+Tabbed");
			}

			clearInterval(iid);
			alt_held = false;

			const window_els = $(".os-window").toArray(); // @TODO: support webamp, but only one entry; maybe should be based on tasks, not windows
			if (window_els.length < 2) {
				return;
			}
			// @TODO: Clippy
			if (!notice_shown) {
				alert("It looks like you're trying to use Alt+Tab to switch between windows.\n\nUse Alt+` (grave accent) instead within the 98.js desktop.\n\nAlso, use Alt+4 instead of Alt+F4 to close windows.");
				notice_shown = true;
			}
		}
	}

})();
