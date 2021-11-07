
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
		address_determined();
	}
	if (system_folder_lowercase_name_to_path[address.toLowerCase()]) {
		address = system_folder_lowercase_name_to_path[address.toLowerCase()];
		address_determined();
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
		} else {
			folder_view = new FolderView(address);
			$(folder_view.element).appendTo("#content");
			folder_view.focus();
		}
	}
};

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
	$("#refresh").on("click", refresh);
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

});
