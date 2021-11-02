
var $desktop = $(".desktop");
$desktop.css("touch-action", "none"); // TODO: should this be in FolderView, or is it to prevent scrolling the page or what?

var folder_view = new FolderView(desktop_folder_path, { asDesktop: true });
$(folder_view.element).appendTo($desktop);

// Prevent drag and drop from redirecting the page (the browser default behavior for files)
// TODO: only prevent if there are actually files; there's nothing that uses text inputs atm that's not in an iframe, so it doesn't matter YET (afaik)
// $G.on("dragover", function(e){
// 	e.preventDefault();
// });
// $G.on("drop", function(e){
// 	e.preventDefault();
// });

function loadThemeFile(file) {
	var reader = new FileReader();
	reader.onload = () => {
		loadThemeFromText(reader.result);
	};
	reader.readAsText(file);
}
function applyTheme(cssProperties, documentElement = document.documentElement) {
	applyCSSProperties(cssProperties, { element: documentElement, recurseIntoIframes: true });
}
function loadThemeFromText(fileText) {
	var cssProperties = parseThemeFileString(fileText);
	applyTheme(cssProperties);
	window.themeCSSProperties = cssProperties;
}

$("html").on("dragover", function (event) {
	event.preventDefault();
	event.stopPropagation();
});
$("html").on("dragleave", function (event) {
	event.preventDefault();
	event.stopPropagation();
});
$("html").on("drop", function (event) {
	event.preventDefault();
	event.stopPropagation();
	var files = [...event.originalEvent.dataTransfer.files];
	for (var file of files) {
		if (file.name.match(/\.theme(pack)?$/i)) {
			loadThemeFile(file);
		}
	}
});

// Despite overflow:hidden on html and body,
// focusing elements that are partially offscreen can still scroll the page.
// For example, with opening Paint and moving it partially offscreen and opening Image > Attributes,
// the default focused button can scroll the entire desktop.
// We need to prevent (reset) scroll, and also avoid scrollIntoView().
$(window).on("scroll focusin", () => {
	window.scrollTo(0, 0);
});

// SVG filter for animating the desktop background

const map_url = "images/swirl.webp";
const displacement_scale = 0;
const svg_source = `
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		id="wallpaper-distortion-filter-svg"
		width="0" height="0"
		style="position: absolute;"
	><defs>
		<filter
			id="wallpaper-distortion"
			width="1" height="1" x="0" y="0"
			color-interpolation-filters="sRGB"
			filterUnits="objectBoundingBox"
			preserveAspectRatio="none"
		>
			<feFlood
				width="100%" height="100%"
				x="0" y="0"
				flood-color="rgb(127,127,127)"
				
				result="identity-displacement"
			/>
			<feImage
				width="100%" height="100%"
				x="0.1" y="0.1"
				href="${map_url}"
				preserveAspectRatio="xMidYMid"
				result="displacement-map-image"
			/>
			<feMerge result="displacement-map">
				<feMergeNode in="identity-displacement"/>
				<feMergeNode in="displacement-map-image"/>
			</feMerge>
			<feDisplacementMap
				in="SourceGraphic"
				in2="displacement-map"
				scale="${displacement_scale}"
				xChannelSelector="R"
				yChannelSelector="G"
				result="displaced"
			>
				<animate
				attributeName="scale" from="0" to="500"
				dur="50s" repeatCount="indefinite" />
			</feDisplacementMap>
			<feComponentTransfer in="displacement-map" result="displacement-debug">
			  <feFuncA type="linear" slope="0" id='displacement-debug-feFuncA'/>
			</feComponentTransfer>
			<feMerge>
				<feMergeNode in="displaced"/>
				<feMergeNode in="displacement-debug"/>
			</feMerge>
		</filter>	
	</defs></svg>
`;
let svg = document.getElementById("wallpaper-distortion-filter-svg");
if (!svg) {
	var doc = new DOMParser().parseFromString(svg_source, "application/xml");
	document.body.appendChild(document.importNode(doc.querySelector("svg"), true));
}
document.querySelector(".wallpaper").style.filter = "url(#wallpaper-distortion)";
addEventListener("keydown", (event) => {
	if (event.key === "d") {
		const feFuncA = document.getElementById("displacement-debug-feFuncA");
		if (feFuncA.getAttribute("slope") === "0") {
			feFuncA.setAttribute("slope", "0.5");
		} else if (feFuncA.getAttribute("slope") === "0.5") {
			feFuncA.setAttribute("slope", "1");
		} else {
			feFuncA.setAttribute("slope", "0");
		}
	}
});
// addEventListener("mousemove", (event) => {
// 	document.querySelector("#wallpaper-distortion-filter-svg feDisplacementMap").setAttribute("scale",
// 		(event.clientX / window.innerWidth) * 1000
// 	);
// });
console.log(document.querySelector("feImage").href);
