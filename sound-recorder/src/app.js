
var $body = $("body")
var $V = $("<div class='sound-recorder'/>").addClass("jspaint").appendTo($body); // @TODO: remove jspaintisms (including $V)

var $position = $("<div class='inset position'>Position:<br/><span/> sec.</div>");
$position.display = function(t){ $position.find("span").text(t.toFixed(2)); };
var $length = $("<div class='inset length'>Length:<br/><span/> sec.</div>");
$length.display = function(t){ $length.find("span").text(t.toFixed(2)); };
var $wave = $("<div class='inset wave'/>");
var $display = $("<div class='display'/>").append($position, $wave, $length);

var $slider = $("<div class='inset slider'/>");
var $backward = $("<button/>");
var $forward = $("<button/>");
var $play = $("<button/>");
var $stop = $("<button/>");
var $record = $("<button/>");
var $controls = $("<div class='controls'/>").append($backward, $forward, $play, $stop, $record);

var $main = $("<div class='main'/>").appendTo($V).append($display, $slider, $controls);

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

