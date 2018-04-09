
var $desktop = $(".desktop");
$desktop.attr("touch-action", "none"); // TODO: should this be in $FolderView, or is it to prevent scrolling the page or what?

var $folder_view = $FolderView(desktop_folder_path);
$folder_view.appendTo($desktop);

// Prevent drag and drop from redirecting the page (the browser default behavior for files)
// TODO: only prevent if there are actually files; there's nothing that uses text inputs atm that's not in an iframe, so it doesn't matter YET (afaik)
$G.on("dragover", function(e){
	e.preventDefault();
});
$G.on("drop", function(e){
	e.preventDefault();
});
