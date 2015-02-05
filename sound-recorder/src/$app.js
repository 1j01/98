
var $position = $("<div class='inset position'>Position:<br/><span/> sec.</div>");
$position.display = function(t){ $position.find("span").text(t.toFixed(2)); };
var $length = $("<div class='inset length'>Length:<br/><span/> sec.</div>");
$length.display = function(t){ $length.find("span").text(t.toFixed(2)); };
var $wave_display = new $WaveDisplay;
var $wave = $("<div class='inset wave'/>").append($wave_display);
var $display = $("<div class='display'/>").append($position, $wave, $length);

var $slider = $("<div class='inset slider'/>");
var $slider_container = $("<div class='slider-container'/>").append($slider);

var $seek_to_start = $Button("Seek To Start", 0).click(seek_to_start);
var $seek_to_end = $Button("Seek To End", 1).click(seek_to_end);
var $play = $Button("Play", 2).click(play);
var $stop = $Button("Stop", 3).click(stop);
var $record = $Button("Record", 4).click(record);
var $controls = $("<div class='controls'/>").append($seek_to_start, $seek_to_end, $play, $stop, $record);

var $main = $("<div class='main'/>").appendTo($V).append($display, $slider_container, $controls);

$position.display(0);
$length.display(0);

$slider.slider({
	step: SLIDER_DUMBNESS = 0.00001, // we don't really want it to step
	slide: function(event, ui){
		// $slider.slider("value") is not updated yet here so you have to use ui.value
		update(ui.value);
	}
});

/* ------------------------------------- */

$("body").on("mousedown contextmenu", function(e){
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

