
var programs_being_loaded = 0;

function $Iframe(options){
	var $iframe = $("<iframe allowfullscreen sandbox='allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-modals allow-popups allow-downloads'>");
	var iframe = $iframe[0];

	var disable_delegate_pointerup = false;
	
	$iframe.focus_contents = function(){
		if (!iframe.contentWindow) {
			return;
		}
		if (iframe.contentDocument.hasFocus()) {
			return;
		}
		
		disable_delegate_pointerup = true;
		iframe.contentWindow.focus();
		setTimeout(function(){
			iframe.contentWindow.focus();
			disable_delegate_pointerup = false;
		});
	};
	
	// Let the iframe to handle mouseup events outside itself
	var delegate_pointerup = function(){
		if (disable_delegate_pointerup) {
			return;
		}
		if(iframe.contentWindow && iframe.contentWindow.jQuery){
			iframe.contentWindow.jQuery("body").trigger("pointerup");
		}
		if(iframe.contentWindow){
			const event = new iframe.contentWindow.MouseEvent("mouseup", {button: 0});
			iframe.contentWindow.dispatchEvent(event);
			const event2 = new iframe.contentWindow.MouseEvent("mouseup", {button: 2});
			iframe.contentWindow.dispatchEvent(event2);
		}
	};
	$G.on("mouseup blur", delegate_pointerup);
	$iframe.destroy = ()=> {
		$G.off("mouseup blur", delegate_pointerup);
	};
	
	// @TODO: delegate pointermove events too?

	$("body").addClass("loading-program");
	programs_being_loaded += 1;
	
	$iframe.on("load", function(){
		
		if(--programs_being_loaded <= 0){
			$("body").removeClass("loading-program");
		}
		
		if (window.themeCSSProperties) {
			applyTheme(themeCSSProperties, iframe.contentDocument.documentElement);
		}

		// on Wayback Machine, and iframe's url not saved yet
		if (iframe.contentDocument.querySelector("#error #livewebInfo.available")) {
			var message = document.createElement("div");
			message.style.position = "absolute";
			message.style.left = "0";
			message.style.right = "0";
			message.style.top = "0";
			message.style.bottom = "0";
			message.style.background = "#c0c0c0";
			message.style.color = "#000";
			message.style.padding = "50px";
			iframe.contentDocument.body.appendChild(message);
			message.innerHTML = `<a target="_blank">Save this url in the Wayback Machine</a>`;
			message.querySelector("a").href =
				"https://web.archive.org/save/https://98.js.org/" +
				iframe.src.replace(/.*https:\/\/98.js.org\/?/, "");
			message.querySelector("a").style.color = "blue";
		}

		var $contentWindow = $(iframe.contentWindow);
		$contentWindow.on("pointerdown click", function(e){
			iframe.$window && iframe.$window.focus();
			
			// from close_menus in $MenuBar
			$(".menu-button").trigger("release");
			// Close any rogue floating submenus
			$(".menu-popup").hide();
		});
		// We want to disable pointer events for other iframes, but not this one
		$contentWindow.on("pointerdown", function(e){
			$iframe.css("pointer-events", "all");
			$("body").addClass("drag");
		});
		$contentWindow.on("pointerup", function(e){
			$("body").removeClass("drag");
			$iframe.css("pointer-events", "");
		});
		// $("iframe").css("pointer-events", ""); is called elsewhere.
		// Otherwise iframes would get stuck in this interaction mode
		
		iframe.contentWindow.close = function(){
			iframe.$window && iframe.$window.close();
		};
		// TODO: hook into saveAs (a la FileSaver.js) and another function for opening files
		// iframe.contentWindow.saveAs = function(){
		// 	saveAsDialog();
		// };
		
	});
	if (options.src) {
		$iframe.attr({src: options.src});
	}
	$iframe.css({
		minWidth: 0,
		minHeight: 0, // overrides user agent styling apparently, fixes Sound Recorder
		flex: 1,
		border: 0, // overrides user agent styling
	});

	return $iframe;
}

function $IframeWindow(options){
	
	var $win = new $Window(options);
	
	var $iframe = $win.$iframe = $Iframe({src: options.src});
	$win.$content.append($iframe);
	var iframe = $win.iframe = $iframe[0];
	// TODO: should I instead of having iframe.$window, have a get$Window type of dealio?
	// where all is $window needed?
	// I know it's used from within the iframe contents as frameElement.$window
	iframe.$window = $win;

	$win.on("close", function(){
		$iframe.destroy();
	});
	$win.onFocus($iframe.focus_contents);

	$iframe.on("load", function(){
		$win.show();
		$win.focus();
		// $iframe.focus_contents();
	});
	
	$win.setInnerDimensions = ({width, height})=> {
		const width_from_frame = $win.width() - $win.$content.width();
		const height_from_frame = $win.height() - $win.$content.height();
		$win.css({
			width: width + width_from_frame,
			height: height + height_from_frame + 21,
		});
	};
	$win.setInnerDimensions({
		width: (options.innerWidth || 640),
		height: (options.innerHeight || 380),
	});
	$win.$content.css({
		display: "flex",
		flexDirection: "column",
	});
	
	// TODO: cascade windows
	$win.center();
	$win.hide();
	
	return $win;
}

// Fix dragging things (i.e. windows) over iframes (i.e. other windows)
// (when combined with a bit of css, .drag iframe { pointer-events: none; })
// (and a similar thing in $IframeWindow)
$(window).on("pointerdown", function(e){
	//console.log(e.type);
	$("body").addClass("drag");
});
$(window).on("pointerup dragend blur", function(e){
	//console.log(e.type);
	if(e.type === "blur"){
		if(document.activeElement.tagName.match(/iframe/i)){
			return;
		}
	}
	$("body").removeClass("drag");
	$("iframe").css("pointer-events", "");
});

