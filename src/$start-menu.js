
// TODO: start menu

/*
// if running from file: protocol, try to sniff the username >:)
var username_match = location.href.match(/\/(Users|home)\/(\w+)\//);
var username = username_match && username_match[1] || "Admin";
*/

var $start_menu = $("<div class='start-menu'>").appendTo("body");
$start_menu.hide();
// TODO: legitimate contents or whatever
$start_menu.html("Welcome to the Start Menu.<br>Please enjoy your stay.<br><br>Amazing.<br><br><br><br><br><br>At the Start Menu, you can do all kinds of thing. Sit and wait, here you are. Look up at the night sky, say goodbye, maybe see a star. Rent a car. Sponds sword buy rent a car, anywher you went, that's a car™<br><br>And thus that's a thing. 420 blaze it, it's the blaze it hour.<br>This webpage cannot be displayed at this time. Stop. Don't Start. Allah-alla walluki. Manooki. Walaluigi.<br>Mononoki. Low key keyboard fee.<br>").css({padding: "15px"});
var $start_button = $(".start-button");
$start_button.on("pointerdown", function(){
	if($start_menu.is(":hidden")){
		$start_button.addClass("selected");
		$start_menu.slideDown(100); // DOWN AS IN UP (stupid jQuery))
	}else{
		$start_button.removeClass("selected");
		$start_menu.toggle();
	}
});
// TODO: close when you click off
