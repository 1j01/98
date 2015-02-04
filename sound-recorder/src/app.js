
var audio_context;
var recorder;

var previous_time;
var tid = -1;
var recording = false;
var playing = false;

var file = new AudioFile;

var update = function(position_from_slider){
	document.title = file.name + " - Sound Recorder";
	if(position_from_slider != null){
		file.position = position_from_slider;
	}else{
		if(recording || playing){
			var delta_time = new Date().getTime() - previous_time;
			previous_time = new Date().getTime();
			file.position += delta_time/1000;
			if(file.position >= file.availLength){
				$stop.click();
				file.position = file.availLength;
			}
		}
		if(recording){
			file.length = Math.max(file.length, file.position);
			$play.disable();
		}else if(file.length && !playing){
			$play.enable();
		}else{
			$play.disable();
		}
		$slider.slider("option", "max", file.availLength);
		$slider.slider("value", file.position);
	}
	
	$length.display(file.availLength);
	$position.display(file.position);
	$wave_display.triggerHandler("update");
	
	if(file.length && file.position > 0){
		$seek_to_start.enable();
	}else{
		$seek_to_start.disable();
	}
	if(file.length && file.position + SLIDER_DUMBNESS < file.length){ // why doesn't the slider slide all the way to the max?
		$seek_to_end.enable();
	}else{
		$seek_to_end.disable();
	}
};

var record = function(){
	clearInterval(tid);
	if(!recorder){ return; }
	
	recorder.record();
	__log("Recording...");
	
	$record.disable();
	$stop.enable();
	
	file.availLength = Math.max(file.length, file.position + 23.77);
	
	previous_time = new Date().getTime();
	tid = setInterval(update, 50);
	recording = true;
};

var stop = function(){
	clearInterval(tid);
	if(!recorder){ return; }
	
	if(recording){
		create_download();
		recorder.stop();
		//recorder.clear();
		__log("Stopped recording.");
	}
	
	recording = false;
	playing = false;
	
	$stop.disable();
	$record.enable();
	
	file.availLength = file.length;
	update();
};

var seek_to_start = function(){
	file.position = 0;
	update();
};
var seek_to_end = function(){
	file.position = file.length;
	update();
};

var play = function(){
	clearInterval(tid);
	if(file.position >= file.length){
		file.position = 0;
	}
	
	$play.disable();
	$stop.enable();
	
	playing = true;
	previous_time = new Date().getTime();
	tid = setInterval(update, 50);
	update();
};

function create_download(){
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
		playing = false;
		file = new AudioFile;
		update();
	});
};
var file_open = function(){
	are_you_sure(function(){
		
	});
};
var file_save = function(){
	file.length > 0 && recorder && recorder.exportWAV(function(blob) {
		var name = new Date().toISOString() + ".wav";
		Recorder.forceDownload(blob, name);
	});
};
var file_save_as = file_save; // function(){};



$(function(){
	
	var gotStream = function(stream){
		var input = audio_context.createMediaStreamSource(stream);
		__log("Media stream created.");
		
		recorder = new Recorder(input, {workerPath: "lib/recorderWorker.js"});
		__log("Recorder initialised.");
		
		var analyser = $wave_display.analyser;
		input.connect(analyser);
		
		$record.enable();
	};
	var gotError = function(err) {
		__log('No live audio input: ' + err);
	};
	navigator.getUserMedia({audio: true}, gotStream, gotError);
	update();
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

