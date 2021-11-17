
var programs_being_loaded = 0;

function enhance_iframe(iframe) {
	var $iframe = $(iframe);

	$("body").addClass("loading-program");
	programs_being_loaded += 1;

	$iframe.on("load", function () {

		if (--programs_being_loaded <= 0) {
			$("body").removeClass("loading-program");
		}

		try {
			console.assert(iframe.contentWindow.document === iframe.contentDocument); // just something that won't get optimized away if we were to ever use a minifier (or by the JIT compiler??)
		} catch (e) {
			console.warn(`[enhance_iframe] iframe integration is not available for '${iframe.src}'`);
			return;
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

		// Let the containing page handle keyboard events, with an opportunity to cancel them
		proxy_keyboard_events(iframe);

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

// Let the containing page handle keyboard events, with an opportunity to cancel them
function proxy_keyboard_events(iframe) {
	// Note: iframe must be same-origin, or this will fail.
	for (const event_type of ["keyup", "keydown", "keypress"]) {
		iframe.contentWindow.addEventListener(event_type, (event) => {
			const proxied_event = new KeyboardEvent(event_type, {
				target: iframe,
				view: iframe.ownerDocument.defaultView,
				bubbles: true,
				cancelable: true,
				key: event.key,
				keyCode: event.keyCode,
				which: event.which,
				code: event.code,
				shiftKey: event.shiftKey,
				ctrlKey: event.ctrlKey,
				metaKey: event.metaKey,
				altKey: event.altKey,
				repeat: event.repeat,
				//...@TODO: should it copy ALL properties?
			});
			const result = iframe.dispatchEvent(proxied_event);
			// console.log("proxied", event, "as", proxied_event, "result", result);
			if (!result) {
				event.preventDefault();
			}
		}, true);
	}
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

	$iframe.on("load", function () {
		$win.show();
		$win.focus();
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
