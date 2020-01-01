function Task($win){
	$win.task = this;
	var $task = this.$task = $("<button class='task'/>").appendTo($(".tasks"));
	var $icon = $Icon($win.getIconName() || "task", TASKBAR_ICON_SIZE);
	var $title = $("<span class='title'/>").text($win.getTitle());
	$win.on("title-change", function(e){
		$title.text($win.getTitle());
	});
	$win.on("icon-change", function(e){
		// $icon = ... needed so changing works multiple times
		$icon.replaceWith($icon = $win.$icon.clone()); // XXX: assuming TITLEBAR_ICON_SIZE === TASKBAR_ICON_SIZE
	});
	$task.append($icon, $title);
	$task.on("click", function(){
		if($task.hasClass("selected")){
			$win.minimize();
			$win.triggerHandler("blur");
		}else{
			$win.unminimize();
			$win.bringToFront();
			$win.triggerHandler("focus");
		}
	});
	if($win.is(":visible")){
		$win.triggerHandler("focus");
	}
	$win.on("focus", function(e){
		if ($win.is(e.target)) {
			$task.addClass("selected");
		}
	})
	$win.on("blur", function(e){
		if ($win.is(e.target)) {
			$task.removeClass("selected");
		}
	})
	$win.on("close", function(){
		$task.remove();
	});
}
