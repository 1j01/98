
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

var $seek_to_start = $Button("Seek To Start", 0);
var $seek_to_end = $Button("Seek To End", 1);
var $play = $Button("Play", 2);
var $stop = $Button("Stop", 3);
var $record = $Button("Record", 4);
var $controls = $("<div class='controls'/>").append($seek_to_start, $seek_to_end, $play, $stop, $record);

var $main = $("<div class='main'/>").appendTo($V).append($display, $slider_container, $controls);

var $log = $("<pre class='outside-app-widget'/>").appendTo($body);
var __log = function(message, data){
	$log.append(
		$("<div style='font-family:monospace'/>").text(message + " " + (data || ""))
	);
}

$position.display(0);
$length.display(0);

$slider.slider({
	step: 0.01,
	slide: function(event, ui){
		//console.log(ui.value, $slider.slider("value"));
		// these are different; the $slider.slider("value") is not updated
		update(ui.value);
	}
});

var audio_context;
var recorder;

var previous_time;
var tid = -1;
var recording = false;

var file = {
	length: 0,
	position: 0,
	name: "Sound"
};

var update = function(position_from_slider){
	document.title = file.name + " - Sound Recorder";
	if(position_from_slider != null){
		file.position = position_from_slider;
	}else{
		if(recording){
			var delta_time = new Date().getTime() - previous_time;
			previous_time = new Date().getTime();
			file.position += delta_time/1000;
		}
		$slider.slider("option", "max", file.length);
		$slider.slider("value", file.position);
	}
	
	$length.display(file.length);
	$position.display(file.position);
	
	if(file.length && file.position > 0){
		$seek_to_start.enable();
	}else{
		$seek_to_start.disable();
	}
	if(file.length && file.position+0.01 < file.length){ // +0.01 because the slider doesn't go all the way to max
		$seek_to_end.enable();
	}else{
		$seek_to_end.disable();
	}
};
update();


$record.click(function(){
	clearInterval(tid);
	if(!recorder){ return; }
	
	recorder.record();
	__log("Recording...");
	
	$record.disable();
	$stop.enable();
	
	// I think it increases the length of the file to at least ~24 seconds
	// more than the size of the file that has been recorded in
	/*if(file.length){
		//file.length += 1;
	}else{
		file.length = 23.77;
	}*/
	file.length = Math.max(file.length, file.position + 23.77);
	// also, 23.77 is probably some even number in buffer bytes
	
	previous_time = new Date().getTime();
	tid = setInterval(update, 50);
	recording = true;
});

$stop.click(function(){
	clearInterval(tid);
	recording = false;
	
	if(!recorder){ return; }
	
	recorder.stop();
	__log("Stopped recording.");
	$stop.disable();
	$record.enable();
	
	// create WAV download link using audio data blob
	createDownloadLink();
	
	//recorder.clear();
});

$seek_to_start.click(function(){
	file.position = 0;
	update();
});
$seek_to_end.click(function(){
	file.position = file.length;
	update();
});

function createDownloadLink(){
	recorder && recorder.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
		var name = new Date().toISOString() + ".wav";
		$("body").append(
			$("<div class='outside-app-widget'/>").append(
				$("<audio controls/>").attr({
					src: url,
				}),
				$("<br/>"),
				$("<a/>", {
					download: name,
					text: name,
					href: url,
				})
			)
		);
	});
}

$(function(){
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		__log('Audio context set up.');
		__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch (e) {
		alert('No web audio support in this browser!');
	}
	
	var gotStream = function(stream){
		var input = audio_context.createMediaStreamSource(stream);
		__log("Media stream created.");

		recorder = new Recorder(input);
		__log("Recorder initialised.");
		
		$record.enable();
	};
	var gotError = function(err) {
		__log('No live audio input: ' + err);
	};
	navigator.getUserMedia({audio: true}, gotStream, gotError);
});

var wave_canvas = new Canvas(112, 35);
wave_canvas.ctx.fillStyle = "lime";
wave_canvas.ctx.fillRect(0, 17, wave_canvas.width, 1);
$wave.append(wave_canvas);


var $status_text = $();
$status_text.default = function(){};

var are_you_sure = function(fn){
	fn(); // probably, right?
};
var file_new = function(){
	are_you_sure(function(){
		if(recorder){
			recorder.stop();
			recorder.clear();
		}
		recording = false;
		file = {
			position: 0,
			length: 0,
			name: "Sound",
		};
		update();
	});
};
var file_open = function(){
	are_you_sure(function(){
		
	});
};
var file_save = function(){
	file.length > 0 && recorder && recorder.exportWAV(function(blob) {
		//var url = URL.createObjectURL(blob);
		var name = new Date().toISOString() + ".wav";
		Recorder.forceDownload(blob, name);
		/*console.log(url, name);
		console.log($("<a/>", {
			download: name,
			href: url,
		}).appendTo("body").click());*/
	});
};
var file_save_as = file_save; // function(){};


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

