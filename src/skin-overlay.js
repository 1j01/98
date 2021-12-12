function getOffset(element, fromElement) {
	let el = element,
		offsetLeft = 0,
		offsetTop = 0;

	do {
		offsetLeft += el.offsetLeft;
		offsetTop += el.offsetTop;

		el = el.offsetParent;
	} while (el && el !== fromElement);

	return { offsetLeft, offsetTop };
}

class SkinOverlay {
	constructor() {
		this.overlayCanvases = [];
		this.animateFns = [];
		this.skinImageCanvases = {};
		this.skinCanvasPatterns = {};
		this.skinPaintEditors = {};
		this.editMode = false;
	}

	setEditMode(drawDirectly) {
		for (const canvas of this.overlayCanvases) {
			canvas.style.pointerEvents = drawDirectly ? "auto" : "none";
		}
		this.editMode = drawDirectly;
	}

	makeOverlayCanvas(windowEl) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.style.position = "absolute";
		canvas.style.left = "0";
		canvas.style.top = "0";
		canvas.style.pointerEvents = this.editMode ? "auto" : "none";
		canvas.style.willChange = "opacity"; // hint fixes flickering in chrome
		canvas.className = "skin-overlay-canvas overlay-canvas";
		windowEl.appendChild(canvas);
		this.overlayCanvases.push(canvas);
		canvas.addEventListener("contextmenu", e => {
			e.stopImmediatePropagation(); // prevent webamp's context menu
			e.preventDefault(); // prevent system context menu (given that we're preventing webamp's handler)
		});
		canvas.addEventListener("pointerdown", e => {
			e.preventDefault(); // so JS Paint can keep focus for keyboard shortcuts
			// actually, better to focus it explicitly, so it can work if it wasn't focused before
			// will do that below

			// proxy the event to the JS Paint editor, so you can draw on the Webamp instance directly to edit the skin
			for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
				if (el.classList.contains("overlay-canvas")) {
					continue; // looking under the overlay canvas
				}
				const computedStyle = getComputedStyle(el);
				if (computedStyle.backgroundImage && computedStyle.backgroundImage !== "none" && computedStyle.getPropertyValue("--sprite-info")) {
					// this is a element has a sprite
					let sprite;
					try {
						sprite = parseJSON(computedStyle.getPropertyValue("--sprite-info").trim().slice(1, -1).replace(/\\"/g, "\""));
					} catch (error) {
						if (!window.showed_sprite_error) {
							console.error("Could not parse sprite info", computedStyle.getPropertyValue("--sprite-info"), error);
							window.showed_sprite_error = true;
						}
						return;
					}
					// practically, this will probably have to be a single editor later (for perf and reasonable UI)
					// but jspaint only supports a single image document at the moment
					const editor = this.skinPaintEditors[sprite.name];
					if (editor) {
						const getCanvasPos = (event) => {
							const elRect = el.getBoundingClientRect();
							let x = event.clientX - elRect.left;
							let y = event.clientY - elRect.top;
							// @TODO: background-position-x and background-position-y
							// see code below for parsing
							// x += sprite.x;
							// y += sprite.y;
							return { x, y };
						};
						editor._trigger_canvas_event("pointerenter", e, getCanvasPos(e));
						editor._trigger_canvas_event("pointerdown", e, getCanvasPos(e));
						editor._contentWindow.focus();
						const onPointerMove = e => {
							editor._trigger_canvas_event("pointermove", e, getCanvasPos(e));
						};
						const onPointerUpCancel = e => {
							editor._trigger_canvas_event("pointerup", e, getCanvasPos(e));
							document.removeEventListener("pointermove", onPointerMove);
							document.removeEventListener("pointerup", onPointerUpCancel);
							document.removeEventListener("pointercancel", onPointerUpCancel);
						};
						document.addEventListener("pointermove", onPointerMove);
						document.addEventListener("pointerup", onPointerUpCancel);
						document.addEventListener("pointercancel", onPointerUpCancel);
					}
				}

			}
		});

		this.animateFns.push(() => {
			// (not actually supporting multiple editors)
			const editor = this.skinPaintEditors[Object.keys(this.skinPaintEditors)[0]];
			if (editor) {
				canvas.style.cursor = editor._get_cursor();
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.resetTransform();
			ctx.fillStyle = "red";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			const scale =
				(windowEl.classList.contains("doubled") ? 2 : 1) *
				(window.devicePixelRatio || 1);
			if (
				canvas.width !== windowEl.clientWidth * scale ||
				canvas.height !== windowEl.clientHeight * scale
			) {
				canvas.width = windowEl.clientWidth * scale;
				canvas.height = windowEl.clientHeight * scale;
			}
			canvas.style.width = windowEl.clientWidth + "px";
			canvas.style.height = windowEl.clientHeight + "px";
			const stuff = Array.from(windowEl.querySelectorAll("*:not(.overlay-canvas)"));
			stuff.push(windowEl);
			const webampState = webamp.store.getState();
			// preload images for states that aren't used yet, like pressed button sprites
			// for (const imageURL of Object.values(webampState.display.skinImages)) {
			// 	loadImage(imageURL);
			// }

			stuff
				.map(el => {
					const width = el.clientWidth;
					const height = el.clientHeight;
					const area = width * height;
					return { element: el, width, height, area };
				})
				// .filter(({ area }) => area > 0) // zero-area elements needed for text
				.sort((a, b) => b.area - a.area) // using area as an approximation of depth (bigger things are usually further down)
				.forEach(({ element, width, height, area }) => {
					const { offsetLeft, offsetTop } = getOffset(element, windowEl);
					const windowElRect = windowEl.getBoundingClientRect();
					ctx.save();
					ctx.scale(scale, scale);
					let sourceX = 0;
					let sourceY = 0;
					let canvasPattern;
					const computedStyle = getComputedStyle(element);
					ctx.globalAlpha = computedStyle.opacity * (computedStyle.display === "none" ? 0 : 1) * (computedStyle.visibility === "hidden" ? 0 : 1);
					if (ctx.globalAlpha === 0) {
						return;
					}
					if (computedStyle.backgroundColor !== "transparent" && computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
						ctx.fillStyle = computedStyle.backgroundColor;
						ctx.fillRect(offsetLeft, offsetTop, width, height);
					}
					const repeat = computedStyle.backgroundRepeat || "repeat";
					// I'm using CSS vars, which cascades down, and I only want to render once,
					// so I'm checking if the background-image is set; --sprite-info should always have a corresponding background-image
					// (background-image doesn't cascade)
					if (computedStyle.backgroundImage && computedStyle.backgroundImage !== "none") {
						if (computedStyle.getPropertyValue("--sprite-info")) {
							let sprite;
							try {
								sprite = JSON.parse(computedStyle.getPropertyValue("--sprite-info").trim().slice(1, -1).replace(/\\"/g, "\""));
							} catch (error) {
								if (!window.showed_sprite_error) {
									console.error("Could not parse sprite info", computedStyle.getPropertyValue("--sprite-info"), error);
									window.showed_sprite_error = true;
								}
								return;
							}
							const { x, y, width, height, name } = sprite;
							let previewCanvas = this.skinImageCanvases[name];
							if (this.skinPaintEditors[name]) {
								const editor = this.skinPaintEditors[name];
								if (!this.skinImageCanvases[name]) {
									const editorCanvas = editor._find_canvas();
									if (editorCanvas) {
										previewCanvas = document.createElement("canvas");
										previewCanvas.width = editorCanvas.width;
										previewCanvas.height = editorCanvas.height;
										previewCanvas.ctx = previewCanvas.getContext("2d"); // expected by render_canvas_view
										this.skinImageCanvases[name] = previewCanvas;
									}
								}
								if (previewCanvas) {
									// @TODO: render only when needed (but still live preview during brush strokes etc.)
									// could add some hooks in jspaint to maintain a viewport, use it for the thumbnail too,
									// and possibly split-pane features etc.
									// (the key benefit being that it wouldn't rerender all viewports if one zooms/pans)
									editor._contentWindow.render_canvas_view(previewCanvas, 1, 0, 0, false);
								}
							}
							if (previewCanvas) {
								canvasPattern = this.skinCanvasPatterns[`${name} ${repeat}`];
								if (!canvasPattern) {
									canvasPattern = makeCanvasPattern(previewCanvas, repeat, ctx);
									// this.skinCanvasPatterns[`${name} ${repeat}`] = canvasPattern; // can't actually cache this, if we want to live-update
								}
							} else {
								const imageURL = webampState.display.skinImages[name];
								canvasPattern = getCanvasPattern(imageURL, repeat, ctx);
							}
							// sourceX = x;
							// sourceY = y;
						} else {
							// should not happen
							const imageURLMatch = computedStyle.backgroundImage.match(/url\("(.*)"\)/);
							if (imageURLMatch) {
								const imageURL = imageURLMatch[1];
								canvasPattern = getCanvasPattern(imageURL, repeat, ctx);
							}
						}
					}
					if (canvasPattern) {

						// Note: CanvasPattern is an opaque object, but I've tacked on width/height to it
						if (computedStyle.backgroundPositionX.includes("%")) {
							sourceX = parseFloat(computedStyle.backgroundPositionX) / 100 * (width - canvasPattern.width);
						} else {
							sourceX = parseFloat(computedStyle.backgroundPositionX);
						}
						if (computedStyle.backgroundPositionY.includes("%")) {
							sourceY = parseFloat(computedStyle.backgroundPositionY) / 100 * (height - canvasPattern.height);
						} else {
							sourceY = parseFloat(computedStyle.backgroundPositionY);
						}
				
						ctx.save();
						try {
							ctx.fillStyle = canvasPattern;
							const matrix = new DOMMatrix(`translate(${sourceX}px, ${sourceY}px)`);
							canvasPattern.setTransform(matrix);
							let elementMatrix = new DOMMatrix();
							let el = element;
							let clipRect;
							while (el && el !== windowEl) {
								const transform = el.style.transform; // hopefully don't need getComputedStyle here...
								if (transform && transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)") {
									const matrix = new DOMMatrix(transform);
									elementMatrix = elementMatrix.multiply(matrix);
								}
								// have some fun with matrix transforms
								// const arr = [1, 0, 0, 1, 0, 0];
								// for (let i = 0; i < arr.length; i++) {
								// 	arr[i] = Math.sin((Date.now() / 500) + i + hash(el) * 40.23) / 50;
								// }
								// arr[0] = 1 - arr[0];
								// arr[3] = 1 - arr[3];
								// elementMatrix = elementMatrix.multiply(new DOMMatrix(arr));

								// handle overflow clipping
								// only the largest clip region, not handling nested clip regions
								if (getComputedStyle(el).overflow === "hidden") {
									clipRect = el.getBoundingClientRect();
								}

								el = el.parentElement;
							}
							if (clipRect) {
								ctx.beginPath();
								ctx.rect(clipRect.left - windowElRect.left, clipRect.top - windowElRect.top, clipRect.width, clipRect.height);
								ctx.clip();
							}
							ctx.transform(elementMatrix.a, elementMatrix.b, elementMatrix.c, elementMatrix.d, elementMatrix.e, elementMatrix.f);
							ctx.translate(offsetLeft, offsetTop);
							ctx.fillRect(0, 0, width, height);
						} catch (error) {
							// console.warn(error);	
						}
						ctx.restore();
					}
					if (element instanceof HTMLCanvasElement || element instanceof HTMLImageElement || element instanceof HTMLVideoElement) {
						ctx.drawImage(element, offsetLeft, offsetTop, width, height);
					} else {
						// only want direct text children, since we're iterating over all elements and we want to render the text only once
						const text = Array.prototype.filter
							.call(element.childNodes, (child) => child.nodeType === Node.TEXT_NODE)
							.map((child) => child.textContent)
							.join('');
						// const text = `${sourceX}`;// ${sourceY} ${width} ${height} ${offsetLeft} ${offsetTop} ${repeat}`;

						if (text) {
							const textIndent = parseFloat(computedStyle.textIndent);
							ctx.font = computedStyle.font;
							ctx.fillStyle = computedStyle.color;
							ctx.textAlign = computedStyle.textAlign;
							ctx.textBaseline = "top";
							ctx.translate(textIndent, 0);
							if (computedStyle.textAlign === "left" || computedStyle.textAlign === "start" || computedStyle.textAlign === "justify") {
								ctx.fillText(text, offsetLeft, offsetTop);
							} else if (computedStyle.textAlign === "center") {
								ctx.fillText(text, offsetLeft + width / 2, offsetTop);
							} else {
								ctx.fillText(text, offsetLeft + width, offsetTop);
							}
						}
					}
					ctx.restore();
				});
		});
	}
	setSkinImage(name, image) {
		// The preview is rendered onto the skinImageCanvas, so it can't be the document canvas, else it'll be cleared for drawing
		// this.skinImageCanvases[name] = image;
		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);
		canvas.ctx = ctx; // expected by jspaint's render_canvas_view
		this.skinImageCanvases[name] = canvas;
	}

	render() {
		this.animateFns.forEach(fn => fn());
	}
	cleanUp() {
		this.overlayCanvases.forEach(canvas => {
			canvas.remove();
		});
	}
	fadeOutAndCleanUp() {
		this.fadeOut();
		this.overlayCanvases[0].addEventListener("transitionend", () => {
			this.cleanUp();
		});
	}
	fadeOut() {
		this.overlayCanvases.forEach(canvas => {
			canvas.style.transition =
				"opacity 1s cubic-bezier(0.125, 0.960, 0.475, 0.915)";
			canvas.style.opacity = "0";
		});
	}
	fadeIn() {
		this.overlayCanvases.forEach(canvas => {
			canvas.style.transition = "opacity 0.2s ease";
			canvas.style.opacity = "1";
		});
	}
}

