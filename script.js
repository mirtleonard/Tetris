var board = new Array(20), forms = new Array(15), currentForm, gameOver, set = 0, score, highScore = 0;

forms[0] = {
      rotate: true,
      colour : "red",
      form : [[0, 1, 0],
              [1, 1, 1],
              [0, 0, 0]]
};

forms[1] = {
      rotate: true,
      colour : "blue",
      form : [[0, 1, 0],
              [0, 1, 0],
              [0, 1, 0]]
};

forms[2] = {
      rotate: false,
      colour : "yellow",
      form : [[0, 0, 0],
              [1, 1, 0],
              [1, 1, 0]]
};

forms[3] = {
      rotate: true,
      colour : "cyan",
      form : [[0, 0, 0],
              [1, 1, 0],
              [0, 1, 1]]
};

forms[4] = {
      rotate: true,
      colour : "pink",
      form : [[0, 1, 0],
              [0, 1, 0],
              [0, 1, 1]]
};

function startGame() {
  score = 0;
  gameOver = 0;
  createBoard();
  updateScore();
  generateForm();
  if (set == 0) {
    set = 1;
    setInterval(move, 1000);
  }
}

function move() {
  if (gameOver)
    return;
  if (!valid(currentForm.coords.line + 1, currentForm.coords.column)) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (verify(i + currentForm.coords.line, currentForm.coords.column + j) && currentForm.form[i][j] == 1) {
          board[currentForm.coords.line + i][currentForm.coords.column + j] = 1;
          if (currentForm.coords.line == 1) {
            gameOver = 1;
            $('#lose').modal();
            return;
          }
        }
      }
    }
    gainPoints();
    generateForm();
  }
  update(1, 0);
}

function verify(line, column) {
    return line >= 0 && line <= 19 && column >= 0 && column < 11;
}

function valid(line, column) {
  for (i = line; i < line + 3; i++) {
    for (j = column; j < column + 3; j++) {
      if (verify(i, j)) {
        if (board[i][j] == 1 && currentForm.form[i - line][j - column] == 1) {
          return false;
        }
      } else if (currentForm.form[i - line][j - column] == 1) {
        return false;
      }
    }
  }
  return true;
}

function clear(line, column) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (currentForm.form[i][j] == 1 && verify(i + line, column + j)) {
        $("#l" +  (line + i) + 'c' + (column + j)).attr(
          'style', 'background-color: Teal');
      }
    }
  }
}

function update(nextLine, nextColumn) {
  column = currentForm.coords.column;
  line = currentForm.coords.line;
  clear(line, column);
  line += nextLine;
  column += nextColumn;
  currentForm.coords.line += nextLine;
  currentForm.coords.column += nextColumn;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (currentForm.form[i][j] == 1 && verify(i + line, column + j)) {
        $("#l" +  (line + i) + 'c' + (column + j)).attr(
          'style', 'background-color: ' + currentForm.colour);
      }
    }
  }
}

function createBoard() {
  $("#board").empty();
  for (var i = 2; i < 19; i++) {
    var line = $('<div>').attr({
      id : i,
      class : "d-flex justify-content-center",
    });
    board[i] = new Array(11);
    $("#board").append(line);
    for (var j = 0; j < 11; j++) {
      var cell = $('<div>').attr({
        id : ('l' + i + 'c' + j),
        class : "cell",
      });
      $("#" + i).append(cell);
      board[i][j] = 0
    }
  }
  for (var i = 0; i < 2; i++) {
    board[i] = new Array(11);
    for (var j = 0; j < 11; j++) {
        board[i][j] = 0;
    }
  }
  board[19] = new Array(11);
  for (var j = 0; j < 11; j++) {
    board[19][j] = 1;
  }
}

function generateForm() {
  currentForm = {...forms[Math.floor(Math.random() * 5)]};
  currentForm['coords'] = {column : 4, line: 0}
}

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

  function gainPoints() {
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

function updateScore() {
  if (score > highScore) {
    highScore = score;
  }
  $("#score").html("Score: " + score + "<br/>" + "HighScore: " + highScore);
}

  function rotate() {
    if (!currentForm.rotate) {
      return;
    }
    rotated = [[0,0,0],[0,0,0],[0,0,0]]
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        rotated[j][i] = currentForm.form[2 - i][j];
      }
    }
    copy = currentForm.form;
    currentForm.form = rotated;
    if (valid(currentForm.coords.line, currentForm.coords.column)) {
      currentForm.form = copy;
      clear(currentForm.coords.line, currentForm.coords.column);
      currentForm.form = rotated;
      update(0, 0);
    } else {
      currentForm.form = copy;
    }
  }

  $(document).on("keydown", function (where) {
    if (where.which == 37) {
      if (valid(currentForm.coords.line, currentForm.coords.column - 1)) {
        update(0, -1);
      }
    } else if (where.which == 38 ) {
      rotate();
    } else if (where.which == 39 ) {
      if (valid(currentForm.coords.line, currentForm.coords.column + 1)) {
        update(0, 1);
      }
    } else if (where.which == 40 ) {
      if (valid(currentForm.coords.line + 1, currentForm.coords.column)) {
        update(1, 0);
      }
    }
  });
