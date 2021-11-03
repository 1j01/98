
var player_counts = [1, 2, 3, 4];
var current_player_count = 1;
// var sounds_enabled = true;
// var music_enabled = true;
var audio_enabled = true;

var freezing_display = false;
var menus_open = false;
var triggering_menus = false;
let triggering_plunger = false;
let triggering_flipper = false;

let mouse_x = 0;
let mouse_y = 0;

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
var overlay_canvas = document.getElementById("overlay-canvas");
var overlay_context = overlay_canvas.getContext("2d");

// left half of the screen will be handled automatically by the game, triggering the left flipper
// right half, for touch, will be intercepted by us to trigger the right flipper, or as appropriate, the plunger
// @TODO: support triggering both flippers at once (might need a full-canvas interception)
var right_button = document.createElement("div");
right_button.style.position = "absolute";
right_button.style.left = "183px";
right_button.style.top = "0px";
right_button.style.width = "183px";
right_button.style.bottom = "0px";
right_button.style.display = "block";
right_button.style.zIndex = "10";
right_button.style.touchAction = "none";

right_button.addEventListener("pointerdown", function (event) {
	if (event.button === 2) {
		if (event.pointerType !== "touch") {
			// normal-ish behavior for mouse
			click(mouse_x, mouse_y, ["mousedown"], { button: event.button, buttons: event.buttons });
		}
		return; // prevent infinite recursion
	}
	update_mouse_position(event);
	event.stopImmediatePropagation();
	// event.preventDefault(); // we need the subsequent pointerup so can't preventDefault
	const near_plunger = mouse_x > 260;
	// If ball is waiting to be launched, allow triggering the plunger by pressing further to the right,
	// but still allow triggering the flipper in the mid-right (even thought it's technically pointless),
	// because it could be confusing / feel broken otherwise.
	// If ball is in play, always trigger the flipper, so there's a bigger hit region and less chance of
	// an annoying "I pressed it but it didn't work" experience.
	if (is_awaiting_deployment() && near_plunger) {
		click(mouse_x, mouse_y, ["mouseup"], { button: 2, buttons: 2 }); // in case flipper is stuck (not tested, but this is probably helpful idk)

		const event = new KeyboardEvent("keydown", {
			bubbles: true, cancelable: true,
			keyCode: 32, which: 32, key: " ", code: "Space",
			shiftKey: false, ctrlKey: false, altKey: false, metaKey: false,
		});
		triggering_plunger = true;
		// console.log("dispatching keydown", event);
		canvas.dispatchEvent(event);
	} else if (event.pointerType === "touch") {
		click(mouse_x, mouse_y, ["mousedown"], { button: 2, buttons: 2 });
		triggering_flipper = true;
	} else {
		// normal-ish behavior for mouse
		click(mouse_x, mouse_y, ["mousedown"], { button: event.button, buttons: event.buttons });
		prev_buttons = event.buttons;
	}
}, true);
let prev_buttons;
right_button.addEventListener("pointermove", function (event) {
	if (event.buttons !== prev_buttons && event.buttons) {
		// normal-ish behavior for mouse
		click(mouse_x, mouse_y, ["mousedown"], { button: event.button, buttons: event.buttons });
		prev_buttons = event.buttons;
	}
});

addEventListener("pointerup", function (event) {
	// console.log("pointerup", event.button, { triggering_flipper, triggering_plunger });
	if (event.button === 2) {
		return; // prevent infinite recursion
	}
	update_mouse_position(event);
	if (triggering_plunger) {
		const event = new KeyboardEvent("keyup", {
			bubbles: true, cancelable: true,
			keyCode: 32, which: 32, key: " ", code: "Space",
			shiftKey: false, ctrlKey: false, altKey: false, metaKey: false,
		});
		triggering_plunger = false;
		// console.log("dispatching keyup", event);
		canvas.dispatchEvent(event);
	} else if (triggering_flipper) {
		click(mouse_x, mouse_y, ["mouseup"], { button: 2, buttons: 0 });
		triggering_flipper = false;
	}
}, true);
right_button.addEventListener("contextmenu", function (event) {
	event.preventDefault();
});
right_button.addEventListener("selectstart", function (event) {
	event.preventDefault();
});

canvas.parentElement.appendChild(right_button);

