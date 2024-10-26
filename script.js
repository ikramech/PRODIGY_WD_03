const grid = document.getElementById('grid');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const restartButton = document.getElementById('restartButton');

let playerScore = 0;
let computerScore = 0;
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false; // Track if the game is over

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Event listener for each cell
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const cellIndex = cell.getAttribute('data-cell-index');
        // Allow move only if the cell is empty and the game is not over
        if (board[cellIndex] === '' && !isGameOver) {
            makeMove(cellIndex, 'X'); // Player's move
            if (!isGameOver) {
                computerMove(); // Computer's turn
            }
        }
    });
});

function makeMove(index, player) {
    board[index] = player; // Update the board
    cells[index].innerText = player; // Update the cell display
    cells[index].classList.add(player === 'X' ? 'player-x' : 'player-o'); // Add class based on player

    // Check for a winner after the move
    if (checkWinner(player)) {
        isGameOver = true; // Mark the game as over
    } else if (!board.includes('')) {
        showMessage("It's a Tie!"); // Check for a tie
        isGameOver = true; // Mark the game as over
    }
}

function computerMove() {
    // Check for a winning move
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') {
            makeMove(c, 'O');
            return;
        }
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') {
            makeMove(b, 'O');
            return;
        }
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') {
            makeMove(a, 'O');
            return;
        }
    }

    // Block player's winning move
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
            makeMove(c, 'O');
            return;
        }
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') {
            makeMove(b, 'O');
            return;
        }
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') {
            makeMove(a, 'O');
            return;
        }
    }

    // Choose a random empty cell if no immediate win or block
    const emptyCells = board.map((cell, index) => (cell === '') ? index : null).filter(index => index !== null);
    if (emptyCells.length === 0) return; 
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomIndex, 'O'); 
}

function checkWinner(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            showMessage(player === 'X' ? 'Player Wins!' : 'Computer Wins!');
            updateScore(player); 
            
            // Ajouter la classe pour animer les cellules gagnantes
            highlightWinningCells([a, b, c]);
            
            return true;
        }
    }
    return false;
}

// Fonction pour ajouter la classe d'animation
function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('winning-cell');
    });

    // Vérifie si le gain est vertical, horizontal ou diagonal
    if (indices[0] % 3 === indices[1] % 3) { // Vertical
        indices.forEach(index => {
            cells[index].classList.add('vertical-line');
        });
    } else if (Math.floor(indices[0] / 3) === Math.floor(indices[1] / 3)) { // Horizontal
        indices.forEach(index => {
            cells[index].classList.add('horizontal-line');
        });
    } else if (indices[0] === 0 && indices[1] === 4 && indices[2] === 8) { // Diagonale 1-5-9
        indices.forEach(index => {
            cells[index].classList.add('diagonal-line1');
        });
    } else if (indices[0] === 2 && indices[1] === 4 && indices[2] === 6) { // Diagonale 3-5-7
        indices.forEach(index => {
            cells[index].classList.add('diagonal-line2');
        });
    }
}

function showMessage(msg) {
    message.innerText = msg; 
    message.style.display = 'block'; // Show the message
}

function updateScore(winner) {
    if (winner === 'X') {
        playerScore++; // Increment player's score
        playerScoreDisplay.innerText = playerScore; 
    } else if (winner === 'O') {
        computerScore++; // Inc
        computerScoreDisplay.innerText = computerScore; 
    }
}

restartButton.addEventListener('click', restartGame);

function restartGame() {
    board = ['', '', '', '', '', '', '', '', '']; 
    cells.forEach(cell => {
        cell.innerText = ''; 
        cell.classList.remove('winning-cell', 'horizontal-line', 'vertical-line', 'diagonal-line1', 'diagonal-line2', 'player-x', 'player-o'); // Remove classes
    });
    message.style.display = 'none'; 
    isGameOver = false; 
    currentPlayer = 'X'; 
}

// Optional: Add keyboard support for restarting the game
document.addEventListener('keypress', (e) => {
    if (e.key === 'r') {
        restartGame();
    }
});
