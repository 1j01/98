
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

var navigate_audio = new Audio("/audio/START.WAV");

var offline_mode = false;

var folder_view, $iframe;

var history_back_stack = [];
var history_forward_stack = [];

var active_address = "";
setInterval(() => {
	try {
		if ($iframe && $iframe[0].contentWindow && !folder_view) {
			if ($iframe[0].contentWindow.location.href !== "about:blank") {
				active_address = $iframe[0].contentWindow.location.href;
			}
		}
	} catch (e) {
		// ignore
	}
}, 200);

var go_to = async function (address, action_name = "go") {

	// for preventing focus from being lost when navigating
	// folder_view.element.contains(document.activeElement) is not needed because
	// the folder view is currently in an iframe (the iframe)
	const had_focus = $iframe && document.activeElement === $iframe[0];

	// @TODO: split out src and normalized address, and use normalized address for the input, but use src for the iframe
	// so the address can show the system path, and Up command can return to a folder (rather than an HTTP server's folder listing, or a 404, depending on the server)

	let normalized_address, is_url, zone;
	try {
		({ normalized_address, is_url, zone } = await resolve_address(address));
	} catch (error) {
		if (error._is_drive_not_found_error) {
			alert("Drive not found.");
			return;
		} else if (error._is_stat_error) {
			alert("Failed to get info about " + address + "\n\n" + error);
			return;
		} else {
			alert("Failed to resolve address " + address + "\n\n" + error);
			return;
		}
	}
	address = normalized_address;

	if (
		action_name !== "initially-load" && // load can take time, and thus the sound doesn't work well as an "action sound"
		(action_name !== "refresh" || zone !== "local") // don't play the sound for refreshing local folders
	) {
		try {
			navigate_audio.play();
		} catch (e) {
			console.log("navigate_audio.play() failed: " + e);
		}
	}

	if (zone === "internet") {
		if (offline_mode) {
			if (await showMessageBox({
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
			}) === "connect") {
				offline_mode = false;
			} else {
				return;
			}
		}
		$("#internet-buttons").show();
		$("#standard-buttons").hide();
	} else {
		$("#internet-buttons").hide();
		$("#standard-buttons").show();
	}

	if (system_folder_path_to_name[address]) {
		$("#address").val(system_folder_path_to_name[address]);
	} else {
		$("#address").val(address);
	}
	$("#address-icon").attr("src", getIconPath(get_icon_for_address(address), 16));

	// if (action_name === "back") {
	// 	history_forward_stack.push(active_address);
	// } else if (action_name === "forward") {
	// 	history_back_stack.push(active_address);
	// } else
	if (action_name === "go") {
		history_back_stack.push(active_address);
		history_forward_stack.length = 0;
	} else {
		// for refresh and initial load, leave history stacks alone
		// for back and forward, handle them externally?
	}
	active_address = address; // must come after pushing to history stack

	set_title(get_display_name_for_address(address));
	set_icon(get_icon_for_address(address));

	$("#status-bar-left-text").empty();

	// Only remove content after any async operations have completed, and in particular, after navigation is confirmed, in the case that there's a dialog box.
	if (folder_view) {
		folder_view.element.remove();
		folder_view = null;
	}
	if ($iframe) {
		$iframe.remove();
		$iframe = null;
	}
	$("#content").empty(); // in case of apps loaded in the iframe which append menu bars outside of the iframe (@TODO: make apps not do this, and instead look only for a specifically designated $Window instance associated with the iframe)

	if (is_url) {
		$iframe = $("<iframe>").attr({
			src: address,
			allowfullscreen: "allowfullscreen",
			sandbox: "allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-modals allow-popups",
			allow: "camera https://brie.fi;microphone https://brie.fi",
		}).appendTo("#content");

		enhance_iframe($iframe[0]);

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
		}).show();
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
			onConfigure: async (changes) => {
				if ("view_as_web_page" in changes) {
					await render_folder_template(folder_view, address, eventHandlers);
				}
			},
			openFolder: go_to,
			openFileOrFolder: executeFile,
		});

		if (
			address !== "/desktop/" &&
			address !== "/recycle-bin/" &&
			address !== "/network-neighborhood/"
		) {
			$("#status-bar-right-icon").attr({
				src: getIconPath("my-computer", 16),
			}).show();
			$("#status-bar-right-text").text("My Computer");
		} else {
			$("#status-bar-right-icon").hide();
			$("#status-bar-right-text").text("");
		}

		await render_folder_template(folder_view, address, eventHandlers);
	}
	// console.log("had_focus", had_focus, "$iframe", $iframe, "folder_view", folder_view);
	// if (had_focus && $iframe) {
	// 	console.log("refocus iframe");
	// 	$iframe[0].contentWindow.focus();
	// 	folder_view?.focus();
	// }
};


