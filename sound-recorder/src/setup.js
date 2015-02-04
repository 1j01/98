
var $body = $("body") // @TODO: remove jspaintisms
var $V = $("<div class='sound-recorder'/>").addClass("jspaint").appendTo("body"); // @TODO: remove jspaintisms
var $status_text = $(); // @TODO: remove jspaintisms
$status_text.default = function(){}; // @TODO: remove jspaintisms

var $log = $("<pre class='outside-app-widget'/>");
var __log = function(message, data){
	$log.append(
		$("<div style='font-family:monospace'/>").text(message + " " + (data || ""))
	);
	$log.appendTo("body");
}

try {
	// webkit shim
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	window.URL = window.URL || window.webkitURL;

	audio_context = new AudioContext;
	__log('Audio context set up.');
	__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
} catch (e) {
	alert('No web audio support in this browser!');
	console.error(e);
}
