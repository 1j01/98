minesweeper.ssd = function(container, starting_value) {
  var div = $.createElement("div").style({
    "width": 39,
    "height": 23,
    "background-image": minesweeper.sprite,
    "background-repeat": "no-repeat",
    "background-position": "-46px -81px",
    "padding": 1, "margin": "auto"
  });
  var table = $.createElement("table").setAttribute({"cellspacing": 0, "cellpadding": 0});
  var tbody = $.createElement("tbody");
  var tr = $.createElement("tr");
  this.ssd_digits = [];
  for(var i = 0; i < 3; i++) {
    var digit = new minesweeper.ssd_digit();
    this.ssd_digits.push(digit);
    var td = $.createElement("td");
    td.appendChild(digit.get_element());
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
  table.appendChild(tbody);
  div.appendChild(table);
  container.appendChild(div);

  this.set_value(starting_value);
}
minesweeper.ssd.prototype.value;
minesweeper.ssd.prototype.set_value = function(value) {
  value = Math.min(value, 999);

  this.ssd_digits[0].set_state("0");
  this.ssd_digits[1].set_state("0");
  this.ssd_digits[2].set_state("0");

  if(value < 0) {
    var value_string = Math.abs(value) + "";
    this.ssd_digits[0].set_state("-");
    this.ssd_digits[1].set_state(value_string[value_string.length-2]);
    this.ssd_digits[2].set_state(value_string[value_string.length-1]);
  }
  else {
    var value_string = value + "";
    if(value_string.length === 1) value_string = "00" + value_string;
    if(value_string.length === 2) value_string = "0" + value_string;
    this.ssd_digits[0].set_state(value_string[0]);
    this.ssd_digits[1].set_state(value_string[1]);
    this.ssd_digits[2].set_state(value_string[2]);
  }

  this.value = value;
}
minesweeper.ssd.prototype.get_value = function() {
  return this.value;
}
minesweeper.ssd.prototype.increment = function() {
  this.set_value(this.value + 1);
}
minesweeper.ssd.prototype.decrement = function() {
  this.set_value(this.value - 1);
}

minesweeper.ssd_digit = function() {}
minesweeper.prototype.element;
minesweeper.ssd_digit.prototype.get_element = function() {
  if(!this.element) {
    this.element = $.createElement("div").style({
      "width": 13,
      "height": 23,
      "background-image": minesweeper.sprite,
      "background-repeat": "no-repeat",
      "background-position": "0px -32px"
    });
  }
  return this.element;
}
minesweeper.ssd_digit.prototype.set_state = function(state) {
  switch(state) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      this.element.style({"background-position": "-" + (state*13) + "px -32px"})
    break;
    case "-":
      this.element.style({"background-position": "-130px -32px"})
    break;
  }
}
