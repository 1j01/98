
function AudioFile(){
	var file = this;
	file.name = "Sound";
	file.position = 0;
	file.length = 0;
	file.availLength = 0;
	
	var bufferLength = 4096;
	var numChannels = 2;
	var sampleRate = audio_context.sampleRate;
	
	file.audio = new BuffAudio(audio_context);
	file.updateBuffer = function(){
		var frameCount = sampleRate * file.availLength;
		file.buffer = audio_context.createBuffer(numChannels, frameCount||1, sampleRate);
		file.audio.initNewBuffer(file.buffer);
	};
	file.updateBuffer();
	
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
			
			var len = inputData.length;
			for(var i=0; i<len; i++){
				outputData[i] = inputData[i];
				if(channel === 0){
					fileData[(file.position*sampleRate + i)|0] = inputData[i];
				}
			}
		}
		
		file.position += len / sampleRate;
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
