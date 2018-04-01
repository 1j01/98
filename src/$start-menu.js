
// TODO: start menu

/*
// if running from file: protocol, try to sniff the username >:)
var username_match = location.href.match(/\/(Users|home)\/(\w+)\//);
var username = username_match && username_match[1] || "Admin";
*/

var $start_menu = $(".start-menu");
$start_menu.hide();
// TODO: legitimate contents or whatever
$start_content_area = $start_menu.find(".all-kinds-of-thing-container");
$start_content_default = $start_menu.find(".all-kinds-of-thing-start-content");
$windows_cant_do_it_you_can = $start_menu.find(".windows-cant-do-it-you-can");
var reset_to_start_of_start = function(){
	$start_content_area.html("").append($start_content_default);
	$start_content_default.on("click", "a", function(e){
		e.preventDefault();
		$windows_cant_do_it_you_can.attr({hidden: null});
		$start_content_area.html("").append($windows_cant_do_it_you_can);
		$windows_cant_do_it_you_can.find(".the-thing-heading").text($(e.target).text());
		$windows_cant_do_it_you_can.find(".back-link").on("click", reset_to_start_of_start);
	});
};
reset_to_start_of_start();
var $start_button = $(".start-button");
$start_button.on("pointerdown", function(){
	reset_to_start_of_start();
	if($start_menu.is(":hidden")){
		$start_button.addClass("selected");
		$start_menu.slideDown(100); // DOWN AS IN UP (stupid jQuery)
	}else{
		$start_button.removeClass("selected");
		$start_menu.toggle();
	}
});
// TODO: close when you click off
