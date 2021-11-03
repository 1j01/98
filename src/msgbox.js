
window.showMessageBox = ({ title, message, buttons, callback, iconID="warning" }) => {
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
		})
	).css({
		textAlign: "center",
	});
	$win.$Button("OK", () => $win.close()).addClass("default").focus().css({
		width: 100,
		margin: "16px",
		alignSelf: "center",
	});
	$win.center();
}

window.alert = (message) => {
	showMessageBox({
		title: "Alert",
		message,
		buttons: ["OK"],
	});
};

