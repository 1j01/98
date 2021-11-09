
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

	const template_url = new URL("../../src/WEB/FOLDER.HTT", window.location.href);
	const htt = await (await fetch(template_url)).text();
	const percent_vars = {
		THISDIRPATH: address,
		THISDIRNAME: get_display_name_for_address(address),
		TEMPLATEDIR: new URL(".", template_url).toString(),
		//template_url.href.split("/").slice(0, -1).join("/"),
	};
	const percent_var_regexp = /%([A-Z_]+)%/gi;
	const named_color_regexp = /(ButtonFace|...)not followed by \)/gi; // @TODO: transform to var(--ButtonFace)
	// @TODO: replace \ in paths after percent vars with /, and de-dupe by stripping slash from var values
	const html = htt.replaceAll(percent_var_regexp, (match, var_name) => {
		if (var_name in percent_vars) {
			return percent_vars[var_name];
		} else {
			console.warn("Unknown percent variable:", match);
			return match;
		}
	});
	
	const doc = new DOMParser().parseFromString(html, "text/html");
	console.log(doc);
	$(doc).find("script").each((i, script) => {
		if (script.hasAttribute("event")) {
			const event_name = script.getAttribute("event");
			script.removeAttribute("event");
			script.textContent = `addEventListener("${event_name}", (event) => {
${script.textContent}});`;
		} else {
			script.textContent = `(() => { /* make top level return valid */
${script.textContent}}());`;
		}
	});

	$iframe = $("<iframe>").attr({
		srcdoc: html,
	}).appendTo("#content");

	$iframe.on("load", () => {
		$iframe.contents()
			.find("object[classid='clsid:1820FED0-473E-11D0-A96C-00C04FD705A2']")
			.replaceWith(folder_view.element);
		$iframe.contents()
			.find("head")
			.append(`
		<meta charset="utf-8">
		<title>Folder Template</title>
		<link href="../../layout.css" rel="stylesheet" type="text/css">
		<link href="../../classic.css" rel="stylesheet" type="text/css">
		<link href="../../lib/os-gui/layout.css" rel="stylesheet" type="text/css">
		<link href="../../lib/os-gui/windows-98.css" rel="stylesheet" type="text/css">
		<link rel="icon" href="../../images/icons/explorer-16x16.png" sizes="16x16" type="image/png">
		<link rel="icon" href="../../images/icons/explorer-32x32.png" sizes="32x32" type="image/png">
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<script src="../../lib/jquery.min.js"></script>
		<script src="../../lib/browserfs.js"></script>
		<script src="../../lib/os-gui/$Window.js"></script>
		<script src="../../src/msgbox.js"></script>
		<script>defaultMessageBoxTitle = "Explorer";</script>
		<link href="explorer.css" rel="stylesheet" type="text/css">
`);
		eventHandlers.onStatus = ({ items, selectedItems }) => {
		
		};
	});

	// var range = document.createRange();
	// // Make the parent of the first div in the document become the context node
	// range.selectNode(document.getElementsByTagName("div").item(0));
	// var documentFragment = range.createContextualFragment(tagString);
	// document.body.appendChild(documentFragment);

	// execute scripts
// 	for (const script of doc.querySelectorAll("script")) {
// 		try {
// 			eval(script.textContent);
// 		} catch (error) {

// 		console.error(
// `Failed to render ${template_url}:

// `, error, `

// This is likely an error from evaluating scripts.

// Falling back to simple folder view.`
// 		);
// 		$("#content").empty();
// 		$(folder_view.element).appendTo("#content");
// 	}
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
							const dummy_menu_bar = new MenuBar({"Dummy": menu_items});
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
