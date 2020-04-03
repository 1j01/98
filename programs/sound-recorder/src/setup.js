
// webkit shim
window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;

if(window.AudioContext){
	var audio_context = new AudioContext;
}else{
	alert('No web audio support in this browser!');
}
