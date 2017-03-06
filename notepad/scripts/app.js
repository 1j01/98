document.getElementById("content").innerHTML = localStorage["notepad-content"] || "Put something in the body";

setInterval(function(){
    localStorage["notepad-content"] = document.getElementById("content").innerHTML;
},2000)
