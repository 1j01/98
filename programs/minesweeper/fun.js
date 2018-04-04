
// For running in the console (in the context of the minesweeper iframe):
// parent.$(".minesweeper-playing-cursor").remove();
// if (typeof iid !== "undefined") { clearInterval(iid); }
// if (typeof rafid !== "undefined") { cancelAnimationFrame(rafid); }

// For running as a script, triggering immediately by default:
// $.ready(function () {

// For running if you enter the sequence ↑↑↓↓←→←→BA
window.onkeydown = Konami.code(function () {

	// TODO: allow running in standalone
	if (!frameElement) { return console.warn("Nope, must run within iframe context"); }

	var $mouse = parent.$("<img src='programs/jspaint/images/cursors/default.png' class='minesweeper-playing-cursor'>").appendTo("body");

	var target_x = 0;
	var target_y = 0;
	var vel_x = 0;
	var vel_y = 0;
	var cur_x = 0;
	var cur_y = 0;
	var animate = function () {
		rafid = requestAnimationFrame(animate);
		var dx = target_x - cur_x;
		var dy = target_y - cur_y;
		var dist = Math.hypot(dx, dy);
		var force = 2;
		vel_x += dx / Math.max(1, dist) * force;
		vel_y += dy / Math.max(1, dist) * force;
		vel_x /= 1.07;
		vel_y /= 1.07;
		cur_x += vel_x;
		cur_y += vel_y;

		var el = document.elementFromPoint(cur_x, cur_y);
		// TODO: Not actually random but more regular clicking; ideally plan movement to make (the fairly regular) clicks line up with safe tiles
		if (is_safe_tile(el) && Math.random() < 0.1) {
			// TODO: click sound
			dispatch_mouse_event(cur_x, cur_y, "mousedown");
			dispatch_mouse_event(cur_x, cur_y, "mouseup");
			// dispatch_mouse_event(cur_x, cur_y, "click");
		}

		$mouse.css({
			position: "absolute",
			zIndex: 5000000,
			left: cur_x + parent.$(frameElement).offset().left,
			top: cur_y + parent.$(frameElement).offset().top,
		});
	};
	animate();

	iid = setInterval(function () {
		var tds = $("td");
		for (var i = 0; i < 50; i++) {//purposely limited number of tries
			var td = tds[~~(Math.random() * tds.length)];
			if (is_unclicked_safe_tile(td)) { break }
		}
		for (var i = 0; i < 50; i++) {//purposely limited number of tries
			var td = tds[~~(Math.random() * tds.length)];
			if (is_safe_tile(td)) { break }
		}
		var rect = td.getBoundingClientRect();
		target_x = rect.left + 8;
		target_y = rect.top + 8;
	}, 500);

	function dispatch_mouse_event(x, y, type) {
		var ev = document.createEvent("MouseEvent");
		var el = document.elementFromPoint(x, y);
		ev.initMouseEvent(
			type,
			true /* bubble */, true /* cancelable */,
			window, null,
			x, y, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /*left*/, null
		);
		el.dispatchEvent(ev);
	}

	function is_unclicked_safe_tile(el) {
		var tile = minesweeper_.grid.get_tile_from_td(el);
		return tile && !tile.is_a_mine_ && !tile.is_revealed_;
	}

	function is_safe_tile(el) {
		var tile = minesweeper_.grid.get_tile_from_td(el);
		return tile && !tile.is_a_mine_;
	}

});
