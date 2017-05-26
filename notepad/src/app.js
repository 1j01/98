
var $textarea = $("#document-textarea");
var $print_helper = $("#print-helper");

$("body").on("mousedown selectstart contextmenu", function(e){
	if(
		e.target instanceof HTMLSelectElement ||
		e.target instanceof HTMLTextAreaElement ||
		(e.target instanceof HTMLLabelElement && e.type !== "contextmenu") ||
		(e.target instanceof HTMLInputElement && e.target.type !== "color")
	){
		return;
	}
	e.preventDefault();
});

function file_new(){
	
}

function file_open(){
	
}

function file_save(){
	
}

function file_save_as(){
	
}

function select_all(){
	$textarea.focus().select();
}

function insert_time_and_date(){
	var str = moment().format("LT l");
	$textarea.focus();
	document.execCommand("insertText", false, str);
}

var word_wrap_enabled = false;
function is_word_wrap_enabled(){
	return $textarea.css("white-space") == "pre-wrap";
}
function toggle_word_wrap(){
	var enable = !is_word_wrap_enabled();
	$textarea.css("white-space", enable ? "pre-wrap" : "pre");
	$textarea.css("overflow-x", enable ? "auto" : "scroll");
}

// TODO: insert time/date on file open if file content starts with ".LOG"

var document_id = "default";

function update_print_helper(){
	$print_helper.text($textarea.val());
}

$textarea.on("input", function(e){
	update_print_helper();
	try {
		localStorage["notepad:" + document_id] = $textarea.val();
	} catch(e) {}
});

try {
	$textarea.val(localStorage["notepad:" + document_id] || "");
} catch(e) {}

$(window).on("keydown", function(e){
	if(e.key == "F5"){
		e.preventDefault();
		insert_time_and_date();
	}
});

update_print_helper();
