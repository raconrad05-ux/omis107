const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const winsXEl = document.getElementById('wins-x');
const winsOEl = document.getElementById('wins-o');
const drawsEl = document.getElementById('draws');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');

let board;
let currentPlayer;
let gameOver;
let startingPlayer = 'X';
const scores = { X: 0, O: 0, draws: 0 };

// Build the 9 cells once; game state drives their contents.
const cells = Array.from({ length: 9 }, (_, i) => {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'cell';
  cell.dataset.index = i;
  cell.addEventListener('click', () => handleMove(i));
  boardEl.appendChild(cell);
  return cell;
});

function findWinner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}

function handleMove(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const winner = findWinner();

  if (winner) {
    gameOver = true;
    scores[winner.player]++;
    winner.line.forEach(i => cells[i].classList.add('win'));
    setStatus(`Player ${winner.player} wins!`);
  } else if (board.every(Boolean)) {
    gameOver = true;
    scores.draws++;
    setStatus("It's a draw!");
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(`Player ${currentPlayer}'s turn`);
  }

  render();
}

function setStatus(text) {
  statusEl.textContent = text;
}

function render() {
  cells.forEach((cell, i) => {
    const value = board[i];
    cell.textContent = value || '';
    cell.classList.toggle('x', value === 'X');
    cell.classList.toggle('o', value === 'O');
    cell.disabled = gameOver || Boolean(value);
    cell.setAttribute('aria-label', `Cell ${i + 1}: ${value || 'empty'}`);
  });

  winsXEl.textContent = scores.X;
  winsOEl.textContent = scores.O;
  drawsEl.textContent = scores.draws;
  scoreXEl.classList.toggle('active', !gameOver && currentPlayer === 'X');
  scoreOEl.classList.toggle('active', !gameOver && currentPlayer === 'O');
}

function newGame() {
  board = Array(9).fill(null);
  currentPlayer = startingPlayer;
  // Alternate who goes first each game so neither player keeps the advantage.
  startingPlayer = startingPlayer === 'X' ? 'O' : 'X';
  gameOver = false;
  cells.forEach(cell => cell.classList.remove('win'));
  setStatus(`Player ${currentPlayer}'s turn`);
  render();
}

document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('reset-scores').addEventListener('click', () => {
  scores.X = scores.O = scores.draws = 0;
  render();
});

newGame();
