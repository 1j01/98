
function parse_query_string(queryString) {
	var query = {};
	var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
	}
	return query;
}

function set_title(title) {
	document.title = title;

	if (frameElement && frameElement.$window) {
		frameElement.$window.title(document.title);
	}
}

function set_icon(icon_id) {
	document.querySelector("link[rel~=icon]").href = getIconPath(icon_id, 16)
	if (frameElement && frameElement.$window) {
		frameElement.$window.setIcons({
			"16": getIconPath(icon_id, 16),
			"32": getIconPath(icon_id, 32),
		});
	}
}

// @TODO: maintain less fake naming abstraction
// base it more on the actual filesystem
function get_display_name_for_address(address) {
	if (system_folder_path_to_name[address]) {
		return system_folder_path_to_name[address];
	} else if (address.match(/\w+:\/\//)) {
		return address;
	} else {
		return file_name_from_path(address.replace(/[\/\\]$/, ""));
	}
}

function get_icon_for_address(address) {
	// TODO: maintain less fake naming abstraction
	// base it more on the actual filesystem
	if (address === "/") { // currently / is our C:\ analog (or C:\Windows\)
		return "hard-disk-drive";
		// }else if(address === "/my-computer/"){ // we don't have an actual My Computer location yet, it just opens (C:)
		// 	return "my-computer";
	} else if (address === "/my-documents/") {
		return "my-documents";
	} else if (address === "/network-neighborhood/") {
		return "network";
	} else if (address === "/desktop/") { // i.e. C:\Windows\Desktop
		return "desktop";
	} else if (address.match(/^\w+:\/\//) || address.match(/\.html?$/)) {
		return "html";
	} else {
		return "folder-open";
	}
}

var offline_mode = false;

var folder_view, $iframe;
var active_address = "";
setInterval(() => {
	try {
		if ($iframe && $iframe[0].contentWindow) {
			active_address = $iframe[0].contentWindow.location.href;
		}
	} catch (e) {
		// ignore
	}
}, 200);

var go_to = function (address) {
	if (folder_view) {
		folder_view.element.remove();
		folder_view = null;
	}
	if ($iframe) {
		$iframe.remove();
		$iframe = null;
	}

	address = address || "/";
	var is_url = !!address.match(/\w+:\/\//);
	var drive_match = address.match(/^\(?([a-z]):\)?[/\\]?\)?$/i);
	function handle_url_case() {
		if (!address.match(/^https?:\/\/web.archive.org\//) && !address.startsWith(window.location.origin)) {
			if (address.match(/^https?:\/\/(www\.)?(windows93.net)/)) {
				address = "https://web.archive.org/web/2015-05-05/" + address;
			} else if (
				!address.match(/^https?:\/\/(www\.)?(copy.sh)/) &&
				!address.match(/^(file|data|blob):\/\//)
			) {
				address = "https://web.archive.org/web/1998/" + address;
			}
		}
		is_url = true;
		if (offline_mode) {
			showMessageBox({
				title: "Web page unavailable while offline",
				message: "The Web page you requested is not available while offline.\n\n" +
					"To view this page, click Connect.",
				buttons: [
					// @TODO: accelerators &C and &S
					{
						label: "Connect",
						value: "connect",
						default: true,
					},
					{
						label: "Stay Offline",
					},
				],
				iconID: "offline",
			}).then((result) => {
				if (result === "connect") {
					offline_mode = false;
					address_determined();
				}
			});
		} else {
			address_determined();
		}
	}
	if (system_folder_lowercase_name_to_path[address.toLowerCase()]) {
		address = system_folder_lowercase_name_to_path[address.toLowerCase()];
		address_determined();
	} else if (drive_match) {
		if (drive_match[1].toUpperCase() === "C") {
			address = "/";
			address_determined();
		} else {
			alert("Drive not found.");
		}
	} else if (is_url) {
		handle_url_case();
	} else {
		withFilesystem(function () {
			var fs = BrowserFS.BFSRequire("fs");
			fs.stat(address, function (err, stats) {
				if (err) {
					if (err.code === "ENOENT") {
						address = "https://" + address;
						handle_url_case();
						return;
					}
					return alert("Failed to get info about " + address + "\n\n" + err);
				}
				if (stats.isDirectory()) {
					if (address[address.length - 1] !== "/") {
						address += "/";
					}
					address_determined();
				} else {
					// TODO: open html files in a new window, but don't infinitely recurse
					// executeFile(address);
					if (address.match(/\.html$/i)) {
						address = window.location.origin + "/" + address.replace(/^\/?/, "");
						is_url = true;
						address_determined();
					} else {
						executeFile(address);
					}
				}
			});
		});
	}

	function address_determined() {
		if (system_folder_path_to_name[address]) {
			$("#address").val(system_folder_path_to_name[address]);
		} else {
			$("#address").val(address);
		}
		$("#address-icon").attr("src", getIconPath(get_icon_for_address(address), 16));
		active_address = address;

		set_title(get_display_name_for_address(address));
		set_icon(get_icon_for_address(address));

		$("#status-bar-left-text").empty();

		if (is_url) {
			$iframe = $("<iframe>").attr({
				src: address,
				allowfullscreen: "allowfullscreen",
				sandbox: "allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-modals allow-popups",
			}).appendTo("#content");

			// If only we could access the contentDocument cross-origin
			// For https://archive.is/szqQ5
			// $iframe.on("load", function(){
			// 	$($iframe[0].contentDocument.getElementById("CONTENT")).css({
			// 		position: "absolute",
			// 		left: 0,
			// 		top: 0,
			// 		right: 0,
			// 		bottom: 0,
			// 	});
			// });

			// We also can't inject a user agent stylesheet, for things like scrollbars
			// Too bad :/

			// We also can't get the title; it's kinda hard to make a web browser like this!
			// $iframe.on("load", function(){
			// 	set_title($iframe[0].contentDocument.title + " - Explorer"); // " - Microsoft Internet Explorer"
			// });

			$("#status-bar-right-icon").attr({
				src: getIconPath("zone-internet", 16),
				hidden: false,
			});
			$("#status-bar-right-text").text("Internet");
		} else {
			const eventHandlers = {}; // @TODO: less hacky event duct tape
			// (just wanna have multiple listeners, but I gave myself a single-listener API)
			// (I could just use DOM events on folder_view.element)
			folder_view = new FolderView(address, {
				onStatus: ({ items, selectedItems }) => {
					$("#status-bar-left-text").text(
						selectedItems.length > 0 ?
							selectedItems.length + " object(s) selected" :
							items.length + " object(s)"
					);
					eventHandlers.onStatus?.({ items, selectedItems });
				},
			});
			render_folder_template(folder_view, address, eventHandlers);
			folder_view.focus();

			if (
				address !== "/desktop/" &&
				address !== "/recycle-bin/" &&
				address !== "/network-neighborhood/"
			) {
				$("#status-bar-right-icon").attr({
					src: getIconPath("my-computer", 16),
					hidden: false,
				});
				$("#status-bar-right-text").text("My Computer");
			} else {
				$("#status-bar-right-icon").attr({
					hidden: true,
				});
				$("#status-bar-right-text").text("");
			}
		}
	}
};

async function render_folder_template(folder_view, address, eventHandlers) {
	$("#content").empty();

	const template_url = new URL("../../src/WEB/FOLDER.HTT", location.href);
	const htt = await (await fetch(template_url)).text();
	const percent_vars = {
		THISDIRPATH: new URL(address, location.href),
		THISDIRNAME: get_display_name_for_address(address),
		TEMPLATEDIR: new URL(".", template_url).toString(),
		//template_url.href.split("/").slice(0, -1).join("/"),
	};
	const percent_var_regexp = /%([A-Z_]+)%/gi;
	const named_color_to_css_var = {
		ActiveBorder: "var(--ActiveBorder)", // Active window border.
		ActiveCaption: "var(--ActiveTitle)", // Active window caption.
		AppWorkspace: "var(--AppWorkspace)", // Background color of multiple document interface.
		Background: "var(--Background)", // Desktop background.
		ButtonFace: "var(--ButtonFace)", // Face color for three-dimensional display elements.
		ButtonHighlight: "var(--ButtonHilight)", // Dark shadow for three-dimensional display elements(for edges facing away from the light source).
		ButtonShadow: "var(--ButtonShadow)", // Shadow color for three-dimensional display elements.
		ButtonText: "var(--ButtonText)", // Text on push buttons.
		CaptionText: "var(--TitleText)", // Text in caption, size box, and scrollbar arrow box.
		GrayText: "var(--GrayText)", // Grayed(disabled) text.This color is set to #000 if the current display driver does not support a solid gray color.
		Highlight: "var(--Hilight)", // Item(s) selected in a control.
		HighlightText: "var(--HilightText)", // Text of item(s) selected in a control.
		InactiveBorder: "var(--InactiveBorder)", // Inactive window border.
		InactiveCaption: "var(--InactiveTitle)", // Inactive window caption.
		InactiveCaptionText: "var(--InactiveTitleText)", // Color of text in an inactive caption.
		InfoBackground: "var(--InfoWindow)", // Background color for tooltip controls.
		InfoText: "var(--InfoText)", // Text color for tooltip controls.
		Menu: "var(--Menu)", // Menu background.
		MenuText: "var(--MenuText)", // Text in menus.
		Scrollbar: "var(--Scrollbar)", // Scroll bar gray area.
		ThreeDDarkShadow: "var(--ButtonDkShadow)", // Dark shadow for three-dimensional display elements.
		ThreeDFace: "var(--ButtonFace)", // Face color for three-dimensional display elements.
		ThreeDHighlight: "var(--ButtonHilight)", // Highlight color for three-dimensional display elements.
		ThreeDLightShadow: "var(--ButtonLight)", // Light color for three-dimensional display elements(for edges facing the light source).
		ThreeDShadow: "var(--ButtonShadow)", // Dark shadow for three-dimensional display elements.
		Window: "var(--Window)", // Window background.
		WindowFrame: "var(--WindowFrame)", // Window frame.
		WindowText: "var(--WindowText)", // Text in windows.
	};
	const lowercase_named_color_to_css_var = Object.fromEntries(
		Object.entries(named_color_to_css_var)
			.map(([key, value]) => [key.toLowerCase(), value])
	);
	const named_color_regexp = new RegExp(`(${Object.keys(named_color_to_css_var).join("|")})(?!\s*[)?.:=\[])`, "gi");
	// @TODO: replace \ in paths after percent vars with /, and de-dupe by stripping slash from var values
	// and protocol e.g. file://%TEMPLATEDIR%\wvleft.bmp
	let html = htt.replaceAll(percent_var_regexp, (match, var_name) => {
		if (var_name in percent_vars) {
			return percent_vars[var_name];
		} else {
			console.warn("Unknown percent variable:", match);
			return match;
		}
	});
	html = html.replaceAll(named_color_regexp, (match, color_name) =>
		lowercase_named_color_to_css_var[color_name.toLowerCase()]
	);

	const doc = new DOMParser().parseFromString(html, "text/html");
	$(doc).find("script").each((i, script) => {
		if (script.getAttribute("language") === "JavaScript") {
			script.removeAttribute("language");
		}
		if (script.hasAttribute("for")) {
			script.removeAttribute("for");
		}
		// HACK: making everything global so I can wrap things in functions
		// JUSTIFICATION: most stuff is probably global already in this ancient HTML
		// const to_export = script.textContent.matchAll(/(function|var)\s+([a-zA-Z_$][\w$]*)\s*[(;=]/g);
		const func_matches = script.textContent.matchAll(/function\s+([a-zA-Z_$][\w$]*)\s*\(/g);
		let exports = "";
		for (const func_match of func_matches) {
			const func_name = func_match[1];
			exports += `window.${func_name} = ${func_name};\n`;
		}
		// first handle `var foo;`
		script.textContent = script.textContent.replaceAll(
			/var\s([a-zA-Z_$][\w$]*)[;\n\r]/g,
			"/*var*/ window.$1 = undefined;"
		);
		// then handle `var foo = bar;`
		script.textContent = script.textContent.replaceAll(/var\s/g, "/*var*/ window.");

		if (script.hasAttribute("event")) {
			const event_name = script.getAttribute("event");
			script.removeAttribute("event");
			script.textContent = `addEventListener("${event_name}", (event) => {
${script.textContent}
${exports}
});`;
		} else {
			script.textContent = `(() => { /* make top level return valid */
${script.textContent}
${exports}
})();`;
		}
	});

	// html = new XMLSerializer().serializeToString(doc);
	html = `<!doctype html>
${doc.documentElement.outerHTML}`;

	// This function will be run in the context of the iframe.
	// It is here for syntax highlighting/checking/formatting,
	// and avoiding escaping complexities, but it will be stringified,
	// so note that variables can not be referenced from the outer scope.
	const head_injected_script_fn = () => {
		// Usually the scripts refer to "document.all.FileList", but sometimes use just "FileList",
		// relying on the fact that IDs pollute the global namespace.
		Object.defineProperty(window, "FileList", {
			get() { return document.getElementById("FileList"); }
		});

		// Neither Chrome or Firefox are working for debugging srcdoc iframes.
		// Chrome gives wildly incorrect line numbers,
		// and Firefox just gives "Error loading this URI: Unknown source"
		// or sometimes it opens view-source:about:srcdoc in a new tab ("Hmm. That address doesn’t look right.")
		// Of course, as I'm implementing this, finally Firefox is starting working... sometimes.
		addEventListener("error", (event) => {
			const { $window } = showMessageBox({
				message: "An error occurred.",
			});
			// $window.$content.append(`
			// 	<details>
			// 		<summary>Details</summary>
			// 		<pre class='error-pre'></pre>
			// 		<pre class='location-pre'></pre>
			// 	</details>
			// `)
			$window.$content.append(`
				<pre class='error-pre'></pre>
				<pre class='location-pre'></pre>
			`)
			$window.$content.find("pre")
				.css({
					overflow: "auto",
					maxHeight: 400,
					textAlign: "left",
					background: "var(--Window)",
					color: "var(--WindowText)",
					margin: 10,
					padding: 5,
					userSelect: "text",
					cursor: "auto",
					// whiteSpace: "pre-wrap",
				});

			$window.$content.find(".error-pre").text(event.error);

			const srcdoc = frameElement.srcdoc;
			const lines = srcdoc.split(/\r\n|\r|\n/g);

			$window.$content.find(".location-pre").append(
				lines.map((line, index) =>
					$("<div>").text(
						// ((index + 1 == event.lineno) ? "--->" : "    ") +
						(index + 1 + "").padStart(4, " ") + ": " + line
					).css({
						background: (index + 1 == event.lineno) ? "var(--Hilight)" : "",
						color: (index + 1 == event.lineno) ? "var(--HilightText)" : "",
						width: "1000%", // because ugh highlight doesn't extend to whole line if it scrolls
					})
				)
					.slice(event.lineno - 5, event.lineno + 4)
			);
		});

		// Allow message boxes to go outside the window.
		showMessageBox = parent.showMessageBox || showMessageBox;

		// Implement <object-hack>, which we'll convert <object ...> to.
		class ObjectHack extends HTMLElement {
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
				this._params_slot = document.createElement("slot");
				this.shadowRoot.append(this._params_slot);
			}
			connectedCallback() {
				const params = {};
				for (const param_el of this.querySelectorAll("param")) {
					params[param_el.name] = param_el.value;
				}
				console.log(params, this.children, this._params_slot.children);
				console.log(`this.getAttribute("classid")`, this.getAttribute("classid"));
				switch (this.getAttribute("classid")) {
					case "clsid:1D2B4F40-1F10-11D1-9E88-00C04FDCAB92":
						// thumbnail
						const img = document.createElement("img");
						this.shadowRoot.append(img);
						this.haveThumbnail = () => {
							return false;
						};
						this.displayFile = (path) => {
							img.src = path;
						}
						break;
					case "clsid:1820FED0-473E-11D0-A96C-00C04FD705A2":
						// folder view
						console.log("making folder view");
						const folder_view = frameElement._folder_view;
						this.shadowRoot.append(folder_view.element);

						this.SelectedItems = () => {
							const selected_items = folder_view.items.filter((item) => item.element.classList.contains("selected"));
							return {
								Count: () => selected_items.length,
								Item: (index) => {
									const item = selected_items[index];
									if (!item) {
										return {}; // ???
									}
									return {
										Name: item.title,
										Size: item.resolvedStats?.size,
										Path: item.file_path,
									};
								},
							};
						};
						const detail_key = {
							0: "name",
							2: "type",
							3: "date",
						};
						this.Folder = {
							GetDetailsOf: (item, detail_id) => {
								if (item == null) {
					
								} else {
					
								}
							}
						};
						break;
					case "clsid:05589FA1-C356-11CE-BF01-00AA0055595A":
						// media player
						const video = document.createElement("video"); // @TODO: or audio
						video.src = params.FileName;
						video.controls = true;
						this.shadowRoot.append(video);
						break;
					default:
						console.warn("Unsupported classid value:", this.getAttribute("classid"));
						console.log(this.attributes);
						break;
				}
			}
		}
		customElements.define("object-hack", ObjectHack);
	};
	html = html.replace(/<object/ig, "<object-hack");
	html = html.replace(/<\/object/ig, "</object-hack");

	const head_injected_html = `
		<meta charset="utf-8">
		<title>Folder Template</title>
		<link href="../../layout.css" rel="stylesheet" type="text/css">
		<link href="../../classic.css" rel="stylesheet" type="text/css">
		<link href="../../lib/os-gui/layout.css" rel="stylesheet" type="text/css">
		<link href="../../lib/os-gui/windows-98.css" rel="stylesheet" type="text/css">
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<script src="../../lib/jquery.min.js"></script>
		<script src="../../lib/os-gui/$Window.js"></script>
		<script src="../../src/msgbox.js"></script>
		<script>defaultMessageBoxTitle = "Explorer";</script>
		<style>
			.desktop-icon .title {
				/* background: transparent; */
				/* mix-blend-mode seems to need a background (for the dotted focus effect) */
				background: var(--Window);
				color: var(--WindowText);
			}
			.folder-view {
				background: var(--Window); /* needed for mix-blend-mode */
				color: var(--WindowText);
			}
		</style>
		<script>
			(${head_injected_script_fn})();
		</script>
	`;

	html = html.replace(/\s+<\/head>/i, (match) => `${head_injected_html}\n${match}`);

	$iframe = $("<iframe>").attr({
		srcdoc: html,
	}).appendTo("#content");

	$iframe[0]._folder_view = folder_view;

	$iframe.on("load", () => {
		var doc = $iframe[0].contentDocument;
		// const object = doc.querySelector("object[classid='clsid:1820FED0-473E-11D0-A96C-00C04FD705A2']");
		// $(object).replaceWith(folder_view.element);
		// for (var i = 0; i < object.attributes.length; i++) {
		// 	var attribute = object.attributes[i];
		// 	folder_view.element.setAttribute(attribute.name, attribute.value);
		// }

		// not working:
		// var range = doc.createRange();
		// range.selectNode(doc.head); // sets context node
		// var document_fragment = range.createContextualFragment(head_inject_html);
		// document.head.appendChild(document_fragment);

		// not working:
		// $iframe.contents()
		// 	.find("head")
		// 	.append(head_inject_html);

		eventHandlers.onStatus = ({ items, selectedItems }) => {
			doc.dispatchEvent(new CustomEvent("SelectionChanged", { bubbles: true }));
			// @TODO: render preview of selected item(s?), and trigger OnThumbnailReady
		};
	});
}

function refresh() {
	// go to whatever the address was before
	// ignoring changes to the address since navigation
	go_to(active_address);
}

function go_back() {
	// TODO: show message about why it doesn't work
	// if it doesn't work - I mean, might as well have it try it!
	$iframe[0].contentWindow.history.back();
}
function go_forward() {
	$iframe[0].contentWindow.history.forward();
}
function can_go_back() {
	try {
		return $iframe[0].contentWindow.history.length > 1;
	} catch (e) {
		return false;
	}
}
function can_go_forward() {
	try {
		return $iframe[0].contentWindow.history.length > 1;
	} catch (e) {
		return false;
	}
}

function get_up_address(address) {
	return address.replace(/[^\/]*\/?$/, "").replace(/(https?|ftps?|sftp|file):\/\/\/?$/, "") || "/";
}

function go_up() {
	// can't use $iframe[0].contentWindow.location (unless page is on the same domain)
	go_to(get_up_address(active_address));
}
function can_go_up() {
	return get_up_address(active_address) !== active_address;
}


// called from FolderView
function executeFile(file_path) {
	// I don't think this withFilesystem is necessary
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.stat(file_path, function (err, stats) {
			if (err) {
				return alert("Failed to get info about " + file_path + "\n\n" + err);
			}
			if (stats.isDirectory()) {
				go_to(file_path);
			} else {
				// (can either check frameElement or parent !== window, but not parent by itself)
				if (frameElement) {
					parent.executeFile(file_path);
				} else {
					alert("Can't open files in standalone mode. Explorer must be run in a desktop.");
				}
			}
		});
	});
}

$(function () {
	var query = parse_query_string(location.search);
	// try to prevent our (potentially existing) iframe from blocking the iframe we're *inside* from blocking the *window* we're inside from showing up until the page loads 
	// TODO: do so consistently
	// wait wouldn't the iframe we're in have loaded by now? or no
	setTimeout(function () {
		if (query.address) {
			go_to(query.address);
		} else {
			go_to("/");
		}
	});
	$("#address").on("keydown", function (e) {
		if (e.which === 13) {
			go_to($("#address").val());
		}
	});
	$("#address").on("pointerdown", function (e) {
		if (this !== document.activeElement) {
			$(this).select();
			e.preventDefault(); // prevents starting a selection
		}
	});
	$("#address").on("focus", function (e) {
		$(this).select();
	});
	$("#address").on("dragstart", function (e) {
		e.preventDefault();
	});
	$("#back").on("click", go_back);
	$("#forward").on("click", go_forward);
	$("#up").on("click", go_up);

	$("#delete").on("click", function () {
		folder_view.delete_selected();
	});

	var $up_button = $("#up");
	var $back_button = $("#back");
	var $forward_button = $("#forward");
	setInterval(() => {
		$up_button.attr("disabled", can_go_up() ? null : "disabled");
		$back_button.attr("disabled", can_go_back() ? null : "disabled");
		$forward_button.attr("disabled", can_go_forward() ? null : "disabled");
	}, 100);

	$(".toolbar button:not(#view-menu-button)").each((i, button) => {
		const $button = $(button);
		const sprite_n = [0, 1, 44, 21, 22, 23, 24, 26, 31, 38][i];
		$("<div class='icon'/>")
			.appendTo($button)
			.css({
				backgroundPosition: `${-sprite_n * 20}px 0px`,
			});
	});

	$(document).on("pointerdown", ".toolbar-drag-handle", (event) => {
		// console.log("pointerdown", event.currentTarget);
		const pointer_id = event.pointerId ?? event.originalEvent.pointerId;
		const toolbar_el = event.currentTarget.closest(".toolbar");
		function release_drag(event) {
			if ((event.pointerId ?? event.originalEvent.pointerId) === pointer_id) {
				$(window).off("pointerup", release_drag);
				$(window).off("pointercancel", release_drag);
				$(window).off("pointermove", drag);
				toolbar_el.style.cursor = "";
			}
		}
		function drag(event) {
			const el_under_pointer = document.elementFromPoint(event.clientX, event.clientY);
			if (!el_under_pointer) {
				return;
			}
			const toolbar_el_under_pointer = el_under_pointer.closest(".toolbar");
			if (
				!toolbar_el_under_pointer ||
				toolbar_el_under_pointer === toolbar_el
			) {
				return;
			}
			// swap the two toolbars
			const toolbar_el_prev_sibling = toolbar_el.nextElementSibling;
			const toolbar_el_under_pointer_prev_sibling = toolbar_el_under_pointer.nextElementSibling;
			toolbar_el.parentNode.insertBefore(toolbar_el_under_pointer, toolbar_el_prev_sibling);
			toolbar_el_under_pointer.parentNode.insertBefore(toolbar_el, toolbar_el_under_pointer_prev_sibling);

			update_toolbar_overflow();
		}
		$(window).on("pointerup", release_drag);
		$(window).on("pointercancel", release_drag);
		$(window).on("pointermove", drag);
		toolbar_el.style.cursor = "move";
		toolbar_el.setPointerCapture(pointer_id);
		event.preventDefault();
	});
	$(window).on("selectstart", ".toolbar", (event) => {
		console.log("selectstart", event.currentTarget);
		event.preventDefault();
	});
	$(window).on("resize", () => {
		update_toolbar_overflow();
	});
	update_toolbar_overflow();

	function update_toolbar_overflow() {
		// each toolbar should get an overflow menu button
		// if there's not enough space.
		// Windows 98 doesn't actually hide the items that are cut off;
		// you can sometimes see a partially cut off item,
		// but it should appear in the overflow menu.
		$(".toolbar").each((i, toolbar_el) => {
			const $toolbar_el = $(toolbar_el);
			let $overflow_button = $toolbar_el.find(".toolbar-overflow-menu-button");
			if (toolbar_el.scrollWidth > toolbar_el.clientWidth) {
				if (!$overflow_button.length) {
					$overflow_button = $("<button class='toolbar-overflow-menu-button lightweight'/>")
						.appendTo($toolbar_el)
						.text("»"); // @TODO: SVG
					// @TODO: don't open if just clicked to close
					$overflow_button.on("click", (event) => {
						const $menu = $("<div class='toolbar-overflow-menu outset-deep'/>");
						$menu.css({
							position: "fixed",
							top: $toolbar_el.offset().top + $toolbar_el.outerHeight(),
							right: document.body.clientWidth - $toolbar_el.offset().left - $toolbar_el.outerWidth(),
						});
						$menu.appendTo(document.body);

						// click outside the menu to close
						// including clicking outside the iframe
						$(window).on("pointerdown", global_pointerdown);
						$(window).on("blur", close_menu);
						function close_menu() {
							$menu.remove();
							$(window).off("pointerdown", global_pointerdown);
							$(window).off("blur", close_menu);
						}
						function global_pointerdown(event) {
							if (event.target.closest(".toolbar-overflow-menu, .menu-popup")) {
								return;
							}
							close_menu();
						}

						// add copies of the overflowed items to the menu
						const items = $toolbar_el.find("button, .menu-button").toArray();
						const overflowed_items = items.filter((item) =>
							item.offsetLeft + item.offsetWidth > toolbar_el.clientWidth
						);
						if ($toolbar_el.is("#menu-bar-toolbar")) {
							// display menu bar overflow items like a normal menu
							const overflow_menus = {};
							for (const [menu_key, menu] of Object.entries(menus)) {
								if (overflowed_items.some((item) => item.textContent === remove_hotkey(menu_key))) {
									overflow_menus[menu_key] = menu;
								}
							}
							// translate menus into menu items
							// @TODO: in a future version of OS-GUI,
							// top level menus should have a similar structure
							// and there should be an API for context menus
							// which we could use here. (or perhaps overflow menus should be part of the library)
							const menu_items = Object.entries(overflow_menus).map(([menu_key, menu]) => {
								return {
									item: menu_key,
									submenu: menu,
								};
							});
							const dummy_menu_bar = new MenuBar({ "Dummy": menu_items });
							$menu.append(dummy_menu_bar.element);
							$menu.css({
								top: $toolbar_el.offset().top,
							});
							$menu.find(".menu-button")[0].dispatchEvent(new Event("pointerdown"));
							// @TODO: don't involve $menu in the first place
							// $menu.remove(); // breaks positioning
							$menu.css({
								visibility: "hidden",
								pointerEvents: "none", // is this necessary?
							});
							// If you hit Escape, refocus the real menu bar
							// @TODO: doesn't work because Escape closes all menus in a "just in case" way
							// dummy_menu_bar.element.addEventListener("focusin", (event) => {
							// 	console.log("hello");
							// 	menu_bar.focus();
							// });
						} else {
							for (const item of items) {
								if (item.offsetLeft + item.offsetWidth > toolbar_el.clientWidth) {
									// $(item).clone(true).appendTo($menu); // would only work with jQuery event listeners
									$(item).clone().appendTo($menu).on("click", (event) => {
										// item.dispatchEvent(new Event("pointerdown")); // was for menu buttons
										item.click();
										close_menu();
									});
								}
							}
						}
					});
				}
			} else {
				$overflow_button.remove();
			}
		});
	}

	$(window).on("keydown", (event) => {
		// @TODO: handle all modifiers explicitly
		if (event.key === "F5") {
			refresh();
			event.preventDefault();
		} else if (event.key === "BrowserBack" || (event.key === "ArrowLeft" && event.altKey)) {
			go_back();
			event.preventDefault();
		} else if (event.key === "BrowserForward" || (event.key === "ArrowRight" && event.altKey)) {
			go_forward();
		} else if (event.key === "ArrowUp" && event.altKey) {
			go_up();
		}
	});

	// @TODO: expose this in OS-GUI library
	function remove_hotkey(text) {
		return text.replace(/\s?\(&.\)/, "").replace(/([^&]|^)&([^&\s])/, "$1$2");
	}
});
