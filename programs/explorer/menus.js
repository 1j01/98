
// This menu is shared between the View menu and the Views toolbar button dropdown
/** @type {OSGUIMenuFragment[]} */
var views_dropdown_menu_items = [
	// @TODO: make this option unavailable for the Desktop folder
	{
		label: "as &Web Page",
		checkbox: {
			check: ()=> folder_view ? folder_view.config.view_as_web_page : true,
			toggle: () => {
				folder_view?.configure({ view_as_web_page: !folder_view.config.view_as_web_page });
			},
			enabled: ()=> !!folder_view, // @TODO: hide the option entirely, don't just disable it
		},
		description: "Displays items in Web View",
	},
	MENU_DIVIDER,
	{
		ariaLabel: "View Mode",
		getValue: () => folder_view ? folder_view.config.view_mode : "LARGE_ICONS",
		setValue: (view_mode) => {
			folder_view?.configure({
				view_mode
			});
		},
		radioItems: [
			// {
			// 	label: "As Desktop (Debug)",
			// 	value: "DESKTOP",
			// 	enabled: ()=> !!folder_view,
			// },
			// Thumbnails option can be enabled in folder Properties window.
			// {
			// 	label: "T&humbnails",
			// 	value: "THUMBNAIL",
			// 	enabled: () => !!folder_view,
			// 	description: "Displays items using thumbnail view.",
			// },
			{
				label: "Lar&ge Icons",
				value: "LARGE_ICONS",
				enabled: () => !!folder_view,
				description: "Displays items by using large icons.",
			},
			{
				label: "S&mall Icons",
				value: "SMALL_ICONS",
				enabled: () => !!folder_view,
				description: "Displays items by using small icons.",
			},
			{
				label: "&List",
				value: "LIST",
				enabled: () => !!folder_view,
				description: "Displays items in a list.",
			},
			{
				label: "&Details",
				value: "DETAILS",
				// enabled: ()=> !!folder_view,
				enabled: false, // @TODO
				description: "Displays information about each item in the window.",
			},
		],
	},
];

