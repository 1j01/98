rocket.extend($ = rocket.$, rocket);
var arcade = {};

minesweeper = function(play_area, face) {
  play_area.preventSelect();
  this.play_area = play_area;
}
minesweeper.sprite = "url('minesweeper/img/sprite.png')";

minesweeper.prototype.play_area;
minesweeper.prototype.play_table;
minesweeper.prototype.grid;
minesweeper.prototype.grid_area;
minesweeper.prototype.timer_interval;
minesweeper.prototype.header_td_mine_count;
minesweeper.prototype.header_td_timer;
minesweeper.prototype.width;
minesweeper.prototype.height;
minesweeper.prototype.number_mines;
minesweeper.prototype.mine_counter;
minesweeper.prototype.game_over;
minesweeper.prototype.mouse = {"left": false, "right": false};

minesweeper.prototype.build = function(width, height) {

	this.play_table = $.createElement("table").setAttribute({"cellspacing": 0, "cellpadding": 0}).style({"border": "1px solid black", "width": width*16 + 22, "-moz-box-shadow": "3px 3px 6px 1px #999", "-webkit-box-shadow": "3px 3px 6px 1px #999", "box-shadow": "3px 3px 6px 1px #999", "margin": "auto"});
	var tbody = $.createElement("tbody");

	// 5 Rows
	var tr_border_top = $.createElement("tr");
	var tr_header = $.createElement("tr");
	var tr_border_middle = $.createElement("tr");
	var tr_border_bottom = $.createElement("tr");

	// Cells
	var td_border_top_left = $.createElement("td").style({"width": 10, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "0px -81px"});
	var td_border_top_right = $.createElement("td").style({"width": 10, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-26px -81px"});
	tr_border_top.appendChild(td_border_top_left);
  for(var i = 0; i < width; i++) {
    tr_border_top.appendChild($.createElement("td").style({"width": 16, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-10px -81px"}));
  }
	tr_border_top.appendChild(td_border_top_right);
  tbody.appendChild(tr_border_top);

	var td_header_left = $.createElement("td").style({"width": 10, "height": 32, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-36px -81px"});
	var td_header_center = $.createElement("td").style({"background-color": "#c0c0c0"}).setAttribute({"colspan": width});
	var td_header_right = $.createElement("td").style({"width": 10, "height": 32, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-36px -81px"});
  tr_header.appendChild(td_header_left);
  tr_header.appendChild(td_header_center);
  tr_header.appendChild(td_header_right);
  tbody.appendChild(tr_header);

	var td_border_middle_left = $.createElement("td").style({"width": 10, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-0px -91px"});
	var td_border_middle_right = $.createElement("td").style({"width": 10, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-26px -91px"});
  tr_border_middle.appendChild(td_border_middle_left);
  for(var i = 0; i < width; i++) {
    tr_border_middle.appendChild($.createElement("td").style({"background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-10px -81px"}));
  }
  tr_border_middle.appendChild(td_border_middle_right);
  tbody.appendChild(tr_border_middle);

  var tr_grid_area = $.createElement("tr");
  tr_grid_area.appendChild($.createElement("td").style({"height": 16, "width": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-36px -81px"}));
  this.grid_area = $.createElement("td").setAttribute({"colspan": width, "rowspan": height});
  tr_grid_area.appendChild(this.grid_area);
  tr_grid_area.appendChild($.createElement("td").style({"height": 16, "width": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-36px -81px"}));
  tbody.appendChild(tr_grid_area);
  for(var i = 0; i < height-1; i++) {
    tr_grid_area = $.createElement("tr");
    tr_grid_area.appendChild($.createElement("td").style({"height": 16, "width": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-36px -81px"}));
    tr_grid_area.appendChild($.createElement("td").style({"height": 16, "width": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-36px -81px"}));
    tbody.appendChild(tr_grid_area);
  }

	var td_border_bottom_left = $.createElement("td").style({"width": 10, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "0px -101px"});
	var td_border_bottom_right = $.createElement("td").style({"width": 10, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-26px -101px"});
	tr_border_bottom.appendChild(td_border_bottom_left);
  for(var i = 0; i < width; i++) {
    tr_border_bottom.appendChild($.createElement("td").style({"width": 16, "height": 10, "background-image": minesweeper.sprite, "background-repeat": "no-repeat", "background-position": "-10px -101px"}));
  }
	tr_border_bottom.appendChild(td_border_bottom_right);
  tbody.appendChild(tr_border_bottom);

  this.play_table.appendChild(tbody);
  this.play_area.appendChild(this.play_table);

  // Header
  var header_table = $.createElement("table").setAttribute({"cellpadding": 0, "cellspacing": 0}).style({"width": "100%"});
  var header_tbody = $.createElement("tbody");
  var header_tr = $.createElement("tr");
  this.header_td_mine_count = $.createElement("td").style({"width": 53, "text-align": "center"});
  this.header_td_face = $.createElement("td").style({"text-align": "center"});
  this.header_td_timer = $.createElement("td").style({"width": 53, "text-align": "center"});
  header_tr.appendChild(this.header_td_mine_count);
  header_tr.appendChild(this.header_td_face);
  header_tr.appendChild(this.header_td_timer);
  header_tbody.appendChild(header_tr);
  header_table.appendChild(header_tbody);
  td_header_center.appendChild(header_table);
}

minesweeper.prototype.new_game = function(width, height, number_mines) {
  var self = this;

  this.mouse.right = false;
  this.mouse.left = false;
  this.game_over = false;

  this.width = width;
  this.height = height;
  this.number_mines = number_mines;

  this.play_area.innerHTML("");

  this.build(width, height);

  var face = new minesweeper.face(this, this.header_td_face);

  this.play_table.removeEventListener("mousedown,mouseup").style({"cursor": "default", "border": "1px solid #444"});
  this.play_table
    .addEventListener("mousedown", function(e) {
      if(e.target === face.get_element()) return false;
      if(e.which === 1) face.set_state("scared");
    })
    .addEventListener("mouseup", function(e) {
      face.set_state("smile");
    });

  this.mine_counter = new minesweeper.ssd(this.header_td_mine_count, number_mines)
  var timer = new minesweeper.ssd(this.header_td_timer, 0);

  this.timer_interval = setInterval(function() { timer.increment(); }, 1000);

	this.grid = new minesweeper.grid(this, this.grid_area, width, height, face);
	this.grid.generate(number_mines);
}
minesweeper.prototype.restart = function() {
  this.new_game(this.width, this.height, this.number_mines);
}
minesweeper.prototype.lose = function() {
  if(!this.game_over) {
    clearInterval(this.timer_interval);
    this.game_over = true;
    // alert('You lose!');
  }
}
minesweeper.prototype.win = function() {
  if(!this.game_over) {
    clearInterval(this.timer_interval);
    this.game_over = true;
    // alert('You win!');
  }
}

$.ready(function() {
  var minesweeper_ = new minesweeper($("#play_area"));
  minesweeper_.new_game(16, 16, 40);

  $("#button_beginner").addEventListener("click", function() {
    // minesweeper_.new_game(9, 9, 1);
    minesweeper_.new_game(9, 9, 10);
  });
  $("#button_intermediate").addEventListener("click", function() {
    minesweeper_.new_game(16, 16, 40);
  });
  $("#button_expert").addEventListener("click", function() {
    minesweeper_.new_game(30, 16, 99);
  });

  $(document)
    .addEventListener("mousedown", function(e) {
      if(e.which == 1) minesweeper_.mouse.left = true;
      else if(e.which == 3) minesweeper_.mouse.right = true;
      if(e.target.nodeName !== "TD") return false;

      var tile = minesweeper_.grid.get_tile_from_td(e.target);
      if(!tile) return false;

      // On right click, mark the tile if the right mouse is the only button down
      if(minesweeper_.mouse.right && !minesweeper_.mouse.left) {
        var state = tile.mark();
        if(state === "flag") {
          minesweeper_.mine_counter.decrement();
        }
        else if(state === "question") {
          minesweeper_.mine_counter.increment();
        }
      }

      // On left click OR if I have both mouse buttons down
      if(minesweeper_.mouse.left || (minesweeper_.mouse.right && minesweeper_.mouse.left)) {
        var tiles_to_highlight = [];
        tiles_to_highlight.push(minesweeper_.grid.get_tile_from_td(e.target));

        // If I have both mouse buttons down, add the surrounding tiles to the highlight array
        if(minesweeper_.mouse.left && minesweeper_.mouse.right) {
          var coordinates = minesweeper_.grid.get_coordinates_from_td(e.target);
          var surrounding_tiles = minesweeper_.grid.get_surrounding_tiles(coordinates.x, coordinates.y);
          tiles_to_highlight = tiles_to_highlight.concat(surrounding_tiles);
        }

        // Highlight the tiles
        // console.log(tiles_to_highlight);
        for(var i in tiles_to_highlight) {
          if(tiles_to_highlight[i].highlight()) {
            minesweeper_.grid.highlighted_tiles.push(tiles_to_highlight[i]);
          }
        }
      }
    })
    .addEventListener("mouseup", function(e) {
      if(e.target.nodeName !== "TD") {
        if(e.which == 1) minesweeper_.mouse.left = false;
        else if(e.which == 3) minesweeper_.mouse.right = false;
        return false;
      }
      // If I am releasing the left mouse button OR if both mouse buttons were down and I released either one of them
      if(minesweeper_.mouse.left || (minesweeper_.mouse.left && minesweeper_.mouse.right)) {
        var click_coordinates = minesweeper_.grid.get_coordinates_from_td(e.target);

        if(click_coordinates.x === -1 || click_coordinates.y === -1) {
          if(e.which == 1) minesweeper_.mouse.left = false;
          else if(e.which == 3) minesweeper_.mouse.right = false;
          return false;
        }

        // If I'm trying the quick reveal, do a couple of checks to make sure that all the mines are marked or don't reveal.
        if(minesweeper_.mouse.left && minesweeper_.mouse.right) {

          // Get the number of flagged tiles
          var flag_count = 0;
          for(var i in minesweeper_.grid.highlighted_tiles) {
            if(minesweeper_.grid.highlighted_tiles[i].get_state() === "flag") flag_count++;
          }

          // Compare. If all the mines are marked, reveal each of the surrounding tiles
          if(flag_count == minesweeper_.grid.tiles[click_coordinates.x][click_coordinates.y].get_mine_count() && minesweeper_.grid.tiles[click_coordinates.x][click_coordinates.y].is_revealed() ) {
            for(var i in minesweeper_.grid.highlighted_tiles) {
              var coordinates = minesweeper_.grid.get_coordinates_from_td(minesweeper_.grid.highlighted_tiles[i].get_element());
              minesweeper_.grid.reveal_area(coordinates.x, coordinates.y);
            }
          }
          else { // If not all of the tiles are marked and we're not revealing, unhighlight all of the tiles.
            for(var i in minesweeper_.grid.highlighted_tiles) {
              minesweeper_.grid.highlighted_tiles[i].unhighlight();
            }
          }

        }
        else { // Single tile reveals are simple
          minesweeper_.grid.reveal_area(click_coordinates.x, click_coordinates.y);
        }

        // Clear highlighted tile array
        minesweeper_.grid.highlighted_tiles = [];
      }
      if(e.which == 1) minesweeper_.mouse.left = false;
      else if(e.which == 3) minesweeper_.mouse.right = false;

      // Now check to see if you won.
      // if(minesweeper_.mine_counter.get_value() === 0) {
        if(minesweeper_.grid.all_mines_marked()) {
          minesweeper_.win();
        }
      // }
    });
});
