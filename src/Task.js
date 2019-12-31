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
	$win.__$task = $task;
	$task.append($icon, $title);
	$task.on("click", function(){
		$task.toggleClass("selected");
		if ($win.$titlebar) {
			if($task.hasClass("selected")){
				if ($win.is(":hidden")) {
					const before_rect = $task[0].getBoundingClientRect();
					$win.show();
					const after_rect = $win.$titlebar[0].getBoundingClientRect();
					$win.hide();
					$win.animateTitlebar(before_rect, after_rect, ()=> {
						$win.show();
						$win.triggerHandler("focus");
					});
				} else {
					$win.show();
					$win.triggerHandler("focus");
				}
			}else{
				const before_rect = $win.$titlebar[0].getBoundingClientRect();
				$win.hide();
				$win.triggerHandler("blur");
				const after_rect = $task[0].getBoundingClientRect();
				$win.animateTitlebar(before_rect, after_rect);
			}
		} else {
			if($task.hasClass("selected")){
				$win.show();
				$win.triggerHandler("focus");
			} else {
				$win.hide();
				$win.triggerHandler("blur");
			}
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
