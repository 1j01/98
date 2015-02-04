
function AudioFile(){
	this.name = "Sound";
	this.position = 0;
	this.length = 0;
	this.availLength = 0;
	
	/*
	this.buffer = audio_context.createBuffer(2, 22050, 44100);
	
	this.playback = audio_context.createBufferSource();
	this.playback.buffer = this.buffer;
	this.playback.connect(audio_context.destination);
	
	var bufferLength = config.bufferLength || 4096;
	var numChannels = config.numChannels || 2;

	var createScriptProcessor = (
		audio_context.createScriptProcessor ||
		audio_context.createJavaScriptNode
	);

	this.node = createScriptProcessor.call(
		audio_context,
		bufferLen,
		numChannels,
		numChannels
	);
	*/
	
}
