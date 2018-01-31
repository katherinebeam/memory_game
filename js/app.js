const NUM_OF_CARDS = 16;
const gameBoard = document.querySelector('.game-board');
const restartButton = document.querySelector('.restart');
let moves = document.querySelector('.moves');
const symbols = [
    'diamond',
    'paper-plane-o',
    'anchor', 'bolt',
    'cube', 'leaf',
    'bicycle',
    'bomb',
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb'
];
let openSymbol = '';
let openCards = [];
let cardsToReset = [];
let matchCount = 0;
let starCount = 3;
let moveCount = 0;
let seconds = 0;
let minutes = 0;

document.addEventListener('DOMContentLoaded', buildCards);
document.addEventListener('DOMContentLoaded', timer);
gameBoard.addEventListener('click', showCard);
restartButton.addEventListener('click', restart);

function buildCards() {
    resetBoard();
    shuffle(symbols);
    for(let i = 0; i < NUM_OF_CARDS; i++) {
        const card = document.createElement('li');
        const symbol = document.createElement('i');
        card.classList.add('card');
        symbol.classList.add('fa')
        symbol.classList.add('fa-'+symbols[i]);
        card.appendChild(symbol);
        gameBoard.appendChild(card);
    }
}

function restart() {
    location.reload();
}

function resetBoard() {
    gameBoard.textContent = '';
    moves.textContent = '0';
    matchCount = 0;
}

function resetWrongCards() {
    for(let card of cardsToReset) {
        card.classList.remove('wrong');
    }
}

function resetOpenCards() {
    incrementMoveCounter();
    openSymbol = '';
    openCards = [];
}

function incrementMoveCounter() {
    moveCount++;
    moves.textContent = moveCount;
}

function showCard(e) {
    resetWrongCards();
    const card = e.target;
    card.classList.add('open');
    card.classList.add('show');
    checkForMatch(card);
}

function checkForMatch(card) {
    const symbol = card.querySelector('i').classList[1];  // grabs the card's fa- class (which is used to differentiate the cards)
    openCards.push(card);
    if(openSymbol === '') {
        openSymbol = symbol;
    } else if(openSymbol === symbol) {
        showMatch();
    } else {
        closeCards();
    }
}

function showMatch() {
    matchCount++;
    for(let card of openCards) {
        card.classList.add('match');
    }
    resetOpenCards();
    checkMoveCount();
    checkForWin();
}

function closeCards() {
    for(let card of openCards) {
        card.classList.add('wrong');
        card.classList.remove('open');
        card.classList.remove('show');
    }
    cardsToReset = openCards;
    resetOpenCards();
    checkMoveCount();
}

function checkMoveCount() {
    if(moveCount === 10 || moveCount === 20) {
        // stars should be reduced by 1 when 10 moves are reached, and again when 20 moves are reached
        reduceStars(1);
    }
}

function reduceStars(numToReduce) {
    starCount -= numToReduce;
    let star = document.querySelector('.fa-star');
    star.classList.remove('fa-star');
}

function checkForWin() {
    if(matchCount === NUM_OF_CARDS / 2) {
        buildWinScreen();
    }
}

function buildWinScreen() {
    const container = document.querySelector('.container');
    const checkmark = buildCheckmark();
    const congratsMessage = buildCongratsMessage();
    const statsMessage = buildStatsMessage();
    const playAgainButton = buildPlayAgainButton();
    container.textContent = '';
    container.appendChild(checkmark);
    container.appendChild(congratsMessage);
    container.appendChild(statsMessage);
    container.appendChild(playAgainButton);
}

function buildCheckmark() {
    const checkmark = document.createElement('i');
    checkmark.classList.add('fa');
    checkmark.classList.add('fa-check');
    return checkmark;
}

function buildCongratsMessage() {
    const h1Message = document.createElement('h1');
    h1Message.textContent = 'Congratulations! You Won!';
    h1Message.classList.add('congrats-h1');
    return h1Message;
}

function buildStatsMessage() {
    const statsMessage = document.createElement('p');
    statsMessage.textContent = `In ${minutes} minutes and ${seconds} seconds with ${moveCount} Moves and ${starCount} Stars.`;
    return statsMessage;
}

function buildPlayAgainButton() {
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.classList.add('play-again-button');
    playAgainButton.addEventListener('click', restart);
    return playAgainButton;
}

function timer() {
    let interval = setInterval(function() {
        updateTime();
    }, 1000);
}

function updateTime() {
    let displaySeconds = formatTime(seconds);
    let displayMinutes = formatTime(minutes);
    const timer = document.querySelector('.timer');
    if(matchCount < NUM_OF_CARDS / 2) {
        if(seconds < 59) {
            seconds++;
        } else {
            minutes++;
            seconds = 0;
        }
        displaySeconds = formatTime(seconds);
        displayMinutes = formatTime(minutes);
        timer.textContent = `${displayMinutes}:${displaySeconds}`;
    }
}

function formatTime(time) {
    let displayTime = '';
    time < 10 ? displayTime = '0' + time : displayTime = time;
    return displayTime;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}