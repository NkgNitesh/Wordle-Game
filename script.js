
let wordToGuess = "";
let currentRow = 0;
let currentCol = 0;
const maxRows = 5;
let gameOver = false;
const hintUsed = false;

const grid = document.getElementById('grid');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const hintButton = document.getElementById('hint-button');

// Generate grid (5x5)
for (let i = 0; i < 25; i++) {
    let tile = document.createElement('div');
    grid.appendChild(tile);
}

// Generate keyboard
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
keys.forEach(key => {
    let btn = document.createElement('button');
    btn.textContent = key;
    btn.id = `key-${key}`;
    btn.onclick = () => handleKeyPress(key);
    keyboard.appendChild(btn);
});

function handleKeyPress(key) {
    if (!gameOver && currentCol < 5 && currentRow < maxRows) {
        let tile = grid.children[currentRow * 5 + currentCol];
        tile.textContent = key;
        currentCol++;
    }
}

function handleBackspace() {
    if (!gameOver && currentCol > 0) {
        currentCol--;
        let tile = grid.children[currentRow * 5 + currentCol];
        tile.textContent = "";
    }
}

function updateKeyboard(key, color) {
    let btn = document.getElementById(`key-${key}`);
    if (btn && btn.style.backgroundColor !== 'green') {
        btn.style.backgroundColor = color;
    }
}

function checkWord() {
    let guessedWord = '';
    for (let i = 0; i < 5; i++) {
        guessedWord += grid.children[currentRow * 5 + i].textContent;
    }

    for (let i = 0; i < 5; i++) {
        let tile = grid.children[currentRow * 5 + i];
        let letter = guessedWord[i];
        if (letter === wordToGuess[i]) {
            tile.classList.add('correct');
            updateKeyboard(letter, 'green');
        } else if (wordToGuess.includes(letter)) {
            tile.classList.add('present');
            updateKeyboard(letter, 'yellow');
        } else {
            tile.classList.add('absent');
            updateKeyboard(letter, 'gray');
        }
    }

    currentRow++;
    currentCol = 0;

    if (guessedWord === wordToGuess) {
        message.textContent = "Congratulations! You guessed the word!";
        gameOver = true;
    } else if (currentRow === maxRows) {
        message.textContent = `Game over! The correct word was: ${wordToGuess}`;
        gameOver = true;
    }
}

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();

    if (!gameOver && /^[A-Z]$/.test(key)) {
        handleKeyPress(key);
    } else if (!gameOver && e.key === 'Enter' && currentCol === 5) {
        checkWord();
    } else if (e.key === 'Backspace') {
        handleBackspace();
    }
});

// Hint functionality
hintButton.addEventListener('click', () => {
    if (!hintUsed && !gameOver) {
        message.textContent = `Hint: One letter is "${wordToGuess.charAt(Math.floor(Math.random() * 5))}"`;
    }
});

// Fetch random word from API
function getRandomWord() {
    fetch('https://random-word-api.herokuapp.com/word?number=1&length=5')
        .then(response => response.json())
        .then(data => {
            wordToGuess = data[0].toUpperCase();
            console.log("Word to guess: ", wordToGuess);
        })
        .catch(error => {
            console.error("Error fetching word:", error);
        });
}

getRandomWord();
