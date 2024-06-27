/** @type {OSGUITopLevelMenus} */
var menus = {
	"&Edit": [
		{
			label: "&Copy",
			shortcutLabel: "Ctrl+C",
			ariaKeyShortcuts: "Control+C",
			enabled: () => {
				return !!navigator.clipboard.writeText;
			},
			action: () => {
				window.focus(); // needed for clipboard access in some browsers
				copyResult();
			},
		},
		{
			label: "&Paste",
			shortcutLabel: "Ctrl+V",
			ariaKeyShortcuts: "Control+V",
			enabled: () => {
				return !!navigator.clipboard.readText;
			},
			action: () => {
				window.focus(); // needed for clipboard access in some browsers
				pasteResult();
			},
		},
	],
	"&View": [
		{
			ariaLabel: "Layout",
			getValue: () => "standard", // TODO
			setValue: (layout_mode) => {
				// TODO
			},
			radioItems: [
				{
					label: "S&tandard",
					value: "standard",
					enabled: false,
				},
				{
					label: "&Scientific",
					value: "scientific",
					enabled: false,
				},
			],
		},
	],
	"&Help": [
		{
			label: "&Help Topics",
			action: function () {
				var show_help = window.show_help;
				try {
					show_help = parent.show_help;
				} catch (e) { }
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
			label: "&About Calculator",
			action: function () {
				// TODO: about dialog
				window.open("https://github.com/muzam1l/mcalculator");
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
	$(function () {
		$("body").addClass("menu-bar-is-outside-frame");
	});
} else {
	$(function () {
		$(menu_bar.element).prependTo(jQuery("body"));
	});
}
