
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
/*
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
*/

// GLSL shader(s) for animating the desktop background
var cloud_vert_glsl = `
attribute vec4 a_position;
void main() {
	gl_Position = vec4(a_position.xy, 0.0, 1.0);
}
`;
var cloud_fragment_glsl = `
// Based on https://www.shadertoy.com/view/4tdSWr

precision mediump float;

uniform float a_time;
uniform vec2 a_resolution;

const float cloud_scale = 1.0;
const float speed = 0.003;
const float cloud_dark = 0.5;
const float cloud_light = 0.3;
const float cloud_cover = 0.2;
const float cloud_alpha = 8.0;
const float sky_tint = 0.5;
// https://airtightinteractive.com/util/hex-to-glsl/
const vec3 sky_colour1 = vec3(0.475, 0.682, 0.839); // #79aed6
const vec3 sky_colour2 = vec3(0.455, 0.678, 0.855); // #74adda
const vec3 cloud_colour1 = vec3(0.937, 0.941, 0.957); // #eff0f4
const vec3 cloud_colour2 = vec3(0.627, 0.769, 0.894); // #a0c4e4

const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);

vec2 hash(vec2 p) {
	p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
	return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
	const float K1 = 0.366025404; // (sqrt(3)-1)/2;
	const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor(p + (p.x + p.y) * K1);
	vec2 a = p - i + (i.x + i.y) * K2;
	vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0); // vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0 * K2;
	vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
	vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
	return dot(n, vec3(70.0));
}

// float fbm(vec2 n) {
// 	float total = 0.0, amplitude = 0.1;
// 	for (int i = 0; i < 7; i++) {
// 		total += noise(n) * amplitude;
// 		n = m * n;
// 		amplitude *= 0.4;
// 	}
// 	return total;
// }

// -----------------------------------------------

void main() {
	vec2 p = gl_FragCoord.xy / a_resolution.xy;
	vec2 uv = p * vec2(a_resolution.x / a_resolution.y, 1.0);
	float time = a_time * speed;
	float q = 0.0; // fbm(uv * cloud_scale * 0.5);
	// ridged noise shape
	float r = 0.0;
	uv *= cloud_scale;
	uv -= q - time;
	float weight = 0.8;
	for (int i = 0; i < 4; i++) {
		r += abs(weight * noise(uv));
		uv = m * uv + time;
		weight *= 0.7;
	}
	// noise shape
	float f = 0.0;
	uv = p * vec2(a_resolution.x / a_resolution.y, 1.0);
	uv *= cloud_scale;
	uv -= q - time;
	weight = 0.7;
	for (int i = 0; i < 8; i++) {
		f += weight * noise(uv);
		uv = m * uv + time;
		weight *= 0.6;
	}
	f *= r + f;
	// noise colour
	float c = 0.0;
	time = a_time * speed * 2.0;
	uv = p * vec2(a_resolution.x / a_resolution.y, 1.0);
	uv *= cloud_scale * 2.0;
	uv -= q - time;
	weight = 0.4;
	for (int i = 0; i < 7; i++) {
		c += weight * noise(uv);
		uv = m * uv + time;
		weight *= 0.6;
	}
	// noise ridge colour
	float c1 = 0.0;
	time = a_time * speed * 3.0;
	uv = p * vec2(a_resolution.x / a_resolution.y, 1.0);
	uv *= cloud_scale * 3.0;
	uv -= q - time;
	weight = 0.4;
	for (int i = 0; i < 7; i++) {
		c1 += abs(weight * noise(uv));
		uv = m * uv + time;
		weight *= 0.6;
	}

	c += c1;
	vec3 sky_colour = mix(sky_colour2, sky_colour1, p.y);

	f = cloud_cover + cloud_alpha * f * r;

	vec3 cloud_colour = mix(cloud_colour2, cloud_colour1, f * 0.4);
	vec3 result = mix(sky_colour, cloud_colour, clamp(f + c, 0.0, 1.0));
	gl_FragColor = vec4(result, 1.0);
}
`;

