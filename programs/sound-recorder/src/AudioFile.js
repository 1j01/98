

function AudioFile(){
	var file = this;
	file.name = "Sound";
	file.position = 0;
	file.length = 0;
	file.availLength = 0;
	
	file.audio = new BuffAudio(audio_context);
	
	var bufferLength = 4096;
	var numChannels = 2;
	var sampleRate = audio_context.sampleRate;
	
	var copy_buffer_data = function(old_buffer, new_buffer, offset){
		var offsetIndex = ~~((offset || 0) * sampleRate);
		for(var channel = 0; channel < numChannels; channel++){
			var oldData = old_buffer.getChannelData(Math.min(channel, old_buffer.numberOfChanels-1));
			var newData = new_buffer.getChannelData(channel);
			for(var i=0, len = oldData.length; i<len; i++){
				newData[i] = oldData[i + offsetIndex];
			}
		}
	};
	
	file.newBuffer = function(){
		var frameCount = (sampleRate * file.availLength) || 1; // (Buffers can't be of length 0)
		var new_buffer = audio_context.createBuffer(numChannels, frameCount, sampleRate);
		file.audio.initNewBuffer(new_buffer);
		return new_buffer;
	};
	
	file.setBuffer = function(buffer){
		file.buffer = buffer;
		file.audio.initNewBuffer(buffer);
		file.length = file.availLength = buffer.length / buffer.sampleRate;
	};
	
	file.updateBufferSize = function(length){
		length = length || file.availLength;
		var originalLength = file.length;
		file.availLength = length;
		var old_buffer = file.buffer;
		var new_buffer = file.newBuffer();
		if(old_buffer){
			copy_buffer_data(old_buffer, new_buffer);
		}
		file.setBuffer(new_buffer);
		file.length = originalLength; // setBuffer sets file.length
	};
	
	file.crop = function(start, end){
		file.availLength = file.length = end - start;
		var old_buffer = file.buffer;
		var new_buffer = file.newBuffer();
		if(old_buffer){
			copy_buffer_data(old_buffer, new_buffer, start);
		}
		file.setBuffer(new_buffer);
	};
	
	file.buffer = file.newBuffer();
	
	var createScriptProcessor = (
		audio_context.createScriptProcessor ||
		audio_context.createJavaScriptNode
	);
	file.recorder = createScriptProcessor.call(audio_context,
		bufferLength,
		numChannels, // input
		numChannels // output (why? see below)
	);
	file.recorder.onaudioprocess = function(e){
		if (!recording) return;
		
		for(var channel = 0; channel < numChannels; channel++){
			var inputData = e.inputBuffer.getChannelData(channel);
			var outputData = e.outputBuffer.getChannelData(channel);
			var fileData = file.buffer.getChannelData(channel);
			
			for(var i=0, len = inputData.length; i<len; i++){
				outputData[i] = inputData[i];
				if(channel === 0){
					fileData[(file.position*sampleRate + i)|0] = inputData[i];
				}
			}
		}
		
		file.audio.initNewBuffer(file.buffer); // wow, is this really necessary?? can we get rid of this please?
		
		file.position += len / sampleRate;
	};
	
	file.applyTimeScale = function(scale){
		/*
		var abs_scale = Math.abs(scale);
		file.applyTimeFunction(function(position, length){
			if(scale < 0){
				return (length - position) * abs_scale;
			}else{
				return position * abs_scale;
			}
		});
	};
	file.applyTimeFunction = function(timeFunction){*/
		// file.length = file.availLength???
		
		var old_buffer = file.buffer;
		var old_position = file.position;
		var old_length = file.length;//file.availLength???
		
		var abs_scale = Math.abs(scale);
		var f = function(old_position){
			//return timeFunction(old_position, old_length);
			if(scale < 0){
				return (old_length - old_position) * abs_scale;
			}else{
				return old_position * abs_scale;
			}
		};
		
		file.length = file.availLength = Math.abs(f(old_length) - f(0));
		var new_buffer = file.newBuffer();
		
		for(var channel = 0; channel < numChannels; channel++){
			var oldData = old_buffer.getChannelData(Math.min(channel, old_buffer.numberOfChanels-1));
			var newData = new_buffer.getChannelData(channel);
			/*for(var i=0, len=newData.length; i<len; i++){
				newData[i] = oldData[~~f(i)];
			}*/
			for(var i=0, len=oldData.length, inc=1/abs_scale; i<len; i+=inc){
				newData[~~f(i)] = oldData[~~(i)];
			}
		}
		
		file.setBuffer(new_buffer);
		
		// Update the file position and playback state
		file.position = f(old_position);
		console.log("old position:", old_position, "new position:", file.position);
		console.log("old length:", old_length, "new length:", file.length);
		file.audio.seek(file.position);
		if(playing){
			file.audio.play();
		}
		update();
	};
	
	file.applyEffect = function(effectFunction, timeScale){
		var old_buffer = file.buffer;
		var pos = file.position / file.length;
		
		file.length = file.availLength = file.availLength * Math.abs(timeScale || 1);
		var new_buffer = file.newBuffer();
		
		for(var channel = 0; channel < numChannels; channel++){
			var oldData = old_buffer.getChannelData(Math.min(channel, old_buffer.numberOfChanels-1));
			var newData = new_buffer.getChannelData(channel);
			effectFunction(oldData, newData);
		}
		
		file.setBuffer(new_buffer);
		
		// Update the file position
		var new_position = pos * file.length;
		if(timeScale < 0){
			new_position = file.length - new_position;
		}
		seek(new_position);
	};
	
	file.download = function(){
		file.updateBufferSize(file.length);
		
		var gotWAV = function(blob){
			var a = document.createElement('a');
			a.href = (window.URL || window.webkitURL).createObjectURL(blob);
			a.download = file.name.replace(/(?:\.wav)?$/, ".wav");
			var click = document.createEvent("Event");
			click.initEvent("click", true, true);
			a.dispatchEvent(click);
		};
		
		var worker = new Worker("lib/recorderWorker.js");
		
		worker.postMessage({
			command: "init",
			config: {
				sampleRate: audio_context.sampleRate,
				numChannels: numChannels
			}
		});
		
		var buffer = [];
		for (var channel = 0; channel < numChannels; channel++){
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
			gotWAV(e.data);
		};
	};
	
	// We have to connect the script processing node to the output
	// or else we don't recieve any audioprocess events :(
	// We don't want that to actually take effect,
	// so we pass it through a gain node to mute it
	var work_around = audio_context.createGain();
	work_around.gain.value = 0;
	file.recorder.connect(work_around);
	work_around.connect(audio_context.destination);
}
