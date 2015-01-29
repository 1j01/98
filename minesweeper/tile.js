minesweeper.tile = function(is_a_mine) {
	this.is_a_mine_ = is_a_mine;
  this.is_revealed_ = false;
}

minesweeper.tile.prototype.is_a_mine_;
minesweeper.tile.prototype.is_revealed_;
minesweeper.tile.prototype.state;
minesweeper.tile.prototype.mine_count;
minesweeper.tile.prototype.element;

minesweeper.tile.prototype.is_a_mine = function() {
	return this.is_a_mine_;
}
minesweeper.tile.prototype.is_revealed = function() {
  return this.is_revealed_;
}
minesweeper.tile.prototype.get_mine_count = function() {
  return this.mine_count;
}

minesweeper.tile.prototype.get_element = function() {
  if(!this.element) {
    this.element = $.createElement("td").style({
      "width": 16,
      "height": 16,
      "background-image": minesweeper.sprite,
      "background-repeat": "no-repeat"
    });
    this.set_state("covered");
  }
  return this.element[0];
}

minesweeper.tile.prototype.reveal = function(force) {
  if(this.get_state() === "flag") {
    if(force) {
      if(!this.is_a_mine()) this.set_state("mine_x");
    }
    else {
      return "flag";
    }
  }
  else if(this.is_a_mine()) {
    if(force) {
      this.set_state("mine");
    }
    else {
      this.set_state("mine_red");
    }
  }
  else {
    this.set_state("count_" + this.mine_count);
  }
  this.is_revealed_ = true;
  return (this.is_a_mine()) ? "mine" : true;
}

minesweeper.tile.prototype.highlight = function() {
  if(this.is_revealed()) return false;
  var state = this.get_state();
  if(state === "covered") this.set_state("highlighted");
  else if(state === "question") this.set_state("question_highlighted");
  return true;
}

minesweeper.tile.prototype.unhighlight = function() {
  if(this.is_revealed()) return false;
  var state = this.get_state();
  if(state === "highlighted") this.set_state("covered");
  else if(state === "question_highlighted") this.set_state("question");
}

minesweeper.tile.prototype.mark = function() {
  if(this.is_revealed()) return false;
  var state = this.get_state();
  if(state === "covered") this.set_state("flag");
  else if(state === "flag") this.set_state("question");
  else if(state === "question") this.set_state("covered");
  return this.get_state();
}

minesweeper.tile.prototype.set_state = function(state) {
  this.state = state;
  switch(state) {
    case "covered":
      this.element.style({"background-position": "0px -16px"})
    break;
    case "flag":
      this.element.style({"background-position": "-48px -16px"});
    break;
    case "question":
      this.element.style({"background-position": "-96px -16px"});
    break;
    case "question_highlighted":
      this.element.style({"background-position": "-112px -16px"});
    break;
    case "highlighted":
    case "count_0":
      this.element.style({"background-position": "-16px -16px"});
    break;
    case "count_1":
      this.element.style({"background-position": "0px 0px"});
    break;
    case "count_2":
      this.element.style({"background-position": "-16px 0px"});
    break;
    case "count_3":
      this.element.style({"background-position": "-32px 0px"});
    break;
    case "count_4":
      this.element.style({"background-position": "-48px 0px"});
    break;
    case "count_5":
      this.element.style({"background-position": "-64px 0px"});
    break;
    case "count_6":
      this.element.style({"background-position": "-80px 0px"});
    break;
    case "count_7":
      this.element.style({"background-position": "-96px 0px"});
    break;
    case "count_8":
      this.element.style({"background-position": "-112px 0px"});
    break;
    case "mine_red":
      this.element.style({"background-position": "-80px -16px"});
    break;
    case "mine_x":
      this.element.style({"background-position": "-64px -16px"});
    break;
    case "mine":
      this.element.style({"background-position": "-32px -16px"});
    break;
  }
}
minesweeper.tile.prototype.get_state = function() {
  return this.state;
}

minesweeper.tile.prototype.set_mine_count = function(mine_count) {
  this.mine_count = mine_count;
}
