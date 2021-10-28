(function () {
	var $time = $(".taskbar-time");
	var update_time = function () {
		$time.text(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
		$time.attr("title", new Date().toLocaleString([], { weekday: 'long', month: 'long', day: '2-digit', minute: '2-digit', hour: '2-digit' }));
		setTimeout(update_time, 1000);
	};
	update_time();
}());
