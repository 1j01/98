
var sprite_sheet = document.createElement("img");
sprite_sheet.src = "img/buttons.png";

var $Button = function(title, n){
	var $button = $("<button/>").attr("title", title);

	// These aren't really toggle buttons (except for their radio button behavior)...
	// but they have the look of toggle buttons while being clicked.
	$button.addClass("toggle");
	
	var n_buttons = 5;
	var sheet_width = 125;
	var sheet_height = 17;
	var sprite_width = sheet_width / n_buttons;
	var sprite_height = sheet_height;
	
	var make_canvas = (width, height)=> {
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.ctx = canvas.getContext("2d");
		return canvas;
	};

	var enabled_canvas = make_canvas(sprite_width, sprite_height);
	var disabled_canvas = make_canvas(sprite_width, sprite_height);
	
	function drawButtonIcon() {

		enabled_canvas.ctx.drawImage(
			// source
			sprite_sheet, sprite_width*n, 0, sprite_width, sprite_height,
			// dest
			0, 0, sprite_width, sprite_height
		);
		
		disabled_canvas.ctx.drawShadowOfImage = function(x, y, color){
			var temp_canvas = make_canvas(sprite_width, sprite_height);
			var tmx = temp_canvas.ctx;
			tmx.drawImage(enabled_canvas, 0, 0);
			tmx.globalCompositeOperation = "source-in";
			tmx.fillStyle = color;
			tmx.fillRect(0, 0, sprite_width, sprite_height);
			disabled_canvas.ctx.drawImage(temp_canvas, x, y);
		};

		var style = getComputedStyle($button[0]);
		var hilight = style.getPropertyValue("--ButtonHilight");
		var shadow = style.getPropertyValue("--ButtonShadow");

		disabled_canvas.ctx.drawShadowOfImage(1, 1, hilight);
		disabled_canvas.ctx.drawShadowOfImage(0, 0, shadow);
	}

	$(sprite_sheet).load(function(){
		drawButtonIcon();
		// TODO: only update when theme changes
		setInterval(drawButtonIcon, 200);
	});
	
	$(enabled_canvas).add(disabled_canvas).css({
		margin: "auto",
		marginTop: 1,
		marginBottom: 2,
		pointerEvents: "none",
	});
	
	$button.disable = function(){
		$button.attr("disabled", true);
		$button.empty().append(disabled_canvas);
		return $button;
	};
	$button.enable = function(){
		$button.attr("disabled", false);
		$button.empty().append(enabled_canvas);
		return $button;
	};
	$button.disable();
	
	return $button;
};
