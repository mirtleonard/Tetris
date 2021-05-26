var board = new Array(20), shapes = new Array(15), shape, gameOver, set = 0, score, highScore = 0;

// game shapes
shapes[0] = {
      rotate: true,
      colour : "red",
      grid : [[0, 1, 0],
              [1, 1, 1],
              [0, 0, 0]]
};

shapes[1] = {
      rotate: true,
      colour : "blue",
      grid : [[0, 1, 0],
              [0, 1, 0],
              [0, 1, 0]]
};

shapes[2] = {
      rotate: false,
      colour : "yellow",
      grid : [[0, 0, 0],
              [1, 1, 0],
              [1, 1, 0]]
};

shapes[3] = {
      rotate: true,
      colour : "cyan",
      grid : [[0, 0, 0],
              [1, 1, 0],
              [0, 1, 1]]
};

shapes[4] = {
      rotate: true,
      colour : "pink",
      grid : [[0, 1, 0],
              [0, 1, 0],
              [0, 1, 1]]
};

// from here game begins
function startGame() {
  score = 0;
  gameOver = false;
  createBoard();
  updateScore();
  generateShape();
  if (set == 0) {
    set = 1;
    setInterval(nextState, 200);
  }
}

// a grid with 19 lines and 11 columns
function createBoard() {
  $("#board").empty();
  for (var i = 0; i < 19; i++) {
    var line = $('<div>').attr({
      id : i,
      class : "d-flex justify-content-center",
    });
    board[i] = new Array(11);
    if (i >= 2) {
      $("#board").append(line);
    }
    for (var j = 0; j < 11; j++) {
      var cell = $('<div>').attr({
        id : ('l' + i + 'c' + j),
        class : "cell",
      });
      if (i >= 2) {
        $("#" + i).append(cell);
      }
      board[i][j] = 0
    }
  }
  board[19] = new Array(11);
  for (var j = 0; j < 11; j++) {
    board[19][j] = 1;
  }
}

// the shape is randomly generated
function generateShape() {
  shape = {...shapes[Math.floor(Math.random() * 5)]};
  shape['line'] = 0;
  shape['column'] = 4;
}

// is verifying the state of the Game and update it
function nextState() {
  if (gameOver)
    return;
  if (!valid(shape.line + 1, shape.column)) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (outOfGrid(i + shape.line, shape.column + j) && shape.grid[i][j] == 1) {
          board[shape.line + i][shape.column + j] = 1;
          if (shape.line == 1) {
            gameOver = true;
            $('#lose').modal();
            return;
          }
        }
      }
    }
    checkLines();
    generateShape();
  }
  update(1, 0);
}

// update current position
function update(nextLine, nextColumn) {
  clear(shape.line, shape.column);
  shape.line += nextLine;
  shape.column += nextColumn;
  for (var i = shape.line; i < shape.line + 3; i++) {
    for (var j = shape.column; j < shape.column + 3; j++) {
      if (shape.grid[i - shape.line][j - shape.column] == 1 && outOfGrid(i, j)) {
        $("#l" +  (i) + 'c' + (j)).attr(
          'style', 'background-color: ' + shape.colour);
      }
    }
  }
}

// remove old position
function clear(line, column) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (shape.grid[i][j] == 1 && outOfGrid(i + line, column + j)) {
        $("#l" +  (line + i) + 'c' + (column + j)).attr(
          'style', 'background-color: Teal');
      }
    }
  }
}

// verify if the line and column aren't out of the grid
function outOfGrid(line, column) {
    return line >= 0 && line <= 19 && column >= 0 && column < 11;
}

// this function returns if the next action is valid
function valid(line, column) {
  for (i = line; i < line + 3; i++) {
    for (j = column; j < column + 3; j++) {
      if (outOfGrid(i, j)) {
        if (board[i][j] == 1 && shape.grid[i - line][j - column] == 1) {
          return false;
        }
      } else if (shape.grid[i - line][j - column] == 1) {
        return false;
      }
    }
  }
  return true;
}

function checkLines() {
  for (var i = 18; i > 0; i--) {
    var checked = 1;
    for (var j = 0; j < 11; j++) {
      if (board[i][j] != 1)
      checked = 0;
    }
    if (checked) {
      clearBoard(i);
      score += 500;
      updateScore();
      i++;
    }
  }
}

// clears full lines
function clearBoard(line) {
  while (line > 0) {
    for (j = 0; j < 11; j++) {
      board[line][j] = board[line - 1][j];
      $('#l' +  (line) + 'c' + j).attr(
      'style', 'background-color: ' + $('#l' + (line - 1) + 'c' + j).css("background-color"));
    }
    line--;
  }
}

// updates score and make it appear on screen
function updateScore() {
  if (score > highScore) {
    highScore = score;
  }
  $("#score").html("Score: " + score + "<br/>" + "HighScore: " + highScore);
}

// this function rotates the shape if the move is valid
function rotate() {
  if (!shape.rotate) {
    return;
  }
  rotated = [[0,0,0],[0,0,0],[0,0,0]]
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      rotated[j][i] = shape.grid[2 - i][j];
    }
  }
  copy = shape.grid;
  shape.grid = rotated;
  if (valid(shape.line, shape.column)) {
    shape.grid = copy;
    clear(shape.line, shape.column);
    shape.grid = rotated;
    update(0, 0);
  } else {
    shape.grid = copy;
  }
}

// event listener that detects which key is pressed
$(document).on("keydown", function (where) {
  if (where.which == 37) {
    if (valid(shape.line, shape.column - 1)) {
      update(0, -1);
    }
  } else if (where.which == 38 ) {
    rotate();
  } else if (where.which == 39 ) {
    if (valid(shape.line, shape.column + 1)) {
      update(0, 1);
    }
  } else if (where.which == 40 ) {
    if (valid(shape.line + 1, shape.column)) {
      update(1, 0);
    }
  }
});
