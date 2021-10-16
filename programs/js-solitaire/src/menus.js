var menus = {
	"&Game": [
		{
			item: "&Deal",
			shortcut: "F2",
			action: ()=> { resetGame(); },
			description: "Deal a new game",
		},
		// Don't want to imply you can undo by showing this option
		// {
		// 	item: "&Undo",
		// 	shortcut: "",
		// 	enabled: false,
		// 	action: ()=> { undo(); },
		// 	description: "Undo last action",
		// },
		{
			item: "De&ck...",
			shortcut: "",
			enabled: false,
			action: ()=> {},
			description: "Choose new deck back",
		},
		{
			item: "&Options...",
			shortcut: "",
			enabled: false,
			action: ()=> {},
			description: "Change Solitaire options",
		},
		MENU_DIVIDER,
		{
			item: "E&xit",
			shortcut: "",
			action: ()=> {
				close();
			},
			description: "Exit Solitaire",
		}
	],
	"&Help": [
		// {
		// 	item: "&Help Topics",
		// 	action: ()=> {
		// 		var show_help = window.show_help;
		// 		try {
		// 			show_help = parent.show_help;
		// 		} catch(e) {}
		// 		if (show_help === undefined) {
		// 			return alert("Help Topics only works when inside of the 98.js.org desktop.");
		// 		}
		// 		show_help({
		// 			title: "Solitaire Help",
		// 			contentsFile: "help/solitaire-help/solitaire.hhc",
		// 			root: "help/solitaire-help",
		// 		});
		// 	},
		// 	description: "Displays Help for the current task or command.",
		// },
		// or more detailedly:
		// {
		// 	item: "&Contents",
		// 	enabled: false,
		// 	action: ()=> {},
		// 	description: "Index of Solitaire help topics"
		// },
		// {
		// 	item: "&Search for Help on...",
		// 	enabled: false,
		// 	action: ()=> {},
		// 	description: "Search the Help Engine for a specific topic"
		// },
		// {
		// 	item: "&How to Use Help",
		// 	enabled: false,
		// 	action: ()=> {},
		// 	description: "Help using help"
		// },
		// MENU_DIVIDER,
		{
			item: "&About Solitaire...",
			action: ()=> {
				window.open("https://github.com/1j01/98/tree/master/programs/js-solitaire");
			},
			description: "About Solitaire"
		},
	],
};

var go_outside_frame = false;
if(frameElement){
	try{
		if(parent.MenuBar){
			MenuBar = parent.MenuBar;
			go_outside_frame = true;
		}
	}catch(e){}
}
var menu_bar = new MenuBar(menus);
if (go_outside_frame) {
	frameElement.parentElement.insertBefore(menu_bar.element, frameElement);
} else {
	document.body.prepend(menu_bar.element);
}
