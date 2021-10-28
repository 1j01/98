var $Button = function (title, n) {
	var $button = $("<button/>").attr("title", title);

	// These aren't really toggle buttons (except for their radio button behavior)...
	// but they have a similar look while being clicked.
	$button.addClass("toggle");

	$("<span>").appendTo($button).addClass("icon").css({
		"background-position": `-${n * 44}px 0`,
	});

	$button.disable = function () {
		$button.attr("disabled", true);
		return $button;
	};
	$button.enable = function () {
		$button.attr("disabled", false);
		return $button;
	};
	$button.disable();

	return $button;
};
