
function Task($win){
	var $task = this.$task = $("<button class='task'/>").appendTo($tasks);
	var $icon = $Icon($win.icon_name || "task", TASKBAR_ICON_SIZE);
	// TODO: update task button title when window title changes
	var $title = $("<span class='title'/>").text($win.title());
	$task.append($icon, $title);
	$task.on("click", function(){
		$task.toggleClass("selected");
		if($task.hasClass("selected")){
			$win.show();
			$win.triggerHandler("focus");
		}else{
			$win.hide();
			$win.triggerHandler("blur");
		}
	});
	if($win.is(":visible")){
		$task.addClass("selected");
		$win.triggerHandler("focus");
	}
	$win.on("pointerdown", function(e){
		$task.addClass("selected");
		$win.triggerHandler("focus");
	});
	$win.on("close", function(){
		$task.remove();
	});
}

var $taskbar = $(".taskbar");
var $start_button = $(".start-button");
var $tasks = $(".tasks");
