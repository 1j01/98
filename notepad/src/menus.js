
var ____________________________ = "A HORIZONTAL RULE / DIVIDER";

var menus = {
	"&File": [
		// TODO: file management
		{
			item: "&New",
			shortcut: "Ctrl+N",
			action: file_new,
			enabled: false,
			description: "Creates a new document.",
		},
		{
			item: "&Open",
			shortcut: "Ctrl+O",
			action: file_open,
			enabled: false,
			description: "Opens an existing document.",
		},
		{
			item: "&Save",
			shortcut: "Ctrl+S",
			action: file_save,
			enabled: false,
			description: "Saves the active document.",
		},
		{
			item: "Save &As",
			shortcut: "Ctrl+Shift+S",
			action: file_save_as,
			enabled: false,
			description: "Saves the active document with a new name.",
		},
		____________________________,
		// {
		// 	item: "Print Pre&view",
		// 	action: function(){
		// 		print();
		// 	},
		// 	description: "Prints the active document and sets printing options.",
		// 	//description: "Displays full pages.",
		// },
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
		// ____________________________,
		// {
		// 	item: "Recent File",
		// 	enabled: false,
		// 	description: "Opens this document.",
		// },
		____________________________,
		{
			item: "E&xit",
			shortcut: "Alt+F4",
			action: function(){
				close();
			},
			description: "Quits Notepad.",
		}
	],
	"&Edit": [
		{
			item: "&Undo",
			shortcut: "Ctrl+Z",
			enabled: function(){
				return document.queryCommandEnabled("undo");
			},
			action: function(){
				document.execCommand("undo");
			},
			description: "Undoes the last action.",
		},
		// NOTE: Notepad in Windows 98 doesn't actually have a separate Repeat/Redo
		{
			item: "&Repeat",
			shortcut: "Ctrl+Shift+Z", //"F4",
			enabled: function(){
				return document.queryCommandEnabled("redo");
			},
			action: function(){
				document.execCommand("redo");
			},
			description: "Redoes the previously undone action.",
		},
		____________________________,
		// FIXME: Cut and Copy can show up as enabled when you open the menu
		// and then disabled as you move over the menu,
		// and then actually work even though they appear disabled.
		{
			item: "Cu&t",
			shortcut: "Ctrl+X",
			enabled: function(){
				return document.queryCommandEnabled("cut");
			},
			action: function(){
				document.execCommand("cut");
			},
			description: "Cuts the selection and puts it on the Clipboard.",
		},
		{
			item: "&Copy",
			shortcut: "Ctrl+C",
			enabled: function(){
				return document.queryCommandEnabled("copy");
			},
			action: function(){
				document.execCommand("copy");
			},
			description: "Copies the selected text to the Clipboard.",
		},
		{
			item: "&Paste",
			shortcut: "Ctrl+V",
			enabled: function(){
				return document.queryCommandEnabled("paste");
			},
			action: function(){
				document.execCommand("paste");
			},
			description: "Inserts the contents of the Clipboard into the document.",
		},
		{
			item: "De&lete",
			shortcut: "Del",
			enabled: function(){
				var textarea = $textarea.get(0);
				var startPos = textarea.selectionStart;
				var endPos = textarea.selectionEnd;
				return (endPos !== startPos);
			},
			action: function(){
				if(document.queryCommandEnabled("delete")){
					document.execCommand("delete");
				}else{
					// FIXME: breaks undo
					var textarea = $textarea.get(0);
					var startPos = textarea.selectionStart;
					var endPos = textarea.selectionEnd;
					var selectionBefore = textarea.value.substring(0, startPos);
					var selectionAfter = textarea.value.substring(endPos);
					textarea.textContent = selectionBefore + selectionAfter;
					textarea.focus();
					textarea.selectionStart = textarea.selectionEnd = startPos;
				}
			},
			description: "Deletes the selection.",
		},
		____________________________,
		{
			item: "Select &All",
			// NOTE: Notepad in Windows 98 doesn't actually have Ctrl+A as a shortcut
			shortcut: "Ctrl+A",
			action: select_all,
			description: "Selects everything.",
		},
		{
			item: "Time/&Date",
			shortcut: "F5",
			// @TODO
			action: function(){},
			enabled: false,
			description: "Inserts the current time and date.", // NOTE: made up text
		},
		____________________________,
		{
			item: "&Word Wrap",
			enabled: false,
			checkbox: {
				toggle: function(){
					// @TODO
				},
				check: function(){
					// @TODO return ...;
				},
			},
			description: "Makes overflowing lines either wrap or scroll.", // NOTE: made up text
		},
		{
			item: "Set &Font",
			action: function(){},
			enabled: false,
			description: "Chooses a font or changes the text size.", // NOTE: made up text
		},
	],
	"&Search": [
		{
			item: "&Find...",
			action: function(){},
			enabled: false,
			description: "Search for characters or words within the document.", // NOTE: made up text
		},
		{
			item: "Find &Next",
			shortcut: "F3",
			action: function(){},
			enabled: false,
			description: "Go to the next search result.", // NOTE: made up text
		},
	],
	"&Help": [
		// TODO: help options
		{
			item: "&Help Topics",
			action: function(){},
			enabled: false,
			description: "Displays Help for the current task or command.",
		},
		____________________________,
		{
			item: "&About Notepad",
			action: function(){},
			enabled: false,
			description: "Displays information about this application."
		}
	],
};
