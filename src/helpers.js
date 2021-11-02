
var TAU =     //////|//////
          /////     |     /////
       ///         tau         ///
     ///     ...--> | <--...     ///
   ///     -'   one | turn  '-     ///
  //     .'         |         '.     //
 //     /           |           \     //
//     |            | <-..       |     //
//    |          .->|     \       |    //
//    |         /   |      |      |    //
- - - - - - Math.PI + Math.PI - - - - - 0
//    |         \   |      |      |    //
//    |          '->|     /       |    //
//     |            | <-''       |     //
 //     \           |           /     //
  //     '.         |         .'     //
   ///     -.       |       .-     ///
     ///     '''----|----'''     ///
       ///          |          ///
         //////     |     /////
              //////|//////          C/r;

var $G = $(window);

function Cursor(cursor_def) {
	return "url(images/cursors/" + cursor_def[0] + ".png) " +
		cursor_def[1].join(" ") +
		", " + cursor_def[2]
}

function E(t) {
	return document.createElement(t);
}

var DESKTOP_ICON_SIZE = 32;
var TASKBAR_ICON_SIZE = 16;
var TITLEBAR_ICON_SIZE = 16;

// For Wayback Machine, match URLs like https://web.archive.org/web/20191213113214/https://98.js.org/
// (also match URLs like https://98.js.org/ because why not)
const web_server_root_for_icons =
	location.href.match(/98.js.org/) ?
		location.href.match(/.*98.js.org/)[0] + "/" :
		"/";

function getIconPath(iconID, size) {
	return web_server_root_for_icons + "images/icons/" + iconID + "-" + size + "x" + size + ".png";
}

function Canvas(width, height) {
	var new_canvas = E("canvas");
	var new_ctx = new_canvas.getContext("2d");
	new_ctx.imageSmoothingEnabled = false;
	new_ctx.mozImageSmoothingEnabled = false;
	new_ctx.webkitImageSmoothingEnabled = false;
	if (width && height) {
		// new Canvas(width, height)
		new_canvas.width = width;
		new_canvas.height = height;
	} else {
		// new Canvas(image)
		var copy_of = width;
		if (copy_of) {
			new_canvas.width = copy_of.width;
			new_canvas.height = copy_of.height;
			new_ctx.drawImage(copy_of, 0, 0);
		}
	}
	new_canvas.ctx = new_ctx;
	return new_canvas;
}

function mustHaveMethods(obj, methodNames) {
	for (const methodName of methodNames) {
		if (typeof obj[methodName] != 'function') {
			console.error("Missing method", methodName, "on object", obj);
			throw new TypeError("missing method " + methodName);
		}
	}
	return true;
}
const windowInterfaceMethods = [
	"close",
	"minimize",
	"unminimize",
	// "maximize",
	// "unmaximize",
	"bringToFront", // TODO: maybe setZIndex instead
	"getTitle",
	// "getIconName",
	"getIconAtSize",
	"focus",
	"blur",
	"onFocus",
	"onBlur",
	"onClosed",
];
