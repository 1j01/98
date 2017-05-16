
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

update_print_helper();
