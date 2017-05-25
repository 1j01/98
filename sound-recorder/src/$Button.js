
var sprite_sheet = document.createElement("img");
sprite_sheet.src = "img/buttons.png";

var $Button = function(title, n){
	var $button = $("<button/>").attr("title", title);
	
	var n_buttons = 5;
	var sheet_width = 125;
	var sheet_height = 17;
	var sprite_width = sheet_width / n_buttons;
	var sprite_height = sheet_height;
	
	var enabled_canvas = new Canvas(sprite_width, sprite_height);
	var disabled_canvas = new Canvas(sprite_width, sprite_height);
	
	$(sprite_sheet).load(function(){
		
		enabled_canvas.ctx.drawImage(
			// source
			sprite_sheet, sprite_width*n, 0, sprite_width, sprite_height,
			// dest
			0, 0, sprite_width, sprite_height
		);
		
		disabled_canvas.ctx.drawShadowOfImage = function(x, y, color){
			var temp_canvas = new Canvas(sprite_width, sprite_height);
			var tmx = temp_canvas.ctx;
			tmx.drawImage(enabled_canvas, 0, 0);
			tmx.globalCompositeOperation = "source-in";
			tmx.fillStyle = color;
			tmx.fillRect(0, 0, sprite_width, sprite_height);
			disabled_canvas.ctx.drawImage(temp_canvas, x, y);
		};
		disabled_canvas.ctx.drawShadowOfImage(1, 1, "#FFFFFF");
		disabled_canvas.ctx.drawShadowOfImage(0, 0, "#7F7F7F");
		
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
