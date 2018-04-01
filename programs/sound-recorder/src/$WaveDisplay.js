
function $WaveDisplay(){
	var wave_canvas = new Canvas(112, 35);
	wave_canvas.ctx.fillStyle = "lime";
	wave_canvas.ctx.fillRect(0, 17, wave_canvas.width, 1);
	
	var analyser = audio_context.createAnalyser();
	var data = new Uint8Array(analyser.fftSize = 2048);
	
	var $wave_display = $(wave_canvas);
	$wave_display.analyser = analyser;
	
	$wave_display.display = function(){
		
		if(recording){
			analyser.getByteTimeDomainData(data);
		}else{
			for(var i=0, len = data.length; i<len; i++){
				data[i] = 128;
			}
			for(var channel = 0; channel < file.buffer.numberOfChannels; channel++){
				var fileData = file.buffer.getChannelData(channel);
				
				for(var i=0, len = data.length; i<len; i++){
					var index = (file.position*file.buffer.sampleRate + i)|0;
					if(index >= fileData.length){ break; }
					data[i] += fileData[index]*128 / file.buffer.numberOfChannels;
				}
			}
		}
		
		wave_canvas.ctx.clearRect(0, 0, wave_canvas.width, wave_canvas.height);
		for(var x=0; x<wave_canvas.width; x++){
			var loudness = data[~~(data.length * x/wave_canvas.width)] / 128.0 - 1;
			
			if(location.protocol === "file:"){
				var h = ~~(loudness*20 * wave_canvas.height/2);
				wave_canvas.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
				wave_canvas.ctx.fillRect(x, 17-h, 1, h*2+1);
			}
			
			var h = ~~(loudness * wave_canvas.height/2);
			wave_canvas.ctx.fillStyle = "lime";
			wave_canvas.ctx.fillRect(x, 17-h, 1, h*2+1);
		}
	};
	
	return $wave_display;
}
