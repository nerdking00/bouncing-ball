'use strict';

// timer variables
let timer;
let sec = 0;
let min = 0;
let hour = 0;

let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let timer_element = document.getElementById('timer');
let app = document.querySelector('.app')


// game variables

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const para = document.querySelector('p');
const html = document.querySelector('html');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
let playBtn = document.querySelector('.play');

let count = 0;

// !!!!!!!!!!!!!!!!TIMER BLOCK!!!!!!!!!!!!!!!!

stopBtn.addEventListener('click', function () {
    timer = clearInterval(timer);
    resetBtn.disabled = false;
});

resetBtn.addEventListener('click', function () {
    timer = clearInterval('timer');
    resetBtn.disabled = true;
    sec = 0;
    min = 0;
    hour = 0;
    timer_element.innerHTML = '00 : 00 : 00';
});

function timerHandler() {
    sec++;

    if (sec === 60) {
        sec = 0;
        min++;
    }
    if (min === 60) {
        min = 0;
        hour++;
    }

    displayTime();
}


function displayTime() {
    let secBelow = sec;
    let minBelow = min;
    let hourBelow = hour;

    if (sec < 10) {
        secBelow = '0' + sec;
    }
    if (min < 10) {
        minBelow = '0' + min;
    }
    if (hour < 10) {
        hourBelow = '0' + hour;
    }
    timer_element.innerHTML = hourBelow + ' : ' + minBelow + ' : ' + secBelow;
}

//  !!!!!!!!!!!!!MAIN GAME BLOCK!!!!!!!!!!!!!!!

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}


function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();

}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x + this.size) <= 0 + this.size) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y + this.size) <= 0 + this.size) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}


function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x + this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y + this.size) <= app.offsetHeight) {
        this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function () {
    let _this = this;
    window.onkeydown = function (e) {
        if (e.key === 'a' || e.key === 'ф' || e.key === 'ArrowLeft') {
            _this.x -= _this.velX;
        } else if (e.key === 'd' || e.key === 'в' || e.key === 'ArrowRight') {
            _this.x += _this.velX;
        } else if (e.key === 'w' || e.key === 'ц' || e.key === 'ArrowUp') {
            _this.y -= _this.velY;
        } else if (e.key === 's' || e.key === 'ы' || e.key === 'ArrowDown') {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists === true) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exists) {
                balls[j].exists = false;
                count--;
                para.textContent = 'Balls count: ' + count;
                if (count === 0) {
                    timer = clearInterval(timer);
                    resetBtn.disabled = false;
                }
            }
        }
    }
}

let balls = [];

while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
    count++;
    para.textContent = 'Balls count: ' + count;
}

let evilCircle = new EvilCircle(random(0, width), random(0, height), true);
evilCircle.setControls();



function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    evilCircle.draw()
    evilCircle.checkBounds()
    evilCircle.collisionDetect()

    requestAnimationFrame(loop);
}

playBtn.addEventListener('click', function () {
    app.style.visibility = 'visible';
    playBtn.style.visibility = 'hidden';
    loop();
    timer = setInterval(timerHandler, 1000);
});