/** @type {OSGUITopLevelMenus} */
var menus = {
	"&File": [
		// @TODO: os-gui should support descriptions for top level menus,
		// and in general treat them more like menus and submenus
		// description: "Contains commands for working with the selected items.",
		{
			label: "&New",
			submenu: [
				// @TODO: icons for these items
				{
					label: "&Folder",
					enabled: false, // @TODO
				},
				{
					label: "&Shortcut",
					enabled: false, // @TODO
				},
				MENU_DIVIDER,
				{
					label: "Text Document",
					enabled: false, // @TODO
				},
				{
					label: "WordPad Document",
					enabled: false, // @TODO
				},
				{
					label: "Bitmap Image",
					enabled: false, // @TODO
				},
				{
					label: "Wave Sound",
					enabled: false, // @TODO
				},
				{
					label: "Microsoft Data Link",
					enabled: false, // @TODO
				},
			],
		},
		MENU_DIVIDER,
		{
			label: "Create &Shortcut",
			enabled: false, // @TODO
			description: "Creates shortcuts to the selected items.",
		},
		{
			label: "&Delete",
			action: () => {
				folder_view.delete_selected();
			},
			description: "Deletes the selected items.",
		},
		{
			label: "Rena&me",
			action: () => {
				folder_view.start_rename();
			},
			description: "Renames the selected item.",
		},
		{
			label: "P&roperties",
			enabled: false, // @TODO
			description: "Displays the properties of the selected items.",
		},
		// @TODO: show history entries, oldest first
		// MENU_DIVIDER,
		// {
		// 	label: "(name of location)",
		// },
		MENU_DIVIDER,
		{
			label: "&Work Offline",
			checkbox: {
				check: () => offline_mode,
				toggle: () => {
					offline_mode = !offline_mode;
				},
			},
			description: "Shows Web pages without downloading them.",
		},
		{
			label: "&Close",
			action: function () {
				close();
			},
			description: "Closes the window.",
		},
	],
	"&Edit": [
		// description: "Contains edit commands.",
		{
			label: "&Undo", // @TODO: specific name per action too
			enabled: false, // @TODO
			// description: e.g. "Undo Rename of 'whatever.gif' to 'whatever.txt'",
		},
		MENU_DIVIDER,
		{
			label: "Cu&t",
			shortcutLabel: "Ctrl+X",
			ariaKeyShortcuts: "Control+X",
			enabled: false, // @TODO
			description: "Removes the selected items and copies them onto the Clipboard.",
		},
		{
			label: "&Copy",
			shortcutLabel: "Ctrl+C",
			ariaKeyShortcuts: "Control+C",
			enabled: false, // @TODO
			description: "Copies the selected items to the Clipboard. To put them in the new location, use the Paste command.",
		},
		{
			label: "&Paste",
			shortcutLabel: "Ctrl+V",
			ariaKeyShortcuts: "Control+V",
			enabled: false, // @TODO
			description: "Inserts the items you have copied or cut into the selected location.",
		},
		{
			label: "Paste &Shortcut",
			enabled: false, // @TODO
			description: "Creates shortcuts to the items you have copied or cut into the selected location.",
		},
		MENU_DIVIDER,
		{
			label: "Select &All",
			shortcutLabel: "Ctrl+A",
			ariaKeyShortcuts: "Control+A",
			action: function () {
				folder_view.select_all();
				folder_view.focus();
			},
			description: "Selects all items in window.",
		},
		{
			label: "&Invert Selection",
			action: function () {
				folder_view.select_inverse();
				folder_view.focus();
			},
			description: "Reverses which items are selected and which are not.",
		},
	],
	"&View": [
		// description: "Contains commands for manipulating the view.",
		{
			label: "&Toolbars",
			submenu: [
				{
					label: "&Standard Buttons",
					checkbox: {
						check: ()=> $("#standard-buttons-toolbar").is(":visible"),
						toggle: ()=> $("#standard-buttons-toolbar").toggle(),
					},
					description: "Displays the Standard Buttons toolbar.",
				},
				{
					label: "&Address Bar",
					checkbox: {
						check: ()=> $("#address-bar-toolbar").is(":visible"),
						toggle: ()=> $("#address-bar-toolbar").toggle(),
					},
					description: "Displays the Address bar.",
				},
				{
					label: "&Links",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
					description: "Displays the Quick Links bar.",
				},
				{
					label: "&Radio",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
				MENU_DIVIDER,
				{
					label: "&Text Labels",
					checkbox: {
						check: ()=> !$("body").hasClass("hiding-label-text"),
						toggle: () => {
							$("body").toggleClass("hiding-label-text");
						},
					},
					description: "Adds a text label under each toolbar button.",
				},
			],
			description: "Shows or hides toolbars.",
		},
		{
			label: "Status &Bar",
			checkbox: {
				check: ()=> $("#status-bar").is(":visible"),
				toggle: () => {
					$("#status-bar").toggle();
				},
			},
			description: "Shows or hides the status bar.",
		},
		{
			label: "&Explorer Bar",
			submenu: [
				{
					label: "&Search",
					shortcutLabel: "Ctrl+E",
					ariaKeyShortcuts: "Control+E",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
					description: "Shows the Search bar.",
				},
				{
					label: "&Favorites",
					shortcutLabel: "Ctrl+I",
					ariaKeyShortcuts: "Control+I",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
					description: "Shows the Favorites bar.",
				},
				{
					label: "&History",
					shortcutLabel: "Ctrl+H",
					ariaKeyShortcuts: "Control+H",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
					description: "Shows the History bar.",
				},
				{
					label: "F&olders",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
					description: "Shows the Folders bar.",
				},
				MENU_DIVIDER,
				{
					label: "&Tip of the Day",
					checkbox: {
						check: ()=> false,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
				},
			],
			description: "Shows or hides an Explorer bar.",
		},
		MENU_DIVIDER,
		...views_dropdown_menu_items,
		// MENU_DIVIDER,
		// {
		// 	label: "&Customize this Folder...",
		// 	enabled: ()=> folder_view &&...?
		// 	description: "Customizes the view of this folder.",
		// },
		MENU_DIVIDER,
		{
			label: "Arrange &Icons",
			submenu: [
				{
					ariaLabel: "Sort By",
					getValue: () => folder_view ? folder_view.config.sort_mode : "NAME",
					setValue: (sort_mode) => {
						folder_view?.configure({
							sort_mode
						});
					},
					radioItems: [
						// @TODO: dynamic based on attributes available for the type of item
						// Name & Description for Control Panel items
						// Name, Type, Size, Date for files
						// etc.
						{
							label: "by &Name",
							value: "NAME",
							description: "Sorts items alphabetically by name.",
							enabled: ()=> !!folder_view,
						},
						{
							label: "by &Type",
							value: "TYPE",
							description: "Sorts items by type.",
							enabled: ()=> !!folder_view,
						},
						{
							label: "by &Size",
							value: "SIZE",
							description: "Sorts items by size, from smallest to largest.",
							enabled: ()=> !!folder_view,
						},
						{
							label: "by &Date",
							value: "DATE",
							description: "Sorts items by date, from oldest to most recent.",
							enabled: ()=> !!folder_view,
						},
					],
				},
				MENU_DIVIDER,
				{
					label: "&Auto Arrange",
					checkbox: {
						check: ()=> true,
						toggle: ()=> {}, // @TODO
					},
					enabled: false, // @TODO
					description: "Arranges the icons automatically.",
				},
			],
			description: "Contains commands for arranging items in the window.",
		},
		{
			label: "Line &Up Icons",
			enabled: false, // @TODO
			description: "Arranges icons in a grid.",
		},
		MENU_DIVIDER,
		{
			label: "&Refresh",
			shortcutLabel: "F5",
			ariaKeyShortcuts: "F5",
			action: () => {
				refresh();
			},
			description: "Refreshes the contents of the current pane.",
		},
		{
			label: "Folder &Options...",
			enabled: false, // @TODO
			description: "Enables you to change settings.",
		},
	],
	"&Go": [
		// description: "Contains commands for browsing to various pages.",
		{
			label: "&Back",
			shortcutLabel: "Alt+Left Arrow",
			ariaKeyShortcuts: "Alt+ArrowLeft",
			action: () => {
				go_back();
			},
			enabled: ()=> can_go_back(),
			description: "Goes to the previous page.",
		},
		{
			label: "&Forward",
			shortcutLabel: "Alt+Right Arrow",
			ariaKeyShortcuts: "Alt+ArrowRight",
			action: () => {
				go_forward();
			},
			enabled: ()=> can_go_forward(),
			description: "Goes to the next page.",
		},
		{
			label: "&Up One Level",
			// shortcutLabel: "Alt+Up Arrow",
			// ariaKeyShortcuts: "Alt+ArrowUp",
			action: () => {
				go_up();
			},
			enabled: ()=> can_go_up(),
			description: "Goes up one level.",
		},
		MENU_DIVIDER,
		{
			label: "&Home Page",
			shortcutLabel: "Alt+Home",
			ariaKeyShortcuts: "Alt+Home",
			action: () => {
				go_home();
			},
			description: "Goes to your home page.",
		},
		{
			label: "Channel &Guide",
			action: () => {
				// http://interdimensionalcable.io/ doesn't work because of HTTP vs HTTPS (Mixed Content)
				go_to("https://topotech.github.io/interdimensionalcable/");
			},
			description: "Opens the Channel Guide Web page.",
		},
		{
			label: "&Search the Web",
			action: () => {
				// Can you find a search engine that supports iframes?
				// This is a fun alternative, although it'd be nicer if it was thematic (i.e. retro)
				go_to("https://mrdoob.com/projects/chromeexperiments/google-gravity/index.html");
			},
		},
		MENU_DIVIDER,
		{
			label: "My &Computer",
			action: () => {
				// @TODO: a real My Computer location
				go_to("/");
			},
			description: "Opens My Computer.",
		},
		{
			label: "&Internet Call",
			action: () => {
				// @TODO: host a configured version in order to theme it,
				// maybe allow sharing individual windows on the 98.js desktop?
				// How much of NetMeeting should I implement? :P
				go_to("https://brie.fi/ng/98?audio=1&video=1&fs=0&invite=0&share=0&chat=1");
			},
			description: "Opens your Internet call and meeting program.",
		},
	],
	"F&avorites": [
		// description: "Displays the contents of your Favorites folder.",
		{
			label: "&Add to Favorites...",
			enabled: false, // @TODO
			description: "Adds the current page to your Favorites list.",
		},
		{
			label: "&Organize Favorites...",
			enabled: false, // @TODO
			description: "Opens the Favorites folder.",
		},
		MENU_DIVIDER,
		// @TODO: populate with favorites
		// description and tooltip should be the URL of the item
		{
			label: "(Empty)",
			enabled: false,
		},
	],
	"&Tools": [
		// @TODO: this shows up if Exploring (right click, Explore)
		// and differently if you're in Internet Explorer
		// and not at all if you're in a normal file explorer window
		// This is currently the Exploring version.
		// description: "Contains tools commands.",
		{
			label: "&Find",
			submenu: [
				{
					label: "&Files or Folders...",
					enabled: false, // @TODO
				},
				{
					label: "&Computer...",
					enabled: false, // @TODO
				},
				{
					label: "On the &Internet...",
					enabled: false, // @TODO
				},
			],
		},
		MENU_DIVIDER,
		{
			label: "Map &Network Drive...",
			enabled: false, // @TODO: could use BrowserFS Dropbox adapter
			description: "Connects to a network drive.",
		},
		{
			label: "&Disconnect Network Drive...",
			enabled: false, // @TODO
			description: "Disconnects from a network drive.",
		},
		{
			label: "&Synchronize...",
			enabled: false, // @TODO
			description: "Updates all offline content.",
		},
	],
	"&Help": [
		// description: "Contains commands for displaying Help.",
		{
			label: "&Help Topics",
			enabled: false, // @TODO
			description: "Opens Help.",
		},
		MENU_DIVIDER,
		{
			// label: "&About Windows 98",
			label: "&About 98.js.org",
			action: function () {
				// TODO: about dialog
				window.open("https://github.com/1j01/98#readme");
			},
			// description: "Displays program information, version number, and copyright.",
			description: "Opens the 98.js project Web page.",
		}
	],
};

// @TODO: let menus go outside the window (outside the iframe)
// This app is a bit special, because it has a menu bar that can be
// dragged around.

// var go_outside_frame = false;
// if (frameElement) {
// 	try {
// 		if (parent.MenuBar) {
// 			MenuBar = parent.MenuBar;
// 			go_outside_frame = true;
// 		}
// 	} catch (e) { }
// }
var menu_bar = new MenuBar(menus);
// if (go_outside_frame) {
// 	$(menu_bar.element).insertBefore(frameElement);
// } else {
// 	$(function () {
// 		$(menu_bar.element).prependTo("body");
// 	});
// }

$(function () {
	$("#menu-bar-toolbar").append(menu_bar.element);
});

$(menu_bar.element).on("info", (event) => {
	const status = event.detail?.description ?? "";
	$("#status-bar-simple").show();
	$("#status-bar-simple-text").text(status);
	$("#status-bar-left, #status-bar-middle, #status-bar-right").hide();
});
$(menu_bar.element).on("default-info", (event) => {
	$("#status-bar-left, #status-bar-middle, #status-bar-right").show();
	$("#status-bar-simple").hide();
});