function memoizeAsyncFunction(asyncFunc) {
	let cache = {};
	return async function () {
		let args = JSON.stringify(arguments);
		cache[args] = cache[args] || asyncFunc.apply(this, arguments);
		return cache[args];
	};
}

function memoizeFunction(func) {
	let cache = {};
	return function () {
		let args = JSON.stringify(arguments);
		cache[args] = cache[args] || func.apply(this, arguments);
		return cache[args];
	};
}

parseJSON = memoizeFunction(JSON.parse);

loadImage = memoizeAsyncFunction(function loadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
		img.src = url;
	});
});

const canvasPatterns = {};
// not using loadCanvasPattern directly because I want synchronous access (this is just a helper to implicitly kick off loading)
function getCanvasPattern(url, repeat, context) {
	loadCanvasPattern(url, repeat, context);
	return canvasPatterns[`${url} ${repeat}`];
}
function makeCanvasPattern(image, repeat, context) {
	const canvasPattern = context.createPattern(image, repeat);
	if (!canvasPattern) {
		throw new Error(`Failed to create pattern from image: ${url}`);
	}
	canvasPattern.width = image.width;
	canvasPattern.height = image.height;
	return canvasPattern;
}
// this is memoized, so it only needs to handle setting cache values and not returning them
loadCanvasPattern = memoizeAsyncFunction(async function loadCanvasPattern(url, repeat, context) {
	if (!url || url === "null") {
		return null;
	}
	const image = await loadImage(url); // separately cached because there could be different repeat values for the same image
	const canvasPattern = makeCanvasPattern(image, repeat, context);
	canvasPatterns[`${url} ${repeat}`] = canvasPattern;
});

// function hash(el) {
// 	// too slow because it causes reflows
// 	// return el.offsetLeft + el.offsetTop;
// 	// this is faster:
// 	const rect = el.getBoundingClientRect();
// 	return rect.left + rect.top;
// }
