
// TODO: bullet point style radio button menu items (instead of check marks)
var current_view_mode = "LARGE_ICONS";
var checkbox_for_view_mode = function (menu_item_view_mode) {
	return {
		check: function () {
			return menu_item_view_mode === current_view_mode;
		},
		toggle: function () {
			current_view_mode = menu_item_view_mode;
			// @TODO: update the view
		},
	};
};

var menus = {
	"&File": [
		{
			item: "&New",
			submenu: [
				// @TODO: icons for these items
				{
					item: "&Folder",
					enabled: false, // @TODO
				},
				{
					item: "&Shortcut",
					enabled: false, // @TODO
				},
				MENU_DIVIDER,
				{
					item: "Text Document",
					enabled: false, // @TODO
				},
				{
					item: "WordPad Document",
					enabled: false, // @TODO
				},
				{
					item: "Bitmap Image",
					enabled: false, // @TODO
				},
				{
					item: "Wave Sound",
					enabled: false, // @TODO
				},
				{
					item: "Microsoft Data Link",
					enabled: false, // @TODO
				},
			],
		},
		MENU_DIVIDER,
		{
			item: "Create &Shortcut",
			enabled: false, // @TODO
		},
		{
			item: "&Delete",
			enabled: false, // @TODO
		},
		{
			item: "Rena&me",
			enabled: false, // @TODO
		},
		{
			item: "P&roperties",
			enabled: false, // @TODO
		},
		// @TODO: show history entries, oldest first
		// MENU_DIVIDER,
		// {
		// 	item: "(name of location)",
		// },
		MENU_DIVIDER,
		{
			item: "&Work Offline",
			enabled: false, // @TODO
		},
		{
			item: "&Close",
			enabled: false, // @TODO
		},
	],
	"&Edit": [
		{
			item: "&Undo", // @TODO: specific name per action too
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "Cu&t",
			shortcut: "Ctrl+X",
			enabled: false, // @TODO
		},
		{
			item: "&Copy",
			shortcut: "Ctrl+C",
			enabled: false, // @TODO
		},
		{
			item: "&Paste",
			shortcut: "Ctrl+V",
			enabled: false, // @TODO
		},
		{
			item: "Paste &Shortcut",
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "Select &All",
			shortcut: "Ctrl+A",
			action: function () {
				folder_view.select_all();
				folder_view.focus();
			},
		},
		{
			item: "&Invert Selection",
			action: function () {
				folder_view.select_inverse();
				folder_view.focus();
			},
		},
	],
	"&View": [
		{
			item: "&Toolbars",
			submenu: [
				{
					item: "&Standard Buttons",
					checkbox: {
						check: ()=> true,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				{
					item: "&Address Bar",
					checkbox: {
						check: ()=> true,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				{
					item: "&Links",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				{
					item: "&Radio",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				MENU_DIVIDER,
				{
					item: "&Text Labels",
					checkbox: {
						check: ()=> true,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
			],
		},
		{
			item: "Status &Bar",
			checkbox: {
				check: ()=> false,
				toggle: ()=> {}, // @TODO
			},
			enabled: false, // @TODO
		},
		{
			item: "&Explorer Bar",
			submenu: [
				{
					item: "&Search",
					shortcut: "Ctrl+E",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				{
					item: "&Favorites",
					shortcut: "Ctrl+I",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				{
					item: "&History",
					shortcut: "Ctrl+H",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				{
					item: "F&olders",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				MENU_DIVIDER,
				{
					item: "&Tip of the Day",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
			],
		},
		MENU_DIVIDER,
		{
			item: "&Large Icons",
			checkbox: checkbox_for_view_mode("LARGE_ICONS"),
			enabled: false, // @TODO
		},
		{
			item: "&Small Icons",
			checkbox: checkbox_for_view_mode("SMALL_ICONS"),
			enabled: false, // @TODO
		},
		{
			item: "&List",
			checkbox: checkbox_for_view_mode("LIST"),
			enabled: false, // @TODO
		},
		{
			item: "&Details",
			checkbox: checkbox_for_view_mode("DETAILS"),
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "Arrange &Icons",
			submenu: [
				// @TODO: dynamic based on attributes available for the type of item
				// Name & Description for Control Panel items
				// Name, Type, Size, Date for files
				// etc.
				// These apparently are not checkboxes, by the way.
				{
					item: "by &Name",
					enabled: false, // @TODO
				},
				{
					item: "by &Type",
					enabled: false, // @TODO
				},
				{
					item: "by &Size",
					enabled: false, // @TODO
				},
				{
					item: "by &Date",
					enabled: false, // @TODO
				},
				MENU_DIVIDER,
				{
					item: "&Auto Arrange",
					enabled: false, // @TODO
				},
			],
		},
		{
			item: "Line &Up Icons",
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "&Refresh",
			shortcut: "F5",
			enabled: false, // @TODO
		},
		{
			item: "Folder &Options...",
			enabled: false, // @TODO
		},
	],
	"&Go": [
		{
			item: "&Back",
			shortcut: "Alt+Left Arrow",
			enabled: false, // @TODO
		},
		{
			item: "&Forward",
			shortcut: "Alt+Right Arrow",
			enabled: false, // @TODO
		},
		{
			item: "&Up One Level",
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "&Home Page",
			shortcut: "Alt+Home",
			enabled: false, // @TODO
		},
		{
			item: "Channel &Guide",
			enabled: false, // @TODO
		},
		{
			item: "&Search the Web",
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "My &Computer",
			enabled: false, // @TODO
		},
		{
			item: "&Internet Call",
			enabled: false, // @TODO
		},
	],
	"F&avorites": [
		{
			item: "&Add to Favorites...",
			enabled: false, // @TODO
		},
		{
			item: "&Organize Favorites...",
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		// @TODO: populate with favorites
		{
			item: "(Empty)",
			enabled: false,
		},
	],
	"&Tools": [
		{
			item: "&Find",
			submenu: [
				{
					item: "&Files or Folders...",
					enabled: false, // @TODO
				},
				{
					item: "&Computer...",
					enabled: false, // @TODO
				},
				{
					item: "On the &Internet...",
					enabled: false, // @TODO
				},
			],
		},
		MENU_DIVIDER,
		{
			item: "Map &Network Drive...",
			enabled: false, // @TODO
		},
		{
			item: "&Disconnect Network Drive...",
			enabled: false, // @TODO
		},
		{
			item: "&Synchronize...",
			enabled: false, // @TODO
		},
	],
	"&Help": [
		{
			item: "&Help Topics",
			enabled: false, // @TODO
		},
		MENU_DIVIDER,
		{
			item: "&About 98.js.org",
			action: function () {
				// TODO: about dialog
				window.open("https://github.com/1j01/98#readme");
			},
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
var menu_bar = new MenuBar(menus);
if (go_outside_frame) {
	$(menu_bar.element).insertBefore(frameElement);
} else {
	$(function () {
		$(menu_bar.element).prependTo("body");
	});
}
