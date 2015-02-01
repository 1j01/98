
var $body = $("body")
var $V = $("<div class='sound-recorder'/>").addClass("jspaint").appendTo($body); // @TODO: remove jspaintisms (including $V)

var $position = $("<div class='inset position'>Position:<br/><span/> sec.</div>");
$position.display = function(t){ $position.find("span").text(t.toFixed(2)); };
var $length = $("<div class='inset length'>Length:<br/><span/> sec.</div>");
$length.display = function(t){ $length.find("span").text(t.toFixed(2)); };
var $wave = $("<div class='inset wave'/>");
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
	
	var disabled_canvas = new Canvas(sprite_width, sprite_height);
	
	$(sprite_sheet).load(function(){
		
		disabled_canvas.ctx.drawShadowOfImage = function(x, y, color){
			var temp_canvas = new Canvas(sprite_width, sprite_height);
			var tmx = temp_canvas.ctx;
			tmx.drawImage(
				// source
				sprite_sheet, sprite_width*n, 0, sprite_width, sprite_height,
				// dest
				0, 0, sprite_width, sprite_height
			);
			tmx.globalCompositeOperation = "source-in";
			tmx.fillStyle = color;
			tmx.fillRect(0, 0, sprite_width, sprite_height);
			disabled_canvas.ctx.drawImage(temp_canvas, x, y);
		};
		disabled_canvas.ctx.drawShadowOfImage(1, 1, "#FFFFFF");
		disabled_canvas.ctx.drawShadowOfImage(0, 0, "#7F7F7F");
		
	});
	$(disabled_canvas).appendTo($button).css({margin: "auto"});
	$button.attr("disabled", true);
	
	return $button;
};

var $seek_to_start = $Button("Seek To Start", 0);
var $seek_to_end = $Button("Seek To End", 1);
var $play = $Button("Play", 2);
var $stop = $Button("Stop", 3);
var $record = $Button("Record", 4);
var $controls = $("<div class='controls'/>").append($seek_to_start, $seek_to_end, $play, $stop, $record);

var $main = $("<div class='main'/>").appendTo($V).append($display, $slider_container, $controls);

$position.display(0);
$length.display(0);

$slider.slider({
	step: 0.01,
	slide: function(event, ui){
		$position.display(ui.value);
	}
});
//$slider.slider("max", 500);

var canvas = new Canvas(112, 35);
canvas.ctx.fillStyle = "lime";
canvas.ctx.fillRect(0, 17, canvas.width, 1);
$wave.append(canvas);


var $status_text = $();
$status_text.default = function(){};

var file_new = function(){};
var file_open = function(){};
var file_save = function(){};
var file_save_as = function(){};


/* ------------------------------------- */

$body.on("mousedown contextmenu", function(e){
	if(
		e.target instanceof HTMLSelectElement ||
		e.target instanceof HTMLTextAreaElement ||
		(e.target instanceof HTMLLabelElement && e.type !== "contextmenu") ||
		(e.target instanceof HTMLInputElement && e.target.type !== "color")
	){
		return true;
	}
	e.preventDefault();
});

// We might not get a mouseup event if you Alt+Tab or whatever
$G.on("blur", function(e){
	$G.triggerHandler("mouseup");
});

