
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.URL = window.URL || window.webkitURL;

if(window.AudioContext){
	var audio_context = new AudioContext;
}else{
	alert('No web audio support in this browser!');
}

var previous_time;
var tid = -1;
var recording = false;
var playing = false;

var file = new AudioFile;
var file_path;
var saved = true;

var default_file_name_for_title = "Sound";
var default_file_name_for_saving = "Sound.wav";

var are_you_sure = function(callback){
	if(saved){
		return callback();
	}
	// TODO: Use a proper dialog window! DRY with Notepad and Paint.
	if(confirm("Discard changes to "+(file_path || file.name || default_file_name_for_saving)+"?")){
		callback();
	}
};

var parse_query_string = function(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
};

var query = parse_query_string(location.search);
if(query.path){
	var file_path = query.path;
	var file_name = file_name_from_path(file_path);
}

var get_wav_file = function(file, callback){
	file.updateBufferSize(file.length);

	var worker = new Worker("lib/recorderWorker.js");
	
	worker.postMessage({
		command: "init",
		config: {
			sampleRate: audio_context.sampleRate,
			numChannels: file.numberOfChannels
		}
	});
	
	var buffer = [];
	for (var channel = 0; channel < file.numberOfChannels; channel++){
		buffer.push(file.buffer.getChannelData(channel));
	}
	worker.postMessage({
		command: "record",
		buffer: buffer,
	});
	
	worker.postMessage({
		command: "exportWAV",
		type: "audio/wav",
	});
	
	worker.onmessage = function(e){
		callback(e.data);
	};
};

var download_wav_file = function(file){
	
	// FIXME: download click fails because of async
	// TODO: display a window with a link to download, maybe prompt for a filename
	// TODO: use Streams API to actually write in chunks where supported
	// (There's a WritableStream but I don't think there's been a sink specified for writing to a file)

	var gotWAV = function(blob){
		var a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = file.name.replace(/(?:\.wav)?$/, ".wav");
		var click = document.createEvent("Event");
		click.initEvent("click", true, true);
		a.dispatchEvent(click);
	};

	get_wav_file(file, gotWAV);
	
};

var update_title = function(){
	document.title = (file.name || default_file_name_for_title) + " - Sound Recorder";
	if(frameElement && frameElement.$window){
		frameElement.$window.title(document.title);
	}
};

var update = function(position_from_slider){
	update_title();

	if(position_from_slider != null){
		file.position = position_from_slider;
		
		file.audio.seek(file.position);
		if(playing){
			file.audio.play();
		}
	}else{
		if(playing){
			var delta_time = audio_context.currentTime - previous_time;
			previous_time = audio_context.currentTime;
			file.position += delta_time;
		}
		// (not sure the (file.position >= file.availLength) needs to be within if(recording || playing){})
		if(recording || playing){
			if(file.position >= file.availLength){
				file.position = file.availLength;
				stop();
			}
		}else{
			if ($stop.is(":focus")) {
				$play.focus();
			}
			$stop.disable();
		}
		if(recording){
			file.length = Math.max(file.length, file.position);
		}
		if(file.length && !playing && !recording){
			$play.enable();
		}else{
			if ($play.is(":focus")) {
				$stop.focus();
			}
			$play.disable();
		}
		$slider.slider("option", "max", file.availLength);
		$slider.slider("value", file.position);
	}
	
	$length.display(file.availLength);
	$position.display(file.position);
	$wave_display.display();
	
	var can_seek_to_start = file.length && file.position > 0;
	// SLIDER_DUMBNESS: the slider doesn't slide all the way to the max value
	var can_seek_to_end = file.length && file.position + SLIDER_DUMBNESS < file.length;

	if(can_seek_to_start){
		$seek_to_start.enable();
	}
	if (can_seek_to_end) {
		$seek_to_end.enable();
	}

	if (!can_seek_to_start) {
		if ($seek_to_start.is(":focus")) {
			$seek_to_end.focus();
		}
		$seek_to_start.disable();
	}
	if (!can_seek_to_end) {
		if ($seek_to_end.is(":focus")) {
			$seek_to_start.focus();
		}
		$seek_to_end.disable();
	}
};

var record = function(){
	clearInterval(tid);
	
	$record.disable();
	$stop.enable();
	$stop.focus();
	
	audio_context.resume();

	file.availLength = Math.max(file.length, file.position + 23.77);
	file.updateBufferSize(file.availLength);
	
	previous_time = audio_context.currentTime;
	tid = setInterval(update, 50);
	recording = true;
	saved = false;
};

