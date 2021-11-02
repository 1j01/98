
var $position = $("<div class='inset-shallow position'><div class='center-me'>Position:<br/><span/> sec.</div></div>");
$position.display = function (t) { $position.find("span").text(t.toFixed(2)); };
var $length = $("<div class='inset-shallow length'><div class='center-me'>Length:<br/><span/> sec.</div></div>");
$length.display = function (t) { $length.find("span").text(t.toFixed(2)); };
var wave_display = new WaveDisplay;
var $wave = $("<div class='inset-shallow wave'/>").append(wave_display.element);
var $display = $("<div class='display'/>").append($position, $wave, $length);

var $slider = $("<div class='inset-shallow slider'/>");
var $slider_container = $("<div class='slider-container'/>").append($slider);

var make_$button = function (title, n) {
	var $button = $("<button/>").attr("title", title);

	// These aren't really toggle buttons (except for their radio button behavior)...
	// but they have a similar look while being clicked.
	$button.addClass("toggle");

	$("<span>").appendTo($button).addClass("icon").css({
		"background-position": `-${n * 44}px 0`,
	});

	disable($button);

	return $button;
};
function disable($button) {
	$button.attr("disabled", true);
}
function enable($button) {
	$button.attr("disabled", false);
}

var $seek_to_start = make_$button("Seek To Start", 0).click(seek_to_start);
var $seek_to_end = make_$button("Seek To End", 1).click(seek_to_end);
var $play = make_$button("Play", 2).click(play);
var $stop = make_$button("Stop", 3).click(stop);
var $record = make_$button("Record", 4).click(record);
var $controls = $("<div class='controls'/>").append($seek_to_start, $seek_to_end, $play, $stop, $record);

var $app = $("<div class='sound-recorder'/>").appendTo("body");
var $main = $("<div class='main'/>").appendTo($app).append($display, $slider_container, $controls);

$position.display(0);
$length.display(0);

$slider.slider({
	step: SLIDER_DUMBNESS = 0.00001, // we don't really want it to step...
	// except for if you use the keyboard (or mousewheel)
	// TODO: is there a way to have it be continuous when dragging, but still step reasonably?
	// handle keyboard events manually and prevent the default I guess

	slide: function (event, ui) {
		// $slider.slider("value") is not updated yet here so you have to use ui.value
		update(ui.value);
	}
});
$slider.find(".ui-slider-handle").addClass("outset-deep");

$slider_container.on("mousedown pointerdown", () => {
	$slider.find(".ui-slider-handle").focus();
});

/* ------------------------------------- */

$("body").on("mousedown selectstart contextmenu", function (e) {
	if (
		e.target instanceof HTMLButtonElement ||
		e.target instanceof HTMLSelectElement ||
		e.target instanceof HTMLTextAreaElement ||
		(e.target instanceof HTMLLabelElement && e.type !== "contextmenu") ||
		(e.target instanceof HTMLInputElement && e.target.type !== "color")
	) {
		return;
	}
	e.preventDefault();
});

$("body").on("keydown", function (e) {
	if (e.ctrlKey) {
		var key = String.fromCharCode(e.keyCode).toUpperCase();
		switch (key) {
			// case "Z":
			// 	e.shiftKey ? redo() : undo();
			// break;
			// case "Y":
			// 	redo();
			// break;
			case "O":
				file_open();
				break;
			case "N":
				file_new();
				break;
			case "S":
				e.shiftKey ? file_save_as() : file_save();
				break;
			default:
				// This shortcut is not handled, do not try to prevent the default.
				return true;
		}
		e.preventDefault();
		return false;
	}
});

function open_from_file_list_warning_if_unsaved(files) {
	$.each(files, function (i, file) {
		if (file.type.match(/audio/)) {
			load_from_blob_warning_if_unsaved(file);
			return false;
		} else {
			alert("File not recognized as an audio file");
		}
	});
}

$("body").on("dragover dragenter", function (e) {
	e.preventDefault();
	e.stopPropagation();
}).on("drop", function (e) {
	e.preventDefault();
	e.stopPropagation();
	var dt = e.originalEvent.dataTransfer;
	if (dt && dt.files && dt.files.length) {
		open_from_file_list_warning_if_unsaved(dt.files);
	}
});

