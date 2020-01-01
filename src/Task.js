function Task($win){
	$win.task = this;
	const $task = this.$task = $("<button class='task'/>").appendTo($(".tasks"));
	const $title = $("<span class='title'/>");
	
	this.updateTitle = ()=> {
		$title.text($win.getTitle());
	};

	let $icon;
	this.updateIcon = ()=> {
		const icon_name = $win.getIconName() || "task";
		const old_$icon = $icon;
		$icon = $Icon(icon_name, TASKBAR_ICON_SIZE);
		if (old_$icon) {
			old_$icon.replaceWith($icon);
		} else {
			$task.prepend($icon);
		}
	};
	
	this.updateTitle();
	this.updateIcon();

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
