(() => {
	var $window_switcher = $("<div class='window-switcher outset-deep'>");
	var $window_switcher_list = $("<ul class='window-switcher-list'>").appendTo($window_switcher);
	var $window_switcher_window_name = $("<div class='window-switcher-window-name inset-deep'>").appendTo($window_switcher);
	var agent;
	var used_window_switcher = false;

	function activate_window($window) {
		// console.log("Activating window:", $window);
		$window.unminimize();
		$window.bringToFront();
		$window.focus(); // unminimize will focus but only if it was minimized (that's the current behavior anyway)
	}

	function show_window_switcher(cycle_backwards) {
		if ($window_switcher.is(":visible")) {
			cycle_window_switcher(cycle_backwards);
			return;
		}
		$window_switcher_list.empty();
		const tasks = Task.all_tasks;
		if (tasks.length === 1) {
			activate_window(tasks[0].$window);
			if (!used_window_switcher) {
				agent?.stopCurrent(); // needed to continue on from the message with `hold` set (speak(message, true))
				agent?.speak("If there's only one window, Alt+1 will switch to it right away.");
				// used_window_switcher = true; // allow the switching message to be spoken later
			}
			return;
		}
		if (tasks.length < 2) {
			return;
		}
		tasks.sort((a, b) =>
			// using z-index, as it's similar to last-used order
			b.$window[0].style.zIndex - a.$window[0].style.zIndex
		);
		for (const task of tasks) {
			var $window = task.$window;
			var $item = $("<li>").addClass("window-switcher-item");
			$item.append($window.getIconAtSize(32) ?? $("<img>").attr({
				src: "/images/icons/task-32x32.png",
				width: 32,
				height: 32,
				alt: $window.getTitle()
			}));
			$item.data("$window", $window);
			// $item.on("click", function () { // Windows 98 didn't allow clicking items in the window switcher.
			// 	activate_window($window);
			// });
			$window_switcher_list.append($item);
			if ($window.hasClass("focused")) {
				$item.addClass("active");
			}
		}
		cycle_window_switcher(cycle_backwards);
		$window_switcher.appendTo("body");
		// console.log("Showing window switcher", $window_switcher[0]);
		if (!used_window_switcher) {
			agent?.stopCurrent(); // needed to continue on from the message with `hold` set (speak(message, true))
			// Um, if you know about Alt+Tab, you can guess about how Alt+1 works. But Clippy is supposed to be annoying, right?
			agent?.speak("There you go! Press 1 until you get to the window you want.");
			used_window_switcher = true;
		}
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
		activate_window($active.data("$window"));
		$window_switcher.remove(); // must remove only after getting data()
	}
	function window_switcher_cancel() {
		$window_switcher.remove();
	}

	window.addEventListener("keydown", handle_keydown, true);
	window.addEventListener("keyup", handle_keyup, true);
	window.addEventListener("blur", window_switcher_cancel); // this may be from an iframe getting focus (e.g. an app was loading), but in that case we might not be able to get the keyup anyways
	// @TODO: detect if it's an iframe we've integrated with and thus could get the keyup event
	// @TODO: also detect blur inside iframes, to cancel window switching

	var iid;
	var alt_held = false; // for detecting likely Alt+Tab
	var notice_shown = false;
	function handle_keydown(e) {
		// We can't actually intercept Alt+F4, but might as well try, right?
		// Alt+4 is a made-up alternative.
		if (e.altKey && (e.key === "4" || e.key === "F4")) {
			e.preventDefault();
			const $window = e.target.closest(".os-window")?.$window;
			console.log("Alt+4 detected, closing window", $window, e.target);
			$window?.close();
		}
		// console.log(e.key, e.code);
		// I picked Alt+` originally as an alternative to Alt+Tab, but on Ubuntu it switches between windows of the same app.
		// Alt+1 is a more universal alternative, but it's not as obvious.
		if (e.altKey && (e.key === "1" || e.code === "Backquote" || e.code === "Tab")) {
			e.preventDefault();
			show_window_switcher(e.shiftKey);
		} else {
			window_switcher_cancel();
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

			// False positives:
			// - Alt+D focuses the address bar in Chrome
			// - Hold Alt and click outside the browser window
			// - Alt+Space shows the system window menu on some platforms, and on Ubuntu XFCE in Firefox this causes a false positive but not in Chrome apparently (weird!)
			// - Alt+(number) focuses a tab in Chrome, but it actually lets us cancel it; @TODO: detect this as not an Alt+Tab (could use a timeout after any key pressed while holding Alt)

			clearInterval(iid);
			alt_held = false;

			if (Task.all_tasks.length < 2) {
				return;
			}
			if (!notice_shown) {
				clippy.load("Clippy", function (loaded_agent) {
					agent = loaded_agent;
					agent.show();
					const message = "It looks like you're trying to switch windows.\n\nUse Alt+1 instead of Alt+Tab within the 98.js desktop.\n\nAlso, use Alt+4 instead of Alt+F4 to close windows.";
					agent.speak(message, true);
					// held message causes double click to not animate Clippy, for some reason (even after message is cleared)
					$(agent._el).one("dblclick", function () {
						agent.stopCurrent();
						agent.animate();
					});
				});
				notice_shown = true;
			}
		}
	}

})();
