
var create_rotologo = function () {
	var rotologo = document.createElement("img");
	rotologo.classList.add("rotologo");
	if (frameElement) {
		frameElement.parentElement.appendChild(rotologo);
		rotologo.src = "../../images/windows-98-logo-vector-by-pkmnct-plus-js-logo.svg";
		// TODO: add "98.js.org" to the flying logo
	} else {
		document.body.appendChild(rotologo);
		// rotologo.src = "TODO://???/?=windows-98-logo-vector-by-pkmnct-plus-js-logo.svg"; // TODO!
		// rotologo.src = "help/flag&clouds.gif";
		// rotologo.style.mixBlendMode = "multiply";
		// rotologo.style.mixBlendMode = "hard-light";
		// rotologo.src = "images/tools-and-stuff.png";
		rotologo.src = "images/readme/mobipaint	.png";
		rotologo.style.mixBlendMode = "multiply";
	}

	var animate = function () {
		var rAF_ID = requestAnimationFrame(animate);
		// cleanup = function(){
		// 	cancelAnimationFrame(rAF_ID);
		// };

		var $rotologo = $(rotologo);
		$rotologo.css({
			position: "absolute",
			left: "50%",
			top: "50%",
			pointerEvents: "none",
			transform:
				`perspective(4000px) rotateY(${
					Math.sin(Date.now() / 5000)
				}turn) rotateX(${
					0
				}turn) translate(-50%, -50%) translateZ(500px)`,
			// transformOrigin: "50% 50%",
			transformOrigin: "0% 0%",
			// transformStyle: "preserve-3d",
			filter:
				`hue-rotate(${
					Math.sin(Date.now() / 4000)
					// TODO: slow down and stop when you pause
				}turn)`,
			transition: "opacity 1s ease",
		});
		
		var $window = parent.$(frameElement).closest(".window");
		if($window.length){
			//var offset = $window.offset();//position();
			var el = $window[0];
			var offsetLeft = 0;
			var offsetTop = 0;
			do {
				offsetLeft += el.offsetLeft;
				offsetTop += el.offsetTop;
				el = el.offsetParent;
			} while (el);

			$window.css({
				transform:
					`perspective(4000px) rotateY(${
						-(offsetLeft + ($window.outerWidth() - parent.innerWidth) / 2) / parent.innerWidth / 3
					}turn) rotateX(${
						(offsetTop + ($window.outerHeight() - parent.innerHeight) / 2) / parent.innerHeight / 3
					}turn)`,
				transformOrigin: "50% 50%",
				transformStyle: "preserve-3d",
			});
		}
	};
	animate();

	return rotologo;
};

// TODO: make this whole thing work multiple times
var start_movie = function () {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var player;
	var player_placeholder = document.createElement("div");
	document.querySelector(".canvas-area").appendChild(player_placeholder);
	$(player_placeholder).css({
		position: "absolute",
		top: "3px", // TODO: dynamic
		left: "3px",
		mixBlendMode: "multiply",
		pointerEvents: "none",
		transition: "opacity 0.4s ease",
	});
	// NOTE: placeholder not a container; the YT API replaces the element passed in the DOM
	// but keeps inline styles apparently, and maybe other things, I don't know; it's weird

	var rotologo;

	// The YouTube API calls this
	window.onYouTubeIframeAPIReady = function () {
		player = new YT.Player(player_placeholder, {
			height: "390",
			width: "640",
			videoId: "8TvcyPCgKSU",
			playerVars: {
				autoplay: 1,
				controls: 0,
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange,
			},
		});
		rotologo = create_rotologo();
	};

	// 4. The API will call this function when the video player is ready.
	function onPlayerReady(event) {
		player.playVideo();
		// TODO: unmute if muted?
		player.unMute();
	}

	// 5. The API calls this function when the player's state changes.
	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.ENDED) {
			// $(player_container).remove();
			player.destroy();
			// TODO: fade to white instead of black, to work with the multiply effect
			// or fade out opacity alternatively
			// setTimeout/setInterval and check player.getCurrentTime() for when near the end?
			// or we might switch to using soundcloud for the audio and so trigger it with that, with a separate video of just clouds
			// also fade out the rotologo earlier
			$(rotologo).css({opacity: 0});
		}
	}
	function stopVideo() {
		player.stopVideo();
	}

	var is_theoretically_playing = true;
	var space_phase_key_handler = function (e) {
		if (e.which === 32) {
			if (is_theoretically_playing) {
				player.pauseVideo();
				is_theoretically_playing = false;
				$(player.getIframe())
				.add(rotologo)
				.css({opacity: "0"});
			} else {
				player.playVideo();
				is_theoretically_playing = true;
				$(player.getIframe())
				.add(rotologo)
				.css({opacity: ""});
			}
			e.preventDefault();
			// player.getIframe().focus();
		}
	};
	addEventListener("keydown", space_phase_key_handler);
};

var start_moving_picture_feature_film_documentary_album = start_movie;
addEventListener("keydown", Konami.code(start_moving_picture_feature_film_documentary_album));
