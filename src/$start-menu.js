
// TODO: start menu

/*
// if running from file: protocol, try to sniff the username >:)
var username_match = location.href.match(/\/(Users|home)\/(\w+)\//);
var username = username_match && username_match[1] || "Admin";
*/

var $start_menu = $(".start-menu");
$start_menu.hide();
// TODO: legitimate contents or whatever
var $start_content_area = $start_menu.find(".all-kinds-of-thing-container");
var $start_content_default = $start_menu.find(".all-kinds-of-thing-start-content");
var $windows_cant_do_it_you_can = $start_menu.find(".windows-cant-do-it-you-can");
var $start_a_program = $start_menu.find(".start-a-program");
var $self_help_template = $start_menu.find(".self-help-template");
var reset_to_start_of_start = function(){
	$start_content_area.html("").append($start_content_default);
};
$start_content_area.on("click", "a", function(e){
	e.preventDefault(); // TODO: maybe use the location.hash for navigation instead of preventing it
	var $a = $(e.target);
	var $section_to_show;
	if($a.text().match(/a computer program/i)){
		$start_menu.hide();
		$start_button.removeClass("selected");
		Paint();
		return;
	}else if($a.text().match(/a program for people/i)){
		$section_to_show = $windows_cant_do_it_you_can;
	}else if($a.text().match(/a program/i)){
		$section_to_show = $start_a_program;
	}else{
		$section_to_show = $windows_cant_do_it_you_can;
	}
	$section_to_show.attr({hidden: null});
	$start_content_area.html("").append($section_to_show);
	$start_content_area.find(".the-thing-heading").text($a.text());
	$start_content_area.find(".back-link").on("click", reset_to_start_of_start);
});
reset_to_start_of_start();
var open_start_menu = function(){
	reset_to_start_of_start();
	$start_button.addClass("selected");
	$start_menu.attr("hidden", null);
	$start_menu.slideDown(100); // DOWN AS IN UP (stupid jQuery)
	$start_menu.css({zIndex: ++$Window.Z_INDEX});
};
var close_start_menu = function(){
	$start_button.removeClass("selected");
	$start_menu.attr("hidden", "hidden");
	$start_menu.hide();
};
var toggle_start_menu = function(){
	if($start_menu.is(":hidden")){
		open_start_menu();
	}else{
		close_start_menu();
	}
};

var $start_button = $(".start-button");
$start_button.on("pointerdown", function(){
	toggle_start_menu();
});

$("body").on("pointerdown", function(e){
	if($(e.target).closest(".start-menu, .start-button").length === 0){
		close_start_menu();
	}
});
// Note: A lot of the time it's good to use focusout (in jQuery, or else blur with useCapture?[1]) as opposed to 
// That might be the case here as well, but maybe not since programs opening might grab focus and that probably shouldn't close the start menu
// Although at the operating system level it would probably prevent focus switching in the first place, so maybe we could do that
// The point being this is an operating system control and so it may warrant special handling,
// but generally I'd recommend making a control focusable and detecting loss of focus as in this answer:
// [1]: https://stackoverflow.com/a/38317768/2624876

$(window).on("keydown", function(e){
	if(e.which === 27){ // Esc to close
		close_start_menu();
	}
});