function is_awaiting_deployment() {
	// ball at bottom (resting on plunger)
	// Note that the ball bounces, so this state will bounce a bit too.
	// @TODO: the ball can actually rest in different places
	// I should probably check a region for gray pixels,
	// rather than a specific pixel (or set of pixel possibilities)
	return pixel_match(327, 388, [50, 50, 50, 255]);
}
function rgba_at(x, y) {
	const pixel_rgba = new Uint8Array(4);
	y = canvas.height - y;
	gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel_rgba);
	return pixel_rgba;
}
function pixel_match(x, y, reference_rgba, tolerance = 50) {
	const pixel_rgba = rgba_at(x, y);
	const r_diff = Math.abs(pixel_rgba[0] - reference_rgba[0]);
	const g_diff = Math.abs(pixel_rgba[1] - reference_rgba[1]);
	const b_diff = Math.abs(pixel_rgba[2] - reference_rgba[2]);
	// console.log(`${x},${y}: ${pixel_rgba[0]},${pixel_rgba[1]},${pixel_rgba[2]},${pixel_rgba[3]}`, `${reference_rgba[0]},${reference_rgba[1]},${reference_rgba[2]},${reference_rgba[3]}`, `${r_diff},${g_diff},${b_diff}`);
	return r_diff <= tolerance && g_diff <= tolerance && b_diff <= tolerance;
}

function start_freeze_frame() {
	if (freezing_display) {
		return; // don't update the frame
	}
	freezing_display = true;
	overlay_context.fillStyle = "black";
	overlay_context.fillRect(0, 0, canvas.width, canvas.height);
	overlay_context.drawImage(canvas, 0, 0);
}

function stop_freeze_frame() {
	freezing_display = false;
	overlay_context.clearRect(0, 0, canvas.width, canvas.height);
}

function click(canvas_x, canvas_y, event_types = ["mouseenter", "mousedown", "mouseup"], options = {}) {
	const rect = canvas.getBoundingClientRect();
	const client_x = canvas_x + rect.left;
	const client_y = canvas_y + rect.top;
	const params = Object.assign({
		clientX: client_x,
		clientY: client_y,
		pageX: client_x,
		pageY: client_y,
		offsetX: canvas_x,
		offsetY: canvas_y,
		screenX: client_x,
		screenY: client_y,
		movementX: 0,
		movementY: 0,
		which: 1,
		button: 0,
		buttons: 1,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true,
		cancelable: true,
		view: window,
		target: canvas,
	}, options);
	for (const event_type of event_types) {
		canvas.dispatchEvent(new MouseEvent(event_type, params));
	}
	// const click_effect_el = document.createElement("div");
	// click_effect_el.style.position = "absolute";
	// click_effect_el.style.left = client_x + "px";
	// click_effect_el.style.top = client_y + "px";
	// click_effect_el.style.zIndex = "1000";
	// click_effect_el.style.backgroundColor = "red";
	// click_effect_el.style.color = "white";
	// click_effect_el.textContent = `(${canvas_x}, ${canvas_y})`;
	// document.body.appendChild(click_effect_el);
	// setTimeout(() => {
	// 	click_effect_el.remove();
	// }, 100);
}

function update_mouse_position(event) {
	const rect = canvas.getBoundingClientRect();
	mouse_x = ~~(event.clientX - rect.left);
	mouse_y = ~~(event.clientY - rect.top);
}
addEventListener("mousemove", update_mouse_position);

// addEventListener("keydown", function (event) {
// 	if (event.key === "r" || event.key === "c") {
// 		console.log(`(${mouse_x}, ${mouse_y}) color: ${rgba_at(mouse_x, mouse_y)}`);
// 		if (event.key === "c") {
// 			click(mouse_x, mouse_y);
// 		}
// 	}
// });

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function handle_menu_item(top_level_menu_index, item_index, submenu_item_index) {
	close_menus();
	triggering_menus = true;
	window.dispatchEvent(new Event("focus")); // make the game think it's focused
	canvas.style.pointerEvents = "none";
	const delay = 100;
	await sleep(delay);
	click(30 + top_level_menu_index * 50, 15);
	await sleep(delay);
	click(30 + top_level_menu_index * 50, 35 + item_index * 16);
	await sleep(delay);
	if (submenu_item_index !== undefined) {
		click(200 + top_level_menu_index * 50, 35 + item_index * 16 + submenu_item_index * 16);
		await sleep(delay);
	}
	canvas.style.pointerEvents = "auto";
	if (!menus_open) {
		stop_freeze_frame();
	}
	triggering_menus = false;
}

