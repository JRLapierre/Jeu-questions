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

//function that will execute themselves
document.addEventListener('DOMContentLoaded', function() {
    createTimer()
});

document.addEventListener('play-event', play);
document.addEventListener('pause-event', pause);
document.addEventListener('reset-event', reset);
document.addEventListener('right-answer-event', rightAnswer);
document.addEventListener('wrong-answer-event', wrongAnswer);

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
        document.querySelector('x-overlay').setResetEvent();
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
}

function play() {
    if (!intervalId) intervalId = setInterval(drainLiquid, intervalTimeMilis);
}

function pause() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = 0;
    const timerbox = document.getElementById('timerbox'+boxNumber);
    document.querySelector('x-overlay').putLeft(timerbox.isLeftSide());
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
}