var Game = {
    gameType: "",
    playerNumber: "",
    board: [
        ["_", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"]
    ],
    currentTurn: "X",
    filled: 0
}



console.log("HI");
document.getElementById("gameType").addEventListener("change", (Event) => {
    console.log(Event.target.value);
    console.log("HI");
    if (Event.target.value == '1') {
        document.getElementById("playerNumber").classList.remove("hidden");
        document.getElementById("labelPlayerNumber").classList.remove("hidden");
    } else {
        document.getElementById("playerNumber").classList.add("hidden");
        document.getElementById("labelPlayerNumber").classList.add("hidden");
    }
});
document.getElementById("playButton").addEventListener("click", () => {
    document.getElementById("board").classList.remove("hidden");
    document.getElementById("inputTable").classList.add("hidden");
    Game.gameType = document.getElementById("gameType").value;
    Game.playerNumber = document.getElementById("playerNumber").value;
    resetGame();
    if (Game.gameType == 1 && Game.playerNumber == 2) {
        makeComputerMove();
    }
});
document.getElementById("new-game").addEventListener("click", () => {
    document.getElementById("board").classList.add("hidden");
    document.getElementById("inputTable").classList.remove("hidden");
    document.getElementById("gameType").value = "2";
    document.getElementById("result").classList.add("hidden");
    document.getElementById("playerNumber").classList.add("hidden");
    document.getElementById("labelPlayerNumber").classList.add("hidden");

})

function resetGame() {
    resetBoard();
    removeAllListeners();
    removeAllClass();
    addAllEventListeners();
}

function resetBoard() {
    for (let i = 0; i < this.Game.board.length; i++) {
        for (let j = 0; j < this.Game.board[i].length; j++) {
            this.Game.board[i][j] = "_";
        }
    }
    // console.log(document.getElementsByClassName("grid-item"));
    [...document.getElementsByClassName("grid-item")].forEach(element => {
        element.innerHTML = "";
    });
    Game.currentTurn = "X";
    Game.filled = 0;
}

function removeAllListeners() {
    [...document.getElementsByClassName("grid-item")].forEach(element => {
        element.removeEventListener("click", () => {});
    });
}

function addAllEventListeners() {
    [...document.getElementsByClassName("grid-item")].forEach(element => {
        element.addEventListener("click", handleClick, { once: true });
    });
}

function removeAllClass() {
    [...document.getElementsByClassName("grid-item")].forEach(element => {
        element.classList.remove("filled");
    });
}

function handleClick(E) {
    console.log(E);
    const cell = E.target;
    cell.classList.add("filled");
    const currentTurn = Game.currentTurn;
    const nextTurn = currentTurn == "X" ? "O" : "X";
    cell.innerHTML = currentTurn;
    console.log(cell.id);
    Game.board[parseInt(cell.id / 3)][parseInt(cell.id % 3)] = currentTurn;
    Game.filled = Game.filled + 1;
    console.log(Game.board);
    console.log(Game.gameType);

    if (checkWinner(parseInt(cell.id))) {
        gameOver(false);
    } else if (Game.filled == 9) {
        gameOver(true);
    } else {
        Game.currentTurn = nextTurn;
        if (Game.gameType == "1" && ((Game.playerNumber == '1' && nextTurn == "O") || (Game.playerNumber == '2' && nextTurn == "X"))) {
            makeComputerMove();
        }
    }
}

function checkWinner(pos) {
    let i = parseInt(pos / 3);
    let j = pos % 3;
    let flag = 0;
    for (let i1 = 0; i1 < 3; i1++) {
        if (!(Game.board[i1][j] == Game.currentTurn)) {
            flag = 1;
            break;
        }
    }
    if (flag == 0) {
        return true;
    }
    flag = 0;
    for (let i1 = 0; i1 < 3; i1++) {
        if (!(Game.board[i][i1] == Game.currentTurn)) {
            flag = 1;
            break;
        }
    }
    if (flag == 0) {
        return true;
    }

    if (i == j) {
        flag = 0;
        for (let i1 = 0; i1 < 3; i1++) {
            if (!(Game.board[i1][i1] == Game.currentTurn)) {
                flag = 1;
            }
        }
    }
    if (flag == 0) {
        return true;
    }
    if (i + j == 2) {
        flag = 0;
        if (!(Game.board[2][0] == Game.currentTurn && Game.board[1][1] == Game.currentTurn && Game.board[0][2] == Game.currentTurn)) {
            flag = 1;
        }
    }
    if (flag == 0) {
        return true;
    }
    return false;
}

function gameOver(draw) {
    let message = "";
    if (!draw) {
        if (Game.gameType == 1) {
            if ((Game.currentTurn == "X" && Game.playerNumber == "1") || (Game.currentTurn == "O" && Game.playerNumber == "2")) {
                message = "You have won!!!!!";
            } else {
                message = "Computer won!!!!!";
            }
        } else {
            message = Game.currentTurn + " won";
        }
    } else {
        message = "Match Drawn";
    }
    document.getElementById("winning-message").innerHTML = message;
    document.getElementById("result").classList.remove("hidden");

}

function makeComputerMove() {
    let i, j, i1, j1, curr, ans = Game.playerNumber == "1" ? 1000 : -1000;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (Game.board[i][j] == "_") {
                Game.board[i][j] = Game.playerNumber == "1" ? "O" : "X";
                curr = _minimax(1, Game.playerNumber == "1" ? true : false);
                if (Game.playerNumber == "1") {
                    if (curr < ans) {
                        i1 = i;
                        j1 = j;
                        ans = curr;
                    }
                } else {
                    if (curr > ans) {
                        i1 = i;
                        j1 = j;
                        ans = curr;
                    }
                }
                Game.board[i][j] = "_";
            }
        }
    }

    document.getElementById("" + (i1 * 3 + j1)).dispatchEvent(new Event("click"));
}



