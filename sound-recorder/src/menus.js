
var ____________________________ = "A HORIZONTAL RULE / DIVIDER";

var menus = {
	"&File": [
		{
			item: "&New",
			shortcut: "Ctrl+N",
			action: file_new,
			description: "Creates a new document.",
		},
		{
			item: "&Open",
			shortcut: "Ctrl+O",
			action: file_open,
			description: "Opens an existing document.",
		},
		{
			item: "&Save",
			shortcut: "Ctrl+S",
			action: file_save,
			description: "Saves the active document.",
		},
		{
			item: "Save &As",
			shortcut: "Ctrl+Shift+S",
			//shortcut: "",
			action: file_save_as,
			description: "Saves the active document with a new name.",
		},
		/*
		____________________________,
		{
			item: "Print Pre&view",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Displays full pages.",
		},
		{
			item: "Page Se&tup",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Changes the page layout.",
		},
		{
			item: "&Print",
			shortcut: "Ctrl+P",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
		},
		____________________________,
		{
			item: "Set As &Wallpaper (Tiled)",
			action: set_as_wallpaper_tiled,
			description: "Tiles this bitmap as the desktop background.",
		},
		{
			item: "Set As Wa&llpaper (Centered)",
			action: set_as_wallpaper_centered,
			description: "Centers this bitmap as the desktop background.",
		},*/
		____________________________,
		{
			item: "Recent File",
			enabled: false, // @TODO for chrome app
			description: "",
		},
		____________________________,
		{
			item: "E&xit",
			shortcut: "Alt+F4",
			action: function(){
				close();
			},
			description: "Quits Sound Recorder.",
		}
	],
	"&Edit": [
		/*
		{
			item: "&Undo",
			shortcut: "Ctrl+Z",
			enabled: function(){
				return undos.length >= 1;
			},
			action: undo,
			description: "Undoes the last action.",
		},
		{
			item: "&Repeat",
			shortcut: "F4",
			enabled: function(){
				return redos.length >= 1;
			},
			action: redo,
			description: "Redoes the previously undone action.",
		},
		____________________________,*/
		{
			item: "&Copy",
			shortcut: "Ctrl+C",
			enabled: function(){
				return (typeof chrome !== "undefined") && chrome.permissions;
			},
			action: function(){
				document.execCommand("copy");
			},
			description: "Copies to the Clipboard?",
		},
		{
			item: "Paste Insert",
			shortcut: "Ctrl+V",
			enabled: function(){
				return (typeof chrome !== "undefined") && chrome.permissions;
			},
			action: function(){
				document.execCommand("paste");
			},
			description: "Inserts the contents of the Clipboard into the sound.",
		},
		{
			item: "Paste Mix",
			enabled: function(){
				return (typeof chrome !== "undefined") && chrome.permissions;
			},
			action: function(){
				document.execCommand("paste");
			},
			description: "Mixes the contents of the Clipboard into the sound.",
		},
		____________________________,
		{
			item: "Insert File...",
			action: function(){},
			description: "Inserts a file into the sound.",
		},
		{
			item: "Mix with File",
			action: function(){},
			description: "Mixes a file into the sound.",
		},
		____________________________,
		{
			item: "Delete Before Current Position",
			enabled: function(){},
			action: function(){},
			description: "Deletes all audio before the current position.",
		},
		{
			item: "Delete After Current Position",
			enabled: function(){},
			action: function(){},
			description: "Deletes all audio after the current position.",
		},
		____________________________,
		{
			item: "Audio Properties",
			action: function(){},
			description: "Changes microphone and speaker settings.",
		},
	],
	"Effect&s": [
	],
	"&Help": [
		{
			item: "&Help Topics",
			action: function(){},
			description: "Displays Help for the current task or command.",
		},
		____________________________,
		{
			item: "&About Sound Recorder",
			action: function(){},
			description: "Displays information about this application."
		}
	],
};