var menus = {
	"&Game": [
		{
			item: "&New Game",
			shortcut: "F2",
			action: function () {
				handle_menu_item(0, 0);
			},
		},
		{
			item: "&Launch Ball",
			action: function () {
				handle_menu_item(0, 1);
				// @FIXME: this menu item can be disabled if the game is not started yet
				// so clicking on it can fail and leave the ImGui menu open (ugly)
				// I could detect this by the color of the canvas at a certain point
				// but I should probably look into integrating the menus properly,
				// see how easy it is to compile the game etc. (so far I've gotten away with using the pre-built game)
			},
		},
		{
			item: "&Pause/Resume Game",
			shortcut: "F3",
			action: function () {
				handle_menu_item(0, 2);
			},
		},
		MENU_DIVIDER,
		{
			item: "&High Scores...",
			action: function () {
				// handle_menu_item(0, 3);
				// @TODO: custom window
			},
			enabled: false,
		},
		{
			item: "&Demo",
			action: function () {
				handle_menu_item(0, 4);
			},
		},
		{
			item: "E&xit",
			action: function () {
				window.close();
			},
		},
	],
	"&Options": [
		{
			item: "&Full Screen",
			shortcut: "F4",
			action: function () {
				toggle_fullscreen();
			},
		},
		{
			item: "Select &Players",
			submenu: player_counts.map(function (count) {
				return {
					item: `&${count} Player${count > 1 ? "s" : ""}`,
					checkbox: {
						check: function () {
							return current_player_count == count;
						},
						toggle: function () {
							// current_player_count = count;
							// handle_menu_item(1, 0, count - 1);
							// @TODO (doesn't seem to work in this Pinball port)
						},
					},
					enabled: false,
				};
			}),
		},
		MENU_DIVIDER,
		/*
		{
			item: "&Sounds",
			checkbox: {
				check: () => sounds_enabled,
				toggle: () => {
					// sounds_enabled = !sounds_enabled;
					// handle_menu_item(1, 1);
					// @TODO (doesn't seem to work in this Pinball port)
					// (although sounds/music work, to be clear)
				}
			},
			enabled: false,
		},
		{
			item: "&Music",
			checkbox: {
				check: () => music_enabled,
				toggle: () => {
					// music_enabled = !music_enabled;
					// handle_menu_item(1, 2);
					// @TODO (doesn't seem to work in this Pinball port)
					// (although sounds/music work, to be clear)
				}
			},
			enabled: false,
		},
		*/
		{
			item: "&Audio",
			checkbox: {
				check: () => audio_enabled,
				toggle: () => {
					audio_enabled = !audio_enabled;
					if (audio_enabled) {
						unmute_game_audio();
					} else {
						mute_game_audio();
					}
				},
			},
		},
		MENU_DIVIDER,
		{
			item: "P&layer Controls",
			shortcut: "F8",
			action: function () {
				// @TODO
				// handle_menu_item(1, 3.2);
			},
			enabled: false,
		},
	],
	"&Help": [
		{
			item: "&Help Topics",
			shortcut: "F1", // @TODO
			action: function () {
				/* @TODO
				var show_help = window.show_help;
				try {
					show_help = parent.show_help;
				} catch(e) {}
				if (show_help === undefined) {
					return alert("Help Topics only works when inside of the 98.js.org desktop.");
				}
				show_help({
					title: "Pinball Help",
					contentsFile: "help/pinball-help/pinball.hhc",
					root: "help/pinball-help",
				});
				*/
			},
			enabled: false,
		},
		MENU_DIVIDER,
		{
			item: "&About Pinball",
			action: function () {
				// @TODO: about dialog
				window.open("https://github.com/alula/SpaceCadetPinball");
			},
		}
	],
};

var go_outside_frame = false;
if (frameElement) {
	try {
		if (parent.MenuBar) {
			MenuBar = parent.MenuBar;
			go_outside_frame = true;
		}
	} catch (e) { }
}
var menu_bar = new MenuBar(menus);
if (go_outside_frame) {
	frameElement.parentElement.insertBefore(menu_bar.element, frameElement);
} else {
	document.body.prepend(menu_bar.element);
}

function close_menus() {
	menu_bar.closeMenus();
	canvas.focus();
}

// freeze the canvas display while menus are open,
// and as long as ImGui menus are being triggered
const observer = new MutationObserver(function (mutations) {
	menus_open = menu_bar.element.querySelectorAll(".menu-button[aria-expanded='true']").length > 0;
	if (menus_open) {
		start_freeze_frame();
		window.dispatchEvent(new Event("blur")); // make the game think it's blurred
	} else {
		if (document.hasFocus()) {
			window.dispatchEvent(new Event("focus")); // make the game think it's focused
		}
		if (!triggering_menus) {
			// wait for the next frame to unfreeze,
			// otherwise the ImGui menus could be seen for a frame
			// if you click a menu item then quickly open a menu again, and then close it
			setTimeout(() => {
				stop_freeze_frame();
			}, 100);
		}
	}
});
observer.observe(menu_bar.element, {
	attributes: true,
	attributeFilter: ["aria-expanded"],
	subtree: true,
});

function toggle_fullscreen() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.body.requestFullscreen();
	}
}

window.addEventListener("keydown", function (e) {
	if (e.key === "F4") {
		e.preventDefault();
		toggle_fullscreen();
	}
});
