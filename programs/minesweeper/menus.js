
var difficulty_levels = [
	[9, 9, 10],
	[16, 16, 40],
	[30, 16, 99]
];
var set_difficulty = function(difficulty){
	minesweeper_.new_game.apply(minesweeper_, difficulty);
	
	if(frameElement){
		// TODO: um why not just use the computed width <punctuation="thinking-emoji"/> </sentence>
		var tile_size = 16;
		var extra_width = 24;
		var extra_height = 64;
		frameElement.style.width = extra_width + tile_size * difficulty[0] + "px";
		frameElement.style.height = extra_height + tile_size * difficulty[1] + "px";
	}
};
var is_at_difficulty = function(difficulty){
	return (
		minesweeper_.width === difficulty[0] &&
		minesweeper_.height === difficulty[1] &&
		minesweeper_.number_mines === difficulty[2]
	);
};
var checkbox_for_difficulty = function(index){
	return {
		check: function(){
			return is_at_difficulty(difficulty_levels[index]);
		},
		toggle: function(){
			set_difficulty(difficulty_levels[index]);
		},
	};
};

var menus = {
	"&Game": [
		{
			item: "&New",
			// shortcut: "F2", // TODO
			action: function(){
				minesweeper_.restart();
			},
		},
		$MenuBar.DIVIDER,
		{
			item: "&Beginner",
			checkbox: checkbox_for_difficulty(0),
		},
		{
			item: "&Intermediate",
			checkbox: checkbox_for_difficulty(1),
		},
		{
			item: "&Expert",
			checkbox: checkbox_for_difficulty(2),
		},
		{
			item: "&Custom...",
			enabled: false,
			checkbox: {
				check: function(){
					return difficulty_levels.every(function(difficulty){
						return !is_at_difficulty(difficulty);
					});
				},
				toggle: function(){
					// TODO
					// minesweeper_.new_game(width, height, number_of_mines);
				},
			},
		},
		$MenuBar.DIVIDER,
		{
			item: "&Marks (?)",
			enabled: false,
			checkbox: {
				check: function(){
					// TODO
					return true;
				},
				toggle: function(){
					// TODO
				},
			}
		},
		{
			item: "Co&lor",
			enabled: false,
			checkbox: {
				check: function(){
					// TODO
					return true;
				},
				toggle: function(){
					// TODO
				},
			}
		},
		$MenuBar.DIVIDER,
		{
			item: "Best &Times...",
			enabled: false,
			action: function(){
				// TODO
			},
		},
		$MenuBar.DIVIDER,
		{
			item: "E&xit",
			action: function(){
				close();
			},
		}
	],
	"&Help": [
		{
			item: "&Help Topics",
			enabled: false,
			action: function(){
				// TODO
			},
		},
		$MenuBar.DIVIDER,
		{
			item: "&About Minesweeper",
			action: function(){
				// TODO: about dialog
				window.open("https://github.com/ziebelje/minesweeper");
			},
		}
	],
};

var go_outside_frame = false;
if(frameElement){
	try{
		if(parent.$MenuBar){
			$MenuBar = parent.$MenuBar;
			go_outside_frame = true;
		}
	}catch(e){}
}
var $menu_bar = $MenuBar(menus);
if(go_outside_frame){
	$menu_bar.insertBefore(frameElement);
}else{
	$(function(){
		$menu_bar.prependTo(jQuery("body"));
	});
}
