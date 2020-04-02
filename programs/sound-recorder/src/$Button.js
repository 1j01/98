
var sprite_sheet = document.createElement("img");
sprite_sheet.src = "img/buttons.png";

var make_canvas = (width, height)=> {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.ctx = canvas.getContext("2d");
	return canvas;
};

document.documentElement.style.setProperty("--icon-enabled", `url("${sprite_sheet.src}")`);

function renderDisabledStateIcons() {
	var {width, height} = sprite_sheet;

	var disabled_canvas = make_canvas(width, height);
	
	var drawShadowOfImage = function(x, y, color){
		var temp_canvas = make_canvas(width, height);
		var tmx = temp_canvas.ctx;
		tmx.drawImage(sprite_sheet, 0, 0);
		tmx.globalCompositeOperation = "source-in";
		tmx.fillStyle = color;
		tmx.fillRect(0, 0, width, height);
		disabled_canvas.ctx.drawImage(temp_canvas, x, y);
	};

	var style = getComputedStyle(document.documentElement);
	var hilight = style.getPropertyValue("--ButtonHilight");
	var shadow = style.getPropertyValue("--ButtonShadow");

	drawShadowOfImage(1, 1, hilight);
	drawShadowOfImage(0, 0, shadow);

	disabled_canvas.toBlob((blob)=> {
		var blob_url = URL.createObjectURL(blob);
		document.documentElement.style.setProperty("--icon-disabled", `url("${blob_url}")`);
	});
}

$(sprite_sheet).load(function(){
	renderDisabledStateIcons();
	$(window).on("theme-changed", renderDisabledStateIcons);
});

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

	$button.css({
		"background-position": `-${n * sprite_width}px 0`,
	});
	
	$button.disable = function(){
		$button.attr("disabled", true);
		return $button;
	};
	$button.enable = function(){
		$button.attr("disabled", false);
		return $button;
	};
	$button.disable();
	
	return $button;
};
