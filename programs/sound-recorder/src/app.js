
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.URL = window.URL || window.webkitURL;

if (window.AudioContext) {
	var audio_context = new AudioContext;
} else {
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

// @TODO: DRY with Notepad, Paint (except for messages)
function are_you_sure(callback) {
	if (saved) {
		return callback();
	}
	showMessageBox({
		// @TODO: how does Windows 98 handle long paths?
		// message: `Discard changes to ${file_path || file_name || default_file_name_for_title}?`,
		// buttons: [
		// 	{
		// 		label: "Discard",
		// 		action: callback,
		// 	},
		// 	{
		// 		label: "Cancel",
		// 	},
		// ],
		message: `The file '${file_path || file_name || default_file_name_for_title}' file has changed.\n\nDo you want to save these changes?`,
		buttons: [
			{
				label: "Yes",
				value: "save",
				default: true,
			},
			{
				label: "No",
				value: "discard",
			},
			{
				label: "Cancel",
				value: "cancel",
			},
		],
	}).then((result) => {
		// console.log("message box gave", result);
		if (result === "save") {
			file_save(() => {
				callback();
			});
		} else if (result === "discard") {
			callback();
		}
	});
}


var parse_query_string = function (queryString) {
	var query = {};
	var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
	}
	return query;
};

var query = parse_query_string(location.search);
if (query.path) {
	var file_path = query.path;
	var file_name = file_name_from_path(file_path);
}

