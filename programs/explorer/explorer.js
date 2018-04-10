
function parse_query_string(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function folder_display_name_from_path(folder_path) {
	if(folder_path === "/"){
		return "(C:)";
	}else{
		return file_name_from_path(folder_path.replace(/[\/\\]$/, ""));
	}
}

var $folder_view;
var go_to = function(folder_path){
	if($folder_view){
		$folder_view.remove();
		$folder_view = null;
	}
	
	folder_path = folder_path || "/";
	if(folder_path[folder_path.length - 1] !== "/"){
		folder_path += "/";
	}
	
	$("#address").val(folder_path);
	
	var folder_name = folder_display_name_from_path(folder_path);
	set_title(folder_name);

	$folder_view = $FolderView(folder_path).appendTo("#content");
};

var query = parse_query_string(location.search);
if(query.path){
	go_to(query.path);
}else{
	go_to("/");
}

function set_title(title){
	console.log(title);
	document.title = title;

	if(frameElement){
		frameElement.$window.title(document.title);
	}
}

// called from $FolderView
function executeFile(file_path){
	// I don't think this w/ fs is necessary
	withFilesystem(function(){
		var fs = BrowserFS.BFSRequire("fs");
		fs.stat(file_path, function(err, stats){
			if(err){
				return alert("Failed to get info about " + file_path + "\n\n" + err);
			}
			if(stats.isDirectory()){
				go_to(file_path);
			}else{
				// TODO: navigate to folders
				// Note: can either check frameElement or parent !== window
				if(frameElement){
					parent.executeFile(file_path);
				}else{
					alert("Can't open files in standalone mode. Explorer must be run in a desktop.");
				}
			}
		});
	});
}
