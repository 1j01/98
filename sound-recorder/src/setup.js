
// @TODO: make menus a component or jquery plugin, and the status bar optional
var $body = $("body")
var $V = $("<div class='sound-recorder'/>").appendTo("body");
var $status_text = $();
$status_text.default = function(){};

var $log = $("<pre class='outside-app-widget'/>");
var __log = function(message, data){
	$log.append(
		$("<div style='font-family:monospace'/>").text(message + " " + (data || ""))
	);
	$log.appendTo("body");
}

// webkit shim
window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;

if(window.AudioContext){
	try {
		var audio_context = new AudioContext;
		__log('Audio context set up.');
		__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch (e) {
		__log(e);
	}
}else{
	__log('No web audio support in this browser!');
}
