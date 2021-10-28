
var menus = {
	"&File": [
		// NOTE: Notepad in Windows 98 doesn't actually have shortcuts for anything in the File menu
		// also, it leaves off periods from the end of the descriptions
		{
			item: "&New",
			shortcut: "Ctrl+N",
			action: file_new,
			description: "Creates a new document.",
		},
		{
			item: "&Open...",
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
			item: "Save &As...",
			shortcut: "Ctrl+Shift+S",
			action: file_save_as,
			description: "Saves the active document with a new name.",
		},
		MENU_DIVIDER,
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
			action: function () {
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Changes the page layout.",
		},
		{
			item: "&Print...",
			shortcut: "Ctrl+P",
			action: function () {
				print();
			},
			description: "Prints the active document and sets printing options.",
		},
		// MENU_DIVIDER,
		// {
		// 	item: "Recent File",
		// 	enabled: false,
		// 	description: "Opens this document.",
		// },
		MENU_DIVIDER,
		{
			item: "E&xit",
			// shortcut: "Alt+F4",
			action: function () {
				close();
			},
			description: "Quits Notepad.",
		}
	],
	"&Edit": [
		{
			item: "&Undo",
			shortcut: "Ctrl+Z",
			enabled: function () {
				return document.queryCommandEnabled("undo");
			},
			action: function () {
				document.execCommand("undo");
			},
			description: "Undoes the last action.",
		},
		// NOTE: Notepad in Windows 98 doesn't actually have a separate Repeat/Redo
		{
			item: "&Repeat",
			shortcut: "Ctrl+Shift+Z", //"F4",
			enabled: function () {
				return document.queryCommandEnabled("redo");
			},
			action: function () {
				document.execCommand("redo");
			},
			description: "Redoes the previously undone action.",
		},
		MENU_DIVIDER,
		// FIXME: Several of these commands can actually work even though they appear disabled.
		// I probably need to change how menu item enabledness querying works,
		// make it so it queries the enabled status of all items before switching focus to the menus.
		{
			item: "Cu&t",
			shortcut: "Ctrl+X",
			enabled: function () {
				return document.queryCommandEnabled("cut");
			},
			action: function () {
				$textarea.focus();
				document.execCommand("cut");
			},
			description: "Cuts the selection and puts it on the Clipboard.",
		},
		{
			item: "&Copy",
			shortcut: "Ctrl+C",
			enabled: function () {
				return document.queryCommandEnabled("copy");
			},
			action: function () {
				$textarea.focus();
				document.execCommand("copy");
			},
			description: "Copies the selected text to the Clipboard.",
		},
		{
			item: "&Paste",
			shortcut: "Ctrl+V",
			enabled: function () {
				return document.queryCommandEnabled("paste");
			},
			action: function () {
				$textarea.focus();
				document.execCommand("paste");
			},
			description: "Inserts the contents of the Clipboard.",
		},
		{
			item: "De&lete",
			shortcut: "Del",
			enabled: function () {
				var textarea = $textarea.get(0);
				var startPos = textarea.selectionStart;
				var endPos = textarea.selectionEnd;
				return (endPos !== startPos);
			},
			action: function () {
				$textarea.focus();
				if (document.queryCommandEnabled("delete")) {
					document.execCommand("delete");
				} else {
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
		MENU_DIVIDER,
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
			enabled: function () {
				return document.queryCommandEnabled("insertText");
			},
			action: insert_time_and_date,
			description: "Inserts the current time and date.", // NOTE: made up text
		},
		MENU_DIVIDER,
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
			action: function () { }, // TODO: font options dialog
			enabled: false,
			description: "Sets the font and text size.", // NOTE: made up text
		},
	],
	"&Search": [
		{
			item: "&Find...",
			// NOTE: Notepad in Windows 98 doesn't actually have Ctrl+F as a shortcut (although WordPad does)
			shortcut: "Ctrl+F",
			action: function () { }, // TODO
			enabled: false,
			description: "Finds the specified text.",
		},
		{
			item: "Find &Next",
			shortcut: "F3",
			action: function () { }, // TODO
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
		{
			item: "&Help Topics",
			action: function () {
				var show_help = window.show_help;
				try {
					show_help = parent.show_help;
				} catch (e) { }
				if (show_help === undefined) {
					return alert("Help Topics only works when inside of the 98.js.org desktop.");
				}
				show_help({
					title: "Notepad Help",
					contentsFile: "help/notepad-help/notepad.hhc",
					root: "help/notepad-help",
				});
			},
			description: "Lists Help topics.",
			// WordPad: "Lists Help topics"
			// Windows Explorer: "Opens Help."
			// Paint: "Displays Help for the current task or command."
		},
		MENU_DIVIDER,
		{
			item: "&About Notepad",
			action: function () {
				// TODO: dialog
				window.open("https://github.com/1j01/98/tree/master/programs/notepad");
			},
			description: "Displays information about this application."
			// description: "Displays program information, version number, and copyright."
		}
	],
};

var go_outside_frame = false;
if (frameElement) {
	try {
		if (parent.MenuBar) {
			MenuBar = parent.MenuBar;
			go_outside_frame = true;
		}
	} catch (e) { }
}
var menu_bar = MenuBar(menus);
if (go_outside_frame) {
	$(menu_bar.element).insertBefore(frameElement);
} else {
	$(menu_bar.element).prependTo($("#app"));
}
