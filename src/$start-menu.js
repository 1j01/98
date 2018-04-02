
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
var $start_a_program = $start_menu.find(".start-a-program")
var reset_to_start_of_start = function(){
	$start_content_area.html("").append($start_content_default);
	$start_content_default.on("click", "a", function(e){
		e.preventDefault(); // TODO: maybe use the location.hash instead of preventing it
		var $a = $(e.target);
		var $section_to_show;
		if($a.text().match(/program/i)){
			$section_to_show = $start_a_program;
		}else{
			$section_to_show = $windows_cant_do_it_you_can;
		}
		$section_to_show.attr({hidden: null});
		$start_content_area.html("").append($section_to_show);
		$start_content_area.find(".the-thing-heading").text($a.text());
		$start_content_area.find(".back-link").on("click", reset_to_start_of_start);

		// TODO: DRY (just hacking this in here real quick)
		$start_content_area.on("click", "a", function(e){
			e.preventDefault(); // TODO: maybe use the location.hash instead of preventing it
			var $a = $(e.target);
			var $section_to_show;
			if($a.text().match(/a computer program/i)){
				$start_menu.hide();
				$start_button.removeClass("selected");
				Paint(); // FIXME: doubly executed (presumably other code as well, but most of it is basically idempotent)
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