function _hasSomeoneWon(currentPlayer) {
    let i, j, flag1, flag2;
    // return 10;
    for (i = 0; i < 3; i++) {
        flag1 = 1;
        flag2 = 1;
        for (j = 0; j < 3; j++) {
            if (Game.board[i][j] != 'X') {
                flag1 = 0;
            }
            if (Game.board[i][j] != 'O') {
                flag2 = 0;
            }
        }
        if (flag1 == 1) {
            return 10;
        }
        if (flag2 == 1) {
            return -10;
        }
    }
    for (i = 0; i < 3; i++) {
        flag1 = 1;
        flag2 = 1;
        for (j = 0; j < 3; j++) {
            if (Game.board[j][i] != 'X') {
                flag1 = 0;
            }
            if (Game.board[j][i] != 'O') {
                flag2 = 0;
            }
        }
        if (flag1 == 1) {
            return 10;
        }
        if (flag2 == 1) {
            return -10;
        }
    }

    for (i = 0; i < 3; i++) {
        flag1 = 1;
        flag2 = 1;
        for (j = 0; j < 3; j++) {
            if (Game.board[j][i] != 'X') {
                flag1 = 0;
            }
            if (Game.board[j][i] != 'O') {
                flag2 = 0;
            }
        }
        if (flag1 == 1) {
            return 10;
        }
        if (flag2 == 1) {
            return -10;
        }
    }
    flag1 = 1;
    flag2 = 1;
    let flag3 = 1,
        flag4 = 1;

    for (i = 0; i < 3; i++) {
        if (Game.board[i][i] != 'X') {
            flag1 = 0;
        }
        if (Game.board[i][2 - i] != 'X') {
            flag3 = 0;
        }
        if (Game.board[i][i] != 'O') {
            flag2 = 0;
        }
        if (Game.board[i][2 - i] != 'O') {
            flag4 = 0;
        }
    }
    if (flag1 == 1 || flag3 == 1) {
        return 10;
    }
    if (flag2 == 1 || flag4 == 1) {
        return -10;
    }

    return 0;

}

function _isMoveAvailable() {
    let ans = false;
    let i, j;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (Game.board[i][j] == "_") {
                return true;
            }
        }
    }
    return false;
}


function _minimax(depth, currentPlayer) {
    let score = _hasSomeoneWon(!currentPlayer);
    if (score != 0) {
        return score;
    }
    if (!_isMoveAvailable()) {
        return 0;
    }
    let i, j, ans = currentPlayer ? -1000 : 1000,
        curr;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (Game.board[i][j] == "_") {
                Game.board[i][j] = currentPlayer ? "X" : "O";
                curr = _minimax(depth + 1, !currentPlayer);
                if (currentPlayer) {
                    ans = Math.max(curr, ans);
                } else {
                    ans = Math.min(curr, ans);
                }
                Game.board[i][j] = "_";
            }
        }
    }
    return ans;
}