
var effects_reverse = function(){
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[len-1-i];
		}
	}, -1);
};

var effects_increase_volume = function(){
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[i] * 1.25;
		}
	});
};

var effects_decrease_volume = function(){
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[i] / 1.25;
		}
	});
};

var effects_increase_speed = function(){
	file.applyEffect(function(oldData, newData){
		for(var i=0, len=newData.length; i<len; i++){
			newData[i] = oldData[i*2];
		}
	}, 1/2);
};

var effects_decrease_speed = function(){
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
