//settings
const nbBoxes = 4;
const totalTimeSeconds = 20;
const nbQuestions = 15;

//calculated constants
const intervalTimeMilis = (totalTimeSeconds / (nbBoxes * 100)) * 1000

//global variables
let liquidHeight;
let boxNumber;
let intervalId;
let currentQuestion = 0;
let overlay = document.getElementById("overlay");

//function that will execute themselves
document.addEventListener('DOMContentLoaded', function() {
    overlay = document.getElementById("overlay");
    overlay.addEventListener('click', play);
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    createTimer()
});

//-----------------------------------------------------
//initialisation

function createBox(id) {
    /*`
        <div class="area">
            <div class="shapebox" id="shapebox1" style="right: 0px;">
                <span class="spanBox">4</span>
                <div class="colorbox" id="colorbox1"></div>
            </div>
        </div>
    `*/
    //create from the bottom
    const newColorbox = document.createElement('div');//the color
    newColorbox.className = "colorbox";
    newColorbox.id = "colorbox"+id;
    const newSpanbox = document.createElement('span');//the number
    newSpanbox.className = "spanBox";
    newSpanbox.textContent = (nbBoxes - id) + 1;
    const newShapebox = document.createElement('div');//the box
    newShapebox.className = "shapebox";
    newShapebox.id = "shapebox"+id;
    newShapebox.style = ((currentQuestion + id) % 2 == 0) ? "left:0" : "right:0";
    newShapebox.appendChild(newSpanbox);
    newShapebox.appendChild(newColorbox);
    const newArea = document.createElement('div');//the area
    newArea.className = "area";
    newArea.appendChild(newShapebox);
    return newArea;
}

function createTimer() {
    const container = document.getElementById("timer");
    for (let i = 1; i <= nbBoxes; i++) {
        container.appendChild(createBox(i));
    }
    reset()
}

//-----------------------------------------------------
//timer

// Function to decrease the height of the colored area
function drainLiquid() {
    // Reduce height by a small percentage
    if (liquidHeight > 0) { 
        liquidHeight -= 1; 
        document.getElementById('colorbox'+boxNumber).style.height = liquidHeight + '%';
    }
    else if (boxNumber < nbBoxes) {
        boxNumber += 1;
        liquidHeight = 100;
    }
    else {
        clearInterval(intervalId)
        intervalId = 0;
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
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
        document.getElementById('colorbox'+i).style.height = '100%';
        document.getElementById('shapebox'+i).style = ((currentQuestion + i) % 2 == 0) ? "left:0" : "right:0";
    }
    liquidHeight = 100;
    boxNumber = 1;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    resetEvents();
    setTimeout(() => {
        overlay.addEventListener('click', play);
    });
}

function play() {
    if (!intervalId) intervalId = setInterval(drainLiquid, intervalTimeMilis);
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    resetEvents();
    setTimeout(() => {
        overlay.addEventListener('click', pause);
    });
}

function pause() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = 0;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    resetEvents();
    const shapeBox = document.getElementById('shapebox'+boxNumber);
    const sideOverlay = document.getElementById("sideOverlay");
    sideOverlay.style.left = shapeBox.style.left;
    sideOverlay.style.right = shapeBox.style.right;
    document.getElementById("leftOverlay").innerHTML = '&#10004;';
    document.getElementById("rightOverlay").innerHTML = '&#10060;';
    setTimeout(() => {
        document.getElementById("leftOverlay").addEventListener('click', rightAnswer);
        document.getElementById("rightOverlay").addEventListener('click', wrongAnswer);
    });
}

function resetEvents() {
    document.getElementById("leftOverlay").innerHTML = '';
    document.getElementById("rightOverlay").innerHTML = '';
    document.getElementById("leftOverlay").removeEventListener('click', rightAnswer)
    document.getElementById("rightOverlay").removeEventListener('click', wrongAnswer)
    overlay.removeEventListener('click', reset);
    overlay.removeEventListener('click', pause);
    overlay.removeEventListener('click', play);
}

//---------------------------------------------------------
//shifting cases functions


function shiftBox() {
    const shapeBox = document.getElementById('shapebox'+boxNumber);
    //if the box in on the left
    if (shapeBox.style.left === "") {
        shapeBox.style.left = '0px';
        shapeBox.style.right = "";
    }
    //if the box is on the right
    else {
        shapeBox.style.left = "";
        shapeBox.style.right = '0px';
    }
}

//--------------------------------------------------------------
//answering questions

function rightAnswer() {
    //give the points to the team
    const shapeBox = document.getElementById("shapebox"+boxNumber)
    const newPoints = shapeBox.getElementsByTagName("span")[0].textContent;
    const teamId = shapeBox.style.right === "" ? "team1score" : "team2score";
    const spanElement = document.getElementById(teamId);
    spanElement.textContent = parseInt(spanElement.textContent) + parseInt(newPoints);
    //reset
    reset();
}

function wrongAnswer() {
    //shift the current case
    shiftBox();
    //continuer
    play();
}