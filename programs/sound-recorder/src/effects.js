
var applyEffect = function (file, effectFunction, timeScale) {
	var old_buffer = file.buffer;
	var pos = file.position / file.length;
	if (isNaN(pos)) {
		pos = 0;
	}

	file.length = file.availLength = file.availLength * Math.abs(timeScale || 1);
	var new_buffer = file.newBuffer();

	for (var channel = 0; channel < file.numberOfChannels; channel++) {
		var oldData = old_buffer.getChannelData(Math.min(channel, old_buffer.numberOfChannels - 1));
		var newData = new_buffer.getChannelData(channel);
		effectFunction(oldData, newData);
	}

	file.setBuffer(new_buffer);

	// Update the file position
	var new_position = pos * file.length;
	if (timeScale < 0) {
		new_position = file.length - new_position;
	}
	seek(new_position);

	// Mark as unsaved
	saved = false;
};

var applyVolumeScale = function (scale) {
	applyEffect(file, function (oldData, newData) {
		for (var i = 0, len = newData.length; i < len; i++) {
			newData[i] = oldData[i] * scale;
		}
	});
};

var effects_reverse = function () {
	// applyTimeScale(-1);
	applyEffect(file, function (oldData, newData) {
		for (var i = 0, len = newData.length; i < len; i++) {
			newData[i] = oldData[len - 1 - i];
		}
	}, -1);
};

var effects_increase_volume = function () {
	applyVolumeScale(125 / 100);
};

var effects_decrease_volume = function () {
	applyVolumeScale(100 / 125);
};

var effects_increase_speed = function () {
	// applyTimeScale(1/2);
	applyEffect(file, function (oldData, newData) {
		for (var i = 0, len = newData.length; i < len; i++) {
			newData[i] = oldData[i * 2];
		}
	}, 1 / 2);
};

var effects_decrease_speed = function () {
	// applyTimeScale(2/1);
	applyEffect(file, function (oldData, newData) {
		for (var i = 0, len = newData.length; i < len; i++) {
			newData[i] = oldData[~~(i / 2)];
		}
	}, 2);
};

var effects_add_echo = function () {
	var offset = file.buffer.sampleRate * 0.1;
	applyEffect(file, function (oldData, newData) {
		for (var i = 0, len = newData.length; i < len; i++) {
			newData[i] = oldData[i];
			if (i + offset < len) {
				newData[i] += oldData[i + offset] / 2;
			}
		}
	});
};
