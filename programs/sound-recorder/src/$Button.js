
var sprite_sheet = document.createElement("img");
sprite_sheet.src = "img/buttons-spaced-out.png";

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

function waitFor(condition, callback) {
	if (condition()) {
		callback();
	} else {
		setTimeout(waitFor.bind(null, condition, callback), 50);
	}
}

$(sprite_sheet).load(function(){
	// Wait for stylesheet to be loaded
	waitFor(()=> {
		var style = getComputedStyle(document.documentElement);
		var hilight = style.getPropertyValue("--ButtonHilight");
		return !!hilight;
	}, ()=> {
		renderDisabledStateIcons();
		$(window).on("theme-changed", renderDisabledStateIcons);
	});
});

var $Button = function(title, n){
	var $button = $("<button/>").attr("title", title);

	// These aren't really toggle buttons (except for their radio button behavior)...
	// but they have a similar look while being clicked.
	$button.addClass("toggle");
	
	$button.css({
		"background-position": `-${n * 44}px 0`,
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
