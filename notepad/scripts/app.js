// Function to get url params
var parseQueryString = function() {
  var str = window.location.search
  var objURL = {}
    str.replace(
      new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
      function( $0, $1, $2, $3 ){
        objURL[ $1 ] = $3;
      })
    return objURL
}
params = parseQueryString();

// TODO use save button instead of automatic saving every 2 seconds
document.getElementById("content").innerHTML = localStorage["notepad-"+params["file"]] || "Change me, saved to local storage every 2 seconds.";

setInterval(function(){
    localStorage["notepad-"+params["file"]] = document.getElementById("content").innerHTML;
},2000)
