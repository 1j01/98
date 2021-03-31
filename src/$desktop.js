
var $desktop = $(".desktop");
$desktop.attr("touch-action", "none"); // TODO: should this be in $FolderView, or is it to prevent scrolling the page or what?

var $folder_view = $FolderView(desktop_folder_path);
$folder_view.appendTo($desktop);

// Prevent drag and drop from redirecting the page (the browser default behavior for files)
// TODO: only prevent if there are actually files; there's nothing that uses text inputs atm that's not in an iframe, so it doesn't matter YET (afaik)
// $G.on("dragover", function(e){
// 	e.preventDefault();
// });
// $G.on("drop", function(e){
// 	e.preventDefault();
// });

function loadThemeFile(file) {
	var reader = new FileReader();
	reader.onload = ()=> {
		loadThemeFromText(reader.result);
	};
	reader.readAsText(file);
}
function applyTheme(cssProperties, documentElement=document.documentElement) {
	applyCSSProperties(cssProperties, documentElement);

	$(documentElement).find("iframe").each((i, iframe)=> {
		try {
			applyTheme(cssProperties, iframe.contentDocument.documentElement);
		} catch(error) {
			console.log("error applying theme to iframe", iframe, error);
		}
	});
	
	var win = documentElement.ownerDocument.defaultView;
	if (win.$) {
		win.$(win).trigger("theme-changed");
	}
}
function loadThemeFromText(fileText) {
	var cssProperties = parseThemeFileString(fileText);
	applyTheme(cssProperties);
	window.themeCSSProperties = cssProperties;
}

$("html").on("dragover", function(event) {
	event.preventDefault();  
	event.stopPropagation();
});
$("html").on("dragleave", function(event) {
	event.preventDefault();  
	event.stopPropagation();
});
$("html").on("drop", function(event) {
	event.preventDefault();  
	event.stopPropagation();
	var files = [...event.originalEvent.dataTransfer.files];
	for (var file of files) {
		if (file.name.match(/\.theme(pack)?$/i)) {
			loadThemeFile(file);
		}
	}
});

// Despite overflow:hidden on html and body,
// focusing elements that are partially offscreen can still scroll the page.
// For example, with opening Paint and moving it partially offscreen and opening Image > Attributes,
// the default focused button can scroll the entire desktop.
// We need to prevent (reset) scroll, and also avoid scrollIntoView().
$(window).on("scroll focusin", () => {
	window.scrollTo(0, 0);
});
