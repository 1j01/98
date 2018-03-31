
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
if(query.path){
	var file_path = query.path;
	var file_name = file_name_from_path(file_path);
}else{
	var localstorage_document_id = location.search ? location.search.replace("?", "") : "default";
	var file_name = location.search ? location.search.replace("?", "") : "Untitled";
}
document.title = file_name + " - Notepad";

function file_new(){
	// TODO
}

function file_open(){
	// TODO
}

function file_save(){
	if(!file_path){
		return file_save_as();
	}
	
	var content = $textarea.val();
	
	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire('fs');
		fs.writeFile(file_path, content, "utf8", function(error){
			if(error){
				alert("Failed to save file: "+error);
				throw error;
			}
			// NOTE: could be missing changes since retrieving content, since this is (potentially) async
		});
	});
}

function file_save_as(){
	var content = $textarea.val();
	var blob = new Blob([content], {type: "text/plain"});
	var file_saver = saveAs(blob, file_name);
	// file_saver.onwriteend = function(){
		// NOTE: this won't fire in chrome
		// saved = true;
	// };
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

function update_print_helper(){
	$print_helper.text($textarea.val());
}

$textarea.on("input", function(e){
	update_print_helper();
	if(localstorage_document_id){
		try {
			localStorage["notepad:" + localstorage_document_id] = $textarea.val();
		} catch(e) {}
	}
});

if(file_path){
	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire('fs');
		fs.readFile(file_path, "utf8", function(error, content){
			if(error){
				alert("Failed to load file: "+error);
				throw error;
			}
			// NOTE: could be destroying changes, since this is (theoretically/potentially) async
			// altho the user can probably undo
			$textarea.val(content);
		});
	});
}else if(localstorage_document_id){
	try {
		$textarea.val(localStorage["notepad:" + localstorage_document_id] || "");
	} catch(e) {}
}

$(window).on("keydown", function(e){
	if(e.key == "F5" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey){
		e.preventDefault();
		insert_time_and_date();
	}else if(e.key == "S" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey){
		e.preventDefault();
		file_save();
	}else if(e.key == "S" && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey){
		e.preventDefault();
		file_save_as();
	}
});

update_print_helper();
