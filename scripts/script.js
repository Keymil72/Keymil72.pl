const canvas = document.getElementById('Web');
const dotsNumber = 300;
const dotsSpread = 40;
const dotSize = 3;
const dotColor = "white";

const lineNumber = 15;
const lineColor = "white";
const branchNumber = 3;

var ctx = canvas.getContext('2d');
var dots = [];
var lines = [];
var attempts = 0;
var maxAttempts = 50;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.beginPath();
ctx.moveTo(0, 0);
//ctx.ellipse(100, 100, 20, 20, Math.PI / 4, 20, 20);

// ctx.roundRect(100, 100, 5, 5, 40);
// ctx.fillStyle = "white";
// ctx.fill();

function GenerateDots(dotsNumber) {
    for (let i = 0; i < dotsNumber && attempts < maxAttempts; i++) {
        attempts = 0;
        
        let isSpreadEnought = false;
        let randomX;
        let randomY;


        do {
        randomX = Math.floor(Math.random() * ((canvas.width - 20) - 20 + 1) + 20);
        randomY = Math.floor(Math.random() * ((canvas.height - 20) - 20 + 1) + 20);

        isSpreadEnought = CheckDotSpread(randomX, randomY);
        attempts++;

        if (attempts > maxAttempts)
            break;
        
        } while (!isSpreadEnought);
        let pos = [randomX, randomY];
        dots.push(pos);
    }
    console.log(dots.length);
    DrawDots();
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
    lines = [];
}

function DrawLine(startX, startY, endX, endY) {
    let startPos = [startX, startY];
    let endPos = [endX, endY];

    if (!lines.includes([startPos, endPos])) {
        ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = lineColor;
        ctx.stroke();
        lines.push([startPos, endPos]);
    }
}

function MouseMove(){
    let x = event.clientX;
    let y = event.clientY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawDots();
    DrawLines(x, y);
}

document.addEventListener('mousemove', MouseMove);

GenerateDots(dotsNumber);
DrawLines(800, 500);

