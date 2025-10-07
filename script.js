//settings
const nbBoxes = 4;
const totalTimeSeconds = 20;
const nbQuestions = 15;

//calculated constants
const intervalTimeMilis = (totalTimeSeconds / (nbBoxes * 100)) * 1000

//global variables
let boxNumber;
let intervalId;
let currentQuestion = 0;
let overlay;
//function that will execute themselves

document.addEventListener('DOMContentLoaded', function() {
    overlay = document.querySelector('x-overlay');

    overlay.addEventListener('overlay-play', play);//TODO I dont understand how this works yet
    overlay.addEventListener('overlay-right-answer', rightAnswer);
    overlay.addEventListener('overlay-wrong-answer', wrongAnswer);
    overlay.show();
    createTimer()
});

//-----------------------------------------------------
//initialisation

function createTimer() {
    const container = document.getElementById("timer");
    for (let i = 1; i <= nbBoxes; i++) {
        const box = document.createElement('timer-box');
        box.id = 'timerbox'+i;
        box.setAttribute('value', nbBoxes - i + 1);
        container.appendChild(box);
    }
    reset()
}

//-----------------------------------------------------
//timer

// Function to decrease the height of the colored area
function drainLiquid() {
    box = document.getElementById('timerbox'+boxNumber);
    // Reduce height by a small percentage
    if (!box.isEmpty()) { 
        box.drain1();
    }
    else if (boxNumber < nbBoxes) {
        boxNumber += 1;
    }
    else {
        clearInterval(intervalId)
        intervalId = 0;
        overlay.show();
        resetEvents();
        setTimeout(() => {
            overlay.addEventListener('click', reset);
        });
    }
}

function reset() {
    currentQuestion += 1;
    if (intervalId) clearInterval(intervalId);
    for (let i = 1; i <= nbBoxes; i++) {
        const box = document.getElementById('timerbox'+i)
        box.resetHeight();
        box.setSide((currentQuestion + i) % 2 == 0);
    }
    boxNumber = 1;
    overlay.show();
    resetEvents();
    setTimeout(() => {
        overlay.addEventListener('click', play);
    });
}

function play() {
    if (!intervalId) intervalId = setInterval(drainLiquid, intervalTimeMilis);
    overlay.hide();
    resetEvents();
    setTimeout(() => {
        overlay.addEventListener('click', pause);
    });
}

function pause() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = 0;
    overlay.show();
    resetEvents();
    const timerbox = document.getElementById('timerbox'+boxNumber);
    overlay.putLeft(timerbox.isLeftSide());
    overlay.showChoice();
    setTimeout(() => {
        document.getElementById("leftOverlay").addEventListener('click', rightAnswer);
        document.getElementById("rightOverlay").addEventListener('click', wrongAnswer);
    });
}

function resetEvents() {
    overlay.hideChoice();
    document.getElementById("leftOverlay").removeEventListener('click', rightAnswer)
    document.getElementById("rightOverlay").removeEventListener('click', wrongAnswer)
    overlay.removeEventListener('click', reset);
    overlay.removeEventListener('click', pause);
    overlay.removeEventListener('click', play);
}

//--------------------------------------------------------------
//answering questions

function rightAnswer() {
    //give the points to the team
    const box = document.getElementById("timerbox"+boxNumber)
    const newPoints = box.value;
    const teamId = box.isLeftSide() ? "team1score" : "team2score";
    const spanElement = document.getElementById(teamId);
    spanElement.textContent = parseInt(spanElement.textContent) + parseInt(newPoints);
    //reset
    reset();
}

function wrongAnswer() {
    //shift the current case
    document.getElementById('timerbox'+boxNumber).shiftSide();
    //continuer
    play();
}