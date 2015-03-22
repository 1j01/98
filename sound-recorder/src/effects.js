
var applyVolumeScale = function(scale){
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[i] * scale;
		}
	});
};

var effects_reverse = function(){
	// applyTimeScale(-1);
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[len-1-i];
		}
	}, -1);
};

var effects_increase_volume = function(){
	applyVolumeScale(125/100);
};

var effects_decrease_volume = function(){
	applyVolumeScale(100/125);
};

var effects_increase_speed = function(){
	// applyTimeScale(1/2);
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[i*2];
		}
	}, 1/2);
};

var effects_decrease_speed = function(){
	// applyTimeScale(2/1);
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[~~(i/2)];
		}
	}, 2);
};

var effects_add_echo = function(){
	var offset = file.buffer.sampleRate * 0.1;
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[i];
			if(i + offset < len){
				newData[i] += oldData[i + offset]/2;
			}
		}
	});
};
