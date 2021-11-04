
var $textarea = $("#document-textarea");
var $print_helper = $("#print-helper");

$("body").on("mousedown selectstart contextmenu", function (e) {
	if (
		e.target instanceof HTMLSelectElement ||
		e.target instanceof HTMLTextAreaElement ||
		(e.target instanceof HTMLLabelElement && e.type !== "contextmenu") ||
		(e.target instanceof HTMLInputElement && e.target.type !== "color")
	) {
		return;
	}
	e.preventDefault();
});

function parse_query_string(queryString) {
	var query = {};
	var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
	}
	return query;
}

var query = parse_query_string(location.search);
if (query.path) {
	var file_path = query.path;
	var file_name = file_name_from_path(file_path);
} else if (location.search.length > 1) {
	var local_storage_document_id = location.search.replace("?", "");
	var file_name = location.search.replace("?", "");
}
var default_file_name_for_title = "Untitled";
var default_file_name_for_saving = "Untitled.txt";

function update_title() {
	document.title = (file_name || default_file_name_for_title) + " - Notepad";

	if (frameElement && frameElement.$window) {
		frameElement.$window.title(document.title);
	}
}

update_title();

var saved = true;

function are_you_sure(callback) {
	if (saved) {
		return callback();
	}
	showMessageBox({
		// @TODO: how does Windows 98 handle long paths?
		// message: `Discard changes to ${file_path || file_name || default_file_name_for_title}?`,
		// buttons: [
		// 	{
		// 		label: "Discard",
		// 		action: callback,
		// 	},
		// 	{
		// 		label: "Cancel",
		// 	},
		// ],
		message: `The text in the ${file_path || file_name || default_file_name_for_title} file has changed.\n\nDo you want to save the changes?`,
		buttons: [
			{
				label: "Yes",
				value: "save",
				default: true,
			},
			{
				label: "No",
				value: "discard",
			},
			{
				label: "Cancel",
				value: "cancel",
			},
		],
	}).then((result) => {
		// console.log("message box gave", result);
		if (result === "save") {
			file_save(() => {
				callback();
			});
		} else if (result === "discard") {
			callback();
		}
	});
}

if (frameElement) {
	frameElement.$window.on("close", function (e) {
		if (saved) {
			return;
		}
		e.preventDefault();
		are_you_sure(function () {
			frameElement.$window.close(true);
		});
	});
}

function file_new() {
	are_you_sure(function () {
		$textarea.val("");
		update_print_helper();
		saved = true;
		file_path = null;
		file_name = null;
		local_storage_document_id = null;
		update_title();
	});
}

function load_from_blob(blob) {
	var file_reader = new FileReader;
	file_reader.onerror = function () {
		alert("Failed to read file: " + file_reader.error);
	};
	file_reader.onload = function () {
		$textarea.val(file_reader.result);
		update_print_helper();
		saved = true;
		file_path = null;
		file_name = blob.name;
		local_storage_document_id = null;
		update_title();
	};
	file_reader.readAsText(blob);
}

function file_open() {
	are_you_sure(function () {
		// no accept='text/*' because it hides many many types of text files, especially source code
		// altho Notepad in Windows 98 shows only *.txt files
		$("<input type='file'>").click().change(function (e) {
			if (this.files[0]) {
				load_from_blob(this.files[0]);
			}
		});
	});
}

function file_save(saved_callback) {
	if (!file_path) {
		return file_save_as();
	}

	var content = $textarea.val();

	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire('fs');
		fs.writeFile(file_path, content, "utf8", function (error) {
			if (error) {
				alert("Failed to save file: " + error);
				throw error;
			}
			saved = true;
			saved_callback?.();
		});
	});
}

function file_save_as() {
	var content = $textarea.val();
	var blob = new Blob([content], { type: "text/plain" });
	var file_saver = saveAs(blob, (file_name || default_file_name_for_saving));
	// file_saver.onwriteend = function(){
	// NOTE: this won't fire in chrome
	// saved = true;
	// };
}

function select_all() {
	$textarea.focus().select();
}

function insert_time_and_date() {
	var str = moment().format("LT l");
	$textarea.focus();
	document.execCommand("insertText", false, str);
}

var word_wrap_enabled = false;
function is_word_wrap_enabled() {
	return $textarea.css("white-space") == "pre-wrap";
}
function toggle_word_wrap() {
	var enable = !is_word_wrap_enabled();
	$textarea.css("white-space", enable ? "pre-wrap" : "pre");
	$textarea.css("overflow-x", enable ? "auto" : "scroll");
}

// TODO: insert time/date on file open if file content starts with ".LOG"

function update_print_helper() {
	$print_helper.text($textarea.val());
}

$textarea.on("input", function (e) {
	update_print_helper();
	saved = false;
	if (local_storage_document_id) {
		try {
			localStorage["notepad:" + local_storage_document_id] = $textarea.val();
		} catch (e) { }
	}
});

if (file_path) {
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire('fs');
		fs.readFile(file_path, "utf8", function (error, content) {
			if (error) {
				alert("Failed to load file: " + error);
				throw error;
			}
			// NOTE: could be destroying changes, since this is (theoretically/potentially) async
			// altho the user can probably undo
			// TODO: lock the textarea as readonly until here
			$textarea.val(content);
			update_print_helper();
		});
	});
} else if (local_storage_document_id) {
	try {
		$textarea.val(localStorage["notepad:" + local_storage_document_id] || "");
	} catch (e) { }
	update_print_helper();
}

$(window).on("keydown", function (e) {
	if (e.key == "F5" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
		e.preventDefault();
		insert_time_and_date();
	} else if (e.key == "s" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
		e.preventDefault();
		file_save();
	} else if (e.key == "s" && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
		e.preventDefault();
		file_save_as();
	} else if (e.key == "n" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
		e.preventDefault();
		file_new();
	} else if (e.key == "o" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
		e.preventDefault();
		file_open();
	}
});
$G.on("dragover", function (e) {
	e.preventDefault();
});
$G.on("drop", function (e) {
	e.preventDefault();
	var files = e.originalEvent.dataTransfer.files;
	var file = files[0];
	if (file) {
		are_you_sure(function () {
			load_from_blob(file);
		});
	}
});

update_print_helper();