var wallpaper_canvas = document.createElement("canvas");
document.querySelector(".wallpaper").appendChild(wallpaper_canvas);
wallpaper_canvas.style.width = "100%";
wallpaper_canvas.style.height = "100%";
wallpaper_canvas.style.imageRendering = "smooth";
var gl = wallpaper_canvas.getContext('webgl');
function give_up() {
	// give up, it's not worth restoring
	// hide the canvas so it doesn't show a crashed page icon (ᕁ︵ᕁ face in chrome)
	// also avoid the canvas showing through to your computer's desktop, on some platforms,
	// which, while cool, is ruined when you click on the desktop because of `mix-blend-mode: exclusion;`
	// on the marquee, and I don't want to worry about stuff like that interfering with a "cool effect" from an error case.
	// I have taken advantage of the cool effect in Space Cadet anyways. └(★o★)┐ ヾ(*⌣*)ﾉ
	wallpaper_canvas.remove();
}
if (!gl) {
	give_up();
	// can't return from top level
	throw new Error("Failed to get WebGL context");
}
wallpaper_canvas.addEventListener("webglcontextlost", function(event) {
	give_up();
}, false);
var cloud_vertex_shader = createShader(gl, gl.VERTEX_SHADER, window.cloud_vert_glsl);
var cloud_fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, window.cloud_fragment_glsl);
var program = createProgram(gl, cloud_vertex_shader, cloud_fragment_shader);
const time_location = gl.getUniformLocation(program, "a_time");
const resolution_location = gl.getUniformLocation(program, "a_resolution");
var position_attribute_location = gl.getAttribLocation(program, "a_position");
var position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
var positions = [
	-1, -1,
	-1, +1,
	+1, +1,
	+1, +1,
	+1, -1,
	-1, -1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// @TODO: for performance:
// - Check if the canvas is occluded by a maximized window, or an element is fullscreened (other than the wallpaper)
//   and if so, don't draw, but make sure it draws immediately once visible again.
// - Render tiles of cloud texture and translate them.
//   This would give up the subtle shifting of the clouds, but keep infinite scrolling,
//   and cut the processing time by like 50x probably.
var start_time = performance.now();
var last_render_time = -Infinity;
var frame_counter = 0;
var target_fps = 15;
wallpaper_canvas.style.opacity = "0";
// var debugDiv = document.createElement("div");
// document.querySelector(".wallpaper").appendChild(debugDiv);
// debugDiv.style.position = "absolute";
// debugDiv.style.top = "0";
// debugDiv.style.left = "50%";
function ease_in_out(t, a) {
	return Math.pow(t, a) / (Math.pow(t, a) + Math.pow(1 - t, a));
}
function render(time) {
	requestAnimationFrame(render);

	// in case it's rendering slow (especially initially),
	// limit time in based on frames, so it can't jump too much
	const t = Math.min(time, frame_counter * 500 / target_fps);

	if (wallpaper_canvas.style.opacity < 1) {
		wallpaper_canvas.style.opacity = ease_in_out(t / 30000, 1);
	}
	frame_counter++;

	// debugDiv.textContent = `
	// ${Math.round(1000 / (time - lastRenderTime))} FPS
	// time: ${Math.round(time)}
	// frame: ${frameCounter}
	// opacity: ${wallpaperCanvas.style.opacity}
	// `;
	// debugDiv.style.whiteSpace = "pre-wrap";

	if (time - last_render_time < 1000 / target_fps) {
		return;
	}
	last_render_time = time;

	resizeCanvas(gl);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(program);
	gl.enableVertexAttribArray(position_attribute_location);
	gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(
		position_attribute_location, size, type, normalize, stride, offset
	);

	gl.uniform1f(time_location, t * 0.001); // initial offset must not be too large/small for devices that use low-precision floats
	gl.uniform2f(resolution_location, gl.canvas.width, gl.canvas.height);
	// draw
	var primitive_type = gl.TRIANGLES;
	var offset = 0;
	var count = 6;
	gl.drawArrays(primitive_type, offset, count);
}
requestAnimationFrame(render);

function resizeCanvas(gl) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var aspect = width / height;
	var max_width = 640;
	var max_height = 640;
	if (width > max_width) {
		width = max_width;
		height = width / aspect;
	}
	if (height > max_height) {
		height = max_height;
		width = height * aspect;
	}
	gl.canvas.width = width;
	gl.canvas.height = height;
	gl.viewport(0, 0, width, height);
}

function createProgram(gl, vs, fs) {
	const p = gl.createProgram();
	gl.attachShader(p, vs);
	gl.attachShader(p, fs);
	gl.linkProgram(p);
	if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(p));
	}
	return p;
}

function createShader(gl, type, src) {
	const s = gl.createShader(type);
	gl.shaderSource(s, src);
	gl.compileShader(s);
	if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(s));
	}
	return s;
}

// don't put anything after here, or it'll depend on WebGL successfully initializing