var get_wav_file = function (file, callback) {
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
	for (var channel = 0; channel < file.numberOfChannels; channel++) {
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

	worker.onmessage = function (e) {
		callback(e.data);
	};
};

var download_wav_file = function (file, callback) {

	// TODO: use Streams API to actually write in chunks where supported
	// (There's a WritableStream but I don't think there's been a sink specified for writing to a file)

	var gotWAV = function (blob) {
		// We have to show a download dialog here,
		// because browsers only allow downloads during user interaction.
		// @TODO: use this to prompt for a filename?
		showMessageBox({
			// message: `Are you sure you want to download ${file_name || default_file_name_for_saving}?\n\nI'm legally obligated to ask you this.`,
			message: `This will download a file to your computer. Continue?`,
			buttons: [
				{
					label: "Yes",
					default: true,
					action: () => {
						const file_name = file.name.replace(/(?:\.wav)?$/, ".wav");
						const a = document.createElement("a");
						a.download = file_name;
						a.href = URL.createObjectURL(blob);
						a.click();
						// Will the download go through if the page closes?
						// @TODO: test
						setTimeout(() => {
							saved = true;
							a.remove();
							callback?.();
						}, 1000);
					},
				},
				{
					label: "No",
				},
			],
		});
	};

	get_wav_file(file, gotWAV);
};

var update_title = function () {
	document.title = (file.name || default_file_name_for_title) + " - Sound Recorder";
	if (frameElement && frameElement.$window) {
		frameElement.$window.title(document.title);
	}
};

var update = function (position_from_slider) {
	update_title();

	if (position_from_slider != null) {
		file.position = position_from_slider;

		file.audio.seek(file.position);
		if (playing) {
			file.audio.play();
		}
	} else {
		if (playing) {
			var delta_time = audio_context.currentTime - previous_time;
			previous_time = audio_context.currentTime;
			file.position += delta_time;
		}
		// (not sure the (file.position >= file.availLength) needs to be within if(recording || playing){})
		if (recording || playing) {
			if (file.position >= file.availLength) {
				file.position = file.availLength;
				stop();
			}
		} else {
			if ($stop.is(":focus")) {
				$play.focus();
			}
			disable($stop);
		}
		if (recording) {
			file.length = Math.max(file.length, file.position);
		}
		if (file.length && !playing && !recording) {
			enable($play);
		} else {
			if ($play.is(":focus")) {
				$stop.focus();
			}
			disable($play);
		}
		$slider.slider("option", "max", file.availLength);
		$slider.slider("value", file.position);
	}

	$length.display(file.availLength);
	$position.display(file.position);
	wave_display.display();

	var can_seek_to_start = file.length && file.position > 0;
	// SLIDER_DUMBNESS: the slider doesn't slide all the way to the max value
	var can_seek_to_end = file.length && file.position + SLIDER_DUMBNESS < file.length;

	if (can_seek_to_start) {
		enable($seek_to_start);
	}
	if (can_seek_to_end) {
		enable($seek_to_end);
	}

	if (!can_seek_to_start) {
		if ($seek_to_start.is(":focus")) {
			$seek_to_end.focus();
		}
		disable($seek_to_start);
	}
	if (!can_seek_to_end) {
		if ($seek_to_end.is(":focus")) {
			$seek_to_start.focus();
		}
		disable($seek_to_end);
	}
};

var record = function () {
	clearInterval(tid);

	disable($record);
	enable($stop);
	$stop.focus();

	audio_context.resume();

	file.availLength = Math.max(file.length, file.position + 23.77);
	file.updateBufferSize(file.availLength);

	previous_time = audio_context.currentTime;
	tid = setInterval(update, 50);
	recording = true;
	saved = false;
};

var stop = function () {
	clearInterval(tid);

	file.audio.pause();

	if (input) { enable($record); }
	if (file.length) { enable($play); }

	if ($stop.is(":focus")) {
		if (recording) {
			$record.focus();
		} else {
			$play.focus();
		}
	}

	recording = false;
	playing = false;

	disable($stop);

	file.availLength = file.length;
	update();
};

var play = function () {
	clearInterval(tid);
	if (file.position >= file.length) {
		file.position = 0;
	}
	audio_context.resume();
	file.audio.seek(file.position);
	file.audio.play();

	enable($stop);
	$stop.focus();
	disable($play);

	playing = true;
	previous_time = audio_context.currentTime;
	tid = setInterval(update, 50);
	update();
};

var seek_to_start = function () {
	seek(0);
	$seek_to_end.focus();
};

var seek_to_end = function () {
	seek(file.length);
};



var seek = function (t) {
	file.position = t;
	file.audio.seek(file.position);
	if (playing) { file.audio.play(); }
	update();
};
var reset = function () {
	recording = false;
	playing = false;
	file = new AudioFile;
	file_path = null;
	saved = true; // doesn't need a confirmation dialog
	update();
};
var read_audio_data = function (file, callback) {
	var fileReader = new FileReader;
	fileReader.onload = function () {
		var arrayBuffer = this.result;
		audio_context.decodeAudioData(arrayBuffer, callback, function () {
			alert("Failed to read audio from file");
		});
	};
	fileReader.readAsArrayBuffer(file);
};
var load_from_blob_warning_if_unsaved = function (blob) {
	read_audio_data(blob, function (buffer) {
		are_you_sure(function () {
			reset();
			file.original_blob = blob;
			file.name = blob.name;
			file.setBuffer(buffer);
			update();
		});
	});
};



var file_new = function () {
	are_you_sure(reset);
};
var file_open = function () {
	$("<input type='file' accept='audio/*'>").click().change(function (e) {
		if (this.files[0]) {
			load_from_blob_warning_if_unsaved(this.files[0]);
		}
	});
};
var can_revert_file = function () {
	return !!file.original_blob;
};
var file_revert = function () {
	if (!file.original_blob) { throw new Error("No original_blob file"); }
	load_from_blob_warning_if_unsaved(file.original_blob);
};
var file_save_as = function (callback) {
	if (file.length > 0) {
		download_wav_file(file, callback);
	}
};
var file_save = file_save_as;


var can_delete_before_current_position = function () {
	return file.position > 0;
};
var can_delete_after_current_position = function () {
	return file.position < file.length;
};
var delete_before_current_position = function () {
	var cut_position = file.position;
	file.crop(cut_position, file.length);
	seek(0);
};
var delete_after_current_position = function () {
	var cut_position = file.position;
	file.crop(0, cut_position);
	seek(cut_position);
};


if (file_path) {
	// TODO: lock editing starting here

	file.name = file_name_from_path(file_path);
	update_title();

	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire('fs');
		fs.readFile(file_path, function (error, content) {
			if (error) {
				alert("Failed to load file: " + error);
				throw error;
			}
			// NOTE: could be destroying changes, since this is (potentially) async
			// although the user can probably undo
			// TODO: lock editing until here
			var __opening_file_path = file_path;
			var blob = new File([content], file_name_from_path(file_path));
			load_from_blob_warning_if_unsaved(blob);
		});
	});
}

if (frameElement && frameElement.$window) {
	frameElement.$window.on("close", function (e) {
		if (saved) {
			return;
		}
		e.preventDefault();
		are_you_sure(function () {
			frameElement.$window.close(true);
		});
	});
}


var input;

$(function () {

	var gotStream = function (stream) {
		input = audio_context.createMediaStreamSource(stream);
		// console.log("Media stream created.");

		input.connect(wave_display.analyser);
		input.connect(file.recorder);

		enable($record);
	};
	var gotError = function (err) {
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

	$(window).on("resize", () => {
		wave_display.display();
	});
});

// NOTE: DOM-related stuff is apparently supposed to happen in $app.js
// This divide is not necessarily helpful
// I accidentally added a second implementation of drag and drop here, not realizing there was $app.js to look in
