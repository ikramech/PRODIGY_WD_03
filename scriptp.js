const grid = document.getElementById('grid');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const playerXScoreDisplay = document.getElementById('playerXScore');
const playerOScoreDisplay = document.getElementById('playerOScore');
const restartButton = document.getElementById('restartButton');

let playerXScore = 0;
let playerOScore = 0;
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false; // Track if the game is over
let currentPlayer = 'X'; // Track current player

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
            makeMove(cellIndex, currentPlayer); // Player's move
            // Check for a winner after the move
            if (!isGameOver) {
                // Switch player
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    });
});

function makeMove(index, player) {
    board[index] = player; // Update the board
    cells[index].innerText = player; // Update the cell display

    // Add class and color based on the player
    if (player === 'X') {
        cells[index].classList.add('player-x'); // Apply style for 'X'
        cells[index].style.color = '#56599d'; // Set color for player X
    } else {
        cells[index].classList.add('player-o'); // Apply style for 'O'
        cells[index].style.color = '#fd58b3'; // Set color for player O
    }

    // Check for a winner after the move
    if (checkWinner(player)) {
        isGameOver = true; 
    } else if (!board.includes('')) {
        showMessage("It's a Tie!"); 
        isGameOver = true; 
    }
}

function checkWinner(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            showMessage(`${player} Wins!`);
            updateScore(player); // Update score based on winner
            highlightWinningCells([a, b, c]); 
            return true;
        }
    }
    return false;
}

function showMessage(msg) {
    message.innerText = msg; // Display the message
    message.style.display = 'block'; // Show the message
}

function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++; 
        playerXScoreDisplay.innerText = playerXScore;
    } else if (winner === 'O') {
        playerOScore++;
        playerOScoreDisplay.innerText = playerOScore; 
}
}

function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('winning-cell');
    });

    // Add animation for winning lines
    if (indices[0] % 3 === indices[1] % 3) { // Vertical
        indices.forEach(index => {
            cells[index].classList.add('vertical-line');
        });
    } else if (Math.floor(indices[0] / 3) === Math.floor(indices[1] / 3)) { // Horizontal
        indices.forEach(index => {
            cells[index].classList.add('horizontal-line');
        });
    } else if (indices[0] === 0 && indices[1] === 4 && indices[2] === 8) { // Diagonal 1-5-9
        indices.forEach(index => {
            cells[index].classList.add('diagonal-line1');
        });
    } else if (indices[0] === 2 && indices[1] === 4 && indices[2] === 6) { // Diagonal 3-5-7
        indices.forEach(index => {
            cells[index].classList.add('diagonal-line2');
        });
    }
}

restartButton.addEventListener('click', restartGame);

function restartGame() {
    board = ['', '', '', '', '', '', '', '', '']; 

    cells.forEach(cell => {
        cell.innerText = ''; // Clear the cell display
        cell.classList.remove('winning-cell'); 
        cell.classList.remove('horizontal-line'); 
        cell.classList.remove('vertical-line'); 
        cell.classList.remove('diagonal-line1'); 
        cell.classList.remove('diagonal-line2'); 
        cell.style.color = '';
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
