
function AudioFile(){
	this.name = "Sound";
	this.position = 0;
	this.length = 0;
	this.availLength = 0;
	
	/*
	var config = {};
	var bufferLength = config.bufferLength || 4096;
	var numChannels = config.numChannels || 2;

	this.buffer = audio_context.createBuffer(numChannels, 22050, 44100);
	
	this.play = function(t){
		this.playback = audio_context.createBufferSource();
		this.playback.buffer = this.buffer;
		this.playback.connect(audio_context.destination);
		this.playback.start(audio_context.currentTime-t);
	};
	
	this.stop = function(){
		this.playback && this.playback.disconnect();//noteOff(audio_context.currentTime);
		this.playback = null;
	};
	
	var createScriptProcessor = (
		audio_context.createScriptProcessor ||
		audio_context.createJavaScriptNode
	);

	this.recorder = createScriptProcessor.call(
		audio_context,
		bufferLength,
		numChannels,
		numChannels
	);
	this.recorder.onaudioprocess = function(e){
		if (!recording) return;
		var buffer = [];
		for (var channel = 0; channel < numChannels; channel++){
			buffer.push(e.inputBuffer.getChannelData(channel));
		}
	};
	*/
	
}
