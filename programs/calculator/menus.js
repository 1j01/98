
// TODO: bullet point style radio button menu items 
var checkbox_for_view_mode = function(view_mode){
	return {
		check: function(){
			// TODO
			return view_mode === "standard";
		},
		toggle: function(){
			// TODO
			current_view_mode = view_mode;
		},
	};
};

var menus = {
	"&Edit": [
		{
			item: "&Copy",
			shortcut: "Ctrl+C", // TODO
			action: () => {
				// TODO
			},
		},
		{
			item: "&Paste",
			shortcut: "Ctrl+V", // TODO
			action: () => {
				// TODO
			},
		},
	],
	"&View": [
		{
			item: "S&tandard",
			checkbox: checkbox_for_view_mode("standard"),
		},
		{
			item: "&Scientific",
			checkbox: checkbox_for_view_mode("scientific"),
		},
	],
	"&Help": [
		{
			item: "&Help Topics",
			action: function(){
				var show_help = window.show_help;
				try {
					show_help = parent.show_help;
				} catch(e) {}
				if (show_help === undefined) {
					return alert("Help Topics only works when inside of the 98.js.org desktop.");
				}
				show_help({
					title: "Calculator Help",
					contentsFile: "help/calculator-help/calc.hhc",
					root: "help/calculator-help",
				});
			},
		},
		MENU_DIVIDER,
		{
			item: "&About Calculator",
			action: function(){
				// TODO: about dialog
				window.open("https://github.com/unoplatform/calculator");
			},
		}
	],
};

var go_outside_frame = false;
if(frameElement){
	try{
		if(parent.$MenuBar){
			$MenuBar = parent.$MenuBar;
			go_outside_frame = true;
		}
	}catch(e){}
}
var $menu_bar = $MenuBar(menus);
if(go_outside_frame){
	$menu_bar.insertBefore(frameElement);
}else{
	$(function(){
		$menu_bar.prependTo(jQuery("body"));
	});
}
