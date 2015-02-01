
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

var $Button = function(title, x){
	var $button = $("<button/>").attr("title", title);
	
	var n_buttons = 5;
	var sheet_width = 125;
	var sheet_height = 17;
	var sprite_width = sheet_width / n_buttons;
	var sprite_height = sheet_height;
	
	$("<span/>").appendTo($button).css({
		width: sprite_width,
		height: sprite_height,
		backgroundImage: "url(img/buttons.png)",
		backgroundPositionX: -sprite_width*x + "px",
		backgroundPositionY: "0px",
		margin: "auto"
	});
	
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

