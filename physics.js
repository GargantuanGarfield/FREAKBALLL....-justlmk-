const canvas = document.getElementById('table');
const ctx = canvas.getContext('2d');
const playArea = document.getElementById('playArea');

// take this code before updating will's changes
const collisionSounds = [
  hit1 = new Audio('/sounds/BallHit.mp3'),
  hit2 = new Audio('/sounds/BallHit2.mp3'),
  hit3 = new Audio('/sounds/BallHit3.mp3'),
  hit4 = new Audio('/sounds/BallHit4.mp3'),
  hit5 = new Audio('/sounds/BallHit5.mp3')
];

// take this code before updating will's changes
collisionSounds[0].volume = 0.5;
collisionSounds[4].volume = 0.5;

// take this code before updating will's changes
let edgeSounds;

class ball {
    constructor(x, y, color, suit, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.suit = suit;
        this.id = id;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;
    }

    drawBall() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

    collision(ball2) {
        let dx = ball2.x - this.x;
        let dy = ball2.y - this.y;
        let distance = Math.hypot(dx, dy);
        if (distance < this.radius + ball2.radius) {
          let angle = Math.atan2(dy, dx);
          let speed1 = Math.hypot(this.vx, this.vy);
          let speed2 = Math.hypot(ball2.vx, ball2.vy);
          let direction1 = Math.atan2(this.vy, this.vx);
          let direction2 = Math.atan2(ball2.vy, ball2.vx);
      
          let vx1 = speed1 * Math.cos(direction1 - angle);
          let vy1 = speed1 * Math.sin(direction1 - angle);
          let vx2 = speed2 * Math.cos(direction2 - angle);
          let vy2 = speed2 * Math.sin(direction2 - angle);
      
          let final_vx1 = vx2;
          let final_vx2 = vx1;
      
          this.vx = Math.cos(angle) * final_vx1 + Math.cos(angle + Math.PI/2) * vy1;
          this.vy = Math.sin(angle) * final_vx1 + Math.sin(angle + Math.PI/2) * vy1;
          ball2.vx = Math.cos(angle) * final_vx2 + Math.cos(angle + Math.PI/2) * vy2;
          ball2.vy = Math.sin(angle) * final_vx2 + Math.sin(angle + Math.PI/2) * vy2;
      
          let overlap = (this.radius + ball2.radius) - distance;
          this.x -= overlap / 2 * (dx / distance);
          this.y -= overlap / 2 * (dy / distance);
          ball2.x += overlap / 2 * (dx / distance);
          ball2.y += overlap / 2 * (dy / distance);

          // take this code before updating will's changes
          collisionSound();
        }
      }
}

class pocket{

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = 35;
    }

    pocketDraw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
    pocketed(ball){
        let distance = Math.sqrt(Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2))
        if (distance < (ball.radius + this.radius)){
            for (let i = 0; i < balls.length; i++){
                if (balls[i].id == ball.id){
                    console.log("Got it")
                    balls.splice(i, 1)
                    }
                }
            }
            }
        }
        
        
  




let pockets = [
    // Top left
    new pocket(0, 0),
    // Top right
    new pocket(635, 0),
    // Middle left
    new pocket(0, 475),
    // middle right,
    new pocket(635, 475),
    // Bottom left
    new pocket(0, 950),
    // Bottom right
    new pocket(635, 950)
]

class Powerup {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 30; // size of the block
  }

  draw() {
      ctx.fillStyle = "purple"; // PURPLE like you want!
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }}
  
// take this code before updating will's changes
function collisionSound() {
  let randomIndex = Math.floor(Math.random() * collisionSounds.length);
  let sound = collisionSounds[randomIndex];
  sound.currentTime = 0;
  sound.play();
}

// take this code before updating will's changes
function edgeSound() {
  edgeSounds = new Audio('/sounds/BallHitEdge.mp3');
  edgeSounds.volume = 0.3;
  edgeSounds.play();
}

let balls = [
// Cue ball - placed left of the rack
new ball(318, 200, "white", "cue", 0),

// Row 1 (tip)
new ball(318, 600, "red", "solid", 1),

// Row 2
new ball(303, 630, "yellow", "stripe", 9),
new ball(333, 630, "red", "solid", 2),

// Row 3
new ball(288, 660, "red", "solid", 3),
new ball(318, 660, "black", "8-ball", 8),
new ball(348, 660, "yellow", "stripe", 10),


// Row 4
new ball(273, 690, "yellow", "stripe", 11),
new ball(303, 690, "red", "solid", 4),
new ball(333, 690, "yellow", "stripe", 12),
new ball(363, 690, "red", "solid", 5),

// Row 5 (base)
new ball(258, 720, "red", "solid", 6),
new ball(288, 720, "yellow", "stripe", 13),
new ball(318, 720, "red", "solid", 7),
new ball(348, 720, "yellow", "stripe", 14),
new ball(378, 720, "yellow", "stripe", 15)

];

let aiming = false;
let shotCount = 0; // Tracks the number of shots taken
let powerups = []; // Array to store spawned powerups
let startX, startY;


function drawTable() {
  ctx.fillStyle = '#0a5c1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pockets.forEach(pocket =>{
    pocket.pocketDraw();
  })
}

