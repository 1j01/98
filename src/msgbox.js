
// Prefer a function injected from outside an iframe,
// which will make dialogs that can go outside the iframe.

// Note `defaultMessageBoxTitle` handling in make_iframe_window
// Any other default parameters need to be handled there (as it works now)

window.showMessageBox = window.showMessageBox || (({
	title = window.defaultMessageBoxTitle ?? "Alert",
	message,
	// buttons,
	// callback,
	iconID = "warning" // "error", "warning", or "info"
}) => {
	const $win = new $Window({
		title,
		resizable: false,
		innerWidth: 400,
		maximizeButton: false,
		minimizeButton: false,
	});
	$win.$content.append(
		$("<img width='32' height='32'>").attr("src", `../../images/icons/${iconID}-32x32-8bpp.png`).css({
			margin: "16px",
			display: "block",
			float: "left",
		}),
		$("<p>").text(message).css({
			whiteSpace: "pre-wrap",
			textAlign: "left",
			fontFamily: "MS Sans Serif, Arial, sans-serif",
			fontSize: "14px",
			marginTop: "22px",
		})
	).css({
		textAlign: "center",
	});
	$win.$Button("OK", () => $win.close()).addClass("default").focus().css({
		width: 75,
		height: 23,
		margin: "16px",
		alignSelf: "center",
	});
	$win.center();
	return $win;
});

window.alert = (message) => {
	showMessageBox({
		message,
		buttons: ["OK"],
	});
};
