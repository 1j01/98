function Task(win){
	win.task = this;
	const $task = this.$task = $("<button class='task toggle'/>").appendTo($(".tasks"));
	const $title = $("<span class='title'/>");
	
	this.updateTitle = ()=> {
		$title.text(win.getTitle());
	};

	let $icon;
	this.updateIcon = ()=> {
		const icon_name = win.getIconName() || "task";
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
			win.minimize();
			win.blur();
		}else{
			win.unminimize();
			win.bringToFront();
			win.focus();
		}
	});
	
	win.onFocus(()=> {
		$task.addClass("selected");
	});
	win.onBlur(()=> {
		$task.removeClass("selected");
	});
	win.onClosed(()=> {
		$task.remove();
	});

	if(win.is && win.is(":visible")){
		win.focus();
	}
}