function simulateProjection(ball, steps = 30) {
  let tempX = ball.x;
  let tempY = ball.y;
  let vx = ball.vx;
  let vy = ball.vy;
  const path = [];

  const cushionMargin = 20;

  for (let i = 0; i < steps; i++) {
    tempX += vx;
    tempY += vy;
    vx *= 0.98;
    vy *= 0.98;

    if (tempX < ball.radius + cushionMargin) {
      tempX = ball.radius + cushionMargin;
      vx *= -1;
    }
    if (tempX > canvas.width - ball.radius - cushionMargin) {
      tempX = canvas.width - ball.radius - cushionMargin;
      vx *= -1;
    }

    // Bounce off top/bottom cushions
    if (tempY < ball.radius + cushionMargin) {
      tempY = ball.radius + cushionMargin;
      vy *= -1;
    }
    if (tempY > canvas.height - ball.radius - cushionMargin) {
      tempY = canvas.height - ball.radius - cushionMargin;
      vy *= -1;
    }

    path.push({ x: tempX, y: tempY });
  }
  return path;
}

function drawProjectionLine(path, color) {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.closePath();
}

function spawnPowerup() {
  let margin = 50; // Keeps it away from walls
  let x = Math.random() * (canvas.width - 2 * margin) + margin;
  let y = Math.random() * (canvas.height - 2 * margin) + margin;
  powerups.push(new Powerup(x, y));
}

function draw() {
  drawTable();
  powerups.forEach(p => p.draw());
  balls.forEach(ball =>{
    ball.drawBall()
  });


  if (aiming) {
    if (aiming) {
        // Draw the pool stick shaft
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(balls[0].x, balls[0].y);
        ctx.lineWidth = 8; // Thicker for pool stick
        ctx.strokeStyle = '#A0522D'; // Sienna color for wood
        ctx.stroke();
        ctx.closePath();
    
        // Draw the pool stick tip
        ctx.beginPath();
        const dx = balls[0].x - startX;
        const dy = balls[0].y - startY;
        const dist = Math.hypot(dx, dy);
        const tipLength = 10;
        const unitX = dx / dist;
        const unitY = dy / dist;
    
        ctx.moveTo(balls[0].x, balls[0].y);
        ctx.lineTo(balls[0].x - unitX * tipLength, balls[0].y - unitY * tipLength);
        ctx.lineWidth = 10; // Slightly wider tip
        ctx.strokeStyle = '#2F4F4F'; // Dark Slate Gray tip
        ctx.stroke();
        ctx.closePath();
    }
    

    let dx = balls[0].x - startX;
    let dy = balls[0].y - startY;
    let tempBall = new ball(balls[0].x, balls[0].y, "white", "cue", -1);
    tempBall.vx = dx * 0.1;
    tempBall.vy = dy * 0.1;

    let cuePath = simulateProjection(tempBall);
    drawProjectionLine(cuePath, "rgba(255,255,255,0.6)");

    for (let i = 1; i < balls.length; i++) {
      let target = balls[i];
      let dist = Math.hypot(target.x - balls[0].x, target.y - balls[0].y);
      if (dist <= balls[0].radius * 2 + 2) {
        let impactAngle = Math.atan2(target.y - balls[0].y, target.x - balls[0].x);
        let secondBall = new ball(target.x, target.y, target.color, target.suit, -1);
        secondBall.vx = Math.cos(impactAngle) * 1.5;
        secondBall.vy = Math.sin(impactAngle) * 1.5;
        let secondPath = simulateProjection(secondBall, 20);
        drawProjectionLine(secondPath, "rgba(255, 255, 255, 0.6)");
        break;
      }
    }
  }
}



function update() {
    const substeps = 4; // increase this for better accuracy
    for (let step = 0; step < substeps; step++) {
      balls.forEach(ball => {
        ball.x += ball.vx / substeps;
        ball.y += ball.vy / substeps;
        ball.vx *= 0.98 ** (1 / substeps);
        ball.vy *= 0.98 ** (1 / substeps);
  
        if (Math.abs(ball.vx) < 0.1) ball.vx = 0;
        if (Math.abs(ball.vy) < 0.1) ball.vy = 0;
  
        const cushionMargin = 15;
        // take this code before updating will's changes
        if (ball.x < ball.radius + cushionMargin) { ball.x = ball.radius + cushionMargin; ball.vx *= -1; edgeSound();}
        if (ball.x > canvas.width - ball.radius - cushionMargin) { ball.x = canvas.width - ball.radius - cushionMargin; ball.vx *= -1; edgeSound();}
        if (ball.y < ball.radius + cushionMargin) { ball.y = ball.radius + cushionMargin; ball.vy *= -1; edgeSound();}
        if (ball.y > canvas.height - ball.radius - cushionMargin) { ball.y = canvas.height - ball.radius - cushionMargin; ball.vy *= -1; edgeSound();}
      });
  
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          balls[i].collision(balls[j]);
        }
        
        for (let i = 0; i < pocket.length; i++){
            for (let j = 0; j < balls.length; j++){
                pockets[i].pocketed(balls[j]);
            }
        }
      }
    }
  }
  // I will blow up

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('mousedown', (e) => {
  if (balls[0].vx == 0 && balls[0].vy == 0){
    aiming = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  }
});
 
document.addEventListener('mousemove', (e) => {
    if (aiming) {
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
    }
  });
 
  document.addEventListener('mouseup', (e) => {
  if (balls[0].vx == 0 && balls[0].vy == 0){
    aiming = false;
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
   
    let dx = balls[0].x - mouseX;
    let dy = balls[0].y - mouseY;
 
    balls[0].vx = dx * 0.1;
    balls[0].vy = dy * 0.1;
  }
});

gameLoop();

