
var programs_being_loaded = 0;

function $IframeWindow(options){
	
	var $win = new $Window(options);
	$win.$content.html("<iframe allowfullscreen>");
	
	var $iframe = $win.$iframe = $win.$content.find("iframe");
	var iframe = $win.iframe = $iframe[0];
	
	var focus_window_contents = function(e){
		if(!iframe.contentWindow){
			return;
		}
		
		$win.bringToFront();
		
		if($(e.target).closest(".menus, .menu-popup").length === 0){
			return;
		}
		
		iframe.contentWindow.focus();
		setTimeout(function(){
			iframe.contentWindow.focus();
		});
	};
	
	$win.on("focus", focus_window_contents);
	
	// Let the iframe to handle mouseup events outside itself
	var delegate_pointerup = function(){
		if(iframe.contentWindow && iframe.contentWindow.jQuery){
			iframe.contentWindow.jQuery("body").trigger("pointerup");
		}
	};
	$G.on("mouseup blur", delegate_pointerup);
	$win.on("close", function(){
		$G.off("mouseup blur", delegate_pointerup);
	});
	
	// @TODO: delegate pointermove events too?
	
	$("body").addClass("loading-program");
	programs_being_loaded += 1;
	
	$iframe
		.on("load", function(){
			
			if(--programs_being_loaded <= 0){
				$("body").removeClass("loading-program");
			}
			$win.show();
			iframe.contentWindow.focus();
			
			var $contentWindow = $(iframe.contentWindow);
			$contentWindow.on("pointerdown click", function(e){
				focus_window_contents(e);
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
				$win.close();
			};
			// TODO: hook into saveAs (a la FileSaver.js) and another function for opening files
			// iframe.contentWindow.saveAs = function(){
			// 	saveAsDialog();
			// };
			
		})
		.attr({src: options.src})
		.width(options.innerWidth || 640)
		.height(options.innerHeight || 380)
		.css({
			border: 0,
			verticalAlign: "bottom", // avoid unaccounted-for space on the bottom
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

