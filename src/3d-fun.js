(function () {
	var cleanup;

	disable3D = function () {
		if (cleanup) {
			cleanup();
			cleanup = null;
		}
		$(".os-window").css({
			transform: ""
		});
	};

	enable3D = function () {
		disable3D();
		var animate = function () {
			var rAF_ID = requestAnimationFrame(animate);
			cleanup = function () {
				cancelAnimationFrame(rAF_ID);
			};
			// var everything = $("*");
			// $("iframe").each(function(){
			// 	everything = everything.add(this.contentWindow.$ && this.contentWindow.$("*"));
			// });
			// everything.each(function(){
			$(".os-window").each(function () {
				var $window = $(this);
				//var offset = $window.offset();//position();
				var el = this;
				var offsetLeft = 0;
				var offsetTop = 0;
				do {
					offsetLeft += el.offsetLeft;
					offsetTop += el.offsetTop;
					const translate_match = el.style.transform.match(/translate\((\d+)px, (\d+)px\)/);
					if (translate_match) {
						const [, translate_x, translate_y] = translate_match;
						offsetLeft += parseFloat(translate_x);
						offsetTop += parseFloat(translate_y);
					}
					el = el.offsetParent;
				} while (el);

				$window.css({
					transform: `perspective(4000px) rotateY(${-(offsetLeft + (this.clientWidth - innerWidth) / 2) / innerWidth / 3
						}turn) rotateX(${(offsetTop + (this.clientHeight - innerHeight) / 2) / innerHeight / 3
						}turn)`,
					transformOrigin: "50% 50%",
					transformStyle: "preserve-3d",
					// FIXME: interactivity problems (with order elements are considered to have), I think introduced with preserve-3d
				});
			});
		};
		animate();
	};

	toggle3D = function () {
		if (cleanup) {
			disable3D();
		} else {
			enable3D();
		}
	};

	addEventListener("keydown", Konami.code(toggle3D));
}());
