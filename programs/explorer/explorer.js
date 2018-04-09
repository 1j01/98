
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
	var folder_path = query.path;
	var folder_name = folder_name_from_path(folder_path);
}else{
	var folder_path = "/";
	var folder_name = "";
}

$("#address").val(folder_path);
// TODO: allow navigating to other directories

function update_title(){
	document.title = folder_name || "(C:)"

	if(frameElement){
		frameElement.$window.title(document.title);
	}
}

update_title();

$FolderView(folder_path).appendTo("#content");

// called from $FolderView
function executeFile(){
	// TODO: navigate to folders
	if(parent){
		parent.executeFile.apply(parent, arguments);
	}else{
		alert("Can't open files in standalone mode. Explorer must be run in a desktop.");
	}
}
