
var $textarea = $("#document-textarea");
var $print_helper = $("#print-helper");

var $V = $("#app");
var $status_text = $();
$status_text.default = function(){};

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
	document.execCommand("insertText", false, str);
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
