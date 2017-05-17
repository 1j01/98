
var ____________________________ = "A HORIZONTAL RULE / DIVIDER";

var menus = {
	"&File": [
		// TODO: file management
		// NOTE: Notepad in Windows 98 doesn't actually have shortcuts for anything in the File menu
		// also, it leaves off periods from the end of the descriptions
		{
			item: "&New",
			shortcut: "Ctrl+N",
			action: file_new,
			enabled: false,
			description: "Creates a new document.",
		},
		{
			item: "&Open...",
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
			item: "Save &As...",
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
			item: "Page Se&tup...",
			action: function(){
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Changes the page layout.",
		},
		{
			item: "&Print...",
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
			// shortcut: "Alt+F4",
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
			description: "Inserts the contents of the Clipboard.",
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
			description: "Selects the entire document.",
		},
		{
			item: "Time/&Date",
			shortcut: "F5",
			enabled: function(){
				return document.queryCommandEnabled("insertText");
			},
			action: insert_time_and_date,
			description: "Inserts the current time and date.", // NOTE: made up text
		},
		____________________________,
		{
			item: "&Word Wrap",
			checkbox: {
				toggle: toggle_word_wrap,
				check: is_word_wrap_enabled,
			},
			description: "Makes overflowing lines either wrap or scroll.", // NOTE: made up text
		},
		{
			item: "Set &Font...",
			action: function(){}, // TODO: font options dialog
			enabled: false,
			description: "Sets the font and text size.", // NOTE: made up text
		},
	],
	"&Search": [
		{
			item: "&Find...",
			// NOTE: Notepad in Windows 98 doesn't actually have Ctrl+F as a shortcut (although WordPad does)
			shortcut: "Ctrl+F",
			action: function(){}, // TODO
			enabled: false,
			description: "Finds the specified text.",
		},
		{
			item: "Find &Next",
			shortcut: "F3",
			action: function(){}, // TODO
			enabled: false,
			description: "Repeats the last find.",
		},
		// NOTE: Notepad in Windows 98 doesn't have Replace or Go to... options
		// {
		// 	item: "&Replace",
		// 	shortcut: "Ctrl+H",
		// 	action: function(){},
		// 	enabled: false,
		// 	description: "Replaces specific text with different text.",
		// },
		// {
		// 	item: "&Go to",
		// 	shortcut: "Ctrl+G",
		// 	action: function(){},
		// 	enabled: false,
		// 	description: "Goes to a specified line number.", // NOTE: made up text
		// },
	],
	"&Help": [
		// TODO: help options
		{
			item: "&Help Topics",
			action: function(){},
			enabled: false,
			description: "Lists Help topics.",
			// WordPad: "Lists Help topics"
			// Windows Explorer: "Opens Help."
			// Paint: "Displays Help for the current task or command."
		},
		____________________________,
		{
			item: "&About Notepad",
			action: function(){},
			enabled: false,
			description: "Displays program information, version number, and copyright."
			// or just "Displays information about this application." if that's more accurate
		}
	],
};
