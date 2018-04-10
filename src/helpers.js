
var TAU =     //////|//////
          /////     |     /////
       ///         tau         ///
     ///     ...--> | <--...     ///
   ///     -'   one | turn  '-     ///
  //     .'         |         '.     //
 //     /           |           \     //
//     |            | <-..       |     //
//    |          .->|     \       |    //
//    |         /   |      |      |    //
- - - - - - Math.PI + Math.PI - - - - - 0
//    |         \   |      |      |    //
//    |          '->|     /       |    //
//     |            | <-''       |     //
 //     \           |           /     //
  //     '.         |         .'     //
   ///     -.       |       .-     ///
     ///     '''----|----'''     ///
       ///          |          ///
         //////     |     /////
              //////|//////          C/r;

var $G = $(window);

function Cursor(cursor_def){
	return "url(images/cursors/" + cursor_def[0] + ".png) " +
		cursor_def[1].join(" ") +
		", " + cursor_def[2]
}

function E(t){
	return document.createElement(t);
}

var DESKTOP_ICON_SIZE = 32;
var TASKBAR_ICON_SIZE = 16;
var TITLEBAR_ICON_SIZE = 16;

function getIconPath(name, size){
	return "/images/icons/" + name + "-" + size + "x" + size + ".png";
}

function $Icon(name, size){
	var $img = $("<img class='icon'/>");
	$img.attr({
		draggable: false,
		src: getIconPath(name, size),
		width: size,
		height: size,
	});
	return $img;
}

function $IconByIDPromise(id_promise, size){
	// var canvas = document.createElement("canvas");
	// canvas.width = size;
	// canvas.height = size;
	// var ctx = canvas.getContext("2d");
	var $img = $("<img class='icon'/>");
	// var backing_img = new Image;
	$img.attr({
		draggable: false,
		width: size,
		height: size,
	});
	id_promise.then(function(name){
		// $(backing_img).on("load", function(){
		// ctx.drawImage(backing_img, 0, 0, size, size);
		$img.attr({
			src: getIconPath(name, size), //canvas.toDataURL(),
		});
		// XXX: "refreshing" the SVG because the img has to have its src at the time its appended to the svg apparently
		$img.parent().parent().html($img.parent().parent().html())
		// });
		// backing_img.src = getIconPath(name, size);
	});
	return $img;
}

function Canvas(width, height){
	var new_canvas = E("canvas");
	var new_ctx = new_canvas.getContext("2d");
	new_ctx.imageSmoothingEnabled = false;
	new_ctx.mozImageSmoothingEnabled = false;
	new_ctx.webkitImageSmoothingEnabled = false;
	if(width && height){
		// new Canvas(width, height)
		new_canvas.width = width;
		new_canvas.height = height;
	}else{
		// new Canvas(image)
		var copy_of = width;
		if(copy_of){
			new_canvas.width = copy_of.width;
			new_canvas.height = copy_of.height;
			new_ctx.drawImage(copy_of, 0, 0);
		}
	}
	new_canvas.ctx = new_ctx;
	return new_canvas;
}
