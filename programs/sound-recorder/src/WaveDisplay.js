
function WaveDisplay() {
	var wave_canvas = document.createElement("canvas");
	wave_canvas.width = 112;
	wave_canvas.height = 35;
	var wave_ctx = wave_canvas.getContext("2d");
	wave_ctx.fillStyle = "lime";
	wave_ctx.fillRect(0, 17, wave_canvas.width, 1);

	var analyser = audio_context.createAnalyser();
	var data = new Uint8Array(analyser.fftSize = 2048);

	this.element = wave_canvas;
	this.analyser = analyser;

	this.display = function () {
		if (recording) {
			analyser.getByteTimeDomainData(data);
		} else {
			for (var i = 0, len = data.length; i < len; i++) {
				data[i] = 128;
			}
			for (var channel = 0; channel < file.buffer.numberOfChannels; channel++) {
				var fileData = file.buffer.getChannelData(channel);

				for (var i = 0, len = data.length; i < len; i++) {
					var index = (file.position * file.buffer.sampleRate + i) | 0;
					if (index >= fileData.length) { break; }
					data[i] += fileData[index] * 128 / file.buffer.numberOfChannels;
				}
			}
		}

		wave_canvas.width = 1;
		wave_canvas.height = 1;
		wave_canvas.width = wave_canvas.parentElement.scrollWidth;
		wave_canvas.height = wave_canvas.parentElement.scrollHeight;

		wave_ctx.clearRect(0, 0, wave_canvas.width, wave_canvas.height);

		var middle = ~~(wave_canvas.height / 2);

		for (var x = 0; x < wave_canvas.width; x++) {
			var loudness = data[~~(data.length * x / wave_canvas.width)] / 128.0 - 1;


			// if(wave_canvas.width >/== 112){
			// 	var h = ~~(loudness*20 * wave_canvas.height/2);
			// 	wave_ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
			// 	wave_ctx.fillRect(x, middle-h, 1, h*2+1);
			// }

			var h = ~~(loudness * wave_canvas.height / 2);
			wave_ctx.fillStyle = "lime";
			wave_ctx.fillRect(x, middle - h, 1, h * 2 + 1);
		}
	};
}
