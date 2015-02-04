
var $position = $("<div class='inset position'>Position:<br/><span/> sec.</div>");
$position.display = function(t){ $position.find("span").text(t.toFixed(2)); };
var $length = $("<div class='inset length'>Length:<br/><span/> sec.</div>");
$length.display = function(t){ $length.find("span").text(t.toFixed(2)); };
var $wave_display = new $WaveDisplay;
var $wave = $("<div class='inset wave'/>").append($wave_display);
var $display = $("<div class='display'/>").append($position, $wave, $length);

var $slider = $("<div class='inset slider'/>");
var $slider_container = $("<div class='slider-container'/>").append($slider);

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

var $seek_to_start = $Button("Seek To Start", 0).click(seek_to_start);
var $seek_to_end = $Button("Seek To End", 1).click(seek_to_end);
var $play = $Button("Play", 2).click(play);
var $stop = $Button("Stop", 3).click(stop);
var $record = $Button("Record", 4).click(record);
var $controls = $("<div class='controls'/>").append($seek_to_start, $seek_to_end, $play, $stop, $record);

var $main = $("<div class='main'/>").appendTo($V).append($display, $slider_container, $controls);

$position.display(0);
$length.display(0);

var SLIDER_DUMBNESS = 0.00001; // we don't really want a step

$slider.slider({
	step: 0.00001,
	slide: function(event, ui){
		//console.log(ui.value, $slider.slider("value"));
		// these are different; the $slider.slider("value") is not updated
		update(ui.value);
	}
});