var stop = function(){
	clearInterval(tid);
	
	file.audio.pause();
	
	if(input){ $record.enable(); }
	if(file.length) { $play.enable(); }

	if ($stop.is(":focus")) {
		if (recording) {
			$record.focus();
		} else {
			$play.focus();
		}
	}

	recording = false;
	playing = false;
	
	$stop.disable();
	
	file.availLength = file.length;
	update();
};

var play = function(){
	clearInterval(tid);
	if(file.position >= file.length){
		file.position = 0;
	}
	audio_context.resume();
	file.audio.seek(file.position);
	file.audio.play();
	
	$stop.enable();
	$stop.focus();
	$play.disable();
	
	playing = true;
	previous_time = audio_context.currentTime;
	tid = setInterval(update, 50);
	update();
};

var seek_to_start = function(){
	seek(0);
	$seek_to_end.focus();
};

var seek_to_end = function(){
	seek(file.length);
};



var seek = function(t){
	file.position = t;
	file.audio.seek(file.position);
	if(playing){ file.audio.play(); }
	update();
};
var reset = function(){
	recording = false;
	playing = false;
	file = new AudioFile;
	file_path = null;
	saved = true; // the new nothingness is effectively saved, doesn't need a confirmation dialog
	update();
};
var read_audio_data = function(file, callback){
	var fileReader = new FileReader;
	fileReader.onload = function(){
		var arrayBuffer = this.result;
		audio_context.decodeAudioData(arrayBuffer, callback, function(){
			alert("Failed to read audio from file");
		});
	};
	fileReader.readAsArrayBuffer(file);
};
var load_from_blob_warning_if_unsaved = function(blob){
	read_audio_data(blob, function(buffer){
		are_you_sure(function(){
			reset();
			file.original_blob = blob;
			file.name = blob.name;
			file.setBuffer(buffer);
			update();
		});
	});
};



var file_new = function(){
	are_you_sure(reset);
};
var file_open = function(){
	$("<input type='file' accept='audio/*'>").click().change(function(e){
		if(this.files[0]){
			load_from_blob_warning_if_unsaved(this.files[0]);
		}
	});
};
var can_revert_file = function(){
	return !!file.original_blob;
};
var file_revert = function(){
	if(!file.original_blob){ throw new Error("No original_blob file"); }
	load_from_blob_warning_if_unsaved(file.original_blob);
};
var file_save_as = function(){
	if(file.length > 0){
		download_wav_file(file);
	}
};
var file_save = file_save_as;


var can_delete_before_current_position = function(){
	return file.position > 0;
};
var can_delete_after_current_position = function(){
	return file.position < file.length;
};
var delete_before_current_position = function(){
	var cut_position = file.position;
	file.crop(cut_position, file.length);
	seek(0);
};
var delete_after_current_position = function(){
	var cut_position = file.position;
	file.crop(0, cut_position);
	seek(cut_position);
};


if(file_path){
	// TODO: lock editing starting here
	
	file.name = file_name_from_path(file_path);
	update_title();

	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire('fs');
		fs.readFile(file_path, function(error, content){
			if(error){
				alert("Failed to load file: "+error);
				throw error;
			}
			// NOTE: could be destroying changes, since this is (potentially) async
			// altho the user can probably undo
			// TODO: lock editing until here
			var __opening_file_path = file_path;
			var blob = new File([content], file_name_from_path(file_path));
			load_from_blob_warning_if_unsaved(blob);
		});
	});
}

if(frameElement && frameElement.$window){
	frameElement.$window.on("close", function(e){
		if(saved){
			return;
		}
		e.preventDefault();
		are_you_sure(function(){
			frameElement.$window.close(true);
		});
	});
}


var input;

$(function(){
	
	var gotStream = function(stream){
		input = audio_context.createMediaStreamSource(stream);
		// console.log("Media stream created.");
		
		input.connect($wave_display.analyser);
		input.connect(file.recorder);
		
		$record.enable();
	};
	var gotError = function(err){
		console.log("No live audio input: ", err);
	};

	navigator.getUserMedia = (
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
	);

	if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
		navigator.getUserMedia({
			audio: true
		}, gotStream, gotError);
	} else {
		navigator.mediaDevices.getUserMedia({
			audio: true
		}).then(gotStream).catch(gotError);
	}
	
	update();
	
	$(window).on("resize", ()=> {
		$wave_display.display();
	});
});

// NOTE: DOM-related stuff is apparently supposed to happen in $app.js
// This divide is not necessarily helpful
// I accidentally added a second implementation of drag and drop here, not realizing there was $app.js to look in
