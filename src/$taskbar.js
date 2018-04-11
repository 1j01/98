
function Task($win){
	var $task = this.$task = $("<button class='task'/>").appendTo($(".tasks"));
	var $icon = $Icon($win.icon_name || "task", TASKBAR_ICON_SIZE);
	var $title = $("<span class='title'/>").text($win.title());
	$win.on("title-change", function(e){
		$title.text($win.title());
	});
	$win.on("icon-change", function(e){
		// $icon = ... needed so changing works multiple times
		$icon.replaceWith($icon = $win.$icon.clone()); // XXX: assuming TITLEBAR_ICON_SIZE === TASKBAR_ICON_SIZE
	});
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
	$win.on("focusin iframe-focusin", function(e){
		$task.addClass("selected");
	});
	$win.on("close", function(){
		$task.remove();
	});
}

(function(){
	var $time = $(".taskbar-time");
	var update_time = function(){
		$time.text(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
		$time.attr("title", new Date().toLocaleString([], {weekday: 'long', month: 'long', day: '2-digit', minute: '2-digit', hour: '2-digit'}));
		setTimeout(update_time, 1000);
	};
	update_time();
}());
