const canvas = document.getElementById('web');
const inpLinesLimit = document.getElementById('inpLinesLimit');
const dotsNumber = 300;
const dotsSpread = 40;
const dotSize = 3;
const dotColor = "white";
const dotMargin = 10;

const lineNumber = 15;
const lineColor = "#f5f5f5";
const branchNumber = 3;
var linesLimit = 7000;

var ctx = canvas.getContext('2d');
var dots = [];
var lines = [];
var attempts = 0;
var maxAttempts = 50;

var isClearOn = true;
var isLinesLimitOn = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function GenerateDots(dotsNumber) {
    for (let i = 0; i < dotsNumber && attempts < maxAttempts; i++) {
        attempts = 0;
        
        let isSpreadEnought = false;
        let randomX;
        let randomY;


        do {
        randomX = Math.floor(Math.random() * ((canvas.width - dotMargin) - dotMargin + 1) + dotMargin);
        randomY = Math.floor(Math.random() * ((canvas.height - dotMargin) - dotMargin + 1) + dotMargin);

        isSpreadEnought = CheckDotSpread(randomX, randomY);
        attempts++;

        if (attempts > maxAttempts)
            break;
        
        } while (!isSpreadEnought);
        let pos = [randomX, randomY];
        dots.push(pos);
    }
    DrawDots();
    SetupEasterEggButtons();
}

function CheckDotSpread(x, y) {
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        let x1 = dot[0];
        let y1 = dot[1];

        if (x1 - dotsSpread < x && x < x1 + dotsSpread && y1 - dotsSpread < y && y < y1 + dotsSpread) {
            return false;
        }
    }
    return true;
}

function DrawDots(){
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        DrawDot(dot[0], dot[1]);
    }
}

function DrawDot(x, y) {
    ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
    ctx.fillStyle = dotColor;
    ctx.fill();
}


function GetNearestDots(x, y, count) {
    let distances = [];
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        let x1 = dot[0];
        let y1 = dot[1];
        let distance = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
        distances.push([distance, x1, y1]);
    }
    distances.sort((a, b) => a[0] - b[0]);
    return distances.slice(0, count);
}

function DrawLines(startX, startY) {
    let mainNearestDots = GetNearestDots(startX, startY, lineNumber);
    for (let i = 0; i < mainNearestDots.length; i++) {
        let dot = mainNearestDots[i];

        DrawLine(startX, startY, dot[1], dot[2]);
        let branchNearestDots = GetNearestDots(dot[1], dot[2], branchNumber);
        for (let j = 0; j < branchNearestDots.length; j++) {
            let branchDot = branchNearestDots[j];
            DrawLine(dot[1], dot[2], branchDot[1], branchDot[2]);
        }
    }
}

function DrawLine(startX, startY, endX, endY, color = lineColor) {
    let startPos = [startX, startY];
    let endPos = [endX, endY];

    if (!lines.includes([startPos, endPos])) {
        ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.stroke();
        lines.push([startPos, endPos]);
    }
}

function ClearCanvas() {
    lines = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawDots();
}

function MouseMove(){
    let x = event.clientX;
    let y = event.clientY;
    if (isClearOn || (lines.length > linesLimit && isLinesLimitOn))
        ClearCanvas();
    
    DrawLines(x, y);
}

function SetupBtnCleanSwitch(){
    let btn = document.getElementById('btnCleanSwitch');
    let upperLeftDot = GetNearestDots(dotMargin, dotMargin, 1)[0];

    btn.style.color = dotColor;
    btn.style.borderColor = dotColor;
    btn.style.left = upperLeftDot[1] + "px";
    btn.style.top = upperLeftDot[2] + "px";
    btn.style.transform = "translate(-50%, -50%)";

    btn.addEventListener('click', () => {
        isClearOn = !isClearOn;
        ClearCanvas();
    });
}

function SetupBtnLinesLimitSwitch(){
    let btn = document.getElementById('btnLinesLimitSwitch');
    let bottomRightDot = GetNearestDots(window.innerWidth-dotMargin, window.innerHeight-dotMargin, 1)[0];

    btn.style.color = dotColor;
    btn.style.borderColor = dotColor;
    btn.style.left = bottomRightDot[1] + "px";
    btn.style.top = bottomRightDot[2] + "px";
    btn.style.transform = "translate(-50%, -50%)";

    btn.addEventListener('click', () => {
        isLinesLimitOn = !isLinesLimitOn;
        ClearCanvas();
    });
}

function SetupBtnLinesLimitInpShow(){
    let btn = document.getElementById('btnLinesLimitInpShow');
    let upperRightDot = GetNearestDots(window.innerWidth-dotMargin, dotMargin, 1)[0];

    btn.style.color = dotColor;
    btn.style.borderColor = dotColor;
    btn.style.left = upperRightDot[1] + "px";
    btn.style.top = upperRightDot[2] + "px";
    btn.style.transform = "translate(-50%, -50%)";

    btn.addEventListener('click', () => {

        if (inpLinesLimit.style.visibility == "visible")
            inpLinesLimit.style.visibility = "hidden";
        else
            inpLinesLimit.style.visibility = "visible";

        ClearCanvas();
    });
}

function inpLinesLimitEvent(){
    inpLinesLimit.addEventListener('keyup', ({key}) => {
        if (key === "Enter") {
            let value = inpLinesLimit.value;
            if (value >= 60) {
                linesLimit = value;
                console.log("Lines limit set to " + linesLimit);
                ClearCanvas();
                inpLinesLimit.style.visibility = "hidden";
            }
        }
    });
}

function SetupEasterEggButtons() {
       SetupBtnCleanSwitch();
       SetupBtnLinesLimitSwitch();
       SetupBtnLinesLimitInpShow();
       inpLinesLimitEvent();
}

// onLoad

document.addEventListener('mousemove', MouseMove);

GenerateDots(dotsNumber);
DrawLines(800, 500);



