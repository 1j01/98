
var programs_being_loaded = 0;

function enhance_iframe(iframe) {
	var $iframe = $(iframe);

	$("body").addClass("loading-program");
	programs_being_loaded += 1;

	$iframe.on("load", function () {

		if (--programs_being_loaded <= 0) {
			$("body").removeClass("loading-program");
		}

		if (window.themeCSSProperties) {
			applyTheme(themeCSSProperties, iframe.contentDocument.documentElement);
		}

		// Let the iframe to handle mouseup events outside itself
		// (without using setPointerCapture)
		iframe.contentDocument.addEventListener("mousedown", (event) => {
			var delegate_pointerup = function () {
				if (iframe.contentWindow && iframe.contentWindow.jQuery) {
					iframe.contentWindow.jQuery("body").trigger("pointerup");
				}
				if (iframe.contentWindow) {
					const event = new iframe.contentWindow.MouseEvent("mouseup", { button: 0 });
					iframe.contentWindow.dispatchEvent(event);
					const event2 = new iframe.contentWindow.MouseEvent("mouseup", { button: 2 });
					iframe.contentWindow.dispatchEvent(event2);
				}
				clean_up_delegation();
			};
			// @TODO: delegate pointermove events too?
			// @TODO: do delegation in os-gui.js library instead
			// is it delegation? I think I mean proxying (but I'm really tired and don't have internet right now so I can't say for sure haha)

			$G.on("mouseup blur", delegate_pointerup);
			iframe.contentDocument.addEventListener("mouseup", clean_up_delegation);
			function clean_up_delegation() {
				$G.off("mouseup blur", delegate_pointerup);
				iframe.contentDocument.removeEventListener("mouseup", clean_up_delegation);
			}
		});

		// on Wayback Machine, and iframe's url not saved yet
		if (iframe.contentDocument.querySelector("#error #livewebInfo.available")) {
			var message = document.createElement("div");
			message.style.position = "absolute";
			message.style.left = "0";
			message.style.right = "0";
			message.style.top = "0";
			message.style.bottom = "0";
			message.style.background = "#c0c0c0";
			message.style.color = "#000";
			message.style.padding = "50px";
			iframe.contentDocument.body.appendChild(message);
			message.innerHTML = `<a target="_blank">Save this url in the Wayback Machine</a>`;
			message.querySelector("a").href =
				"https://web.archive.org/save/https://98.js.org/" +
				iframe.src.replace(/.*https:\/\/98.js.org\/?/, "");
			message.querySelector("a").style.color = "blue";
		}

		var $contentWindow = $(iframe.contentWindow);
		$contentWindow.on("pointerdown click", function (e) {
			iframe.$window && iframe.$window.focus();

			// from close_menus in $MenuBar
			$(".menu-button").trigger("release");
			// Close any rogue floating submenus
			$(".menu-popup").hide();
		});
		// We want to disable pointer events for other iframes, but not this one
		$contentWindow.on("pointerdown", function (e) {
			$iframe.css("pointer-events", "all");
			$("body").addClass("drag");
		});
		$contentWindow.on("pointerup", function (e) {
			$("body").removeClass("drag");
			$iframe.css("pointer-events", "");
		});
		// $("iframe").css("pointer-events", ""); is called elsewhere.
		// Otherwise iframes would get stuck in this interaction mode

		iframe.contentWindow.close = function () {
			iframe.$window && iframe.$window.close();
		};
		// TODO: hook into saveAs (a la FileSaver.js) and another function for opening files
		// iframe.contentWindow.saveAs = function(){
		// 	saveAsDialog();
		// };

		// Don't override alert (except within the specific pages)
		// but override the underlying message box function that
		// the alert override uses, so that the message boxes can
		// go outside the window.
		iframe.contentWindow.showMessageBox = (options) => {
			return showMessageBox({
				title: options.title ?? iframe.contentWindow.defaultMessageBoxTitle,
				...options,
			});
		};
	});
	$iframe.css({
		minWidth: 0,
		minHeight: 0, // overrides user agent styling apparently, fixes Sound Recorder
		flex: 1,
		border: 0, // overrides user agent styling
	});
}

function make_iframe_window(options) {

	options.resizable ??= true;
	var $win = new $Window(options);

	var $iframe = $win.$iframe = $("<iframe>").attr({ src: options.src });
	enhance_iframe($iframe[0]);
	$win.$content.append($iframe);
	var iframe = $win.iframe = $iframe[0];
	// TODO: should I instead of having iframe.$window, have a get$Window type of dealio?
	// where all is $window needed?
	// I know it's used from within the iframe contents as frameElement.$window
	iframe.$window = $win;

	var alt_held = false;
	$iframe.on("load", function () {
		$win.show();
		$win.focus();
		// @TODO: remove the need for duplicate event handlers
		// by proxying events from the iframe to the window
		iframe.contentWindow.addEventListener("keydown", handle_keydown, true);
		iframe.contentWindow.addEventListener("keyup", handle_keyup, true);
	});

	$win.on("keydown", handle_keydown, true);
	$win.on("keyup", handle_keyup, true);
	// $(top).on("keyup", handle_keyup, true);

	var iid;
	var notice_shown = false;
	function handle_keydown(e) {
		if (e.altKey && (e.key === "4" || e.key === "F4")) { // we can't actually intercept Alt+F4, but might as well try, right?
			e.preventDefault();
			$win.close();
		}
		// console.log(e.key, e.code);
		if (e.altKey && (e.code === "Backquote" || e.code === "Tab")) {
			show_window_switcher(e.shiftKey);
		}
		if (e.key === "Alt") {
			alt_held = true;
			// console.log("Alt held");
			iid = setInterval(look_for_focus_loss, 200);
		}
	}
	function handle_keyup(e) {
		// console.log("keyup", e.key, e.code);
		if (e.key === "Alt") {
			alt_held = false;
			clearInterval(iid);
			// console.log("Alt released");
			window_switcher_close_and_select();
		}
	}
	function look_for_focus_loss() {
		if (!top.document.hasFocus() && alt_held) {
			clearInterval(iid);
			// @TODO: Clippy
			if (!notice_shown) {
				alert("It looks like you're trying to use Alt+Tab to switch between windows.\n\nUse Alt+` (grave accent) instead within the 98.js desktop.\n\nAlso, use Alt+4 instead of Alt+F4 to close windows.");
				notice_shown = true;
			} else {
				// console.log("Alt+Tab detected, notice already shown");
			}
		}
	}
	$win.on("closed", function () {
		clearInterval(iid);
	});

	$win.$content.css({
		display: "flex",
		flexDirection: "column",
	});

	// TODO: cascade windows
	$win.center();
	$win.hide();

	return $win;
}

// Fix dragging things (i.e. windows) over iframes (i.e. other windows)
// (when combined with a bit of css, .drag iframe { pointer-events: none; })
// (and a similar thing in make_iframe_window)
$(window).on("pointerdown", function (e) {
	//console.log(e.type);
	$("body").addClass("drag");
});
$(window).on("pointerup dragend blur", function (e) {
	//console.log(e.type);
	if (e.type === "blur") {
		if (document.activeElement.tagName.match(/iframe/i)) {
			return;
		}
	}
	$("body").removeClass("drag");
	$("iframe").css("pointer-events", "");
});

// @TODO: why does this code live here? It should be generalized to all windows.
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
	const $active = $window_switcher.find(".active");
	if ($active.length === 0) {
		return;
	}
	$active.data("$window").focus();
	$window_switcher.remove(); // must remove only after getting data()
}

