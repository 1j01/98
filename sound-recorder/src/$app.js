
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

$("body").on("mousedown selectstart contextmenu", function(e){
	if(
		e.target instanceof HTMLSelectElement ||
		e.target instanceof HTMLTextAreaElement ||
		(e.target instanceof HTMLLabelElement && e.type !== "contextmenu") ||
		(e.target instanceof HTMLInputElement && e.target.type !== "color")
	){
		return;
	}
	e.preventDefault();
});

$("body").on("keydown", function(e){
	
	if(e.altKey){
		//find key codes
		window.console && console.log(e.keyCode);
	}
	if(e.keyCode === 32){ //Space
		if(playing || recording){
			stop();
		}else{
			play();
		}
	}else if(e.ctrlKey){
		var key = String.fromCharCode(e.keyCode).toUpperCase();
		switch(key){
			// case "Z":
			// 	e.shiftKey ? redo() : undo();
			// break;
			// case "Y":
			// 	redo();
			// break;
			case "O":
				file_open();
			break;
			case "N":
				file_new();
			break;
			case "S":
				e.shiftKey ? file_save_as() : file_save();
			break;
			default:
				// This shortcut is not handled, do not try to prevent the default.
				return true;
		}
		e.preventDefault();
		return false;
	}
});

function open_from_FileList(files){
	$.each(files, function(i, file){
		if(file.type.match(/audio/)){
			open_file(file);
			return false;
		}else{
			alert("File not recognized as an audio file");
		}
	});
}

$body.on("dragover dragenter", function(e){
	e.preventDefault();
	e.stopPropagation();
}).on("drop", function(e){
	e.preventDefault();
	e.stopPropagation();
	var dt = e.originalEvent.dataTransfer;
	if(dt && dt.files && dt.files.length){
		open_from_FileList(dt.files);
	}
});

