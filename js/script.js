document.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.getElementById('status');
    const boardElement = document.getElementById('board');
    const restartButton = document.getElementById('restartBtn');
    const modeButton = document.getElementById('modeBtn');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');

    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = [];
    let victories = { X: 0, O: 0 };
    let boardSize = 3; // default 3x3
    let winLength = 3; // default 3 in fila

    function createBoard(size) {
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-cell-index', i);
            boardElement.appendChild(cell);
        }
    }

    function getCells() {
        return document.querySelectorAll('.cell');
    }

    function startGame(size = 3, win = 3) {
        boardSize = size;
        winLength = win;
        gameActive = true;
        currentPlayer = 'X';
        gameState = Array(size * size).fill('');
        statusDisplay.textContent = messages.playerTurn();
        createBoard(size);
        getCells().forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win', 'draw');
            cell.addEventListener('click', handleCellClick);
        });
    }

    const messages = {
        playerTurn: () => `Turno di ${currentPlayer}`,
        gameWin: () => `Giocatore ${currentPlayer} ha vinto!`,
        gameDraw: () => `Pareggio!`,
    };

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    function handleResultValidation() {
        let roundWon = false;
        let winCombo = [];

        // Controllo orizzontale, verticale e diagonale per winLength di fila
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                // Orizzontale
                if (j <= boardSize - winLength) {
                    let combo = [];
                    for (let k = 0; k < winLength; k++) {
                        combo.push(i * boardSize + (j + k));
                    }
                    if (combo.every(idx => gameState[idx] === currentPlayer)) {
                        roundWon = true;
                        winCombo = combo;
                    }
                }
                // Verticale
                if (i <= boardSize - winLength) {
                    let combo = [];
                    for (let k = 0; k < winLength; k++) {
                        combo.push((i + k) * boardSize + j);
                    }
                    if (combo.every(idx => gameState[idx] === currentPlayer)) {
                        roundWon = true;
                        winCombo = combo;
                    }
                }
                // Diagonale principale
                if (i <= boardSize - winLength && j <= boardSize - winLength) {
                    let combo = [];
                    for (let k = 0; k < winLength; k++) {
                        combo.push((i + k) * boardSize + (j + k));
                    }
                    if (combo.every(idx => gameState[idx] === currentPlayer)) {
                        roundWon = true;
                        winCombo = combo;
                    }
                }
                // Diagonale secondaria
                if (i <= boardSize - winLength && j >= winLength - 1) {
                    let combo = [];
                    for (let k = 0; k < winLength; k++) {
                        combo.push((i + k) * boardSize + (j - k));
                    }
                    if (combo.every(idx => gameState[idx] === currentPlayer)) {
                        roundWon = true;
                        winCombo = combo;
                    }
                }
            }
        }

        if (roundWon) {
            statusDisplay.textContent = messages.gameWin();
            victories[currentPlayer]++;
            updateScores();
            gameActive = false;
            winCombo.forEach(idx => {
                getCells()[idx].classList.add('win');
            });
            showFirework();
            return;
        }

        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = messages.gameDraw();
            gameActive = false;
            getCells().forEach(cell => {
                cell.classList.add('draw');
                setTimeout(() => cell.classList.remove('draw'), 600);
            });
            return;
        }

        handlePlayerChange();
    }

    function updateScores() {
        scoreX.textContent = `X: ${victories.X}`;
        scoreO.textContent = `O: ${victories.O}`;
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = messages.playerTurn();
    }

    function handleRestartGame() {
        startGame(boardSize, winLength);
    }

    function handleModeChange() {
        if (boardSize === 3) {
            startGame(4, 4);
            modeButton.textContent = "Modalità 3x3";
        } else {
            startGame(3, 3);
            modeButton.textContent = "Modalità 4x4";
        }
    }

    function showFirework() {
        const container = document.querySelector('.container');
        const firework = document.createElement('div');
        firework.className = 'firework';
        for (let i = 0; i < 8; i++) {
            const span = document.createElement('span');
            firework.appendChild(span);
        }
        container.appendChild(firework);
        setTimeout(() => firework.remove(), 1300);
    }

    restartButton.addEventListener('click', handleRestartGame);
    modeButton.addEventListener('click', handleModeChange);

    // Avvio iniziale
    startGame(3, 3);
});