var resolve_address = async function (address) {
	address = address || "/";
	var is_url = !!address.match(/\w+:\/\//);
	var drive_match = address.match(/^\(?([a-z]):\)?[/\\]?\)?$/i);
	var zone = "unknown";
	function handle_url_case() {
		if (!address.match(/^https?:\/\/web.archive.org\//) && !address.startsWith(window.location.origin)) {
			// special exemption: show archive but later version
			if (address.match(/^https?:\/\/(www\.)?(windows93.net)/)) {
				address = "https://web.archive.org/web/2015-05-05/" + address;
			// complete exemptions:
			} else if (
				!address.match(/^https?:\/\/(www\.)?(copy.sh|topotech.github.io\/interdimensionalcable|isaiahodhner.io|brie.fi\/ng)/) &&
				!address.match(/^(file|data|blob):\/\//)
			) {
				address = "https://web.archive.org/web/1998/" + address;
			}
		}
		is_url = true;
		// zone = address.startsWith(window.location.origin) ? "local" : "internet"; // @TODO
		zone = "internet";
		return { normalized_address: address, is_url, zone };
	}
	if (system_folder_lowercase_name_to_path[address.toLowerCase()]) {
		address = system_folder_lowercase_name_to_path[address.toLowerCase()];
		zone = "local";
		return { normalized_address: address, is_url, zone };
	} else if (drive_match) {
		if (drive_match[1].toUpperCase() === "C") {
			address = "/";
			zone = "local";
			return { normalized_address: address, is_url, zone };
		} else {
			const error = new Error("Drive not found");
			error.code = "ENOENT";
			error._is_drive_not_found_error = true;
			throw error;
		}
	} else if (is_url) {
		return handle_url_case();
	} else {
		zone = "local";
		return new Promise((resolve, reject) => {
			withFilesystem(function () {
				var fs = BrowserFS.BFSRequire("fs");
				fs.stat(address, function (err, stats) {
					if (err) {
						if (err.code === "ENOENT") {
							address = "https://" + address;
							resolve(handle_url_case());
							return;
						}
						err._is_stat_error = true;
						reject(err);
						return;
					}
					if (stats.isDirectory()) {
						if (address[address.length - 1] !== "/") {
							address += "/";
						}
						resolve({ normalized_address: address, is_url, zone });
					} else {
						// Don't execute files, just open them in the browser.
						// HTML/HTM files work, image files work,
						// maybe some file types should be executed, but
						// if trying to handle that, note that if Explorer is
						// associated with the file type, it will cause recursion,
						// with tons of windows opening, and eventually the page will crash.
						address = window.location.origin + "/" + address.replace(/^\/?/, "");
						is_url = true;
						resolve(handle_url_case());
					}
				});
			});
		});
	}
	// return { normalized_address: address, is_url, zone };
};

async function render_folder_template(folder_view, address, eventHandlers) {
	// Before removing the iframe containing folder_view, adopt the element to preserve event listeners (i.e. marquee functionality etc.)
	document.adoptNode(folder_view.element);

	// if (folder_view.config.view_as_web_page === false) {
	// 	$("#content").append(folder_view.element);
	// 	folder_view.focus();
	// 	return;
	// }

	let htt, template_url;
	if (folder_view.config.view_as_web_page === false) {
		// I'm faking the "View as Web Page" option for now
		// everything's in iframes anyways, so what's the harm in one more iframe, right?
		// I'm treating this option as just "to use folder templates or not".
		htt = `
			<object border=0 tabindex=1 classid="clsid:1820FED0-473E-11D0-A96C-00C04FD705A2" style="height: 100%; width: 100%;"></object>
		`;
		template_url = "https://isaiahodhner.io/lock-ness-monster/sorry"; // valid URL, but nonsense (I'm a little bit tired so doing things stupidly)
	} else {
		// @TODO: load FOLDER.HTT from the folder we're showing, if it exists
		const template_file_name =
			address === "/recycle-bin/" ? "recycle.htt" :
				address === "/network-neighborhood/" ? "nethood.htt" :
					// address === "/my-computer/" ? "MYCOMP.HTT" : // I don't have a proper My Computer folder yet
					"FOLDER.HTT";
		template_url = new URL(`/src/WEB/${template_file_name}`, location.href);
		// console.log("fetching template", template_url.href);
		htt = await (await fetch(template_url)).text();
	}

	const percent_vars = {
		THISDIRPATH: new URL(address.replace(/\/$/, ""), location.href),
		THISDIRNAME: get_display_name_for_address(address),
		TEMPLATEDIR: new URL(".", template_url).toString(),
		//template_url.href.split("/").slice(0, -1).join("/"),
	};
	const percent_var_regexp = /(file:\/\/)?(\\\w*\\?)*%([A-Z_]+)%(\\\w*\\?)*/gi;
	let html = htt.replaceAll(percent_var_regexp, (match, file_protocol, path_before, var_name, path_after) => {
		if (var_name in percent_vars) {
			return (
				// drop the file:// protocol (if applicable)
				(path_before ?? "").replace(/\\/g, "/") +
				percent_vars[var_name] +
				(path_after ?? "").replace(/\\/g, "/")
			);
		} else {
			console.warn("Unknown percent variable:", match);
			return match;
		}
	});

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
	const named_color_regexp = new RegExp(`\b(${Object.keys(named_color_to_css_var).join("|")})\b(?!\s*[)?.:=\[])`, "gi");
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
	const head_end_injected_script_fn = () => {
		// Usually the scripts refer to "document.all.FileList", but sometimes use just "FileList",
		// relying on the fact that IDs pollute the global namespace.
		// FileList is a built-in API nowadays, so it conflicts.
		Object.defineProperty(window, "FileList", {
			get() { return document.getElementById("FileList"); }
		});

		// It uses pixelWidth/pixelHeight/pixelLeft/pixelTop and unitless top/left
		// Originally I polyfilled this on `style`, but it broke `setProperty()` in Firefox (and maybe Chrome but it doesn't seem to come up as a problem somehow?)
		// so I've changed it to a separate `styleHack` property, making the generality of this solution rather pointless.
		// It was an interesting exercise.
		var real_style_descriptor = Reflect.getOwnPropertyDescriptor(HTMLElement.prototype, "style");
		Object.defineProperty(HTMLElement.prototype, "styleHack", {
			get: function () {
				const element = this;
				const style = real_style_descriptor.get.call(element);
				return new Proxy(style, {
					get: function (target, prop, receiver) {
						// Not sure how these should behave for different values of box-sizing (if that was even around back then)
						if (prop === "pixelWidth") {
							return Math.round(element.offsetWidth);
						}
						if (prop === "pixelHeight") {
							return Math.round(element.offsetHeight);
						}
						if (prop === "pixelLeft") {
							return Math.round(element.offsetLeft);
						}
						if (prop === "pixelTop") {
							return Math.round(element.offsetTop);
						}
						return Reflect.get(style, prop, style);
					},
					set: function (target, prop, value) {
						if (prop === "pixelWidth") {
							target.width = value + "px";
							return;
						}
						if (prop === "pixelHeight") {
							target.height = value + "px";
							return;
						}
						if (prop === "pixelLeft" || (prop === "left" && `${value}`.match(/^\d+$/))) {
							target.left = value + "px";
							return;
						}
						if (prop === "pixelTop" || (prop === "top" && `${value}`.match(/^\d+$/))) {
							target.top = value + "px";
							return;
						}
						return Reflect.set(style, prop, value);
					},
				});
			},
			set: function (value) {
				const element = this;
				element.style.cssText = value;
			},
			configurable: true,
			enumerable: true,
		});

		// Fix up ancient CSS in <style> and <link> tags.
		// Based on https://github.com/philipwalton/talks/tree/b0a2b9a3de509dd39368516e7e304a4159b41b08/2016-12-02/demos/src
		const getPageStyles = () => {
			// Query the document for any element that could have styles.
			var styleElements =
				[...document.querySelectorAll('style, link[rel="stylesheet"]')];

			// Fetch all styles and ensure the results are in document order.
			// Resolve with a single string of CSS text.
			return Promise.all(styleElements.map((el) => {
				if (el.href) {
					return fetch(el.href).then((response) => response.text());
				} else {
					return el.innerText;
				}
			})).then((stylesArray) => stylesArray.join('\n'));
		};
		const replacePageStyles = (css) => {
			// Get a reference to all existing style elements.
			const existingStyles =
				[...document.querySelectorAll('style, link[rel="stylesheet"]')];

			// Create a new <style> tag with all the polyfilled styles.
			const polyfillStyles = document.createElement('style');
			polyfillStyles.innerHTML = css;
			document.head.appendChild(polyfillStyles);

			// Remove the old styles once the new styles have been added.
			existingStyles.forEach((el) => el.parentElement.removeChild(el));
		};
		getPageStyles().then((css) => {
			css = css.replace(/padding:\s*((\d+(?:\.?\d+)?\w+),\s*)/g, (match, value) => value.split(/,\s*/g).join(" "));
			css = css.replace(/font:\s*(\d+pt);/, "font-size: $1; line-height: 1;");
			css = css.replace(/font:\s*((\d+pt)(\s*\/\s*\d+pt)?) verdana;/, "font: $1 'verdana', sans-serif;");
			css = css.replace(/style\.(pixel(Width|Height|Left|Top)|left|top)\b/g, "styleHack.$1");

			replacePageStyles(css);
		});

		// Neither Chrome or Firefox are working for debugging srcdoc iframes.
		// Chrome gives wildly incorrect line numbers,
		// and Firefox just gives "Error loading this URI: Unknown source"
		// or sometimes it opens view-source:about:srcdoc in a new tab ("Hmm. That address doesn’t look right.")
		// Firefox also surprisingly actually works sometimes, but it's not reliable.
		// Luckily, onerror seems to work in both browsers.
		addEventListener("error", (event) => {
			const { $window } = showMessageBox({
				message: "An error occurred.",
			});
			// $window.$content.append(`
			// 	<details>
			// 		<summary>Details</summary>
			// 		<pre class='error-pre inset-deep'></pre>
			// 		<pre class='location-pre inset-deep'></pre>
			// 	</details>
			// `)
			$window.$content.append(`
				<pre class='error-pre inset-deep'></pre>
				<pre class='location-pre inset-deep'></pre>
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
				this._params = {};
				this._params_slot.addEventListener("slotchange", (event) => {
					this._params = {};
					for (const param_el of this.querySelectorAll("param, param-hack")) {
						this._params[param_el.getAttribute("name")] = param_el.getAttribute("value");
					}
					// console.log("slotchange, params are now:", this._params);
				});
			}
			connectedCallback() {
				// @TODO: handle params once they change/exist
				// console.log(this._params, this.children, this._params_slot.children);
				// console.log(`this.getAttribute("classid")`, this.getAttribute("classid"));
				switch (this.getAttribute("classid")) {
					case "clsid:1D2B4F40-1F10-11D1-9E88-00C04FDCAB92":
						// thumbnail
						const img = document.createElement("img");
						img.draggable = false;
						this.shadowRoot.append(img);
						this.haveThumbnail = () => {
							return false;
						};
						this.displayFile = (path) => {
							img.src = path;
						}
						break;
					case "clsid:E5DF9D10-3B52-11D1-83E8-00A0C90DC849":
						// folder icon
						{
							const img = document.createElement("img");
							img.draggable = false;
							this.shadowRoot.append(img);
							img.src = frameElement._folder_icon_src;
						}
						break;
					case "clsid:1820FED0-473E-11D0-A96C-00C04FD705A2":
						// folder view
						const folder_view = frameElement._folder_view;
						this.shadowRoot.append(folder_view.element);
						// jQuery's append does HTML, vs native which does Text
						$(this.shadowRoot).append(`
							<link href="/layout.css" rel="stylesheet" type="text/css">
							<link href="/classic.css" rel="stylesheet" type="text/css">
							<link href="/lib/os-gui/layout.css" rel="stylesheet" type="text/css">
							<link href="/lib/os-gui/windows-98.css" rel="stylesheet" type="text/css">
							<style>
								:host {
									display: flex;
								}
								.folder-view {
									background: var(--Window); /* needed for mix-blend-mode */
									color: var(--WindowText);
								}
								.desktop-icon .title {
									/* background: transparent; */
									/* mix-blend-mode seems to need a background (for the dotted focus effect) */
									background: var(--Window);
									color: var(--WindowText);
								}
							</style>
						`);

						this.SelectedItems = () => {
							const selected_items = folder_view.items.filter((item) => item.element.classList.contains("selected"));
							return {
								Count: selected_items.length,
								Item: (index) => {
									const item = selected_items[index];
									if (!item) {
										return {}; // ???
									}
									return {
										Name: item.element.querySelector(".title").textContent,
										Size: item.resolvedStats?.size,
										Path: item.file_path,
										_item: item,
									};
								},
							};
						};
						// These keys may actually be different depending on the system folder.
						// My Computer (MYCOMP.HTT) seems to use 1 for Type
						const detail_key = {
							"-1": "Tip", // description of the item, for control panel items, computers, and printers
							0: "Name",
							1: "Size", // file size as a string
							2: "Type", // file type
							3: "Modified", // modification date
						};
						this.Folder = {
							GetDetailsOf: (item, detail_id) => {
								// console.log("GetDetailsOf", item, detail_id);
								// return `{GetDetailsOf(${JSON.stringify(item)}, ${detail_id})}`; // debugging in the style of a broken template
								if (item == null) {
									return detail_key[detail_id];
								} else if (Object.keys(item).length === 0) {
									return "";
								} else {
									switch (detail_key[detail_id]) {
										case "Tip":
											return item._item.description || "";
										case "Name":
											return item.Name;
										case "Size":
											const bytes = item._item.resolvedStats?.size;
											if (typeof bytes !== "number") {
												return "";
											}
											// Note: Windows 98 uses 2^10 for KB, and uses KB as the minimum unit,
											// but the folder templates, wanting to use bytes for small files,
											// show the size in bytes if it's less than 1000, implying it uses 10^3 for KB.
											// This may confuse people, but I'm just imitating Windows 98. No skin off my back!
											const k = 1024;
											if (bytes === 0) return '0KB';
											const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
											const min_unit = 1; // Start at KB (note that the default template works around this to provide "bytes")
											const i = Math.max(min_unit, Math.floor(Math.log(bytes) / Math.log(k)));
											return Math.ceil(bytes / Math.pow(k, i)) + sizes[i]; // Round up
										case "Type":
											// @TODO: DRY, and move file type code/data to one central place
											const system_folder_path_to_name = {
												"/": "(C:)", //"My Computer",
												"/my-pictures/": "My Pictures",
												"/my-documents/": "My Documents",
												"/network-neighborhood/": "Network Neighborhood",
												"/desktop/": "Desktop",
												"/programs/": "Program Files",
												"/recycle-bin/": "Recycle Bin",
											};
											if (system_folder_path_to_name[item._item.file_path]) {
												return "System Folder";
											}
											if (item._item.resolvedStats?.isDirectory?.()) {
												return "Folder";
											}
											const match = item._item.file_path.match(/\.(\w+)?$/);
											if (match) {
												return match[1].toUpperCase() + " File";
											} else {
												return "Unknown File";
											}
										case "Modified":
											return new Date(item._item.resolvedStats?.mtime).toLocaleString()
												.replace(/, (\d+):(\d+):(\d+)/, " $1:$2"); // Remove the comma and seconds place (doing this as one replace to hopefully not affect other locales negatively)
										default:
											console.warn("Unknown detail ID", detail_id);
											return;
									}
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
						console.warn("Unsupported classid value:", this.getAttribute("classid"), this);
						break;
				}
			}
		}
		customElements.define("object-hack", ObjectHack);
	};
	html = html.replace(/<object/ig, "<object-hack");
	html = html.replace(/<\/object/ig, "</object-hack");
	html = html.replace(/<param/ig, "<param-hack");
	html = html.replace(/<\/param/ig, "</param-hack");

	const head_start_injected_html = `
		<meta charset="utf-8">
		<title>Folder Template</title>
		<link href="/src/ie-6.css" rel="stylesheet" type="text/css">
		<style>
		p {margin: 0;}

		#Panel {
			scrollbar-gutter: stable;
		}

		body {
			user-select: none;
		}
		</style>
	`;

	const head_end_injected_html = `
		<link href="/layout.css" rel="stylesheet" type="text/css">
		<link href="/classic.css" rel="stylesheet" type="text/css">
		<link href="/lib/os-gui/layout.css" rel="stylesheet" type="text/css">
		<link href="/lib/os-gui/windows-98.css" rel="stylesheet" type="text/css">
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<script src="/lib/jquery.min.js"></script>
		<script src="/lib/os-gui/$Window.js"></script>
		<script src="/src/msgbox.js"></script>
		<script>defaultMessageBoxTitle = "Explorer";</script>
		<script>
			(${head_end_injected_script_fn})();
		</script>
	`;

	html = html.replace(/<head>/i, (match) => `${match}\n${head_start_injected_html}\n`);
	html = html.replace(/\s+<\/head>/i, (match) => `${head_end_injected_html}\n${match}`);

	// Empty and append after any async loading (i.e. of the template), to avoid race conditions where multiple contents are appended,
	// if you select multiple folders and hit Enter. It was kinda cool, like a split pane feature, but very not legit.
	$("#content").empty();

	$iframe = $("<iframe>").attr({
		srcdoc: html,
	}).appendTo("#content");

	$iframe[0]._folder_view = folder_view;
	$iframe[0]._folder_icon_src = getIconPath(get_icon_for_address(address), 32);

	enhance_iframe($iframe[0]);

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

		// console.log("folder_view.element.isConnected", folder_view.element.isConnected);
		folder_view.focus();
	});
	$iframe.focus();
}

function refresh() {
	// go to whatever the address was before
	// ignoring changes to the address bar input since navigation
	// and unfortunately also to the address of the iframe, for cross-domain sites
	go_to(active_address, "refresh");
}

function stop_loading() {
	try {
		$iframe[0].contentWindow.stop();
	} catch (e) {
		$iframe.attr("src", "about:blank");
	}
}

function go_back() {
	// $iframe[0].contentWindow.history.back();
	// console.log({ history_back_stack, history_forward_stack });
	history_forward_stack.push(active_address);
	go_to(history_back_stack.pop(), "back");
}
function go_forward() {
	// $iframe[0].contentWindow.history.forward();
	// console.log({ history_back_stack, history_forward_stack });
	history_back_stack.push(active_address);
	go_to(history_forward_stack.pop(), "forward");
}
function can_go_back() {
	try {
		// return $iframe[0].contentWindow.history.length > 1;
		return history_back_stack.length > 0;
	} catch (e) {
		return false;
	}
}
function can_go_forward() {
	try {
		// return $iframe[0].contentWindow.history.length > 1;
		return history_forward_stack.length > 0;
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

function go_home() {
	go_to("https://isaiahodhner.io/"); // My personal homepage; I might use a search engine, but they don't support iframes
}

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
				// (can either check frameElement or parent !== window, but not parent by itself, because `parent === window` when there's no actual parent frame)
				if (frameElement) {
					const systemExecuteFile = parent.systemExecuteFile || parent.parent.systemExecuteFile; // dunno if I'll keep the folder view in an iframe
					if (systemExecuteFile) {
						systemExecuteFile(file_path);
					} else {
						alert("Failed to execute " + file_path + "\n\n" + "systemExecuteFile not found");
					}
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
			go_to(query.address, "initially-load");
		} else {
			go_to("/", "initially-load");
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
	$(".refresh-button").on("click", refresh);
	$(".stop-button").on("click", stop_loading);
	$(".back-button").on("click", go_back);
	$(".forward-button").on("click", go_forward);
	$(".up-button").on("click", go_up);
	$(".home-button").on("click", go_home);
	// @TODO: toggle on pointerdown or mousedown
	$(".back-dropdown-button").on("click", (event) => {
		const $dropdown_button = $(event.currentTarget);
		const $main_button = $dropdown_button.closest(".toolbar-compound-button-wrapper").find(".toolbar-button");
		show_history_dropdown("back", $main_button, history_back_stack);
	});
	$(".forward-dropdown-button").on("click", (event) => {
		const $dropdown_button = $(event.currentTarget);
		const $main_button = $dropdown_button.closest(".toolbar-compound-button-wrapper").find(".toolbar-button");
		show_history_dropdown("forward", $main_button, history_forward_stack);
	});
	function show_history_dropdown(back_or_forward, $main_button, history_stack) {
		const menu_items = history_stack.map((path, index) => {
			return {
				// @TODO: name of folder/file/page
				label: AccessKeys.escape(path),
				action: () => {
					// @TODO: instead of creating a new history entry, manage the stacks.
					go_to(path);//, "go-to-history-item");
				},
			};
		}).reverse();
		show_dropdown($main_button, menu_items);
	}
	function show_dropdown($main_button, menu_items) {
		// @TODO: in a future version of OS-GUI, there should be an API for context menus
		// which we could use here.
		const dummy_menu_bar = new MenuBar({ "Dummy": menu_items });
		$(dummy_menu_bar.element).css({
			position: "absolute",
			left: $main_button.offset().left - 2,
			top: $main_button.offset().top + $main_button.outerHeight() - 20,
			visibility: "hidden",
			pointerEvents: "none",
		}).appendTo("body");
		$(dummy_menu_bar.element).find(".menu-button")[0].dispatchEvent(new Event("pointerdown"));
		// remove the dummy menu bar when the menu is closed
		// Note: release event is not documented!
		$(dummy_menu_bar.element).find(".menu-button").on("release", function () {
			$(dummy_menu_bar.element).remove();
		});
	}
	$(".delete-button").on("click", function () {
		folder_view.delete_selected();
	});
	$(".cycle-view-mode-button").on("click", function () {
		folder_view.cycle_view_mode();
	});
	$(".views-dropdown-button").on("click", () => {
		// menu items defined in menus.js
		show_dropdown($(".cycle-view-mode-button"), views_dropdown_menu_items);
	});
	$(`
		.properties-button, .copy-button, .cut-button, .paste-button, .undo-button,
		.search-button, .favorites-button, .history-button, .print-button
	`).on("click", function () {
		showMessageBox({ message: "Not supported.", iconID: "error" });
	});

	var $up_button = $(".up-button");
	var $back_button = $(".back-button");
	var $forward_button = $(".forward-button");
	var $back_history_dropdown_button = $(".back-dropdown-button");
	var $forward_history_dropdown_button = $(".forward-dropdown-button");
	setInterval(() => {
		$up_button.attr("disabled", can_go_up() ? null : "disabled");
		$back_button.attr("disabled", can_go_back() ? null : "disabled");
		$forward_button.attr("disabled", can_go_forward() ? null : "disabled");
		$back_history_dropdown_button.attr("disabled", can_go_back() ? null : "disabled");
		$forward_history_dropdown_button.attr("disabled", can_go_forward() ? null : "disabled");
	}, 100);

	$(".toolbar-button").each((i, button) => {
		const $button = $(button);
		const sprite_n = [0, 1, 44, 21, 22, 23, 24, 26, 31, 38, 0, 1, 2, 3, 4, 5, 6, 12, 7][i];
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
								if (overflowed_items.some((item) => item.textContent === AccessKeys.remove(menu_key))) {
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
									label: menu_key,
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
			event.preventDefault();
		} else if (event.key === "ArrowUp" && event.altKey) {
			go_up();
			event.preventDefault();
		}
	});
});
